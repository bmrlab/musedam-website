import { HeroProps } from '@/app/[lng]/features/_components/Hero'
import { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { tagColor } from '@/app/[lng]/features/(ai-powered)/const'
import { ssTranslation } from '@/app/i18n'

export default async function fetchData({
  ns,
  lng,
  showcaseLength,
}: {
  ns: string
  lng: string
  showcaseLength: number
}): Promise<{
  heroData: HeroProps
  showcaseData: ShowcaseProps
}> {
  const { t } = await ssTranslation(lng, ns)
  const { t: tFeatures } = await ssTranslation(lng, 'features')

  return {
    heroData: {
      tag: t('hero.tag'),
      tagColor,
      title: t('hero.title'),
      description: t('hero.description'),
      buttonText: tFeatures('button.start'),
      lng,
    },
    showcaseData: {
      title: t('showcase.title'),
      points: new Array(showcaseLength).fill(0).map((_, i) => ({
        keyword: t(`showcase.points.${i}.keyword`),
        description: t(`showcase.points.${i}.description`),
      })),
    },
  }
}
