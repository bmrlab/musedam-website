'use client'
import React, { useState } from 'react';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';

const faqData = [
    {
        question: 'How does Nayzak work?',
        answer:
            'All things starts with a homepage – Get inspired without breaking your wallet with premium Figma and Sketch templates. Capitalize hanging fruit to identify a ballpark value added activity to beta test. Podcasting operational – change management inside of workflows and operations.',
    },
    {
        question: 'Supported platforms',
        answer: 'xxx',
    },
    {
        question: 'Payment methods',
        answer: 'xxx',
    },
    {
        question: 'Help and support',
        answer: 'xxx',
    },
    {
        question: 'Data and statistics',
        answer: 'xxx',
    },
];

const FAQ = () => {
    const [expandedIndex, setExpandedIndex] = useState(0); // 默认展开第一个

    const toggleIndex = (idx) => {
        setExpandedIndex(expandedIndex === idx ? null : idx);
    };

    return (
        <div className="w-full bg-black p-4 font-euclid text-white md:px-[80px] md:py-[104px]">
            <h2 className="mb-10 text-[64px]">FAQ</h2>
            <div className="flex  flex-col divide-y divide-[rgba(255,255,255,0.2)] border-y border-[#fff2]">
                {faqData.map((item, idx) => (
                    <div key={item.question}>
                        <button
                            className="flex w-full items-center justify-between py-8 text-left focus:outline-none"
                            onClick={() => toggleIndex(idx)}
                            aria-expanded={expandedIndex === idx}
                        >
                            <span className="text-[24px] leading-[34px]">{item.question}</span>
                            <span className="ml-4">
                                {expandedIndex === idx ? (
                                    <MinusIcon className="size-7" />
                                ) : (
                                    <PlusIcon className="size-7" />
                                )}
                            </span>
                        </button>
                        {expandedIndex === idx && (
                            <div className="pb-8 pl-1 pr-8 text-left text-[18px] leading-[30px] text-[rgba(255,255,255,0.72)]">
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
