# Blog Publish CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CLI tool that creates, publishes, and schedules blog posts via PayloadCMS REST API, driven by JSON input files.

**Architecture:** TypeScript CLI scripts under `scripts/blog-cli/`, calling PayloadCMS REST API with API Key auth. A dedicated Next.js API route handles scheduled publishing via PayloadCMS Local API (`payload.jobs.queue()`). Zod validates input. No external CLI framework — simple `process.argv` parsing.

**Tech Stack:** TypeScript, Zod (already installed), PayloadCMS 3.80.0 REST API, Next.js 15 API routes, `npx tsx` for script execution.

**Spec:** `docs/superpowers/specs/2026-04-09-blog-publish-cli-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/collections/Users/index.ts` | Modify | Add `useAPIKey: true` to auth config |
| `src/app/(payload)/api/schedule-post/route.ts` | Create | Server endpoint for scheduled publishing via Local API |
| `scripts/blog-cli/types.ts` | Create | Zod schemas + TypeScript types for JSON input |
| `scripts/blog-cli/client.ts` | Create | PayloadCMS REST API wrapper (fetch-based, no external deps) |
| `scripts/blog-cli/resolver.ts` | Create | Resolve human-readable refs (category names, emails, slugs) to numeric IDs |
| `scripts/blog-cli/publisher.ts` | Create | Orchestrate the full publish flow (upsert, upload, create, locale, action) |
| `scripts/blog-cli/index.ts` | Create | CLI entry point, argument parsing, batch mode |
| `.env.example` | Modify | Add `PAYLOAD_API_URL` and `PAYLOAD_API_KEY` env vars |

---

## Task 1: Enable API Key Authentication

**Files:**
- Modify: `src/collections/Users/index.ts:18-20`
- Modify: `.env.example`

- [ ] **Step 1: Add `useAPIKey: true` to Users auth config**

```typescript
// src/collections/Users/index.ts — change auth block at line 18
auth: {
  useAPIKey: true,
  useSessions: false,
},
```

- [ ] **Step 2: Add env vars to `.env.example`**

Append to the end of `.env.example`:

```env
# Blog CLI
PAYLOAD_API_URL=
PAYLOAD_API_KEY=
```

- [ ] **Step 3: Commit**

```bash
git add src/collections/Users/index.ts .env.example
git commit -m "feat: enable API Key auth on Users collection for blog CLI"
```

---

## Task 2: Schedule Post Server Endpoint

**Files:**
- Create: `src/app/(payload)/api/schedule-post/route.ts`

- [ ] **Step 1: Create the route file**

```typescript
// src/app/(payload)/api/schedule-post/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { z } from 'zod'

const SchedulePostSchema = z.object({
  postId: z.number(),
  publishAt: z.string().datetime(),
})

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise })

  // Verify API Key auth — reuse Payload's built-in auth
  const user = await payload.auth({ req })
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = SchedulePostSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { postId, publishAt } = parsed.data
  const publishDate = new Date(publishAt)

  if (publishDate <= new Date()) {
    return Response.json({ error: 'publishAt must be a future date' }, { status: 400 })
  }

  // Verify the post exists and is a draft
  const post = await payload.findByID({ collection: 'posts', id: postId })
  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }
  if (post._status === 'published') {
    return Response.json({ error: 'Post is already published' }, { status: 409 })
  }

  await payload.jobs.queue({
    task: 'schedulePublish',
    input: {
      type: 'publish' as const,
      doc: { relationTo: 'posts' as const, value: postId },
    },
    waitUntil: publishDate.toISOString(),
  })

  return Response.json({
    success: true,
    postId,
    scheduledAt: publishAt,
  })
}
```

> **Note:** `payload.auth({ req })` 的具体签名需在实现时验证。如果 PayloadCMS 3.80.0 不支持这个方式，改用从 request header 中提取 API Key 并手动调用 `payload.find({ collection: 'users', where: { apiKey: { equals: key } } })` 来验证。
>
> 同样，`payload.jobs.queue()` 的 `task` / `input` 参数类型需与 PayloadCMS 源码对照验证。如果类型不匹配，参考 `node_modules/@payloadcms/payload/dist/queues` 中的类型定义调整。

- [ ] **Step 2: Verify the endpoint compiles**

Run: `npx next build --no-lint 2>&1 | head -50`

