import type { Post } from '@/payload-types'

export const blogPost1: Partial<Post> = {
  slug: 'how-to-create-website-from-scratch',
  _status: 'published',
  title: 'How to create a website from scratch in 11 steps',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  publishedAt: new Date().toISOString(),
  meta: {
    title: 'How to create a website from scratch in 11 steps',
    description: 'This is description this is description this is description this is description this is description this is description.',
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
              text: 'Creating a website from scratch might seem daunting, but with the right approach and tools, it becomes an exciting journey of digital creation. In this comprehensive guide, we\'ll walk you through 11 essential steps to build a professional website that meets your goals and engages your audience effectively.',
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
