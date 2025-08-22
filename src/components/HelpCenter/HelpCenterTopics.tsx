"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LocaleLink } from '@/components/LocalLink'
import type { HelpTopic as PayloadHelpTopic } from '@/payload-types'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import Icons from '@/components/icon'
import { useHelpCenterTranslation } from '@/app/i18n/client'

interface HelpCenterTopicsProps {
    topics: PayloadHelpTopic[]
}

export const HelpCenterTopics: React.FC<HelpCenterTopicsProps> = ({ topics }) => {
    return (
        <div className={cn("gap-10 pb-[100px]",
            topics.length < 3 ? 'flex-col flex md:flex-row md:justify-between' : 'grid grid-cols-1 md:grid-cols-3 '
        )}>
            {topics.map((topic, index) => (
                <TopicCard
                    key={topic.id}
                    topic={topic}
                    isHighlighted={index === 0}
                    className={topics.length < 3 ? 'md:flex-1' : undefined}
                />
            ))}
        </div>
    )
}

interface TopicCardProps {
    topic: PayloadHelpTopic
    isHighlighted: boolean
    className?: string
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, isHighlighted, className }) => {
    const { t } = useHelpCenterTranslation()

    return (
        <Card
            className={cn(
                'group cursor-pointer border-none bg-[#F4F4F4] transition-all duration-300',
                'hover:ring-8 hover:ring-[#B1FC01] flex flex-col',
                // 'hover:-translate-y-1 hover:shadow-lg',
                className
            )}
        >
            <CardHeader className="pb-4 pt-10">
                {/* 封面图 */}
                <div className='mb-[50px] flex w-full items-center justify-center'>
                    {(topic.coverImage && typeof topic.coverImage === 'object' && topic.coverImage.url) ?
                        <Image src={topic.coverImage.url} alt={topic.coverImage.alt ?? ''} width={200} height={200} className='size-[180px] max-w-full' /> :
                        <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                            <div className="size-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20" />
                        </div>
                    }
                </div>
                <CardTitle className="font-euclid text-2xl font-medium text-[#141414]">
                    {topic.title}
                </CardTitle>
            </CardHeader>
            <div className='flex-1 flex flex-col justify-between'>
                <CardContent className="pb-4 font-mono font-light">
                    {/* Bullets 描述 */}
                    <ul className="space-y-2">
                        {topic.bullets && topic.bullets.map((bullet, index) => (
                            <li key={index} className="flex items-center text-sm text-[#141414]">
                                <span className='w-[9px] text-center'>·</span>
                                {typeof bullet === 'string' ? bullet : bullet.text}
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <CardFooter>
                    <LocaleLink
                        href={`/help/${topic.slug}`}
                    >
                        <Button className="rounded-full border-[#95989F] px-[18.5px] font-mono hover:border-transparent hover:bg-black hover:text-white" variant="outline">
                            {t('topics.showAll')}

                            <div className="ml-2 ">
                                <Icons.arrowRightLong width={24} height={24} />
                            </div>
                        </Button>
                    </LocaleLink>
                </CardFooter>
            </div>
        </Card>
    )
} 