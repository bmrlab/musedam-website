/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 10:56:51
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 11:27:42
 * @FilePath: /musedam-website/src/components/About/InvestorsCards.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import Image from 'next/image'
import { twx } from '@/utilities/cn'

import useIsMobile from '@/hooks/useIsMobile'
import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { useTranslation } from '@/app/i18n/client'

const Title = twx.p`font-baskervville md:text-[80px] text-[54px] font-normal md:leading-[91.52px] leading-[48px] tracking-[1px] text-[#141414]`

export default function InvestorsCards() {
  const { t } = useTranslation('company')
  const cards = [
    { big: '/Company/Investors-Card-1.svg', small: '/Company/Investors-Card-Small-1.svg' },
    { big: '/Company/Investors-Card-2.svg', small: '/Company/Investors-Card-Small-2.svg' },
    { big: '/Company/Investors-Card-3.svg', small: '/Company/Investors-Card-Small-3.svg' },
  ]
  const isMobile = useIsMobile()
  return (
    <FlexColContainer className="gap-10 px-6 py-[60px] md:gap-20 md:px-20 md:pb-[120px] md:pt-[100px]">
      <FlexColContainer className="items-center justify-between md:flex-row">
        <Title>{t("about-us.investors.title")}</Title>
        <span className="mt-6 text-center font-mono text-[16px] font-light leading-6 tracking-[2%]">
          {t("about-us.investors.subtitle")}
        </span>
      </FlexColContainer>
      <FlexColContainer className="justify-between gap-6 md:flex-row md:gap-[40px]">
        {cards.map((item, index) => (
          <div
            key={index}
            className="h-auto max-h-[400px] w-full max-w-[400px] cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-5"
          >
            <Image
              src={isMobile ? item.small : item.big}
              width={100}
              height={100}
              key={`card-item-${index}`}
              alt="Inspiration-Collection-Discord"
              className="size-full"
            />
          </div>
        ))}
      </FlexColContainer>
    </FlexColContainer>
  )
}
