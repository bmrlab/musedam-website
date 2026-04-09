import * as fs from 'node:fs'
import * as path from 'node:path'
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
      const slug = input.slug ?? ''
      const existing = await this.findExistingPost(slug)
      let postId: number
      let isResume = false

      if (existing) {
        const existingStatus = existing._status as string | undefined
        if (existingStatus === 'published' && !options.force) {
          return {
            file: fileName,
            postId: existing.id,
            slug,
            status: 'skipped',
            action: input.action,
            error: 'Post already published. Use --force to overwrite.',
          }
        }

        postId = existing.id
        isResume = true
        await this.updatePost(postId, input)
      } else {
        postId = await this.createPost(input)
      }

      this.resolver.registerPost(slug, postId)

      if (input.title.en || input.content.en) {
        await this.addEnglishLocale(postId, input)
      }

      const result: PublishResult = {
        file: fileName,
        postId,
        slug,
        status: isResume ? 'resumed' : 'created',
        action: input.action,
      }

      await this.executeAction(postId, input, result)

      return result
    } catch (error) {
      return {
        file: fileName,
        postId: null,
        slug: '',
        status: 'error',
        action: 'draft',
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
      isResume: boolean
    }> = []

    console.log(`\n[Pass 1] Creating ${filePaths.length} posts...\n`)

    for (const filePath of filePaths) {
      const fileName = path.basename(filePath)

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
        const slug = input.slug ?? ''
        const existing = await this.findExistingPost(slug)
        let postId: number
        let isResume = false

        if (existing) {
          const existingStatus = existing._status as string | undefined
          if (existingStatus === 'published' && !options.force) {
            results.push({
              file: fileName,
              postId: existing.id,
              slug,
              status: 'skipped',
              action: input.action,
              error: 'Post already published. Use --force to overwrite.',
            })
            continue
          }

          postId = existing.id
          isResume = true
          await this.updatePost(postId, input, { skipRelatedPosts: true })
        } else {
          postId = await this.createPost(input, { skipRelatedPosts: true })
        }

        this.resolver.registerPost(slug, postId)

        if (input.title.en || input.content.en) {
          await this.addEnglishLocale(postId, input)
        }

        pass1Data.push({ filePath, input, postId, isResume })
        console.log(`  [ok] ${fileName} -> id=${postId} (${isResume ? 'resumed' : 'created'})`)
      } catch (error) {
        results.push({
          file: fileName,
          postId: null,
          slug: '',
          status: 'error',
          action: 'draft',
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    console.log(`\n[Pass 2] Backfilling relatedPosts & executing actions...\n`)

    for (const { filePath, input, postId, isResume } of pass1Data) {
      const fileName = path.basename(filePath)

      try {
        if (input.relatedPosts?.length) {
          const relatedIds = await this.resolver.resolveRelatedPosts(input.relatedPosts)
          if (relatedIds.length > 0) {
            await this.client.update(
              'posts',
              postId,
              { relatedPosts: relatedIds },
              { draft: 'true', locale: 'zh' },
            )
          }
        }

        const result: PublishResult = {
          file: fileName,
          postId,
          slug: input.slug ?? '',
          status: isResume ? 'resumed' : 'created',
          action: input.action,
        }

        await this.executeAction(postId, input, result)
        results.push(result)
        console.log(`  [ok] ${fileName} -> ${input.action} (id=${postId})`)
      } catch (error) {
        results.push({
          file: fileName,
          postId,
          slug: input.slug ?? '',
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
  ): Promise<number> {
    const data = await this.buildPostData(input, options)
    const res = await this.client.create('posts', data, {
      locale: 'zh',
      draft: 'true',
    })

    return res.doc.id
  }

  private async updatePost(
    id: number,
    input: PostInput,
    options: { skipRelatedPosts?: boolean } = {},
  ): Promise<void> {
    const data = await this.buildPostData(input, options)

    await this.client.update('posts', id, data, {
      locale: 'zh',
      draft: 'true',
    })
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

    if (input.categories?.length) {
      data.categories = await this.resolver.resolveCategories(input.categories)
    }

    if (input.authors?.length) {
      data.authors = await this.resolver.resolveAuthors(input.authors)
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

    if (!options.skipRelatedPosts && input.relatedPosts?.length) {
      const relatedIds = await this.resolver.resolveRelatedPosts(input.relatedPosts)
      if (relatedIds.length > 0) {
        data.relatedPosts = relatedIds
      }
    }

    return data
  }

  private async addEnglishLocale(postId: number, input: PostInput): Promise<void> {
    const data: Record<string, unknown> = {}

    if (input.title.en) {
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
        result.url = `/blog/${input.slug ?? ''}`
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
}

function parseAction(value: unknown): PublishResult['action'] {
  return value === 'publish' || value === 'schedule' || value === 'draft' ? value : 'draft'
}
