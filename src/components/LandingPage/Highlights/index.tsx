'use client'

import { useMemo } from 'react'

import useIsMobile from '@/hooks/useIsMobile'
import { useHighlightTranslation, useTranslation } from '@/app/i18n/client'

import HighlightsDesktop from './desktop'
import HighlightsMobile from './mobile'

export type Highlight = {
  title: string
  description: string[]
  list?: string[]
  point?: { title: string; description: string }[]
  image: string
  bgColor: string
}

export default function Highlights() {
  const { t } = useHighlightTranslation()
  const data = useMemo<Highlight[]>(
    () => [
      {
        title: t('collect.title'),
        description: [t('collect.description.0'), t('collect.description.1')],
        image: '/Highlights/Mobile/Collect.png',
        bgColor: '#E8E4E4',
      },
      {
        title: t('organize.title'),
        description: [t('organize.description.0'), t('organize.description.1')],
        image: '/Highlights/Mobile/Organize.png',
        bgColor: '#FFFFFF',
      },
      {
        title: t('collaborate.title'),
        description: [t('collaborate.description.0')],
        list: [
          t('collaborate.list.0'),
          t('collaborate.list.1'),
          t('collaborate.list.2'),
          t('collaborate.list.3'),
        ],
        image: '/Highlights/Mobile/Collaborate.png',
        bgColor: '#D0CCE0',
      },
      {
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
        image: '/Highlights/Mobile/AI-Generate.png',
        bgColor: '#E8E4E4',
      },
    ],
    [t],
  )

  const isMobile = useIsMobile()
  return isMobile ? <HighlightsMobile data={data} /> : <HighlightsDesktop data={data} />
}