If there are type errors related to `payload.jobs.queue` or `payload.auth`, adjust the implementation based on the actual type signatures. Check:
- `node_modules/payload/dist/types/index.d.ts` for `jobs.queue` signature
- `node_modules/payload/dist/auth` for auth verification methods

- [ ] **Step 3: Commit**

```bash
git add src/app/\(payload\)/api/schedule-post/route.ts
git commit -m "feat: add schedule-post API endpoint using PayloadCMS jobs queue"
```

---

## Task 3: Input Types and Validation

**Files:**
- Create: `scripts/blog-cli/types.ts`

- [ ] **Step 1: Create the types file with Zod schemas**

```typescript
// scripts/blog-cli/types.ts
import { z } from 'zod'

const LexicalJsonSchema = z.object({
  root: z.object({
    type: z.literal('root'),
    children: z.array(z.any()),
  }).passthrough(),
})

const LocalizedTextSchema = z.object({
  zh: z.string().min(1),
  en: z.string().optional(),
})

const LocalizedContentSchema = z.object({
  zh: LexicalJsonSchema,
  en: LexicalJsonSchema.optional(),
})

export const PostInputSchema = z
  .object({
    title: LocalizedTextSchema,
    content: LocalizedContentSchema,
    slug: z.string().optional(),
    metaImage: z.union([z.string(), z.number()]).optional(),
    categories: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    relatedPosts: z.array(z.string()).optional(),
    isHeroArticle: z.boolean().default(false),
    isTopArticle: z.boolean().default(false),
    publishedAt: z.string().datetime().optional(),
    action: z.enum(['publish', 'schedule', 'draft']),
  })
  .superRefine((data, ctx) => {
    // Chinese title requires slug
    if (/[^\x00-\x7F]/.test(data.title.zh) && !data.slug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'slug is required when title.zh contains non-ASCII characters',
        path: ['slug'],
      })
    }
    // schedule requires future publishedAt
    if (data.action === 'schedule') {
      if (!data.publishedAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'publishedAt is required when action is "schedule"',
          path: ['publishedAt'],
        })
      } else if (new Date(data.publishedAt) <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'publishedAt must be a future date for schedule action',
          path: ['publishedAt'],
        })
      }
    }
  })

export type PostInput = z.infer<typeof PostInputSchema>

/** Result of processing a single post */
export interface PublishResult {
  file: string
  postId: number | null
  slug: string
  status: 'created' | 'resumed' | 'skipped' | 'error'
  action: 'publish' | 'schedule' | 'draft'
  url?: string
  scheduledAt?: string
  error?: string
}
```

- [ ] **Step 2: Verify the schema parses correctly**

Run: `npx tsx -e "
const { PostInputSchema } = require('./scripts/blog-cli/types');
// Valid input
const r1 = PostInputSchema.safeParse({
  title: { zh: '测试文章' },
  content: { zh: { root: { type: 'root', children: [] } } },
  slug: 'test-post',
  action: 'draft',
});
console.log('valid:', r1.success);

// Missing slug for Chinese title
const r2 = PostInputSchema.safeParse({
  title: { zh: '测试文章' },
  content: { zh: { root: { type: 'root', children: [] } } },
  action: 'draft',
});
console.log('missing slug:', !r2.success);

// Schedule without publishedAt
const r3 = PostInputSchema.safeParse({
  title: { zh: 'test' },
  content: { zh: { root: { type: 'root', children: [] } } },
  slug: 'test',
  action: 'schedule',
});
console.log('schedule no date:', !r3.success);
"
`

Expected: all three `console.log` output `true`.

> **Note:** 如果 `require` 不工作（ESM 模块），改用 `npx tsx --eval` 配合 `import` 语法，或创建临时 `scripts/blog-cli/test-types.ts` 文件运行。

- [ ] **Step 3: Commit**

```bash
git add scripts/blog-cli/types.ts
git commit -m "feat: add Zod input schema and types for blog CLI"
```

---

## Task 4: PayloadCMS REST API Client

**Files:**
- Create: `scripts/blog-cli/client.ts`

- [ ] **Step 1: Create the API client**

