import LandingPage from '@/components/LandingPage'
import { Metadata } from 'next'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
import { getPageMetadata } from '@/utilities/getMetadata'
export default LandingPage



export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return getPageMetadata({ title: t('home.title'), description: t('home.description') })
}
