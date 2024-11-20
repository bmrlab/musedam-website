import Banner from '@/components/LandingPage/Hero/Banner'
import { ssTranslation } from '@/app/i18n'

export default async function Hero({ lng }) {
  const { t } = await ssTranslation(lng, 'landing-page')
  return (
    <div className="flex flex-col items-center justify-center bg-white md:w-full md:px-[80px]">
      <h1 className="mt-[59px] text-center font-baskervville text-[38px] font-normal leading-[43.47px] text-[#141414] md:text-[68px] md:leading-[77.79px]">
        <p>{t('hero.title')}</p>
        <p>{t('hero.subtitle')}</p>
      </h1>
      <button className="mb-12 mt-6 rounded-[1000px] bg-black px-[52.5px] py-[17px] font-mono text-[16px] font-normal leading-[20px] text-white md:mb-[58px] md:mt-9 md:px-[57.5px] md:py-[19px]">
        {t('hero.button.start')}
      </button>
      <Banner />
      <div className="mt-10 flex w-full flex-col items-center gap-4 md:mt-[80px] md:flex-row md:justify-between md:gap-0">
        <h1 className="text-center font-baskervville text-[38px] font-normal leading-[43.37px] text-[#141414] md:text-left md:text-[68px] md:leading-[77.79px]">
          {t('hero.sub-banner.title')}
        </h1>
        <div className="flex max-w-[680px] flex-col items-center gap-6 px-6 md:items-start md:gap-10">
          <p className="text-center font-mono text-[14px] font-light leading-6 text-[#141414] md:text-left md:text-[16px]">
            {t('hero.sub-banner.subtitle')}
          </p>
          <button className="rounded-[8px] bg-black px-[52.5px] py-[17px] font-mono text-[16px] leading-5 text-white md:px-[42.5px] md:py-[14px]">
            {t('hero.button.start')}
          </button>
        </div>
      </div>
      <div className="relative mt-12 h-[210px] w-full rounded-[6px] px-6 md:mt-[80px] md:h-[692px] md:px-10">
        <video muted autoPlay loop className="size-full object-cover">
          <source src="/Introduction/Introduction.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
