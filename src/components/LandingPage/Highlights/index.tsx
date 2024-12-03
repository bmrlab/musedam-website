'use client'

import useIsMobile from '@/hooks/useIsMobile'
import { useHighlightTranslation } from '@/app/i18n/client'

import HighlightsDesktop from './desktop'
import HighlightsMobile from './mobile'
import usePublicUrl from '@/hooks/usePublicUrl'

export type Highlight = {
  key: string
  title: string
  description: string[]
  list?: string[]
  point?: { title: string; description: string }[]
  image: string
  bgColor: string
}

export default function Highlights() {
  const { t } = useHighlightTranslation()
  const { getUrl } = usePublicUrl('/assets/Highlights/Mobile')
  const data = [
    {
      key: 'collect',
      title: t('collect.title'),
      description: [t('collect.description.0'), t('collect.description.1')],
      image: getUrl('Collect.png'),
      bgColor: '#E8E4E4',
    },
    {
      key: 'organize',
      title: t('organize.title'),
      description: [t('organize.description.0'), t('organize.description.1')],
      image: getUrl('Organize.png'),
      bgColor: '#FFFFFF',
    },
    {
      key: 'collaborate',
      title: t('collaborate.title'),
      description: [t('collaborate.description.0')],
      list: [
        t('collaborate.list.0'),
        t('collaborate.list.1'),
        t('collaborate.list.2'),
        t('collaborate.list.3'),
      ],
      image: getUrl('Collaborate.png'),
      bgColor: '#D0CCE0',
    },
    {
      key: 'ai-generate',
      title: t('ai-generate.title'),
      description: [t('ai-generate.description.0')],
      point: [
        {
          title: t('ai-generate.point.0.title'),
          description: t('ai-generate.point.0.description'),
        },
        {
          title: t('ai-generate.point.1.title'),
          description: t('ai-generate.point.1.description'),
        },
        {
          title: t('ai-generate.point.2.title'),
          description: t('ai-generate.point.2.description'),
        },
      ],
      image: getUrl('AI-Generate.png'),
      bgColor: '#E8E4E4',
    },
  ]

  const isMobile = useIsMobile()
  return isMobile ? <HighlightsMobile data={data} /> : <HighlightsDesktop data={data} />
}
