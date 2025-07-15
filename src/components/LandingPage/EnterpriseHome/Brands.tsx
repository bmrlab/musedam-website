'use client'
import { useTranslation } from '@/app/i18n/client'

import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import Image from 'next/image'
import { LocaleLink } from '@/components/LocalLink'
import { HoverTranslateXArrowRight } from '@/components/StyleWrapper/icon'
import usePublicUrl from '@/hooks/usePublicUrl'

export type AINativeCard = {
    key: string
    image: string
}

export default function Brands() {
    const { t } = useTranslation('brands')
    const { getUrl } = usePublicUrl('/assets/Enterprise/Brands')

    return <div className='flex w-full flex-col items-center overflow-hidden'>
        <div className='w-full overflow-x-scroll p-5 md:max-w-[1440px] md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0 ">
                <div className="flex max-w-[800px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
                    <h1 className="text-center font-feature text-[32px] font-normal leading-[41.6px]  md:text-left md:text-[64px] md:leading-[73.6px]">
                        {t('section.title')}
                    </h1>
                </div>
                <LocaleLink
                    href="/features"
                    className="group flex items-center gap-2 text-[14px] leading-[18.2px] tracking-[2%] text-white"
                >
                    <span className="underline-animation">{t('link.text')}</span>
                    <HoverTranslateXArrowRight />
                </LocaleLink>
            </FadeInUpContainer>
        </div>

        <div className='no-scrollbar w-full overflow-scroll p-5 md:px-[80px] md:py-[60px] md:pb-[120px]'>
            <div className='flex w-fit gap-10'>
                {['brand1.jpeg', 'brand2.jpeg', 'brand3.jpeg', 'brand4.jpeg'].map((key) =>
                    <Image src={getUrl(key)} key={key} alt={key} className='h-auto w-[200px] shrink-0 object-cover md:h-[257px] md:w-[450px]' width={450} height={250} />
                )}
            </div>
            <div className='mt-10 flex w-fit gap-10'>
                {['brand5.jpeg', 'brand6.jpeg', 'brand7.jpeg', 'brand8.jpeg'].map((key) =>
                    <Image src={getUrl(key)} key={key} alt={key} className='h-auto w-[200px] shrink-0 object-cover  md:h-[257px] md:w-[450px]' width={450} height={250} />
                )}
            </div>
        </div>
    </div>
}
