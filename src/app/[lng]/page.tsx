import LandingPage from '@/components/LandingPage'
import { Metadata } from 'next'
import { seoTranslation } from '@/app/i18n'
import { MetadataProps } from '@/types/page'
export default LandingPage



export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)

  return {
    title: t('home.title'),
    description: t('home.description'),
    openGraph: {
      title: ''
    }
  }
}
