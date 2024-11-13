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
        heroImage: '/Features/AI-Powered/AI-Search-Hero.png',
        url: '/features/ai-powered/ai-search',
      },
      {
        icon: Zap,
        title: 'AI Parsing',
        description: 'Visuals, Color Schemes, Themes, etc.',
        heroImage: '/Features/AI-Powered/AI-Parsing-Hero.png',
        url: '/features/ai-powered/ai-parsing',
      },
      {
        icon: FileText,
        title: 'AI Content Creation',
        description: 'Craft Blog from Asset Insights',
        heroImage: '/Features/AI-Powered/AI-Content-Creation-Hero.png',
        url: '/features/ai-powered/ai-content-creation',
      },
      {
        icon: Tags,
        title: 'Auto Tags',
        description: 'Auto-Tag for Search & Clustering',
        heroImage: '/Features/AI-Powered/Auto-Tags-Hero.png',
        url: '/features/ai-powered/auto-tags',
      },
      {
        icon: Bot,
        title: 'MuseCopilot',
        description: 'Chat with Copilot on your Content',
        heroImage: '/Features/AI-Powered/MuseCopilot-Hero.png',
        url: '/features/ai-powered/muse-copilot',
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
      },
      { icon: Folders, title: 'Smart Folders', description: 'Automatic Categorization' },
      { icon: Eye, title: '70+ File Formats', description: 'Online Preview for 70+ Formats' },
      {
        icon: List,
        title: 'Multiple Viewing',
        description: 'List, Board, Waterfall and Adaptive',
      },
      {
        icon: Lock,
        title: 'Encrypted Sharing',
        description: 'Set Expiry and Password for Sharing',
      },
    ],
  },
  {
    category: 'Team Collaboration',
    items: [
      { icon: Users, title: 'Team Management', description: 'Member and Department Management' },
      { icon: Lock, title: 'Permissions', description: 'Folder Permissions by Member Role' },
      { icon: FileText, title: 'Dynamic Feedback', description: 'Comments and Annotations' },
      { icon: List, title: 'Versions', description: 'Version Control and History Access' },
      {
        icon: BarChart2,
        title: 'Data Statistics',
        description: 'Activity Statistics and Leaderboards',
      },
    ],
  },
]
