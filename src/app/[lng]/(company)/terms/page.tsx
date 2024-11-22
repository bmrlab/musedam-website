/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 10:56:51
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 12:49:34
 * @FilePath: /musedam-website/src/app/[lng]/(company)/terms/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Metadata } from 'next'
import TermsPageContent from '@/components/About/policy/TermsContent'
import { FlexColContainer } from '@/components/StyleWrapper/container'
import { ssTranslation } from '@/app/i18n'
import { PropsWithLng } from '@/types/page'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <TermsPageContent lng={lng} />
    </FlexColContainer>
  )
}

export async function generateMetadata({ params }: { params: { lng: string } }): Promise<Metadata> {
  const { t } = await ssTranslation(params.lng, 'seo')

  return {
    title: t('terms.title'),
    description: t('terms.description')
  }
}
