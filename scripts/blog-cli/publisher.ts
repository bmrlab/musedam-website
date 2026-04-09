import * as fs from 'node:fs'
import * as path from 'node:path'
import { formatSlug } from '../../src/fields/slug/formatSlug'
import type { PayloadClient, PayloadDoc } from './client'
import type { Resolver } from './resolver'
import { PostInputSchema, type PostInput, type PublishResult } from './types'

export class Publisher {
  private client: PayloadClient
  private resolver: Resolver

  constructor(client: PayloadClient, resolver: Resolver) {
    this.client = client
    this.resolver = resolver
  }

  async processFile(
    filePath: string,
    options: { force?: boolean } = {},
  ): Promise<PublishResult> {
    const fileName = path.basename(filePath)
    let postId: number | null = null
    let slug = ''
    let action: PublishResult['action'] = 'draft'

    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>
      const parsed = PostInputSchema.safeParse(raw)

      if (!parsed.success) {
        const errors = parsed.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ')

        return {
          file: fileName,
          postId: null,
          slug: typeof raw.slug === 'string' ? raw.slug : '',
          status: 'error',
          action: parseAction(raw.action),
          error: `Validation failed: ${errors}`,
        }
      }

      const input = parsed.data
      const canonicalSlug = this.getCanonicalSlug(input)
      action = input.action
      if (canonicalSlug === '') {
        return {
          file: fileName,
          postId: null,
          slug: '',
          status: 'error',
          action,
          error: this.buildEmptySlugError(input),
        }
      }
      slug = canonicalSlug
      const existing = await this.findExistingPost(canonicalSlug)
      let isResume = false

      if (existing) {
        const existingStatus = existing._status as string | undefined
        const existingSlug = typeof existing.slug === 'string' ? existing.slug : canonicalSlug
        if (existingStatus === 'published' && !options.force) {
          return {
            file: fileName,
            postId: existing.id,
            slug: existingSlug,
            status: 'skipped',
            action: input.action,
            error: 'Post already published. Use --force to overwrite.',
          }
        }

        isResume = true
        postId = existing.id
        slug = existingSlug
        const doc = await this.updatePost(existing.id, input)
        postId = doc.id
        slug = this.getPersistedSlug(doc, canonicalSlug)
      } else {
        const doc = await this.createPost(input)
        postId = doc.id
        slug = this.getPersistedSlug(doc, canonicalSlug)
      }

      if (Object.prototype.hasOwnProperty.call(input.title, 'en') || input.content.en) {
        await this.addEnglishLocale(postId, input)
      }

      this.resolver.registerPost(slug, postId)

      const result: PublishResult = {
        file: fileName,
        postId,
        slug,
        status: isResume ? 'resumed' : 'created',
        action: input.action,
      }

      await this.executeAction(postId, slug, input, result)

      return result
    } catch (error) {
      return {
        file: fileName,
        postId,
        slug,
        status: 'error',
        action,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  async processBatch(
    filePaths: string[],
    options: { force?: boolean } = {},
  ): Promise<PublishResult[]> {
    const results: PublishResult[] = []
    const pass1Data: Array<{
      filePath: string
      input: PostInput
      postId: number
      slug: string
      isResume: boolean
    }> = []

    console.log(`\n[Pass 1] Creating ${filePaths.length} posts...\n`)

    for (const filePath of filePaths) {
      const fileName = path.basename(filePath)
      let postId: number | null = null
      let slug = ''
      let action: PublishResult['action'] = 'draft'

      try {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>
        const parsed = PostInputSchema.safeParse(raw)

        if (!parsed.success) {
          const errors = parsed.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ')

          results.push({
            file: fileName,
            postId: null,
            slug: typeof raw.slug === 'string' ? raw.slug : '',
            status: 'error',
            action: parseAction(raw.action),
            error: `Validation failed: ${errors}`,
          })
          continue
        }

        const input = parsed.data
        const canonicalSlug = this.getCanonicalSlug(input)
        action = input.action
        if (canonicalSlug === '') {
          results.push({
            file: fileName,
            postId: null,
            slug: '',
            status: 'error',
            action,
            error: this.buildEmptySlugError(input),
          })
          continue
        }
        slug = canonicalSlug
        const existing = await this.findExistingPost(canonicalSlug)
        let isResume = false

        if (existing) {
          const existingStatus = existing._status as string | undefined
          const existingSlug = typeof existing.slug === 'string' ? existing.slug : canonicalSlug
          if (existingStatus === 'published' && !options.force) {
            results.push({
              file: fileName,
              postId: existing.id,
              slug: existingSlug,
              status: 'skipped',
              action: input.action,
              error: 'Post already published. Use --force to overwrite.',
            })
            continue
          }

          isResume = true
          postId = existing.id
          slug = existingSlug
          const doc = await this.updatePost(existing.id, input, { skipRelatedPosts: true })
          postId = doc.id
          slug = this.getPersistedSlug(doc, canonicalSlug)
        } else {
          const doc = await this.createPost(input, { skipRelatedPosts: true })
          postId = doc.id
          slug = this.getPersistedSlug(doc, canonicalSlug)
        }

        if (Object.prototype.hasOwnProperty.call(input.title, 'en') || input.content.en) {
          await this.addEnglishLocale(postId, input)
        }

        this.resolver.registerPost(slug, postId)
        pass1Data.push({ filePath, input, postId, slug, isResume })
        console.log(`  [ok] ${fileName} -> id=${postId} (${isResume ? 'resumed' : 'created'})`)
      } catch (error) {
        results.push({
          file: fileName,
          postId,
          slug,
          status: 'error',
          action,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    console.log(`\n[Pass 2] Backfilling relatedPosts & executing actions...\n`)

    for (const { filePath, input, postId, slug, isResume } of pass1Data) {
      const fileName = path.basename(filePath)

      try {
        if (input.relatedPosts !== undefined) {
          const relatedIds = await this.resolveRelatedPostsStrict(input.relatedPosts)
          await this.client.update(
            'posts',
            postId,
            { relatedPosts: relatedIds },
            { draft: 'true', locale: 'zh' },
          )
        }

        const result: PublishResult = {
          file: fileName,
          postId,
          slug,
          status: isResume ? 'resumed' : 'created',
          action: input.action,
        }

        await this.executeAction(postId, slug, input, result)
        results.push(result)
        console.log(`  [ok] ${fileName} -> ${input.action} (id=${postId})`)
      } catch (error) {
        results.push({
          file: fileName,
          postId,
          slug,
          status: 'error',
          action: input.action,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return results
  }

  private async findExistingPost(slug: string): Promise<PayloadDoc | null> {
    if (!slug) {
      return null
    }

    const res = await this.client.find('posts', {
      'where[slug][equals]': slug,
      limit: '1',
      draft: 'true',
    })

    return res.docs[0] ?? null
  }

  private async createPost(
    input: PostInput,
    options: { skipRelatedPosts?: boolean } = {},
  ): Promise<PayloadDoc> {
    const data = await this.buildPostData(input, options)
    const res = await this.client.create('posts', data, {
      locale: 'zh',
      draft: 'true',
    })

    return res.doc
  }

  private async updatePost(
    id: number,
    input: PostInput,
    options: { skipRelatedPosts?: boolean } = {},
  ): Promise<PayloadDoc> {
    const data = await this.buildPostData(input, options)

    const res = await this.client.update('posts', id, data, {
      locale: 'zh',
      draft: 'true',
    })

    return res.doc
  }

  private async buildPostData(
    input: PostInput,
    options: { skipRelatedPosts?: boolean } = {},
  ): Promise<Record<string, unknown>> {
    const data: Record<string, unknown> = {
      title: input.title.zh,
      content: input.content.zh,
      isHeroArticle: input.isHeroArticle,
      isTopArticle: input.isTopArticle,
      _status: 'draft',
    }

    if (input.slug) {
      data.slug = input.slug
    }

    if (input.categories !== undefined) {
      data.categories = await this.resolveCategoriesStrict(input.categories)
    }

    if (input.authors !== undefined) {
      data.authors = await this.resolveAuthorsStrict(input.authors)
    }

    if (input.metaImage !== undefined) {
      if (typeof input.metaImage === 'number') {
        data.meta = { image: input.metaImage }
      } else if (typeof input.metaImage === 'string') {
        try {
          const uploaded = await this.client.uploadMedia(input.metaImage, input.title.zh)
          data.meta = { image: uploaded.doc.id }
        } catch (error) {
          console.warn(
            `[warn] Image upload failed: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }
    }

    if (!options.skipRelatedPosts && input.relatedPosts !== undefined) {
      data.relatedPosts = await this.resolveRelatedPostsStrict(input.relatedPosts)
    }

    return data
  }

  private async addEnglishLocale(postId: number, input: PostInput): Promise<void> {
    const data: Record<string, unknown> = {}

    if (Object.prototype.hasOwnProperty.call(input.title, 'en')) {
      data.title = input.title.en
    }

    if (input.content.en) {
      data.content = input.content.en
    }

    if (Object.keys(data).length > 0) {
      await this.client.update('posts', postId, data, {
        locale: 'en',
        draft: 'true',
      })
    }
  }

  private async executeAction(
    postId: number,
    slug: string,
    input: PostInput,
    result: PublishResult,
  ): Promise<void> {
    switch (input.action) {
      case 'publish': {
        const publishData: Record<string, unknown> = { _status: 'published' }

        if (input.publishedAt) {
          publishData.publishedAt = input.publishedAt
        }

        await this.client.update('posts', postId, publishData, { draft: 'true' })
        result.url = `/blog/${slug}`
        break
      }
      case 'schedule':
        await this.client.schedulePost(postId, input.publishedAt!)
        result.scheduledAt = input.publishedAt
        break
      case 'draft':
        break
    }
  }

  private getCanonicalSlug(input: PostInput): string {
    return input.slug ? formatSlug(input.slug) : formatSlug(input.title.zh)
  }

  private getPersistedSlug(doc: PayloadDoc, canonicalSlug: string): string {
    return typeof doc.slug === 'string' ? doc.slug : canonicalSlug
  }

  private buildEmptySlugError(input: PostInput): string {
    return input.slug
      ? 'Validation failed: slug: normalized slug is empty'
      : 'Validation failed: slug: normalized title-derived slug is empty'
  }

  private async resolveCategoriesStrict(names: string[]): Promise<number[]> {
    return this.resolveStrictArray(names, 'Category', (name) =>
      this.resolver.resolveCategory(name),
    )
  }

  private async resolveAuthorsStrict(emails: string[]): Promise<number[]> {
    return this.resolveStrictArray(emails, 'Author', (email) =>
      this.resolver.resolveAuthor(email),
    )
  }

  private async resolveRelatedPostsStrict(slugs: string[]): Promise<number[]> {
    return this.resolveStrictArray(slugs, 'Related post', (slug) =>
      this.resolver.resolvePostBySlug(slug),
    )
  }

  private async resolveStrictArray(
    values: string[],
    label: string,
    resolve: (value: string) => Promise<number | null>,
  ): Promise<number[]> {
    const resolved: number[] = []
    const missing: string[] = []

    for (const value of values) {
      const id = await resolve(value)
      if (id === null) {
        missing.push(value)
        continue
      }

      resolved.push(id)
    }

    if (missing.length > 0) {
      throw new Error(`${label} not found: ${missing.join(', ')}`)
    }

    return resolved
  }
}

function parseAction(value: unknown): PublishResult['action'] {
  return value === 'publish' || value === 'schedule' || value === 'draft' ? value : 'draft'
}
