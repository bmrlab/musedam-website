
'use client'

import Image from 'next/image'
import { FC, ReactNode } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { ChevronDownIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/utilities/cn'
import * as Accordion from '@radix-ui/react-accordion';
import { PlanDetailInfo } from './types/plan'


export const TableCell: FC<{ content: ReactNode }> = ({ content }) => {
    if (typeof content === 'boolean')
        return (
            <div className="flex items-center justify-center">
                {content ? (
                    <Image src='/assets/Pricing/IconCheck.svg' alt='icon-check' width={18} height={18} />
                ) : (
                    <Image src='/assets/Pricing/IconClose.svg' alt='icon-close' width={18} height={18} />)}
            </div>
        )
    return <div className="flex items-center justify-center">{content}</div>
}

const tooltipStyles = {
    tooltipContent: 'relative z-10 h-auto max-w-[240px] whitespace-normal break-words rounded bg-[#333] px-1.5 py-1 text-[12px] leading-[18px] text-white',
    tooltipArrow: 'fill-[#333]',
};

// 提示信息
export const InfoTooltip = ({ hintText, hintLink, hintLinkCustom }: Pick<PlanDetailInfo['items'][number], 'hintLink' | 'hintText' | 'hintLinkCustom'>) => {
    const { t } = useTranslation('pricing')
    const renderHintLink = () => {
        if (!hintLink && !hintLinkCustom) return <></>
        if (hintLinkCustom) {
            if (hintLinkCustom.type === 'common') {
                return <>
                    {t('pricing.click.view')}<a
                        className="underline underline-offset-4"
                        target="_blank"
                        href={hintLinkCustom.link}
                    >
                        {hintLinkCustom.text}
                    </a></>
            } else if (hintLinkCustom.type === 'fileSupport') {
                return <>{t('pricing.fileSupport.click.view')}<a
                    className="underline underline-offset-4"
                    target="_blank"
                    href="https://tezign.feishu.cn/wiki/wikcnyxuvY5538K3k5Mn8dDFere"
                >
                    {t('pricing.fileSupport.linkText')}
                </a></>
            }
        } else {
            return <>
                {t("pricing.click")}
                <a
                    className="underline underline-offset-4"
                    target="_blank"
                    href={hintLink}
                >
                    {t('pricing.button.detail')}
                </a></>
        }
    }
    return (
        <Tooltip.Provider>
            <Tooltip.Root delayDuration={0}>
                <Tooltip.Trigger asChild>
                    <div
                        className={cn(
                            'btn btn-dark-blur size-[20px] rounded-[4px] p-[2px] md:size-[20px] md:rounded-[8px] md:p-[2px]',
                            'text-lighter cursor-pointer',
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <InfoCircledIcon className="size-[16px]" />
                    </div>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content
                        className={tooltipStyles.tooltipContent}
                        sideOffset={4}
                    >
                        <div className="relative z-10 max-w-xs whitespace-normal break-words rounded text-[12px] leading-[18px]">
                            {hintText}
                            {renderHintLink()}
                        </div>
                        <Tooltip.Arrow className={tooltipStyles.tooltipArrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};
export const QAAccordion = () => {
    const { t } = useTranslation('pricing')
    const items: { answerLen: number, otherAnswer?: any }[] = [
        {
            answerLen: 1
        },
        {
            answerLen: 1,
        },
        {
            answerLen: 2,
        },
        {
            answerLen: 2,
        },
        {
            answerLen: 1,
        },
        {
            answerLen: 2,
            // otherAnswer: <p className="mb-0 text-sm leading-5 text-[#676C77]">
            //     {t('pricing.questions.answer5_2_0')}
            //     <a className="text-[#043FFB] underline underline-offset-2"> {t('pricing.questions.answer5_2_1')}</a>
            //     {t('pricing.questions.answer5_2_2')}
            // </p>
        },
    ];
    return (
        <Accordion.Root
            type="multiple"
            className='px-5 md:px-10'
        >
            {items.map(({ answerLen, otherAnswer }, i) => {
                return <Accordion.Item
                    key={i}
                    value={`item-${i}`}
                    className="border-card-border mb-6 rounded-[16px] border p-6"
                >
                    <Accordion.Header className="flex">
                        <Accordion.Trigger
                            className={cn(
                                "flex w-full items-center justify-between",
                                "group "
                            )}
                        >
                            <h3 className="text-start text-[18px] font-medium leading-5">{t(`pricing.questions.ask${i}`)}</h3>
                            <ChevronDownIcon
                                className="ease-[cubic-bezier(0.87,0,0.13,1)] shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                                aria-hidden
                            />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content
                        className={cn(
                            "data-[state=open]:animate-slideDown",
                            "data-[state=closed]:animate-slideUp",
                            "mt-3 overflow-hidden",
                        )}
                    >
                        {Array.from({ length: answerLen }).map((_, answerIndex) => {
                            return <p className="mb-0 font-mono text-sm leading-5 text-[#676C77]" key={`anser-${i}-${answerIndex}`}>
                                {t(`pricing.questions.answer${i + '_' + answerIndex}`)}
                            </p>
                        })}
                        {otherAnswer}
                    </Accordion.Content>
                </Accordion.Item>
            })}
        </Accordion.Root>
    );
};