'use client'

import { FlexColContainer } from '@/components/StyleWrapper/container'
import TermsMDX from './terms.mdx'
import { useEffect, useState } from 'react'
import useIsMobile from '@/hooks/useIsMobile'
import './policy.scss'

export default function TermsPageContent() {
    const isMobile = useIsMobile()

    const [className, setClassName] = useState('')
    useEffect(() => {
        setClassName(isMobile ? 'policy_mobile' : 'policy')
    }, [isMobile])

    return (
        <FlexColContainer className='w-full items-center'>
            <div className="policy-terms prose mx-auto mt-[30px] w-full max-w-[1140px] px-[20px] pb-20 font-mono md:mt-[80px]">
                <h1 className="text-center font-baskervville text-[40px] font-normal leading-[46px] md:text-[68px] md:leading-[78px]">
                    Service Agreement
                </h1>
                <div className="my-[30px] font-mono text-[16px] font-medium leading-[24px] tracking-[0.8px] md:mb-10 md:mt-[60px]">
                    Version Date: October 31, 2024
                </div>
                <div className={className}>
                    <TermsMDX />
                </div>
            </div>
        </FlexColContainer >
    )
}