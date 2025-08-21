'use client'
import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useFAQTranslation } from '@/app/i18n/client';
import { cn } from '@/utilities/cn';
import { FAQSchema } from '@/components/SEO/FAQSchema';

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
        <>
            {/* 添加FAQ结构化数据 */}
            <FAQSchema faqs={faqData} />

            <div className="w-full bg-black px-6 pt-[30px] pb-[60px] font-euclid text-white md:max-w-[1440px] md:px-[80px] md:py-[104px]">
                <h2 className="mb-10 font-feature text-[40px] md:text-[64px] md:text-start text-center">{t('title')}</h2>
                <div className="flex  flex-col divide-y divide-[rgba(255,255,255,0.2)] border-y border-[#fff2]">
                    {faqData.map((item, idx) => (
                        <div key={item.question}>
                            <button
                                className="flex w-full items-center justify-between md:py-8 py-5 text-left focus:outline-none"
                                onClick={() => toggleIndex(idx)}
                                aria-expanded={expandedIndex === idx}
                            >
                                <span className="font-euclid md:text-[24px] md:leading-[34px] text-lg">{item.question}</span>
                                <span className="ml-4">
                                    {expandedIndex === idx ? (
                                        <MinusIcon className="size-[22px] md:size-7" />
                                    ) : (
                                        <PlusIcon className="size-[22px] md:size-7" />
                                    )}
                                </span>
                            </button>
                            <div className={cn("mt-5 md:mt-0 md:pl-1 md:pr-8 text-left font-euclidlight text-[15px] md:text-[18px] font-light leading-[30px] text-white-72",
                                "transition-all duration-400 ease-in-out overflow-hidden",
                                expandedIndex === idx ? 'max-h-[500px]' : 'max-h-0'
                            )}>
                                {item.answer}
                                <div className='h-8 w-full'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FAQ;
