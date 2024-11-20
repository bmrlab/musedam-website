import { cn } from '@/utilities/cn'

import { Input } from '@/components/ui/input'
import { ssTranslation } from '@/app/i18n'

export default async function SubscribeBlock({
  lng,
  className,
}: {
  lng: string
  className?: string
}) {
  const { t } = await ssTranslation(lng, 'landing-page')
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 bg-[rgb(237,237,237)] px-6 py-[60px] text-black md:px-0',
        className,
      )}
    >
      <h2 className="text-center font-baskervville text-[38px] font-normal leading-[43.47px]  md:text-left md:text-[48px] md:leading-[54.91px]">
        {t('subscribe.title')}
      </h2>
      <div className="flex w-full flex-col justify-center gap-2.5 md:flex-row">
        <Input
          type="email"
          placeholder="Your work email"
          className="h-[54px] w-full rounded-[6px] border-none bg-white p-4 placeholder:font-mono placeholder:font-light placeholder:opacity-30 md:h-[50px] md:w-[420px]"
        />
        <button className="h-[54px] rounded-[6px] bg-black px-[56.5px] font-mono text-[16px] leading-[20.8px] text-white md:h-[50px]">
          {t('subscribe.button')}
        </button>
      </div>
      <p className="font-mono text-[14px] font-light leading-[28px] tracking-[1%]">
        {t('subscribe.free-trial')}
      </p>
    </div>
  )
}
