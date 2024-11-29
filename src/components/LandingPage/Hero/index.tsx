import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'

import Banner from '@/components/LandingPage/Hero/Banner'
import { BlackButton } from '@/components/StyleWrapper/button'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { ssTranslation } from '@/app/i18n'

export default async function Hero({ lng }: { lng: string }) {
  const { t } = await ssTranslation(lng, 'landing-page')
  return (
    <div className="flex flex-col items-center justify-center bg-white md:w-full md:px-[80px]">
      <h1 className="mt-[59px] text-center font-euclid text-[32px] font-normal leading-[41.6px] text-[#141414] md:text-[72px] md:leading-[90px]">
        <p>{t('hero.title')}</p>
        <p>{t('hero.subtitle')}</p>
      </h1>
      <Link href={MUSEDAM_LOGIN_URL}>
        <BlackButton className="mb-12 mt-6 rounded-[1000px] px-[52.5px] py-[17px] font-mono text-[16px] font-normal leading-[20px] text-white md:mb-[58px] md:mt-9 md:px-[57.5px] md:py-[19px]">
          {t('hero.button.start')}
        </BlackButton>
      </Link>
      <Banner />
      <FadeInUpContainer className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
        <h1 className="text-center font-euclid text-[32px] font-normal leading-[41.6px] text-[#141414] md:text-left md:text-[54px] md:leading-[68.47px]">
          {t('hero.sub-banner.title')}
        </h1>
        <div className="flex max-w-[680px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
          <p className="text-center font-mono text-[14px] font-light leading-6 text-[#141414] md:text-left md:text-[16px] md:leading-[28px]">
            {t('hero.sub-banner.subtitle')}
          </p>
          <BlackButton className="rounded-[8px] px-[52.5px] py-[17px] font-mono text-[16px] leading-5 text-white md:px-[42.5px] md:py-[14px]">
            {t('hero.button.start')}
          </BlackButton>
        </div>
      </FadeInUpContainer>
      <div className="relative mt-12 h-[210px] w-full rounded-[6px] px-6 md:mt-[80px] md:h-[692px] md:px-10">
        <video muted autoPlay loop className="size-full object-cover">
          <source src="/Introduction/Introduction.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
