'use client'
import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useFAQTranslation } from '@/app/i18n/client';

const FAQ = () => {
    const { t } = useFAQTranslation();
    const [expandedIndex, setExpandedIndex] = useState(0); // 默认展开第一个

    const faqData = [
        {
            question: t('questions.ai-native-dam.question'),
            answer: t('questions.ai-native-dam.answer'),
        },
        {
            question: t('questions.why-better.question'),
            answer: t('questions.why-better.answer'),
        },
        {
            question: t('questions.pricing.question'),
            answer: t('questions.pricing.answer'),
        },
        {
            question: t('questions.free-trial.question'),
            answer: t('questions.free-trial.answer'),
        },
        {
            question: t('questions.prove-value.question'),
            answer: t('questions.prove-value.answer'),
        },
    ];

    const toggleIndex = (idx) => {
        setExpandedIndex(expandedIndex === idx ? null : idx);
    };

    return (
        <div className="w-full bg-black p-4 font-euclid text-white md:max-w-[1440px] md:px-[80px] md:py-[104px]">
            <h2 className="mb-10 font-feature text-[64px]">{t('title')}</h2>
            <div className="flex  flex-col divide-y divide-[rgba(255,255,255,0.2)] border-y border-[#fff2]">
                {faqData.map((item, idx) => (
                    <div key={item.question}>
                        <button
                            className="flex w-full items-center justify-between py-8 text-left focus:outline-none"
                            onClick={() => toggleIndex(idx)}
                            aria-expanded={expandedIndex === idx}
                        >
                            <span className="font-euclid text-[24px] leading-[34px]">{item.question}</span>
                            <span className="ml-4">
                                {expandedIndex === idx ? (
                                    <MinusIcon className="size-7" />
                                ) : (
                                    <PlusIcon className="size-7" />
                                )}
                            </span>
                        </button>
                        {expandedIndex === idx && (
                            <div className="pb-8 pl-1 pr-8 text-left font-euclidlight text-[18px] font-light leading-[30px] text-[rgba(255,255,255,0.72)]">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
