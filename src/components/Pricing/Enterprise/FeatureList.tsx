'use client'
import React, { FC, useState } from 'react';
import { useEnterprisePlan } from './listPlan';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utilities/cn';
import { SessionUser } from '@/types/user';
import { LocaleLink } from '@/components/LocalLink';

const FeatureList: FC<{ user: SessionUser | null }> = ({ user }) => {
    const { allFeature } = useEnterprisePlan();
    const { t } = useTranslation('pricing-featureList');
    const [expandedCategories, setExpandedCategories] = useState({});

    // 切换大类展开/收起
    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: {
                expanded: !(prev[categoryKey]?.expanded)
            }
        }));
    };

    // 切换小组展开/收起
    const toggleGroup = (categoryKey, groupKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: {
                ...prev[categoryKey],
                groups: {
                    ...prev[categoryKey]?.groups,
                    [groupKey]: !prev[categoryKey]?.groups?.[groupKey]
                }
            }
        }));
    };


    return (
        <div className="w-full bg-[#F0F0EA] px-4 py-[60px] md:px-[80px] md:py-[104px]">
            <div className="mb-[60px] flex flex-col items-center">
                <h2 className="font-feature text-[40px] text-[#070707] md:text-[64px]">{t('title')}</h2>
                {/* 生成报价单 */}
                {!user?.isSale && <LocaleLink href='/quotation'><button
                    className="mt-10 rounded-xl bg-black px-6 py-3 text-white-72 shadow transition-colors duration-200 hover:bg-[rgba(0,0,0,0.8)] focus:outline-none "
                >
                    {t('button')}
                </button></LocaleLink>}
            </div>

            <div className="flex flex-col gap-6 font-euclid">
                {/* 表头部分 */}
                <div className="grid grid-cols-12 rounded-2xl border border-[#D1D1CC] bg-[#E1E1DC] text-[rgba(0,0,0,0.72)]">
                    <div className="col-span-4 p-4 font-semibold md:col-span-3">{t('category')}</div>
                    <div className="col-span-8 border-l border-[#D1D1CC] p-4 font-semibold md:col-span-9">{t('details')}</div>
                </div>

                {/* 分类内容 */}
                {Object.entries(allFeature).map(([categoryKey, categoryData]) => {
                    const categoryState = expandedCategories[categoryKey] || {};
                    const isExpend = categoryState.expanded;
                    const groupStates = categoryState.groups || {};
                    const categoriesMap: [string, {
                        name: string;
                        detail: string;
                        showBeta?: boolean
                    }[]][] = Object.entries(categoryData.list)

                    return <div key={categoryKey} className='rounded-2xl '>
                        {/* 分组标题行 */}
                        <div className="sticky md:top-[70px] top-[56px] w-full bg-[#F0F0EA] z-[1]">
                            <div
                                className='flex cursor-pointer items-center rounded-t-2xl border border-[#D1D1CC] bg-[#E1E1DC] py-3'
                                onClick={() => toggleCategory(categoryKey)}
                            >
                                <div className="flex-1 pl-4 text-lg font-bold text-[#141414]">{categoryData.title}</div>
                                <button
                                    className="mr-4 p-2 transition-all duration-300 ease-in-out hover:opacity-80"
                                    aria-label={isExpend ? 'Collapse' : 'Expand'}
                                >
                                    {isExpend ? <MinusIcon className="size-5" /> : <PlusIcon className="size-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="rounded-b-2xl border border-y-0 border-[#D1D1CC]">
                            {categoriesMap.map(([groupKey, groupItems], index) => {
                                const isLast = index + 1 === categoriesMap.length
                                const isGroupExpanded = groupStates[groupKey];
                                return <React.Fragment key={groupKey}>
                                    {/* 小组标题 */}
                                    <div className={cn(
                                        "cursor-pointer items-center border-b border-[#D1D1CC] p-4 font-medium text-[#141414]",
                                        "transition-all duration-300 ease-in-out hover:bg-[#E1E1DC]",
                                        !isExpend && !isGroupExpanded && isLast && 'rounded-b-2xl'
                                    )}
                                        onClick={() => toggleGroup(categoryKey, groupKey)}
                                    >
                                        <span className='mr-[10px] inline-block'>{index < 9 ? '0' : ''}{index + 1}</span>{groupKey}
                                    </div>
                                    {/* 展开时显示所有小组下的功能项 ，两列 */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpend || isGroupExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}
                                    >
                                        {groupItems.map((item, index) => (
                                            <div key={index} className={
                                                cn(
                                                    "grid cursor-pointer grid-cols-12 border-b border-[#D1D1CC] text-sm text-[#262626] transition-all duration-300 ease-in-out hover:bg-[#E1E1DC]",
                                                    (isExpend || isGroupExpanded) && isLast && index + 1 === groupItems.length && 'rounded-b-2xl'
                                                )
                                            }>
                                                <div className="relative col-span-4 flex items-center border-r border-[#D1D1CC] p-2 md:col-span-3 md:p-4">
                                                    {item.name}
                                                    {item.showBeta && <span className='absolute left-[78px] top-[10px] text-[10px]'>BETA</span>}
                                                </div>
                                                <div className="col-span-8 whitespace-pre-line p-2 md:col-span-9 md:p-4">{item.detail}</div>
                                            </div>
                                        ))}
                                    </div>
                                </React.Fragment>
                            })}
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
};

export default FeatureList;    