/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-21 15:11:35
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-21 17:03:38
 * @FilePath: /musedam-website/src/app/[lng]/(company)/terms/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { FlexColContainer } from '@/components/StyleWrapper/container'
import { Metadata } from 'next'
import TermsPageContent from '@/components/About/policy/TermsContent'


export default function AllFeaturesPage() {

    return (
        <FlexColContainer className='w-full items-center'>
            <TermsPageContent />
        </FlexColContainer >
    )
}


export function generateMetadata(): Metadata {
    return {
        title: `MuseDAM Service Agreement | Your Digital Asset Guide`,
        description: `Explore the comprehensive terms that govern the use of MuseDAM's digital asset management platform.Our service agreement outlines the rights and responsibilities for a secure and efficient content management experience.`
    }
}
