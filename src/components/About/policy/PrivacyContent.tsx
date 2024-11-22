/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-21 17:02:20
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-21 17:51:17
 * @FilePath: /musedam-website/src/components/About/PrivacyContent.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import { FlexColContainer } from '@/components/StyleWrapper/container'
import PrivacyMDX from './privacy.mdx'
import { useEffect, useState } from 'react'
import useIsMobile from '@/hooks/useIsMobile'
import './policy.scss'
import { cn } from '@/utilities/cn'

export default function PrivacyPageContent() {
    const isMobile = useIsMobile()

    const [className, setClassName] = useState('')
    useEffect(() => {
        setClassName(isMobile ? 'policy_mobile' : 'policy')
    }, [isMobile])

    return (
        <FlexColContainer className='w-full items-center px-[20px]'>
            <div className="policy-terms prose mx-auto md:mt-[80px] mt-[30px] w-full max-w-[1140px] pb-20 font-mono">
                <h1 className="text-[40px] text-center font-normal leading-[46px] md:text-[68px] md:leading-[78px] font-baskervville">
                    Privacy Policy
                </h1>
                <div className="md:mb-10 md:mt-[60px] my-[30px] font-mono text-[16px] font-medium leading-[24px] tracking-[0.8px]">
                    Version Date: October 31, 2024
                </div>
                <div className={cn('privacy-content', className)}>
                    <PrivacyMDX />
                </div>
            </div>
        </FlexColContainer >
    )
}