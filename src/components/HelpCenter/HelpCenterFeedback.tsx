"use client"

import React, { useState } from 'react'
import { useHelpCenterTranslation } from '@/app/i18n/client'

interface HelpCenterFeedbackProps {
    documentId: string
}

export const HelpCenterFeedback: React.FC<HelpCenterFeedbackProps> = ({ documentId }) => {
    const { t } = useHelpCenterTranslation()
    const [feedback, setFeedback] = useState<'positive' | 'neutral' | 'negative' | null>(null)
    const [submitted, setSubmitted] = useState(false)

    const handleFeedback = async (type: 'positive' | 'neutral' | 'negative') => {
        setFeedback(type)

        try {
            // 这里可以发送反馈到后端
            // await submitFeedback(documentId, type)
            setSubmitted(true)
        } catch (error) {
            console.error('Failed to submit feedback:', error)
        }
    }

    if (submitted) {
        return (
            <div className="mx-auto mt-5 max-w-4xl text-center  md:mt-10">
                <p className="font-medium text-green-600">{t('feedback.thanks')}</p>
            </div>
        )
    }

    return (
        <div className="mt-5 rounded-2xl bg-[#F8F8F8] p-5 text-center md:mt-10 md:px-6 md:py-[30px]">
            <h3 className="mb-3 font-euclid text-base text-[#262626]">
                {t('feedback.question')}
            </h3>

            <div className="flex items-center justify-center space-x-3">
                {([{ label: '☹️', value: 'negative' }, { label: '😐', value: 'neutral' }, { label: '😄', value: 'positive' }] as const).map((item, index) => (
                    <button
                        key={index + item.value}
                        onClick={() => handleFeedback(item.value)}
                        className='text-[30px] transition-all duration-300'
                        aria-label={t(`feedback.labels.${item.value}`)}
                    >
                        {item.label}
                    </button>
                ))}

            </div>
        </div>
    )
} 