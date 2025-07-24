'use client'
import React, { useState } from 'react';
import { useEnterprisePlan } from './listPlan';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utilities/cn';
const FeatureList = () => {
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
                <h2 className="font-feature text-[40px] md:text-[64px] text-[#070707]">{t('title')}</h2>
                {/* 生成报价单 */}
                {/* <button className="mt-10 rounded-xl bg-black px-6 py-3 text-[rgba(255,255,255,0.72)] shadow transition-colors duration-200 hover:bg-[rgba(0,0,0,0.8)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    {t('button')}
                </button> */}
            </div>

            <div className="flex flex-col gap-6 font-euclid">
                {/* 表头部分 */}
                <div className="grid grid-cols-12 rounded-2xl border border-[#D1D1CC] bg-[#E1E1DC] text-[rgba(0,0,0,0.72)]">
                    <div className="md:col-span-3 col-span-4 p-4 font-semibold">{t('category')}</div>
                    <div className="md:col-span-9 col-span-8 border-l border-[#D1D1CC] p-4 font-semibold">{t('details')}</div>
                </div>

                {/* 分类内容 */}
                {Object.entries(allFeature).map(([categoryKey, categoryData]) => {
                    const categoryState = expandedCategories[categoryKey] || {};
                    const isExpend = categoryState.expanded;
                    const groupStates = categoryState.groups || {};
                    const categoriesMap = Object.entries(categoryData.list)

                    return <div key={categoryKey} className='rounded-2xl '>
                        {/* 分组标题行 */}
                        <div className="sticky md:top-[70px] top-[56px] w-full bg-[#F0F0EA]">
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
                        <div className="rounded-b-2xl border border-t-0 border-b-0 border-[#D1D1CC]">
                            {categoriesMap.map(([groupKey, groupItems], index) => {
                                const isLast = index + 1 === categoriesMap.length
                                const isGroupExpanded = groupStates[groupKey];
                                return <React.Fragment key={groupKey}>
                                    {/* 小组标题 */}
                                    <div className={cn(
                                        "p-4 text-[#141414] font-medium items-center border-b border-[#D1D1CC] cursor-pointer",
                                        "transition-all duration-300 ease-in-out hover:bg-[#E1E1DC]",
                                        !isExpend && isLast && 'rounded-b-2xl'
                                    )}
                                        onClick={() => toggleGroup(categoryKey, groupKey)}
                                    >
                                        <span className='mr-[10px] inline-block'>0{index + 1}</span>{groupKey}
                                    </div>
                                    {/* 展开时显示所有小组下的功能项 ，两列 */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpend || isGroupExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}
                                    >
                                        {groupItems.map((item, index) => (
                                            <div key={index} className={
                                                cn(
                                                    "grid cursor-pointer grid-cols-12 text-sm text-[#262626] transition-all duration-300 ease-in-out hover:bg-[#E1E1DC] border-b border-[#D1D1CC]",
                                                    isExpend && isLast && index + 1 === groupItems.length && 'rounded-b-2xl'
                                                )
                                            }>
                                                <div className="md:col-span-3 col-span-4 border-r border-[#D1D1CC] md:p-4 p-2">{item.name}</div>
                                                <div className="md:col-span-9 col-span-8 md:p-4 p-2 whitespace-pre-line">{item.detail}</div>
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