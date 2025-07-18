import type { Post } from '@/payload-types'

export const blogPost6: Partial<Post> = {
  slug: 'creative-operations-scaling-teams',
  _status: 'published',
  title: 'Creative Operations: Scaling Creative Teams Effectively',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  publishedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  meta: {
    title: 'Creative Operations: Scaling Creative Teams Effectively',
    description: 'Learn how to build and scale creative operations that support growing teams and increasing content demands.',
  },
  content: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'The Strategic Importance of Creative Operations',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'As organizations grow and content demands increase, the need for structured creative operations becomes critical. Creative ops bridges the gap between creative vision and business execution, ensuring teams can scale without sacrificing quality or efficiency.',
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
