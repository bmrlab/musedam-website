import type { Post } from '@/payload-types'

export const blogPost3: Partial<Post> = {
  slug: 'building-brands-digital-age',
  _status: 'published',
  title: 'Building Brands in the Digital Age: A Complete Guide',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  meta: {
    title: 'Building Brands in the Digital Age: A Complete Guide',
    description: 'Discover how to create and maintain a strong brand presence across digital channels with proven strategies and tools.',
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
              text: 'Building a brand in today\'s digital landscape requires a fundamentally different approach than traditional branding methods. Discover how to create and maintain a strong brand presence across digital channels with proven strategies and tools.',
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