```typescript
// scripts/blog-cli/client.ts

export interface PayloadClientConfig {
  apiUrl: string
  apiKey: string
}

export interface PayloadDoc {
  id: number
  [key: string]: unknown
}

export interface PayloadListResponse {
  docs: PayloadDoc[]
  totalDocs: number
}

export class PayloadClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: PayloadClientConfig) {
    this.baseUrl = config.apiUrl.replace(/\/+$/, '')
    this.headers = {
      Authorization: `users API-Key ${config.apiKey}`,
    }
  }

  async find(
    collection: string,
    query: Record<string, string> = {},
  ): Promise<PayloadListResponse> {
    const params = new URLSearchParams(query)
    const url = `${this.baseUrl}/${collection}?${params}`
    const res = await fetch(url, { headers: this.headers })
    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${await res.text()}`)
    }
    return res.json()
  }

  async create(
    collection: string,
    data: Record<string, unknown>,
    query: Record<string, string> = {},
  ): Promise<{ doc: PayloadDoc }> {
    const params = new URLSearchParams(query)
    const url = `${this.baseUrl}/${collection}?${params}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      throw new Error(`POST ${url} failed: ${res.status} ${await res.text()}`)
    }
    return res.json()
  }

  async update(
    collection: string,
    id: number,
    data: Record<string, unknown>,
    query: Record<string, string> = {},
  ): Promise<{ doc: PayloadDoc }> {
    const params = new URLSearchParams(query)
    const url = `${this.baseUrl}/${collection}/${id}?${params}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      throw new Error(`PATCH ${url} failed: ${res.status} ${await res.text()}`)
    }
    return res.json()
  }

  async uploadMedia(
    filePath: string,
    alt: string,
  ): Promise<{ doc: PayloadDoc }> {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const { Blob } = await import('node:buffer')

    const fileBuffer = fs.readFileSync(filePath)
    const fileName = path.basename(filePath)
    const blob = new Blob([fileBuffer])

    const formData = new FormData()
    formData.append('file', blob, fileName)
    formData.append('alt', alt)

    const url = `${this.baseUrl}/media`
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: this.headers.Authorization },
      body: formData,
    })
    if (!res.ok) {
      throw new Error(`POST ${url} (upload) failed: ${res.status} ${await res.text()}`)
    }
    return res.json()
  }

  async schedulePost(postId: number, publishAt: string): Promise<void> {
    // Use the custom schedule-post endpoint (Local API)
    const url = `${this.baseUrl}/schedule-post`
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, publishAt }),
    })
    if (!res.ok) {
      throw new Error(
        `POST ${url} (schedule) failed: ${res.status} ${await res.text()}`,
      )
    }
  }
}
```

> **Note:** `schedulePost` 调用的是 Task 2 中创建的 `POST /api/schedule-post` 端点。`this.baseUrl` 应为 PayloadCMS API 根路径（如 `https://site.com/api`），而 `schedule-post` route 位于同一 `(payload)/api/` 下，所以 URL 拼接为 `${this.baseUrl}/schedule-post`。实现时验证这个路径是否正确（取决于 Next.js 路由结构，可能需要 `${siteUrl}/api/schedule-post`）。

- [ ] **Step 2: Commit**

```bash
git add scripts/blog-cli/client.ts
git commit -m "feat: add PayloadCMS REST API client for blog CLI"
```

---

## Task 5: Reference Resolver

**Files:**
- Create: `scripts/blog-cli/resolver.ts`

- [ ] **Step 1: Create the resolver**

