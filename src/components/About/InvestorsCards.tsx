'use client'

import { FlexColContainer } from '@/components/StyleWrapper/container'
import Image from 'next/image'
import useIsMobile from '@/hooks/useIsMobile'
import { twx } from '@/utilities/cn'

const Title = twx.p`font-baskervville md:text-[80px] text-[54px] font-normal md:leading-[91.52px] leading-[48px] tracking-[1px] text-[#141414]`

export default function InvestorsCards() {
    const cards = [
        { big: "/Company/Investors-Card-1.svg", small: "/Company/Investors-Card-Small-1.svg" },
        { big: "/Company/Investors-Card-2.svg", small: "/Company/Investors-Card-Small-2.svg" },
        { big: "/Company/Investors-Card-3.svg", small: "/Company/Investors-Card-Small-3.svg" }
    ]
    const isMobile = useIsMobile()
    return (
        <FlexColContainer className='md:px-20 md:pt-[100px] md:pb-[120px] md:gap-20 px-6 py-[60px] gap-10'>
            <FlexColContainer className="justify-between items-center md:flex-row">
                <Title>Investors</Title>
                <span className="mt-6 font-mono text-[16px] font-light leading-6 tracking-[2%] text-center">MuseDAM - Driving Innovation in Digital Asset Management</span>
            </FlexColContainer>
            <FlexColContainer className="justify-between md:gap-[40px] gap-6 md:flex-row">
                {cards.map((item, index) => (
                    <div className="w-full h-auto max-h-[400px] max-w-[400px] transition-transform cursor-pointer duration-300 ease-in-out hover:-translate-y-5">
                        <Image
                            src={isMobile ? item.small : item.big}
                            width={100}
                            height={100}
                            key={`card-item-${index}`}
                            alt="Inspiration-Collection-Discord"
                            className='w-full h-full'
                        />
                    </div>
                ))}
            </FlexColContainer>
        </FlexColContainer>
    )
}
