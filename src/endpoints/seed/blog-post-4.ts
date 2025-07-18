import type { Post } from '@/payload-types'

export const blogPost4: Partial<Post> = {
  slug: 'workflow-automation-best-practices',
  _status: 'published',
  title: 'Workflow Automation: Best Practices for Creative Teams',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  meta: {
    title: 'Workflow Automation: Best Practices for Creative Teams',
    description: 'Streamline your creative processes with proven workflow automation strategies that boost productivity and reduce manual tasks.',
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
              text: 'Transforming Creative Workflows Through Automation',
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
              text: 'Creative teams often find themselves bogged down by repetitive tasks that take time away from actual creative work. Workflow automation can revolutionize how creative teams operate, allowing them to focus on what they do best while technology handles the routine processes.',
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
