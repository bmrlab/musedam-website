'use client'

import Image from 'next/image'
import { Fragment, useEffect, useRef, } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { cn } from '@/utilities/cn'
import { FlexCenterContainer } from '../../StyleWrapper/Container'
import { InfoTooltip, QAAccordion, TableCell } from '../TableComponents'
import { usePlanMuseDAM } from './museDamPlan'
import { ESpaceType } from '../types/plan'
import { useCountry } from '@/providers/Country'

export default function DetailTableOfMuseDam() {
    const { planMuseDAM } = usePlanMuseDAM()
    const { t } = useTranslation('pricing')
    const { isInChina } = useCountry()
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const header = headerRef.current;

        const checkIfNeedsScroll = () => {
            if (container && header) {
                const needsScroll = container.scrollWidth > container.clientWidth;
                container.style.overflowX = needsScroll ? 'auto' : ''
                header.style.top = needsScroll ? '0' : '70px';
            }
        };

        // 初始检查
        checkIfNeedsScroll();

        // 监听窗口大小变化
        window.addEventListener('resize', checkIfNeedsScroll);

        // 清理监听器
        return () => {
            window.removeEventListener('resize', checkIfNeedsScroll);
        };
    }, []);

    const columns = [
        {
            key: ESpaceType.PERSON_FREE,
            titleKey: 'pricing.free',
            desKey: 'pricing.free.des'
        }, {
            key: ESpaceType.PERSON_PRO,
            titleKey: 'pricing.pro',
            desKey: 'pricing.pro.des'
        }, {
            key: ESpaceType.TEAM,
            titleKey: 'pricing.team',
            desKey: 'pricing.team.des'
        }, {
            key: ESpaceType.ENTERPRISE,
            titleKey: 'pricing.team.enterprise',
            desKey: 'pricing.team.table.enterprise.des',
            icon: '/assets/Pricing/vip.svg'
        }

    ]
    return (
        <div className="text-default mt-[60px] w-full">
            <h1 className="mb-[40px] text-center font-euclid text-[32px] leading-[45px]">{t('pricing.rights')}</h1>
            <div className="no-scrollbar mb-[60px] w-full px-5 md:px-10" ref={containerRef}>
                <table className="pricing-table w-full min-w-[915px] table-fixed text-center text-sm leading-5">
                    <thead className="sticky top-[70px] z-[11]" ref={headerRef}>
                        <tr>
                            <th scope="col" className="w-[170px] font-euclid text-sm leading-5 text-[#676C77] md:w-[228px]">
                                {t('pricing.services')}
                            </th>

                            {columns.map((item) => {
                                const { key, titleKey, desKey, icon } = item
                                return <th scope="col" className="w-[170px] md:w-auto" key={`header-${key}`}>
                                    <div className="flex flex-col items-center justify-center gap-[10px]">
                                        <FlexCenterContainer className="gap-1 text-base font-medium leading-6 xl:text-[16px] 2xl:text-[20px]">
                                            {t(titleKey)}
                                            {icon && <Image
                                                src={icon}
                                                className="inline size-[19px]"
                                                alt=""
                                                width={20}
                                                height={20}
                                            />}
                                        </FlexCenterContainer>
                                        <span className="rounded bg-[#F6F7F9] px-2 font-mono text-[10px] font-normal leading-[16px] text-[#676C77]">
                                            {t(desKey)}
                                        </span>
                                    </div>
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {planMuseDAM.map((group, index) => (
                            <Fragment key={group.group}>
                                {index < planMuseDAM.length && (
                                    <tr className="row--blank">
                                        <td colSpan={5}></td>
                                    </tr>
                                )}
                                <tr className="row--group font-euclid" id={`planMuseDAM-group-${index}`}>
                                    <td colSpan={5}>{group.group}</td>
                                </tr>
                                {group.items?.map((row, rowIndex) => (
                                    <tr
                                        key={row.label}
                                        className={cn(
                                            'row row--group__item font-mono',
                                            rowIndex === group.items.length - 1 ? 'row--group__item--last' : '',
                                            rowIndex % 2 === 0 ? '' : 'row--light',
                                            rowIndex === group.items.length - 1
                                                ? 'border border-t-0 border-[#EBECEE]'
                                                : 'border-x border-[#EBECEE]',
                                        )}
                                    >
                                        <td className="cell text-[#676C77]">
                                            <div className="flex items-center justify-between">
                                                <span>{row.label}</span>
                                                <InfoTooltip hintText={row.hintText} hintLink={isInChina ? row.hintLink : undefined} hintLinkCustom={isInChina ? row.hintLinkCustom : undefined} />
                                            </div>
                                        </td>
                                        {columns.map(({ key }) => {
                                            return <td className="cell  text-[#434343]" key={`cell-${key}`}>
                                                <TableCell content={row.plans[key]} />
                                            </td>
                                        })}
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                    </tbody>
                </table >
            </div >
            <QAAccordion />
            {
                isInChina && <p className="mb-20 px-5 text-center text-[14px] leading-5 text-[#676C77] md:px-10">
                    {t('pricing.questions.others')}
                    <a
                        href="https://tezign.feishu.cn/wiki/wikcnQYTzPsPBCAGEE36oGtdIue"
                        target="_blank"
                        className="text-[#043FFB] underline underline-offset-2"
                    >
                        {t('pricing.questions.museDam.link')}
                    </a>
                    {t('pricing.questions.link.des')}
                </p>
            }
        </div >
    )
}