```typescript
// scripts/blog-cli/resolver.ts
import type { PayloadClient } from './client'

export class Resolver {
  private client: PayloadClient
  /** Cache resolved values within a batch run */
  private categoryCache = new Map<string, number>()
  private authorCache = new Map<string, number>()
  private postSlugCache = new Map<string, number>()

  constructor(client: PayloadClient) {
    this.client = client
  }

  /** Register a slug → id mapping (used in batch mode Pass 1) */
  registerPost(slug: string, id: number): void {
    this.postSlugCache.set(slug, id)
  }

  async resolveCategory(name: string): Promise<number | null> {
    if (this.categoryCache.has(name)) return this.categoryCache.get(name)!

    const res = await this.client.find('categories', {
      'where[title][equals]': name,
      locale: 'zh',
      limit: '1',
    })
    if (res.docs.length === 0) return null

    const id = res.docs[0].id
    this.categoryCache.set(name, id)
    return id
  }

  async resolveAuthor(email: string): Promise<number | null> {
    if (this.authorCache.has(email)) return this.authorCache.get(email)!

    const res = await this.client.find('users', {
      'where[email][equals]': email,
      limit: '1',
    })
    if (res.docs.length === 0) return null

    const id = res.docs[0].id
    this.authorCache.set(email, id)
    return id
  }

  async resolvePostBySlug(slug: string): Promise<number | null> {
    if (this.postSlugCache.has(slug)) return this.postSlugCache.get(slug)!

    const res = await this.client.find('posts', {
      'where[slug][equals]': slug,
      limit: '1',
    })
    if (res.docs.length === 0) return null

    const id = res.docs[0].id
    this.postSlugCache.set(slug, id)
    return id
  }

  async resolveCategories(names: string[]): Promise<number[]> {
    const ids: number[] = []
    for (const name of names) {
      const id = await this.resolveCategory(name)
      if (id !== null) {
        ids.push(id)
      } else {
        console.warn(`[warn] Category not found: "${name}"`)
      }
    }
    return ids
  }

  async resolveAuthors(emails: string[]): Promise<number[]> {
    const ids: number[] = []
    for (const email of emails) {
      const id = await this.resolveAuthor(email)
      if (id !== null) {
        ids.push(id)
      } else {
        console.warn(`[warn] Author not found: "${email}"`)
      }
    }
    return ids
  }

  async resolveRelatedPosts(slugs: string[]): Promise<number[]> {
    const ids: number[] = []
    for (const slug of slugs) {
      const id = await this.resolvePostBySlug(slug)
      if (id !== null) {
        ids.push(id)
      } else {
        console.warn(`[warn] Related post not found: "${slug}"`)
      }
    }
    return ids
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/blog-cli/resolver.ts
git commit -m "feat: add reference resolver for blog CLI"
```

---

## Task 6: Publisher (Core Orchestration)

**Files:**
- Create: `scripts/blog-cli/publisher.ts`

- [ ] **Step 1: Create the publisher**

