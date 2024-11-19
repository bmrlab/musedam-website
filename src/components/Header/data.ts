import {
  BarChart2,
  Bot,
  Eye,
  FileText,
  Folders,
  List,
  LucideProps,
  Search,
  Share2,
  Tags,
  Users,
  Lock,
  Zap,
} from 'lucide-react'

export type FeatureItem = {
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  heroImage?: string
  url?: string
}

const ImageBasePath = '/Navbar-Images'

export const features: {
  category: string
  items: FeatureItem[]
}[] = [
  {
    category: 'AI-Powered',
    items: [
      {
        icon: Search,
        title: 'AI Search',
        description: 'Visual Content Asset Search',
        heroImage: `${ImageBasePath}/AI-Search.png`,
        url: '/features/ai-search',
      },
      {
        icon: Zap,
        title: 'AI Parsing',
        description: 'Visuals, Color Schemes, Themes, etc.',
        heroImage: `${ImageBasePath}/AI-Parsing.png`,
        url: '/features/ai-parsing',
      },
      {
        icon: FileText,
        title: 'AI Content Creation',
        description: 'Craft Blog from Asset Insights',
        heroImage: `${ImageBasePath}/Content-Creation.png`,
        url: '/features/ai-content-creation',
      },
      {
        icon: Tags,
        title: 'Auto Tags',
        description: 'Auto-Tag for Search & Clustering',
        heroImage: `${ImageBasePath}/Auto-Tags.png`,
        url: '/features/auto-tags',
      },
      {
        icon: Bot,
        title: 'MuseCopilot',
        description: 'Chat with Copilot on your Content',
        heroImage: `${ImageBasePath}/MuseCopilot.png`,
        url: '/features/muse-copilot',
      },
    ],
  },
  {
    category: 'Visual Workspace',
    items: [
      {
        icon: Share2,
        title: 'Inspiration Collection',
        description: 'Browser Plugin for Websites',
        heroImage: `${ImageBasePath}/Inspiration-Collection.png`,
        url: '/features/inspiration-collection',
      },
      {
        icon: Folders,
        title: 'Smart Folders',
        description: 'Automatic Categorization',
        heroImage: `${ImageBasePath}/Smart-Folders.png`,
        url: '/features/smart-folders',
      },
      {
        icon: Eye,
        title: '70+ File Formats',
        description: 'Online Preview for 70+ Formats',
        heroImage: `${ImageBasePath}/70+Formats.png`,
        url: '/features/file-formats',
      },
      {
        icon: List,
        title: 'Multiple Viewing',
        description: 'List, Board, Waterfall and Adaptive',
        heroImage: `${ImageBasePath}/Multiple-Viewing.png`,
        url: '/features/multiple-viewing',
      },
      {
        icon: Lock,
        title: 'Encrypted Sharing',
        description: 'Set Expiry and Password for Sharing',
        heroImage: `${ImageBasePath}/Encrypted-Sharing.png`,
        url: '/features/encrypted-sharing',
      },
    ],
  },
  {
    category: 'Team Collaboration',
    items: [
      {
        icon: Users,
        title: 'Team Management',
        description: 'Member and Department Management',
        heroImage: `${ImageBasePath}/Team-Management.png`,
        url: '/features/team-management',
      },
      {
        icon: Lock,
        title: 'Permissions',
        description: 'Folder Permissions by Member Role',
        heroImage: `${ImageBasePath}/Permissions.png`,
        url: '/features/permissions',
      },
      {
        icon: FileText,
        title: 'Dynamic Feedback',
        description: 'Comments and Annotations',
        heroImage: `${ImageBasePath}/Dynamic-Feedback.png`,
        url: '/features/dynamic-feedback',
      },
      {
        icon: List,
        title: 'Versions',
        description: 'Version Control and History Access',
        heroImage: `${ImageBasePath}/Versions.png`,
        url: '/features/versions',
      },
      {
        icon: BarChart2,
        title: 'Data Statistics',
        description: 'Activity Statistics and Leaderboards',
        heroImage: `${ImageBasePath}/Data-Statistics.png`,
        url: '/features/data-statistics',
      },
    ],
  },
]
