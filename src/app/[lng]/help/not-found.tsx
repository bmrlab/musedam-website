import React from 'react'
import { DarkButton } from '@/components/StyleWrapper/button'
import { LocaleLink } from '@/components/LocalLink'
import { useTranslation } from '@/app/i18n/client'

export default function NotFound() {
    const { t } = useTranslation('help-center')

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('common.error')}</h1>
                <LocaleLink
                    href="/help"
                >
                    <DarkButton className='h-[48px] w-full'>
                        {t('common.back')} {t('help.shortTitle')}
                    </DarkButton>
                </LocaleLink>
            </div>
        </div>
    )
} 