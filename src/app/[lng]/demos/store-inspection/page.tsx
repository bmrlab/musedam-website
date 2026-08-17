import { Metadata } from 'next'
import { getPageMetadata } from '@/utilities/getMetadata'

import { MetadataProps, PropsWithLng } from '@/types/page'
import { seoTranslation } from '@/app/i18n'

import StoreInspectionDemo from './page.client'

export default async function StoreInspectionPage({ params }: PropsWithLng) {
  const { t } = await seoTranslation(params)

  return <StoreInspectionDemo title={t('demos.storeInspection.title')} />
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params

  return getPageMetadata({
    lng,
    title: t('demos.storeInspection.title'),
    description: t('demos.storeInspection.description'),
    url: 'demos/store-inspection',
  })
}
