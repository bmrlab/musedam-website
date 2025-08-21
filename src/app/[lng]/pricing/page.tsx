import { Metadata } from 'next'
import { getServerSession } from '@/utilities/auth'
import { getPageMetadata } from '@/utilities/getMetadata'
import { PageSEO } from '@/components/SEO/PageSEO'
import { MetadataProps, PropsWithLng } from '@/types/page'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { seoTranslation } from '@/app/i18n'
import FeatureList from '@/components/Pricing/Enterprise/FeatureList'
import FAQ from '@/components/Pricing/Enterprise/FAQ'
import Buy from '@/components/Pricing/Enterprise/Buy'

export default async function MuseDAMPricingPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ plan?: string }>
} & PropsWithLng) {
  const user = await getServerSession()
  const { lng } = await params
  const { t } = await seoTranslation(params)

  return (
    <FlexColContainer className="w-full items-center bg-[#070707]">
      <PageSEO
        type="pricing"
        title={t('pricing.title')}
        description={t('pricing.description')}
        url="/pricing"
        image="/assets/logo.svg"
        lng={lng}
        breadcrumbs={[
          { name: t('home.shortTitle'), url: '/' },
          { name: t('pricing.shortTitle'), url: '/pricing' }
        ]}
      />
      <FlexColContainer className="w-full items-center ">
        <Buy user={user} />
        <div className='h-[20px] w-full'></div>
        <FeatureList user={user} />
      </FlexColContainer>
      <FAQ />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params
  return getPageMetadata({
    title: t('pricing.title'),
    description: t('pricing.description'),
    url: 'pricing',
    lng,
  })
}
