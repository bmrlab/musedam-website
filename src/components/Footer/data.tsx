import { useMemo } from 'react'

import { useFooterTranslation } from '@/app/i18n/client'

export default function useFooterData() {
  const { t } = useFooterTranslation()

  const data = useMemo(
    () => [
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.ai-search'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.ai-parsing'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.ai-content-creation'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.auto-tags'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.muse-copilot'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.inspiration-collection'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.smart-folders'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.file-formats'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.multiple-viewing'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.encrypted-sharing'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.team-management'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.permissions'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.dynamic-feedback'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.versions'),
          },
        },
      },
      {
        group: t('group.features'),
        item: {
          link: {
            label: t('features.data-statistics'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.creative-production'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.e-commerce'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.marketing'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.media-entertainment'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.events'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.game'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.publisher'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.education'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.non-profit'),
          },
        },
      },
      {
        group: t('group.customers'),
        item: {
          link: {
            label: t('customers.publisher'),
          },
        },
      },
      {
        group: t('group.resources'),
        item: {
          link: {
            label: t('resources.help-center'),
          },
        },
      },
      {
        group: t('group.resources'),
        item: {
          link: {
            label: t('resources.blog'),
          },
        },
      },
      {
        group: t('group.resources'),
        item: {
          link: {
            label: t('resources.tutorials'),
          },
        },
      },
      {
        group: t('group.resources'),
        item: {
          link: {
            label: t('resources.status-page'),
          },
        },
      },
      {
        group: t('group.resources'),
        item: {
          link: {
            label: t('resources.security'),
          },
        },
      },
      {
        group: t('group.resources'),
        item: {
          link: {
            label: t('resources.release-notes'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.about-us'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.investors'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.culture'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.diversity'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.inclusion'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.policies'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.terms'),
          },
        },
      },
      {
        group: t('group.company'),
        item: {
          link: {
            label: t('company.privacy'),
          },
        },
      },
    ],
    [t],
  )

  return { data }
}
