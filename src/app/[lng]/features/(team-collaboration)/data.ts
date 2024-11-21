import { HeroProps } from '@/app/[lng]/features/_components/Hero'
import { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { ssTranslation } from '@/app/i18n'

import { tagColor } from './const'

export default async function fetchData({
  ns,
  lng,
  showcaseLength,
  textDisplayLength,
}: {
  ns: string
  lng: string
  showcaseLength: number
  textDisplayLength: number
}): Promise<{
  heroData: HeroProps
  showcaseData: ShowcaseProps
  textDisplayData: TextDisplayProps
}> {
  const { t } = await ssTranslation(lng, ns)

  return {
    heroData: {
      tag: t('hero.tag'),
      tagColor,
      title: t('hero.title'),
      description: t('hero.description'),
    },
    showcaseData: {
      title: t('showcase.title'),
      points: new Array(showcaseLength).fill(0).map((_, i) => ({
        keyword: t(`showcase.points.${i}.keyword`),
        description: t(`showcase.points.${i}.description`),
      })),
    },
    textDisplayData: {
      title: t('text-display.title'),
      points: new Array(textDisplayLength).fill(0).map((_, i) => ({
        keyword: t(`text-display.points.${i}.keyword`),
        description: t(`text-display.points.${i}.description`),
      })),
    },
  }
}
