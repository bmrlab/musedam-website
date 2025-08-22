"use client"
import React from 'react'
import { HelpCenterSearch } from './HelpCenterSearch'
import Icons from '@/components/icon'
import { useHelpCenterTranslation } from '@/app/i18n/client'

export const HelpCenterHero: React.FC = () => {
    const { t } = useHelpCenterTranslation()

    return (
        <div className="flex flex-col items-center py-[80px] text-center">
            <h1 className="mb-10 font-euclid text-4xl font-normal text-gray-900 md:text-[64px] md:leading-[81px]">
                {t('hero.title')}
            </h1>

            <HelpCenterSearch />
            <div className='mt-5 text-center font-mono text-sm font-light flex items-center justify-center gap-2'>
                <Icons.lightBulb className='size-5 ' />
                {t('hero.subtitle')}
            </div>
        </div>
    )
} 