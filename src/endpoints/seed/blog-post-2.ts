import type { Post } from '@/payload-types'

export const blogPost2: Partial<Post> = {
  slug: 'mastering-digital-asset-management',
  _status: 'published',
  title: 'Mastering Digital Asset Management in 2024',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  meta: {
    title: 'Mastering Digital Asset Management in 2024',
    description: 'Learn how to effectively organize, store, and distribute your digital assets with modern DAM solutions and best practices.',
  },
  content: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'In today\'s digital-first world, organizations are creating and managing more digital content than ever before. Learn how to effectively organize, store, and distribute your digital assets with modern DAM solutions and best practices that scale with your business.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
}
