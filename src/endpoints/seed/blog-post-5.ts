import type { Post } from '@/payload-types'

export const blogPost5: Partial<Post> = {
  slug: 'ai-powered-content-creation',
  _status: 'published',
  title: 'AI-Powered Content Creation: The Future is Here',
  // @ts-ignore
  authors: ['{{AUTHOR}}'],
  publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  meta: {
    title: 'AI-Powered Content Creation: The Future is Here',
    description: 'Explore how artificial intelligence is revolutionizing content creation and what it means for creative professionals.',
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
              text: 'The AI Revolution in Creative Industries',
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
              text: 'Artificial Intelligence is no longer a futuristic concept—it\'s actively transforming how we create, edit, and distribute content. From automated video editing to AI-generated graphics, the creative landscape is evolving at an unprecedented pace.',
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
