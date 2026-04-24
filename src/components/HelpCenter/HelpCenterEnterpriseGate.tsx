import Image from 'next/image'
import { ssTranslation } from '@/app/i18n'
import { HelpEnterpriseGateClientMarker } from '@/providers/HelpEnterpriseGateUi'

export async function HelpCenterEnterpriseGate({ lng }: { lng: string }) {
  const { t } = await ssTranslation(lng, 'help-center')

  return (
    <div className="flex w-full flex-col items-center justify-center px-5 py-16 md:py-24">
      <HelpEnterpriseGateClientMarker />
      <Image
        src="/assets/Safe-Box.png"
        alt={t('enterpriseGate.title')}
        width={280}
        height={280}
        className="mb-10 h-auto w-[min(280px,72vw)] max-w-full select-none"
        priority
      />
      <h2 className="mb-3 text-center text-[22px] font-semibold leading-[32px] text-[#141414]">
        {t('enterpriseGate.title')}
      </h2>
      <p className="text-center text-sm leading-relaxed text-[#676C77]">
        {t('enterpriseGate.description')}
      </p>
    </div>
  )
}
