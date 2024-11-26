'use client'

import { FlexColContainer } from '@/components/StyleWrapper/Container'
import PrivacyMDXEN from './Abroad/privacy-en.mdx'
import PrivacyMDXZH from './Abroad/privacy-zh.mdx'
import PrivacyInChina from './China/privacy.mdx'
import { useEffect, useState } from 'react'
import useIsMobile from '@/hooks/useIsMobile'
import './policy.scss'
import { cn } from '@/utilities/cn'
import { useTranslation } from 'react-i18next'
import { useCountry } from '@/providers/Country'

export default function PrivacyPageContent({ lng }: { lng: string }) {
    const isMobile = useIsMobile()
    const { t } = useTranslation('company')
    const { isInChina } = useCountry()
    const [className, setClassName] = useState('')

    useEffect(() => {
        setClassName(isMobile ? 'policy_mobile' : 'policy')
    }, [isMobile])

    return (
        <FlexColContainer className='w-full items-center px-[20px]'>
            <div className="policy-terms prose mx-auto mt-[30px] w-full max-w-[1140px] pb-20 font-mono md:mt-[80px]">
                <h1 className="text-center font-baskervville text-[40px] font-normal leading-[46px] md:text-[68px] md:leading-[78px]">
                    {isInChina ? '隐私政策' : t('privacy.title')}
                </h1>
                <div className="my-[30px] font-mono text-[16px] font-medium leading-[24px] tracking-[0.8px] md:mb-10 md:mt-[60px]">
                    {isInChina ? '版本日期：2023年9月18日' : t('privacy.update-date')}
                </div>
                <div className={cn('privacy-content', className)}>
                    {isInChina ? <PrivacyInChina /> : lng === 'zh' ? <PrivacyMDXZH /> : <PrivacyMDXEN />}
                </div>
            </div>
        </FlexColContainer >
    )
}
