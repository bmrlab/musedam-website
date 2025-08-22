'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/utilities/cn'
import { useHelpCenterTranslation } from '@/app/i18n/client'

interface TableOfContentsItem {
    id: string
    title: string
    level: string | number
}

interface TableOfContentsSection {
    title: string
    items: TableOfContentsItem[]
}

interface HelpCenterTableOfContentsProps {
    items?: TableOfContentsItem[]
    sections?: TableOfContentsSection[]
    className?: string
    title?: string
}

export const HelpCenterTableOfContents: React.FC<HelpCenterTableOfContentsProps> = ({
    items = [],
    sections = [],
    className,
}) => {
    const [activeId, setActiveId] = useState<string>('')
    const isSmoothScrolling = useRef<boolean>(false)


    // 根据level获取缩进padding
    const getLevelPadding = (level: string | number) => {
        if (typeof level === 'string') {
            // 处理字符串类型的level (h1, h2, h3...)
            const levelNum = parseInt(level.replace('h', ''))
            if (levelNum === 1) return "pl-4 font-medium"
            if (levelNum === 2) return "pl-6"
            if (levelNum === 3) return "pl-8"
            return "pl-4"
        } else {
            // 处理数字类型的level (1, 2, 3...)
            if (level === 1) return "pl-4 font-medium"
            if (level === 2) return "pl-6"
            if (level === 3) return "pl-8"
            return "pl-4"
        }
    }

    // 监听滚动，更新active状态
    useEffect(() => {
        const handleScroll = () => {
            // 新增：如果正在平滑滚动，不更新activeId
            if (isSmoothScrolling.current) return

            const allIds = [
                ...items.map(item => item.id),
                ...sections.flatMap(section => section.items.map(item => item.id))
            ]

            if (allIds.length === 0) return

            let currentActiveId = allIds[0]
            let minDistance = Infinity

            for (const id of allIds) {
                const element = document.getElementById(id)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    const distance = Math.abs(rect.top - 100)

                    if (distance < minDistance && rect.bottom > 0) {
                        minDistance = distance
                        currentActiveId = id
                    }
                }
            }

            setActiveId(currentActiveId)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [items, sections])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            // 立即设置为active状态
            setActiveId(id)
            isSmoothScrolling.current = true
            // 获取元素位置，为header预留100px距离
            const elementTop = element.offsetTop - 100

            window.scrollTo({
                top: elementTop,
                behavior: 'smooth'
            })
            setTimeout(() => {
                isSmoothScrolling.current = false
            }, 500)
        }
    }

    const { t } = useHelpCenterTranslation()

    if (items.length === 0 && sections.length === 0) {
        return (
            <nav className={cn(
                "w-64 shrink-0 pr-6",
                className
            )}>
                <div className="sticky top-[100px]">
                    <div className="text-sm text-gray-500">
                        {t('tableOfContents.noSections')}
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className={cn(
            "md:w-[320px] md:max-w-[30%] shrink-0 pr-6 hidden md:block",
            className
        )}>
            <div className="sticky top-[100px]">
                {/* 渲染分组结构 */}
                {sections.length > 0 && (
                    <div className="space-y-6">
                        {sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-3">
                                <h3 className="font-euclid text-base font-medium text-gray-900">
                                    {section.title}
                                </h3>
                                <ul className="space-y-2">
                                    {section.items.map((item, itemIndex) => {
                                        const isActive = activeId === item.id
                                        const isFirst = itemIndex === 0
                                        const isLast = itemIndex === section.items.length - 1
                                        return (
                                            <li key={item.id} className="relative h-[32px] flex items-center whitespace-nowrap overflow-hidden">
                                                {/* 左边竖线指示器 */}
                                                <div className={cn(
                                                    "absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-200",
                                                    isActive ? "bg-gray-900 rounded-full" : "bg-gray-200",
                                                    isFirst && "rounded-t-full",
                                                    isLast && "rounded-b-full"
                                                )} />
                                                <button
                                                    onClick={() => scrollToSection(item.id)}
                                                    className={cn(
                                                        "w-full text-left text-sm transition-colors hover:text-[#262626] relative overflow-hidden text-ellipsis",
                                                        getLevelPadding(item.level),
                                                        isActive ? "text-[#262626]" : "text-[#95989F]"
                                                    )}
                                                >
                                                    {item.title}
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* 渲染普通项目列表 */}
                {items.length > 0 && (
                    <ul >
                        {items.map((item, index) => {
                            const isActive = activeId === item.id
                            const isFirst = index === 0
                            const isLast = index === items.length - 1
                            return (
                                <li key={item.id} className="relative h-[32px] flex items-center whitespace-nowrap overflow-hidden">
                                    {/* 左边竖线指示器 */}
                                    <div className={cn(
                                        "absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-200",
                                        isActive ? "bg-gray-900 rounded-full" : "bg-[#EBECEE]",
                                        isFirst && "rounded-t-full",
                                        isLast && "rounded-b-full"
                                    )} />
                                    <button
                                        onClick={() => scrollToSection(item.id)}
                                        className={cn(
                                            "w-full text-left text-sm transition-colors hover:text-[#262626] relative overflow-hidden text-ellipsis",
                                            getLevelPadding(item.level),
                                            isActive ? "text-[#262626]" : "text-[#95989F]"
                                        )}
                                    >
                                        {item.title}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </nav>
    )
} 