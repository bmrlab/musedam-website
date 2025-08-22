"use client"

import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { LocaleLink } from '@/components/LocalLink'
import type { HelpTopic as PayloadHelpTopic, HelpCategory as PayloadHelpCategory, HelpDocument as PayloadHelpDocument } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useHelpCenterTranslation } from '@/app/i18n/client'

interface HelpCenterBreadcrumbProps {
    topic: PayloadHelpTopic
    category?: PayloadHelpCategory
    document?: PayloadHelpDocument
}

export const HelpCenterBreadcrumb: React.FC<HelpCenterBreadcrumbProps> = ({ topic, category, document }) => {
    const { t } = useHelpCenterTranslation()

    return (
        <nav className="flex items-center gap-2 font-euclid text-base">
            <LocaleLink href="/help" className="flex items-center text-[#262626] transition-all duration-300 ease-in-out hover:text-gray-700">
                {t('breadcrumb.allCollections')}
            </LocaleLink>

            <ChevronRight className="size-[14px] text-[#AAADB2]" />
            <LocaleLink
                href={`/help/${topic.slug}`}
                className={cn(" transition-all duration-300 ease-in-out hover:text-gray-700",
                    !category ? 'text-[#95989F]' : 'text-[#262626]'
                )}>
                {topic.title}
            </LocaleLink>
            {category && (
                <>
                    <ChevronRight className="size-[14px] text-[#AAADB2]" />
                    <LocaleLink
                        href={`/help/category/${category.slug}`}
                        className={cn(" transition-all duration-300 ease-in-out hover:text-gray-700",
                            !document ? 'text-[#95989F]' : 'text-[#262626]'
                        )}>
                        {category.title}
                    </LocaleLink>
                </>
            )}
            {document && (
                <>
                    <ChevronRight className="size-[14px] text-[#AAADB2]" />
                    <span className="text-[#95989F]">{document.title}</span>
                </>
            )}
        </nav>
    )
} 