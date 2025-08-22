// Help Center 示例数据结构
// 这个文件展示了Help Center的数据模型，实际使用时需要在Payload CMS中创建对应的集合

export interface HelpTopic {
    id: string
    title: string
    slug: string
    coverImage?: {
        url: string
        alt?: string
    }
    bullets: string[]
    description: string
    index: number
}

export interface HelpCategory {
    id: string
    title: string
    slug: string
    description?: string
    topic: string // 关联的专题ID
    index: number
}

export interface HelpDocument {
    id: string
    title: string
    slug: string
    content: string // markdown内容
    excerpt?: string
    author?: {
        name: string
    }
    publishedAt: string
    category: string // 关联的分类ID
    _status: 'published' | 'draft'
    index: number
}

// 示例数据
export const exampleTopics: HelpTopic[] = [
    {
        id: '1',
        title: 'Getting Started',
        slug: 'getting-started',
        bullets: ['The Basics', 'Upload & Download', 'Organize', 'Analytics & Monitoring'],
        description: 'Learn the fundamentals of MuseDAM and get started with your first project.',
        index: 1,
    },
    {
        id: '2',
        title: 'Muse for Team',
        slug: 'muse-for-team',
        bullets: ['Collaboration', 'Workspace settings'],
        description: 'Discover how to collaborate effectively with your team in MuseDAM.',
        index: 2,
    },
    {
        id: '3',
        title: 'Muse for Enterprise',
        slug: 'muse-for-enterprise',
        bullets: ['Advanced Features', 'System Roles'],
        description: 'Enterprise-level features and system administration for large organizations.',
        index: 3,
    },
    {
        id: '4',
        title: 'AI Capability',
        slug: 'ai-capability',
        bullets: ['MuseCopilot', 'Search'],
        description: 'Explore AI-powered features that enhance your creative workflow.',
        index: 4,
    },
    {
        id: '5',
        title: 'Advanced Modules',
        slug: 'advanced-modules',
        bullets: ['Workflow Automation', 'Custom Fields', 'API Integration', 'Advanced Analytics'],
        description: 'Advanced features for power users and developers.',
        index: 5,
    },
    {
        id: '6',
        title: 'Apps and Integrations',
        slug: 'apps-and-integrations',
        bullets: ['Third-party Apps', 'Webhooks', 'API Documentation', 'SDK'],
        description: 'Connect MuseDAM with your favorite tools and build custom integrations.',
        index: 6,
    },
]

export const exampleCategories: HelpCategory[] = [
    {
        id: '1',
        title: 'The Basics',
        slug: 'the-basics',
        description: 'Essential concepts and first steps',
        topic: '1', // Getting Started
        index: 1,
    },
    {
        id: '2',
        title: 'Collect',
        slug: 'collect',
        description: 'Ways to add content to your library',
        topic: '1', // Getting Started
        index: 2,
    },
    {
        id: '3',
        title: 'View',
        slug: 'view',
        description: 'How to browse and preview your content',
        topic: '1', // Getting Started
        index: 3,
    },
    {
        id: '4',
        title: 'Search',
        slug: 'search',
        description: 'Find content quickly and efficiently',
        topic: '1', // Getting Started
        index: 4,
    },
]

export const exampleDocuments: HelpDocument[] = [
    {
        id: '1',
        title: 'What is MuseDAM?',
        slug: 'what-is-musedam',
        content: `
# What is MuseDAM?

MuseDAM is a comprehensive digital asset management platform designed for creative teams and enterprises. It provides a centralized workspace for managing, organizing, and sharing creative assets efficiently.

## Key Features

- **Centralized Library**: Store all your creative assets in one place
- **Smart Organization**: AI-powered tagging and categorization
- **Team Collaboration**: Work together seamlessly with built-in collaboration tools
- **Advanced Search**: Find assets quickly with powerful search capabilities
- **Workflow Automation**: Streamline your creative processes

## Getting Started

To get started with MuseDAM:

1. Create your account
2. Set up your workspace
3. Upload your first assets
4. Invite team members
5. Start organizing and collaborating

For more detailed information, check out our [Getting Started Guide](/help/getting-started).
    `,
        excerpt: 'Learn about MuseDAM and its core features for digital asset management.',
        author: { name: 'MuseDAM Team' },
        publishedAt: '2024-12-20T00:00:00Z',
        category: '1', // The Basics
        _status: 'published',
        index: 1,
    },
    {
        id: '2',
        title: 'Join the Space',
        slug: 'join-the-space',
        content: `
# Join the Space

Learn how to join existing workspaces and collaborate with your team in MuseDAM.

## Invitation Process

1. **Receive Invitation**: You'll receive an email invitation to join a workspace
2. **Accept Invitation**: Click the link in the email to accept
3. **Set Up Account**: Create your account or sign in if you already have one
4. **Access Workspace**: Start collaborating with your team

## Workspace Roles

Different roles have different permissions:

- **Admin**: Full access to all features and settings
- **Editor**: Can create, edit, and manage content
- **Viewer**: Can view and download content (read-only)
- **Guest**: Limited access for external collaborators

## Getting Help

If you encounter any issues while joining a workspace, contact your workspace administrator or reach out to our support team.
    `,
        excerpt: 'Step-by-step guide to joining workspaces and understanding user roles.',
        author: { name: 'MuseDAM Team' },
        publishedAt: '2024-12-20T00:00:00Z',
        category: '1', // The Basics
        _status: 'published',
        index: 2,
    },
    {
        id: '3',
        title: 'Local Upload',
        slug: 'local-upload',
        content: `
# Local Upload

Upload files from your local computer to MuseDAM.

## Supported File Types

MuseDAM supports a wide range of file formats:

- **Images**: JPG, PNG, GIF, SVG, TIFF, PSD, AI
- **Videos**: MP4, MOV, AVI, WMV, FLV
- **Documents**: PDF, DOC, DOCX, PPT, PPTX
- **Audio**: MP3, WAV, FLAC, AAC
- **3D Models**: OBJ, FBX, STL, GLTF

## Upload Methods

### Drag & Drop
1. Open the upload area in MuseDAM
2. Drag files from your computer to the upload zone
3. Release to start uploading

### File Browser
1. Click the upload button
2. Select files from your file browser
3. Click "Open" to start uploading

### Batch Upload
1. Select multiple files at once
2. Upload them in a single batch
3. Monitor progress in the upload queue

## Upload Settings

- **File Size Limit**: Up to 10GB per file
- **Batch Upload**: Up to 100 files at once
- **Auto-tagging**: AI-powered automatic tagging
- **Metadata Extraction**: Automatic metadata extraction from files
    `,
        excerpt: 'Learn how to upload files from your local computer to MuseDAM.',
        author: { name: 'MuseDAM Team' },
        publishedAt: '2024-12-20T00:00:00Z',
        category: '2', // Collect
        _status: 'published',
        index: 1,
    },
] 