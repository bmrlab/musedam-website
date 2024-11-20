import { useMemo } from 'react'
import {
  BarChart2,
  Bot,
  Eye,
  FileText,
  Folders,
  List,
  Lock,
  LucideProps,
  Search,
  Share2,
  Tags,
  Users,
  Zap,
} from 'lucide-react'

import { useHeaderTranslation } from '@/app/i18n/client'

export type FeatureItem = {
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  heroImage?: string
  url?: string
}

const ImageBasePath = '/Navbar-Images'

export default function useHeaderData() {
  const { t } = useHeaderTranslation()
  const data = useMemo<
    {
      category: string
      items: FeatureItem[]
    }[]
  >(
    () => [
      {
        category: t('category.ai-powered'),
        items: [
          {
            icon: Search,
            title: t('ai-powered.ai-search.title'),
            description: t('ai-powered.ai-search.description'),
            heroImage: `${ImageBasePath}/AI-Search.png`,
            url: '/features/ai-search',
          },
          {
            icon: Zap,
            title: t('ai-powered.ai-parsing.title'),
            description: t('ai-powered.ai-parsing.description'),
            heroImage: `${ImageBasePath}/AI-Parsing.png`,
            url: '/features/ai-parsing',
          },
          {
            icon: FileText,
            title: t('ai-powered.ai-content-creation.title'),
            description: t('ai-powered.ai-content-creation.description'),
            heroImage: `${ImageBasePath}/Content-Creation.png`,
            url: '/features/ai-content-creation',
          },
          {
            icon: Tags,
            title: t('ai-powered.auto-tags.title'),
            description: t('ai-powered.auto-tags.description'),
            heroImage: `${ImageBasePath}/Auto-Tags.png`,
            url: '/features/auto-tags',
          },
          {
            icon: Bot,
            title: t('ai-powered.muse-copilot.title'),
            description: t('ai-powered.muse-copilot.description'),
            heroImage: `${ImageBasePath}/MuseCopilot.png`,
            url: '/features/muse-copilot',
          },
        ],
      },
      {
        category: t('category.visual-workspace'),
        items: [
          {
            icon: Share2,
            title: t('visual-workspace.inspiration-collection.title'),
            description: t('visual-workspace.inspiration-collection.description'),
            heroImage: `${ImageBasePath}/Inspiration-Collection.png`,
            url: '/features/inspiration-collection',
          },
          {
            icon: Folders,
            title: t('visual-workspace.smart-folders.title'),
            description: t('visual-workspace.smart-folders.description'),
            heroImage: `${ImageBasePath}/Smart-Folders.png`,
            url: '/features/smart-folders',
          },
          {
            icon: Eye,
            title: t('visual-workspace.file-formats.title'),
            description: t('visual-workspace.file-formats.description'),
            heroImage: `${ImageBasePath}/70+Formats.png`,
            url: '/features/file-formats',
          },
          {
            icon: List,
            title: t('visual-workspace.multiple-viewing.title'),
            description: t('visual-workspace.multiple-viewing.description'),
            heroImage: `${ImageBasePath}/Multiple-Viewing.png`,
            url: '/features/multiple-viewing',
          },
          {
            icon: Lock,
            title: t('visual-workspace.encrypted-sharing.title'),
            description: t('visual-workspace.encrypted-sharing.description'),
            heroImage: `${ImageBasePath}/Encrypted-Sharing.png`,
            url: '/features/encrypted-sharing',
          },
        ],
      },
      {
        category: t('category.team-collaboration'),
        items: [
          {
            icon: Users,
            title: t('team-collaboration.team-management.title'),
            description: t('team-collaboration.team-management.description'),
            heroImage: `${ImageBasePath}/Team-Management.png`,
            url: '/features/team-management',
          },
          {
            icon: Lock,
            title: t('team-collaboration.permissions.title'),
            description: t('team-collaboration.permissions.description'),
            heroImage: `${ImageBasePath}/Permissions.png`,
            url: '/features/permissions',
          },
          {
            icon: FileText,
            title: t('team-collaboration.dynamic-feedback.title'),
            description: t('team-collaboration.dynamic-feedback.description'),
            heroImage: `${ImageBasePath}/Dynamic-Feedback.png`,
            url: '/features/dynamic-feedback',
          },
          {
            icon: List,
            title: t('team-collaboration.versions.title'),
            description: t('team-collaboration.versions.description'),
            heroImage: `${ImageBasePath}/Versions.png`,
            url: '/features/versions',
          },
          {
            icon: BarChart2,
            title: t('team-collaboration.data-statistics.title'),
            description: t('team-collaboration.data-statistics.description'),
            heroImage: `${ImageBasePath}/Data-Statistics.png`,
            url: '/features/data-statistics',
          },
        ],
      },
    ],
    [t],
  )

  return { data }
}
