import React, { FC } from 'react'
import { EFeatureView } from './types'
import { useQuotationStore } from '@/providers/QuotationStore'
import { useTranslation } from '@/app/i18n/client'
import { QuoteDetailRow } from './QuoteDetailData'
import { useEnterprisePlan } from '../Pricing/Enterprise/listPlan'

interface IDetailItem {
    name: string, detail: string
}
type DisplayRow = { title: string; detail?: string; items?: IDetailItem[] }

const DetailItem = ({ item }: { item: IDetailItem }) => {
    return <div
        className="grid min-h-[55px] grid-cols-5 justify-between border-t px-6 py-[15px] text-base"
        key={item.name}
    >
        <div className='flex-content col-span-2 flex items-center'>
            {item.name}
        </div>
        <div className="flex-content col-span-3 whitespace-pre-line text-start">
            {item.detail}
        </div>
    </div>
}

const List = ({ list }: { list: DisplayRow[] }) => {
    return <div className="space-y-0 text-xl">
        {list.map(({ title, detail, items }) => (
            <React.Fragment key={title}>
                <div
                    className="grid min-h-[55px] grid-cols-5 justify-between border-t px-6 py-[15px] text-base transition-colors"
                >
                    <div className='flex-content col-span-2 flex items-center font-medium'>
                        {title}
                    </div>
                    <div className="flex-content col-span-3 flex items-center whitespace-pre-line text-start">
                        {detail}
                    </div>
                </div>

                {items?.map((item) => <DetailItem item={item} key={item.name} />)}
            </React.Fragment>
        ))}
    </div>
}
export const FeatureList: FC<{ rows: QuoteDetailRow[] }> = ({ rows }) => {
    const {
        featureView,
    } = useQuotationStore()
    // 所有权益/映射
    const { basicGroupsByCode, advancedGroupsByCode, basicKeyToGroups, advancedKeyToGroup } = useEnterprisePlan()

    const { t } = useTranslation('quotation-feature')

    const featureListKeys = rows.map((v) => v.key).filter((v) => !!v) as string[]


    const basicList: DisplayRow[] = (() => {
        // const groups = featureListKeys.map(code => basicGroupsByCode[basicKeyToGroups[code]]).filter((v) => !!v)
        const groups = Object.values(basicGroupsByCode).filter((v) => !!v)
        if (featureView === EFeatureView.OVERVIEW) {
            return groups.map(group => ({
                title: group.title,
                detail: group.items.map(i => i.name).join(', ')
            }))
        }
        // DETAIL
        return groups
    })()


    const advancedList: DisplayRow[] = (() => {
        const groups = featureListKeys.map(code => advancedGroupsByCode[advancedKeyToGroup[code]]).filter((v) => !!v)
        if (featureView === EFeatureView.OVERVIEW) {
            return groups.map(group => ({
                title: group.title,
                detail: group.items.map(i => i.name).join(', ')
            }))
        }
        // DETAIL
        return groups
    })()


    return (
        <div className='mt-[120px]'>
            <h3 className="mb-[30px] text-2xl font-bold text-[#141414]">{t('features.title')}</h3>
            <div className='overflow-hidden rounded-2xl border'>
                {/* 已购买的-基础功能 */}
                <div className="flex min-h-[60px] bg-[#F9FAFB] px-6 text-xl font-bold  leading-[60px]">
                    <div className='flex-content' >{t('basic.title')}</div>
                </div>
                <List list={basicList} />
            </div>

            {/* 已购买的-高级功能*/}
            <div className='mt-[30px] overflow-hidden rounded-2xl border'>
                <div className="flex min-h-[60px] bg-[#F9FAFB] px-6 text-xl font-bold   leading-[60px]">
                    <div className='flex-content'>{t('advanced.title')}</div>
                </div>
                <List list={advancedList} />
            </div>
        </div>
    );
}

