"use client"
import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import Image from 'next/image'
import Link from 'next/link'
import { DarkButton } from '@/components/StyleWrapper/button'
import { useTranslation } from 'react-i18next'

export const QuotationError = ({ errorMsg }: { errorMsg: string }) => {
    const { t } = useTranslation('quotation')
    return (
        <div className="fixed top-0 z-[100] h-screen w-screen bg-black">
            <FlexCenterContainer className="flex size-full flex-col">
                <Image src="/assets/logo-dark.svg" width={100} height={100} alt="muse logo" />
                <div className="absolute bottom-[80px] flex w-[194px] flex-col items-center gap-4">
                    <span className='text-center text-lg font-medium text-white'>
                        {errorMsg}
                    </span>

                    <Link
                        href={'/pricing'}
                        prefetch={false}
                    >
                        <DarkButton className='h-[48px]'>
                            <p className="hidden md:block">{t('not.sale.user.button')}</p>
                        </DarkButton>
                    </Link>
                </div>
            </FlexCenterContainer>
        </div>
    )
}