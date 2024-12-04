import { useMemo } from 'react'
import {
  LucideProps,
} from 'lucide-react'

import usePublicUrl from '@/hooks/usePublicUrl'
import Icons from '@/components/icon'
import { useHeaderTranslation } from '@/app/i18n/client'

export type FeatureItem = {
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  heroImage?: string
  url?: string
}

export default function useHeaderData() {
  const { t } = useHeaderTranslation()
  const { realBasePath: ImageBasePath } = usePublicUrl('/assets/Navbar-Images')

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
            icon: Icons.aiSearch,
            title: t('ai-powered.ai-search.title'),
            description: t('ai-powered.ai-search.description'),
            heroImage: `${ImageBasePath}/AI-Search.png`,
            url: '/features/ai-search',
          },
          {
            icon: Icons.aiParsing,
            title: t('ai-powered.ai-parsing.title'),
            description: t('ai-powered.ai-parsing.description'),
            heroImage: `${ImageBasePath}/AI-Parsing.png`,
            url: '/features/ai-parsing',
          },
          {
            icon: Icons.aiContentCreation,
            title: t('ai-powered.ai-content-creation.title'),
            description: t('ai-powered.ai-content-creation.description'),
            heroImage: `${ImageBasePath}/Content-Creation.png`,
            url: '/features/ai-content-creation',
          },
          {
            icon: Icons.autoTags,
            title: t('ai-powered.auto-tags.title'),
            description: t('ai-powered.auto-tags.description'),
            heroImage: `${ImageBasePath}/Auto-Tags.png`,
            url: '/features/auto-tags',
          },
          {
            icon: Icons.museCopilot,
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
            icon: Icons.inspirationCollection,
            title: t('visual-workspace.inspiration-collection.title'),
            description: t('visual-workspace.inspiration-collection.description'),
            heroImage: `${ImageBasePath}/Inspiration-Collection.png`,
            url: '/features/inspiration-collection',
          },
          {
            icon: Icons.smartFolders,
            title: t('visual-workspace.smart-folders.title'),
            description: t('visual-workspace.smart-folders.description'),
            heroImage: `${ImageBasePath}/Smart-Folders.png`,
            url: '/features/smart-folders',
          },
          {
            icon: Icons.fileFormats,
            title: t('visual-workspace.file-formats.title'),
            description: t('visual-workspace.file-formats.description'),
            heroImage: `${ImageBasePath}/70+Formats.png`,
            url: '/features/file-formats',
          },
          {
            icon: Icons.multipleViewing,
            title: t('visual-workspace.multiple-viewing.title'),
            description: t('visual-workspace.multiple-viewing.description'),
            heroImage: `${ImageBasePath}/Multiple-Viewing.png`,
            url: '/features/multiple-viewing',
          },
          {
            icon: Icons.encryptedSharing,
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
            icon: Icons.teamManagement,
            title: t('team-collaboration.team-management.title'),
            description: t('team-collaboration.team-management.description'),
            heroImage: `${ImageBasePath}/Team-Management.png`,
            url: '/features/team-management',
          },
          {
            icon: Icons.permissions,
            title: t('team-collaboration.permissions.title'),
            description: t('team-collaboration.permissions.description'),
            heroImage: `${ImageBasePath}/Permissions.png`,
            url: '/features/permissions',
          },
          {
            icon: Icons.dynamicFeedback,
            title: t('team-collaboration.dynamic-feedback.title'),
            description: t('team-collaboration.dynamic-feedback.description'),
            heroImage: `${ImageBasePath}/Dynamic-Feedback.png`,
            url: '/features/dynamic-feedback',
          },
          {
            icon: Icons.versions,
            title: t('team-collaboration.versions.title'),
            description: t('team-collaboration.versions.description'),
            heroImage: `${ImageBasePath}/Versions.png`,
            url: '/features/versions',
          },
          {
            icon: Icons.dataStatistics,
            title: t('team-collaboration.data-statistics.title'),
            description: t('team-collaboration.data-statistics.description'),
            heroImage: `${ImageBasePath}/Data-Statistics.png`,
            url: '/features/data-statistics',
          },
        ],
      },
    ],
    [t, ImageBasePath],
  )

  return { data }
}