```typescript
// scripts/blog-cli/publisher.ts
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

  /** Process a single JSON file. Returns the result. */
  async processFile(
    filePath: string,
    options: { force?: boolean } = {},
  ): Promise<PublishResult> {
    const fileName = path.basename(filePath)
    try {
      // 1. Read and validate
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const parsed = PostInputSchema.safeParse(raw)
      if (!parsed.success) {
        const errors = parsed.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ')
        return {
          file: fileName,
          postId: null,
          slug: raw.slug ?? '',
          status: 'error',
          action: raw.action ?? 'draft',
          error: `Validation failed: ${errors}`,
        }
      }
      const input = parsed.data
      const slug = input.slug ?? ''

      // 2. Upsert check
      const existing = await this.findExistingPost(slug)
      let postId: number
      let isResume = false

      if (existing) {
        const existingStatus = existing._status as string
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
        // Resume: update existing draft
        postId = existing.id
        isResume = true
        await this.updatePost(postId, input)
      } else {
        // Create new
        postId = await this.createPost(input)
      }

      // Register for batch cross-reference resolution
      this.resolver.registerPost(slug, postId)

      // 3. Add English locale if provided
      if (input.title.en || input.content.en) {
        await this.addEnglishLocale(postId, input)
      }

      // 4. Execute action
      const result: PublishResult = {
        file: fileName,
        postId,
        slug,
        status: isResume ? 'resumed' : 'created',
        action: input.action,
      }

      await this.executeAction(postId, input, result)
      return result
    } catch (err) {
      return {
        file: fileName,
        postId: null,
        slug: '',
        status: 'error',
        action: 'draft',
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  /**
   * Batch mode: Two-pass processing.
   * Pass 1: Create all posts (skip relatedPosts).
   * Pass 2: Backfill relatedPosts + execute actions.
   */
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

    // --- Pass 1: Create all posts ---
    console.log(`\n[Pass 1] Creating ${filePaths.length} posts...\n`)
    for (const filePath of filePaths) {
      const fileName = path.basename(filePath)
      try {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const parsed = PostInputSchema.safeParse(raw)
        if (!parsed.success) {
          const errors = parsed.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; ')
          results.push({
            file: fileName,
            postId: null,
            slug: raw.slug ?? '',
            status: 'error',
            action: raw.action ?? 'draft',
            error: `Validation failed: ${errors}`,
          })
          continue
        }
        const input = parsed.data
        const slug = input.slug ?? ''

        // Upsert check
        const existing = await this.findExistingPost(slug)
        let postId: number
        let isResume = false

        if (existing) {
          const existingStatus = existing._status as string
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

        // English locale
        if (input.title.en || input.content.en) {
          await this.addEnglishLocale(postId, input)
        }

        pass1Data.push({ filePath, input, postId, isResume })
        console.log(`  [ok] ${fileName} → id=${postId} (${isResume ? 'resumed' : 'created'})`)
      } catch (err) {
        results.push({
          file: fileName,
          postId: null,
          slug: '',
          status: 'error',
          action: 'draft',
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    // --- Pass 2: Backfill relatedPosts + execute actions ---
    console.log(`\n[Pass 2] Backfilling relatedPosts & executing actions...\n`)
    for (const { filePath, input, postId, isResume } of pass1Data) {
      const fileName = path.basename(filePath)
      try {
        // Backfill relatedPosts
        if (input.relatedPosts?.length) {
          const relatedIds = await this.resolver.resolveRelatedPosts(
            input.relatedPosts,
          )
          if (relatedIds.length > 0) {
            await this.client.update('posts', postId, {
              relatedPosts: relatedIds,
            }, { draft: 'true', locale: 'zh' })
          }
        }

        // Execute action
        const result: PublishResult = {
          file: fileName,
          postId,
          slug: input.slug ?? '',
          status: isResume ? 'resumed' : 'created',
          action: input.action,
        }
        await this.executeAction(postId, input, result)
        results.push(result)
        console.log(`  [ok] ${fileName} → ${input.action} (id=${postId})`)
      } catch (err) {
        results.push({
          file: fileName,
          postId,
          slug: input.slug ?? '',
          status: 'error',
          action: input.action,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    return results
  }

  // --- Private helpers ---

  private async findExistingPost(slug: string): Promise<PayloadDoc | null> {
    if (!slug) return null
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

    if (input.slug) data.slug = input.slug

    // Resolve categories
    if (input.categories?.length) {
      data.categories = await this.resolver.resolveCategories(input.categories)
    }

    // Resolve authors
    if (input.authors?.length) {
      data.authors = await this.resolver.resolveAuthors(input.authors)
    }

    // Upload or reference meta image
    if (input.metaImage !== undefined) {
      if (typeof input.metaImage === 'number') {
        data.meta = { image: input.metaImage }
      } else if (typeof input.metaImage === 'string') {
        try {
          const uploaded = await this.client.uploadMedia(
            input.metaImage,
            input.title.zh,
          )
          data.meta = { image: uploaded.doc.id }
        } catch (err) {
          console.warn(
            `[warn] Image upload failed: ${err instanceof Error ? err.message : err}`,
          )
        }
      }
    }

    // Resolve relatedPosts (single mode only)
    if (!options.skipRelatedPosts && input.relatedPosts?.length) {
      const relatedIds = await this.resolver.resolveRelatedPosts(
        input.relatedPosts,
      )
      if (relatedIds.length > 0) data.relatedPosts = relatedIds
    }

    return data
  }

  private async addEnglishLocale(
    postId: number,
    input: PostInput,
  ): Promise<void> {
    const data: Record<string, unknown> = {}
    if (input.title.en) data.title = input.title.en
    if (input.content.en) data.content = input.content.en
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
        if (input.publishedAt) publishData.publishedAt = input.publishedAt
        await this.client.update('posts', postId, publishData)
        result.url = `/blog/${input.slug}`
        break
      }
      case 'schedule': {
        await this.client.schedulePost(postId, input.publishedAt!)
        result.scheduledAt = input.publishedAt
        break
      }
      case 'draft':
        // No action needed
        break
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/blog-cli/publisher.ts
git commit -m "feat: add publisher orchestrator for blog CLI"
```

---

## Task 7: CLI Entry Point

**Files:**
- Create: `scripts/blog-cli/index.ts`

- [ ] **Step 1: Create the CLI entry point**

```typescript
// scripts/blog-cli/index.ts
import * as fs from 'node:fs'
import * as path from 'node:path'
import { PayloadClient } from './client'
import { Publisher } from './publisher'
import { Resolver } from './resolver'

function usage(): never {
  console.log(`
Usage:
  npx tsx scripts/blog-cli/index.ts publish <file.json|directory> [--force]
  npx tsx scripts/blog-cli/index.ts list [--status draft|published]

