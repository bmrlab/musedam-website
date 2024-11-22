/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-21 15:11:35
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-21 17:04:35
 * @FilePath: /musedam-website/src/app/[lng]/(company)/terms/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { FlexColContainer } from '@/components/StyleWrapper/container'
import { Metadata } from 'next'
import PrivacyPageContent from '@/components/About/policy/PrivacyContent'


export default function AllFeaturesPage() {

    return (
        <FlexColContainer className='w-full items-center'>
            <PrivacyPageContent />
        </FlexColContainer >
    )
}


export function generateMetadata(): Metadata {
    return {
        title: `MuseDAM Privacy Policy | Secure Digital Asset Management`,
        description: `Understand how MuseDAM safeguards your privacy with our comprehensive policy. Learn about data protection, user rights, and our commitment to confidentiality in managing your digital assets.`
    }
}
