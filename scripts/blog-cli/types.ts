import { z } from 'zod'

export const LexicalJsonSchema = z.object({
  root: z
    .object({
      type: z.literal('root'),
      children: z.array(z.any()),
    })
    .passthrough(),
})

export const LocalizedTextSchema = z.object({
  zh: z.string().min(1),
  en: z.string().optional(),
}).strict()

export const LocalizedContentSchema = z.object({
  zh: LexicalJsonSchema,
  en: LexicalJsonSchema.optional(),
}).strict()

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
    publishedAt: z.string().datetime({ offset: true }).optional(),
    action: z.enum(['publish', 'schedule', 'draft']),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (/[^\x00-\x7F]/.test(data.title.zh) && !data.slug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'slug is required when title.zh contains non-ASCII characters',
        path: ['slug'],
      })
    }

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