Environment variables:
  PAYLOAD_API_URL  PayloadCMS API base URL (e.g. https://site.com/api)
  PAYLOAD_API_KEY  PayloadCMS API Key

Examples:
  npx tsx scripts/blog-cli/index.ts publish ./posts/new-feature.json
  npx tsx scripts/blog-cli/index.ts publish ./posts/
  npx tsx scripts/blog-cli/index.ts publish ./posts/ --force
  npx tsx scripts/blog-cli/index.ts list --status draft
`)
  process.exit(1)
}

function getEnv(name: string): string {
  const val = process.env[name]
  if (!val) {
    console.error(`[error] Missing environment variable: ${name}`)
    process.exit(1)
  }
  return val
}

function collectJsonFiles(target: string): string[] {
  const resolved = path.resolve(target)
  const stat = fs.statSync(resolved)
  if (stat.isFile()) {
    if (!resolved.endsWith('.json')) {
      console.error(`[error] Not a JSON file: ${resolved}`)
      process.exit(1)
    }
    return [resolved]
  }
  if (stat.isDirectory()) {
    return fs
      .readdirSync(resolved)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => path.join(resolved, f))
  }
  console.error(`[error] Not a file or directory: ${resolved}`)
  process.exit(1)
}

function printResults(results: Array<import('./types').PublishResult>): void {
  console.log('\n--- Results ---\n')
  for (const r of results) {
    const icon =
      r.status === 'error' ? '✗' : r.status === 'skipped' ? '⊘' : '✓'
    const line = [
      `${icon} ${r.file}`,
      r.postId ? `id=${r.postId}` : null,
      `status=${r.status}`,
      `action=${r.action}`,
      r.url ? `url=${r.url}` : null,
      r.scheduledAt ? `scheduled=${r.scheduledAt}` : null,
      r.error ? `error="${r.error}"` : null,
    ]
      .filter(Boolean)
      .join(' | ')
    console.log(line)
  }

  const errors = results.filter((r) => r.status === 'error')
  const skipped = results.filter((r) => r.status === 'skipped')
  const ok = results.filter(
    (r) => r.status === 'created' || r.status === 'resumed',
  )
  console.log(
    `\nTotal: ${results.length} | OK: ${ok.length} | Skipped: ${skipped.length} | Errors: ${errors.length}`,
  )

  if (errors.length > 0) process.exit(1)
}

async function cmdPublish(args: string[]): Promise<void> {
  const force = args.includes('--force')
  const target = args.find((a) => !a.startsWith('--'))
  if (!target) {
    console.error('[error] Missing file or directory argument')
    usage()
  }

  const client = new PayloadClient({
    apiUrl: getEnv('PAYLOAD_API_URL'),
    apiKey: getEnv('PAYLOAD_API_KEY'),
  })
  const resolver = new Resolver(client)
  const publisher = new Publisher(client, resolver)

  const files = collectJsonFiles(target)
  console.log(`Found ${files.length} JSON file(s)`)

  let results: Array<import('./types').PublishResult>
  if (files.length === 1) {
    const r = await publisher.processFile(files[0], { force })
    results = [r]
  } else {
    results = await publisher.processBatch(files, { force })
  }

  printResults(results)
}

async function cmdList(args: string[]): Promise<void> {
  const statusIdx = args.indexOf('--status')
  const status = statusIdx >= 0 ? args[statusIdx + 1] : undefined

  const client = new PayloadClient({
    apiUrl: getEnv('PAYLOAD_API_URL'),
    apiKey: getEnv('PAYLOAD_API_KEY'),
  })

  const query: Record<string, string> = {
    limit: '50',
    sort: '-updatedAt',
    locale: 'zh',
    draft: 'true',
  }
  if (status) {
    query['where[_status][equals]'] = status
  }

  const res = await client.find('posts', query)
  console.log(`\nFound ${res.totalDocs} post(s):\n`)
  for (const doc of res.docs) {
    console.log(
      `  [${doc._status}] id=${doc.id} slug=${doc.slug} title="${doc.title}"`,
    )
  }
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case 'publish':
      await cmdPublish(args)
      break
    case 'list':
      await cmdList(args)
      break
    default:
      usage()
  }
}

main().catch((err) => {
  console.error('[fatal]', err)
  process.exit(1)
})
```

- [ ] **Step 2: Verify the CLI compiles and shows usage**

Run: `npx tsx scripts/blog-cli/index.ts`

Expected: prints usage text and exits with code 1.

- [ ] **Step 3: Commit**

```bash
git add scripts/blog-cli/index.ts
git commit -m "feat: add CLI entry point for blog publish tool"
```

---

## Task 8: End-to-End Verification

This task verifies the full flow against a running PayloadCMS instance.

- [ ] **Step 1: Create a sample JSON test file**

Create `scripts/blog-cli/examples/test-draft.json`:

```json
{
  "title": {
    "zh": "CLI 测试文章",
    "en": "CLI Test Post"
  },
  "content": {
    "zh": {
      "root": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [{ "type": "text", "text": "这是一篇通过 CLI 创建的测试文章。" }],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1
      }
    }
  },
  "slug": "cli-test-post",
  "action": "draft"
}
```

- [ ] **Step 2: Set up environment variables**

```bash
export PAYLOAD_API_URL="http://localhost:3000/api"
export PAYLOAD_API_KEY="<your-api-key>"
```

Replace `<your-api-key>` with a key generated from Admin Panel → Users → Edit → API Key.

- [ ] **Step 3: Run the draft test**

Run: `npx tsx scripts/blog-cli/index.ts publish scripts/blog-cli/examples/test-draft.json`

Expected output:
```
Found 1 JSON file(s)

--- Results ---

✓ test-draft.json | id=<number> | status=created | action=draft

Total: 1 | OK: 1 | Skipped: 0 | Errors: 0
```

- [ ] **Step 4: Verify the post exists via list command**

Run: `npx tsx scripts/blog-cli/index.ts list --status draft`

Expected: `cli-test-post` appears in the list.

- [ ] **Step 5: Test resume behavior (rerun same file)**

Run: `npx tsx scripts/blog-cli/index.ts publish scripts/blog-cli/examples/test-draft.json`

Expected: `status=resumed` (not `error` or `skipped`).

- [ ] **Step 6: Test publish action**

Create `scripts/blog-cli/examples/test-publish.json`:

```json
{
  "title": {
    "zh": "CLI 发布测试",
    "en": "CLI Publish Test"
  },
  "content": {
    "zh": {
      "root": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [{ "type": "text", "text": "立即发布的测试文章。" }],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1
      }
    }
  },
  "slug": "cli-publish-test",
  "action": "publish"
}
```

Run: `npx tsx scripts/blog-cli/index.ts publish scripts/blog-cli/examples/test-publish.json`

Expected: `status=created | action=publish`

- [ ] **Step 7: Test schedule action**

Create `scripts/blog-cli/examples/test-schedule.json` (set `publishedAt` to a date ~5 minutes in the future):

```json
{
  "title": {
    "zh": "CLI 定时发布测试",
    "en": "CLI Schedule Test"
  },
  "content": {
    "zh": {
      "root": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [{ "type": "text", "text": "定时发布的测试文章。" }],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1
      }
    }
  },
  "slug": "cli-schedule-test",
  "publishedAt": "2026-04-10T00:00:00Z",
  "action": "schedule"
}
```

Run: `npx tsx scripts/blog-cli/index.ts publish scripts/blog-cli/examples/test-schedule.json`

Expected: `status=created | action=schedule | scheduled=2026-04-10T00:00:00Z`

> If this fails with a `schedule-post` endpoint error, debug the server endpoint from Task 2 — check the route path, auth mechanism, and `payload.jobs.queue` signature.

- [ ] **Step 8: Clean up test posts via Admin Panel and commit examples**

Delete the test posts from Admin Panel. Then:

```bash
git add scripts/blog-cli/examples/
git commit -m "feat: add example JSON files for blog CLI"
```

---

## Task Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Enable API Key auth | None |
| 2 | Schedule post endpoint | None |
| 3 | Input types & validation | None |
| 4 | REST API client | None |
| 5 | Reference resolver | Task 4 |
| 6 | Publisher orchestrator | Tasks 3, 4, 5 |
| 7 | CLI entry point | Task 6 |
| 8 | E2E verification | Tasks 1-7, running PayloadCMS instance |

Tasks 1-4 can be executed in parallel. Task 5 depends on 4. Task 6 depends on 3+4+5. Task 7 depends on 6. Task 8 is manual integration testing.
