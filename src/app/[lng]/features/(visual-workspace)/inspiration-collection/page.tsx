import { Metadata } from 'next'
import { BROWSER_EXTENSION_URL, BROWSER_EXTENSION_URL_ZH } from '@/constant/url'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { isInChina } from '@/app/[lng]/country'
import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase from '@/app/[lng]/features/_components/Showcase'
import TextDisplay from '@/app/[lng]/features/_components/TextDisplay'
import fetchData from '@/app/[lng]/features/(team-collaboration)/data'
import { seoTranslation, ssTranslation } from '@/app/i18n'

import PageClient from './page.client'
import { getPageMetadata } from '@/utilities/getMetadata'

export default async function InspirationCollectionPage({ params }: PropsWithLng) {
  const { lng } = await params
  const { t } = await ssTranslation(lng, 'inspiration-collection')
  const country = await isInChina(lng)
  const { heroData, showcaseData, textDisplayData } = await fetchData({
    ns: 'inspiration-collection',
    lng,
    showcaseLength: 6,
    textDisplayLength: 4,
  })
  return (
    <div>
      <Hero
        {...heroData}
        buttonText={t('button.start')}
        buttonHref={country ? BROWSER_EXTENSION_URL_ZH : BROWSER_EXTENSION_URL}
      />
      <Showcase {...showcaseData}>
        <PageClient />
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  return getPageMetadata({ title: t('features.inspiration-collection.title'), description: t('features.inspiration-collection.description') })
}
