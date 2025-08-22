"use client"
import React from 'react'
import type { HelpTopic as PayloadHelpTopic } from '@/payload-types'
import Image from 'next/image'
import { useHelpCenterTranslation } from '@/app/i18n/client'
interface HelpCenterTopicHeaderProps {
    topic: PayloadHelpTopic
    articleCount?: number
}

export const HelpCenterTopicHeader: React.FC<HelpCenterTopicHeaderProps> = ({
    topic,
    articleCount = 0
}) => {
    const { t } = useHelpCenterTranslation()

    return (
        <div className="flex flex-col items-start gap-2">
            {/* 专题图标 */}
            {(topic.coverImage && typeof topic.coverImage === 'object' && topic.coverImage.url) ?
                <Image src={topic.coverImage.url} alt={topic.coverImage.alt ?? ''} width={200} height={200} className='size-20' /> :
                <div className="flex size-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20" />
                </div>}

            {/* 专题信息 */}
            <h1 className="font-euclid text-[32px] font-medium leading-[45px] text-[#262626]">
                {topic.title}
            </h1>
            <p className="font-mono text-sm font-light text-[#676C77]">
                {articleCount} {t('topics.articles')}
            </p>
            {topic.description && (
                <p className="mt-3 text-gray-600">
                    {topic.description}
                </p>
            )}
        </div>
    )
} 