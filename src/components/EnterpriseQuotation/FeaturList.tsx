import React, { FC } from 'react'
import { EFeatureView } from './types'
import { useQuotationStore } from '@/providers/QuotationStore'
import { useTranslation } from '@/app/i18n/client'
import { QuoteDetailRow, useQuoteDetailData } from './QuoteDetailData'
import { useEnterprisePlan } from '../Pricing/Enterprise/listPlan'
import { cn } from '@/utilities/cn'
import { EAdvancedModules } from './enums'

interface IDetailItem {
    name: string, detail: string
}
type DisplayRow = { title: string; detail?: string; items?: IDetailItem[] }

const DetailItem = ({ item, isInExport }: { item: IDetailItem, isInExport?: boolean }) => {
    return <div
        className={cn("grid min-h-[55px] grid-cols-5 justify-between border-t px-6 py-[15px] text-base",
            isInExport ? 'text-lg' : 'text-base'
        )}
        key={item.name}
    >
        <div className={cn('flex-content col-span-2 flex items-center', !item.detail && 'font-medium')}>
            {item.name}
        </div>
        <div className="flex-content col-span-3 whitespace-pre-line text-start">
            {item.detail}
        </div>
    </div>
}

const List = ({ list, isInExport }: { list: DisplayRow[], isInExport?: boolean }) => {
    return <div className="space-y-0 text-xl">
        {list.map(({ title, detail, items }) => (
            <React.Fragment key={title}>
                <div
                    className={cn("grid min-h-[55px] grid-cols-5 justify-between border-t transition-colors",
                        isInExport ? 'px-6 py-[15px] text-lg' : 'px-[12px] py-[10px] text-sm md:px-6 md:py-[15px] md:text-base'
                    )}
                >
                    <div className='flex-content col-span-2 flex items-center font-medium'>
                        {title}
                    </div>
                    <div className="flex-content  col-span-3 flex items-center whitespace-pre-line text-start">
                        {detail}
                    </div>
                </div>

                {items?.map((item) => <DetailItem item={item} key={item.name} isInExport={isInExport} />)}
            </React.Fragment>
        ))}
    </div>
}


export const FeatureList: FC<{ rows: QuoteDetailRow[], isInExport?: boolean }> = ({ rows, isInExport }) => {
    const {
        featureView,
        mergedToBasicModules,
        advancedModules,
    } = useQuotationStore()
    const { hasSSOType, allModules } = useQuoteDetailData()
    // 所有权益/映射
    const { basicGroupsByCode, advancedGroupsByCode, advancedKeyToGroup } = useEnterprisePlan()

    const { t } = useTranslation('quotation-feature')

    // 从 rows 中获取已购买的模块 key（这些是未合并的模块）
    const rowsKeys = rows.map((v) => v.key).filter((v) => !!v) as string[]
    // 从 allModules 中获取合并到基础报价的模块 key（只包含已购买的）
    // 使用和 QuoteDetailData 中 filterModules 相同的逻辑：!notBuy && advancedModules[key]
    // 合并的模块也应该显示在"企业功能"下，所以需要包含它们
    const mergedKeys = allModules
        .filter((module) => {
            if (!module.key) return false
            // 使用和 filterModules 相同的过滤逻辑
            const notBuy = (module as any).notBuy
            const isPurchased = !notBuy && advancedModules[module.key]
            // 必须是已购买的且合并的模块
            return isPurchased && mergedToBasicModules.has(module.key as EAdvancedModules)
        })
        .map((module) => module.key)
        .filter((v) => !!v) as string[]
    // 合并所有已购买的模块 key（包括合并到基础报价的），都显示在"企业功能"下
    const featureListKeys = Array.from(new Set([...rowsKeys, ...mergedKeys]))


    const basicList: DisplayRow[] = (() => {
        // const groups = featureListKeys.map(code => basicGroupsByCode[basicKeyToGroups[code]]).filter((v) => !!v)
        const groups = Object.values(basicGroupsByCode).filter((v) => !!v)
        if (featureView === EFeatureView.OVERVIEW) {
            return groups.map(group => ({
                title: group.title,
                detail: group.items?.map(i => i.name).join(', ')
            }))
        }
        // DETAIL
        return groups
    })()


    const advancedList: DisplayRow[] = (() => {
        const groups = featureListKeys.map(code => {
            let info = advancedGroupsByCode[advancedKeyToGroup[code]]
            if (code === EAdvancedModules.ENTERPRISE_SSO && info.items) {
                info.items = info.items?.filter((v) => hasSSOType.includes(v.key))
            }
            return info
        }).filter((v) => !!v)

        if (featureView === EFeatureView.OVERVIEW) {
            return groups.map(group => ({
                title: group.title,
                detail: group.items?.map(i => i.name).join(', ')
            }))
        }
        // DETAIL
        return groups
    })()


    return (
        <div className={isInExport ? 'mt-[120px]' : 'mt-[50px] md:mt-[120px]'}>
            <h3 className="mb-[30px] text-2xl font-bold text-[#141414]">{t('features.title')}</h3>
            <div className='overflow-hidden border-b'>
                {/* 已购买的-基础功能 */}
                <div className={cn(
                    "flex bg-[#F9FAFB]  font-bold",
                    isInExport ? 'h-[60px] min-h-[60px] px-6 text-xl leading-[60px]' : 'h-[44px] px-3 leading-[44px] md:h-[60px] md:px-6 md:text-xl md:leading-[60px]'
                )}>
                    <div className='flex-content' >{t('basic.title')}</div>
                </div>
                <List list={basicList} isInExport={isInExport} />
            </div>

            {/* 已购买的-高级功能*/}
            <div className='mt-[30px] overflow-hidden border-b'>
                <div className={cn(
                    "flex bg-[#F9FAFB]  font-bold",
                    isInExport ? 'h-[60px] min-h-[60px] px-6 text-xl leading-[60px]' : 'h-[44px] px-3 leading-[44px] md:h-[60px] md:px-6 md:text-xl md:leading-[60px]'
                )}>
                    <div className='flex-content'>{t('advanced.title')}</div>
                </div>
                <List list={advancedList} isInExport={isInExport} />
            </div>
        </div>
    );
}

