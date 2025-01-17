'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import * as Switch from '@radix-ui/react-switch';
import { Label } from "@/components/ui/label"
import * as Collapsible from '@radix-ui/react-collapsible'
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Cross2Icon } from '@radix-ui/react-icons';
import { cn } from '@/utilities/cn';
import { LocaleLink } from './LocalLink';
import { useCountry } from '@/providers/Country';

export type CookieService = {
    id: string;
    enabled: boolean;
}


const CATEGORY_IDS = {
    essential: 'essential',
    marketing: 'marketing',
    analytics: 'analytics',
    functional: 'functional',
    social: 'social',
} as const;



export type CookieCategory = {
    id: keyof typeof CATEGORY_IDS;
    enabled: boolean;
    required?: boolean;
}

const defaultCategories: CookieCategory[] = [
    {
        id: CATEGORY_IDS.essential,
        enabled: true,
        required: true,
    },
    {
        id: CATEGORY_IDS.marketing,
        enabled: true,
    },
    {
        id: CATEGORY_IDS.analytics,
        enabled: true,
    },
    {
        id: CATEGORY_IDS.functional,
        enabled: true,
    },
    {
        id: CATEGORY_IDS.social,
        enabled: true,
    },
]

interface CookieSettingsProps {
    onSave: (categories: CookieCategory[]) => void;
    handleAccept: () => void
    handleDecline: () => void
}
function CookieSettings({ onSave, handleAccept, handleDecline }: CookieSettingsProps) {
    const { t } = useTranslation('cookie-setting')
    const [categories, setCategories] = useState<CookieCategory[]>(defaultCategories)
    const [openCategories, setOpenCategories] = useState<string[]>(['essential'])


    const handleCategoryToggle = (categoryId: string) => {
        setCategories(prev => prev.map(category => {
            if (category.id === categoryId && !category.required) {
                const newEnabled = !category.enabled
                return {
                    ...category,
                    enabled: newEnabled
                }
            }
            return category
        }))
    }

    const toggleCategory = (categoryId: string) => {
        setOpenCategories(prev =>
            prev.includes(categoryId) ? [] : [categoryId]
            // prev.includes(categoryId)
            //     ? [prev.filter(id => id !== categoryId)]
            //     : [...prev, categoryId]
        )
    }

    return (
        <div className=''>
            <div className='no-scrollbar max-h-[60vh] space-y-4 overflow-auto rounded-lg border px-3 py-4'>
                {categories.map((category) => (
                    <Collapsible.Root open={openCategories.includes(category.id)} onOpenChange={() => toggleCategory(category.id)} key={category.id}>
                        <Collapsible.Trigger className="mb-2 flex w-full cursor-pointer items-center justify-between font-euclid">
                            <div className="flex items-center gap-2">
                                {openCategories.includes(category.id) ? (
                                    <ChevronUp className="size-4" />
                                ) : (
                                    <ChevronDown className="size-4" />
                                )}
                                <div className="text-base">
                                    {t(`categories.${category.id}.name`)}
                                </div>
                            </div>
                            <Switch.Root checked={category.enabled} onCheckedChange={() => handleCategoryToggle(category.id)} disabled={category.required}
                                className={cn("bg-blackA9 relative h-[25px] w-[42px] cursor-pointer rounded-full border border-[#141414]  outline-none  disabled:cursor-not-allowed ",
                                    category.required ? 'border-[rgb(91,86,80)] bg-[rgb(91,86,80)]' : 'data-[state=checked]:bg-primary'
                                )}>
                                <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full border bg-[#141414] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-white" />
                            </Switch.Root>
                        </Collapsible.Trigger>
                        <Collapsible.Content>
                            <div className="mb-2 mt-3 font-zh font-normal">
                                <p className="text-sm text-muted-foreground">
                                    {t(`categories.${category.id}.description`)}
                                </p>
                            </div>
                        </Collapsible.Content>
                    </Collapsible.Root>
                ))}
            </div>
            <div className='mt-4 flex w-full justify-end gap-3'>
                <Button onClick={() => onSave(categories)}>{t('saveSettings')}</Button>
                <Button variant="outline" onClick={handleAccept} >{t('acceptAll')}</Button>
            </div>
        </div>
    )
}

export function CookieConsent() {
    const { t } = useTranslation('cookie-setting')
    const isMobile = false

    const [isVisible, setIsVisible] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent')
        if (consent === null) {
            setTimeout(() => {
                setIsVisible(true)
            }, 5000)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted')
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined')
        setIsVisible(false)
    }


    const handleSavePreferences = (categories: CookieCategory[]) => {
        localStorage.setItem('cookieConsent', JSON.stringify(categories))
        setShowSettings(false)
        setIsVisible(false)
    }

    if (!isVisible) return null

    if (showSettings) {
        return (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 font-mono  md:items-center">
                <Card className={cn("relative w-full md:w-[600px]  md:max-w-[90vw]", isMobile && 'rounded-b-none')}>
                    <Cross2Icon className="absolute right-5 top-5 size-6 cursor-pointer text-gray-400" onClick={() => {
                        setIsVisible(false)
                        setShowSettings(false)
                    }} />
                    <CardHeader>
                        <CardTitle className='font-euclid text-[20px]'>{t('setting.title')}</CardTitle>
                        <p className="font-zh text-sm leading-[1.5em] text-muted-foreground ">
                            {t("setting.intro")}
                            <LocaleLink href={'/privacy'} target="_blank" >
                                <span className="text-[14px] underline underline-offset-4">
                                    {t("privacyLink")}
                                </span>
                            </LocaleLink>
                        </p>
                    </CardHeader>
                    <CardContent>
                        <CookieSettings
                            onSave={handleSavePreferences}
                            handleDecline={handleDecline}
                            handleAccept={handleAccept}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }
    return (
        <div className="fixed bottom-0 right-0 z-50  font-zh md:bottom-6 md:left-6  md:w-[450px]">
            <Card className={cn("w-full ", isMobile && 'rounded-b-none')}>
                <CardHeader>
                    <CardTitle className='font-euclid text-[20px]'>{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-[1.5em] text-muted-foreground">
                        {t("intro1")}
                        <LocaleLink href={'/privacy'} target="_blank" >
                            <span className="text-[14px] underline underline-offset-4">
                                {t("privacyLink")}
                            </span>
                        </LocaleLink>
                        {t("intro2")}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between ">
                    <div
                        onClick={() => setShowSettings(true)}
                        className='cursor-pointer text-sm underline underline-offset-4'
                    >
                        {t('customizeSettings')}
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button variant="outline" onClick={handleDecline}>{t('reject')}</Button>
                        <Button onClick={handleAccept}>
                            {t('acceptAll')}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

