'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { cn, twx } from '@/utilities/cn'

import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { useTranslation } from '@/app/i18n/client'

const Title = twx.p`font-euclid md:text-[80px] text-[54px] font-normal md:leading-[91.52px] leading-[48px] tracking-[1px] text-[#141414]`

export default function InvestorsCards() {
  const { t } = useTranslation('company')

  const cards = useMemo(
    () => [
      {
        logo: '/assets/Company/temasek-logo.svg',
        name: t('investors.temasek'),
        bgColor: '#E2D8FF',
      },
      {
        logo: '/assets/Company/sequoia-logo.svg',
        name: t('investors.sequoia'),
        bgColor: '#EDE9E5',
      },
      { logo: '/assets/Company/hearst-logo.svg', name: t('investors.hearst'), bgColor: '#B4D9FD' },
    ],
    [t],
  )

  return (
    <FlexColContainer className="w-full gap-10 px-6 py-[60px] md:gap-20 md:px-20 md:pb-[120px] md:pt-[100px]">
      <FlexColContainer className="items-center justify-between md:flex-row">
        <Title>{t('about-us.investors.title')}</Title>
        <span className="mt-6 text-center font-mono text-[16px] font-light leading-6 tracking-[2%]">
          {t('about-us.investors.subtitle')}
        </span>
      </FlexColContainer>
      <FlexColContainer className="justify-between gap-6 md:flex-row md:gap-[40px]">
        {cards.map((item, index) => (
          <div
            key={index}
            className={cn(
              'h-[160px] max-h-[400px] w-full max-w-[400px] cursor-pointer rounded-[20px] transition-transform duration-300 ease-in-out hover:-translate-y-5 md:h-auto',
              'flex flex-col items-start justify-between gap-4',
              'p-[30px] pt-[35px] md:aspect-square md:px-[45px] md:py-10',
            )}
            style={{
              backgroundColor: item.bgColor,
            }}
          >
            <div className="relative h-[30px] w-full">
              <Image
                src={item.logo}
                key={`card-item-${index}`}
                alt="investors-logo"
                className="object-contain object-left"
                fill
              />
            </div>
            <span className="text-4 font-[300] leading-4">{item.name}</span>
          </div>
        ))}
      </FlexColContainer>
    </FlexColContainer>
  )
}
