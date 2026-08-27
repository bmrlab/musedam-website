'use client'

import { cn } from '@/utilities/cn'
import { CheckIcon } from '@radix-ui/react-icons'

import { SessionUser } from '@/types/user'
import { FlexColContainer, FlexRowContainer } from '@/components/StyleWrapper/Container'
import { useTranslation } from '@/app/i18n/client'

import { Button } from '../../ui/button'
import { useBillingMenu } from '../billingMenu'
import { LocaleLink } from '@/components/LocalLink'
import { useLanguage } from '@/providers/Language'

export default function Buy({
    isMuseAI: _isMuseAI,
    user: _user,
}: {
    isMuseAI?: boolean
    user: SessionUser | null
}) {

    const { enterpriseBillingMenu } = useBillingMenu({ isMuseAI: false })
    const { language } = useLanguage()
    const isEn = language === 'en-US'
    const { t } = useTranslation('pricing')

    const backgroundLinear = [
        'linear-gradient(180deg, #1A1529 -3.95%, #491DBA 96.05%)',
        'linear-gradient(180deg, #261625 -3.95%, #9A0E83 96.05%)',
        'linear-gradient(180deg, #1A1D0E -3.95%, #DCFF58 96.05%)'
    ]

    const ghostButtonClass = cn(
        'h-[48px] w-full rounded-xl border border-white/10 bg-[#141414] text-white-72',
        'transition-all duration-300 ease-in-out hover:bg-[#262626] hover:text-white',
        isEn ? 'text-lg' : 'text-base',
    )

    return (
            <FlexColContainer className="w-full items-center pb-[120px] pt-5 font-euclid md:pt-[60px]">
                <FlexRowContainer className="mb-10 w-full justify-between px-5 md:mb-[60px] md:px-[80px] ">
                    <h1 className='w-full text-center font-feature text-[40px] leading-[51px] text-white md:text-[78px] md:leading-[87px]'>{t('pricing.title.new')}</h1>
                </FlexRowContainer>

                <div className="no-scrollbar w-full overflow-x-scroll px-5 md:px-[80px]">
                    <div className='flex w-fit min-w-full flex-col items-stretch justify-center gap-[30px] md:flex-row md:items-end md:gap-10'>
                        {enterpriseBillingMenu.map((plan, index) => {
                            const {
                                key,
                                buttonType,
                                summary,
                            } = plan;
                            return <div key={key} className="relative h-fit w-full max-w-sm flex-1 shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#141414] px-6 pb-6 pt-[30px]">
                                <div className='mb-3 h-[36px] w-fit overflow-hidden rounded-[10px] border border-white/10'>
                                    <div
                                        className="flex h-full w-fit items-center rounded-[10px] px-[10px] text-base font-medium"
                                        style={{
                                            background: backgroundLinear[index],
                                            color: plan.color
                                        }}
                                    >
                                        {plan.title}
                                    </div>
                                </div>
                                <div className="font-euclid text-base text-[rgba(255,255,255,0.48)]">{plan.description}</div>
                                <div className="mt-3 font-euclid text-[32px] font-medium leading-[40px] text-white">
                                    {plan.heading}
                                </div>
                                <div className="mt-[30px]">
                                    {buttonType === 'bookDemo' &&
                                        <LocaleLink href={`/book-demo?from=pricing-btn`} prefetch={false}>
                                            <Button
                                                className={cn(
                                                    'border border-white/10',
                                                    'mb-4 h-[48px] w-full rounded-xl bg-[#FF2EE7] text-white',
                                                    'transition-all duration-300 ease-in-out hover:bg-[rgba(255,46,231,0.8)]',
                                                    'shadow-[0_0_8px_-2px_rgba(255,255,255,0.48),0_0_6px_0_rgba(255,255,255,0.16),0_0_8px_-2px_rgba(255,255,255,0.48)_inset]',
                                                    isEn ? 'text-lg' : 'text-base'
                                                )}
                                            >
                                                {t('pricing.bookDemo')}
                                            </Button>
                                        </LocaleLink>
                                    }

                                    <LocaleLink href={`/book-demo?from=pricing-btn`} prefetch={false}>
                                        <Button className={ghostButtonClass}>
                                            {t('pricing.contact.now')}
                                        </Button>
                                    </LocaleLink>
                                </div>

                                <ul className="mt-[30px] space-y-3 text-white-72">
                                    {summary
                                        .filter((v) => !!v)
                                        .map((feature) => (
                                            <li className="flex items-center gap-2 " key={feature}>
                                                <CheckIcon className="shrink-0 text-[#20C997]" width={16} height={16} />
                                                <span className="font-euclidlight text-[13px] font-light leading-[18px]">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        })}
                    </div>
                </div>
            </FlexColContainer>
    )
}
