'use client'

import { FlexColContainer } from '@/components/StyleWrapper/container'
import TermsMDXEN from './terms-en.mdx'
import TermsMDXZH from './terms-zh.mdx'
import { useEffect, useState } from 'react'
import useIsMobile from '@/hooks/useIsMobile'
import './policy.scss'
import { ssTranslation } from '@/app/i18n'
import { useTranslation } from '@/app/i18n/client'

export default function PrivacyPageContent({ lng }: { lng: string }) {
    const isMobile = useIsMobile()
    const { t } = useTranslation('company')
    const [className, setClassName] = useState('')

    useEffect(() => {
        setClassName(isMobile ? 'policy_mobile' : 'policy')
    }, [isMobile])

    return (
        <FlexColContainer className='w-full items-center'>
            <div className="policy-terms prose mx-auto mt-[30px] w-full max-w-[1140px] px-[20px] pb-20 font-mono md:mt-[80px]">
                <h1 className="text-center font-baskervville text-[40px] font-normal leading-[46px] md:text-[68px] md:leading-[78px]">
                    {t('terms.title')}
                </h1>
                <div className="my-[30px] font-mono text-[16px] font-medium leading-[24px] tracking-[0.8px] md:mb-10 md:mt-[60px]">
                    {t('terms.update-date')}
                </div>
                <div className={className}>
                    {lng === 'zh' ? <TermsMDXZH /> : <TermsMDXEN />}
                </div>
            </div>
        </FlexColContainer >
    )
}