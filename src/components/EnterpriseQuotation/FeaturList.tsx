import React, { FC } from 'react'
import { EFeatureView, useQuotationContext } from './index'
import { useTranslation } from '@/app/i18n/client'
import { QuoteDetailRow } from './QuoteDetailData'
import { useEnterprisePlan } from '../Pricing/Enterprise/listPlan'

interface IDetailItem {
    name: string, detail: string
}
type DisplayRow = { title: string; detail?: string; items?: IDetailItem[] }

const DetailItem = ({ item }: { item: IDetailItem }) => {
    return <div
        className="grid grid-cols-5 justify-between border-t py-[15px] pl-8 pr-6 text-sm transition-colors"
        key={item.name}
    >
        <div className='col-span-2 flex items-center'>
            <span className="font-medium">{item.name}</span>
        </div>
        <div className="col-span-3 whitespace-pre-line text-start">
            {item.detail}
        </div>
    </div>
}

const List = ({ list }: { list: DisplayRow[] }) => {
    return <div className="space-y-0 text-xl">
        {list.map(({ title, detail, items }) => (
            <React.Fragment key={title}>
                <div
                    className="grid grid-cols-5 justify-between border-t px-6 py-[15px] transition-colors"
                >
                    <div className='col-span-2 flex items-center'>
                        <span className="text-base font-medium">{title}</span>
                    </div>
                    <div className="col-span-3 whitespace-pre-line text-start text-sm">
                        {detail}
                    </div>
                </div>

                {items?.map((item) => <DetailItem item={item} key={item.name} />)}
            </React.Fragment>
        ))}
    </div>
}
export const FeatureList: FC<{ rows: QuoteDetailRow[] }> = ({ rows }) => {
    // const {
    //     featureView,
    // } = useQuotationContext()
    const featureView = EFeatureView.OVERVIEW
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
        <div className='mt-[50px]'>
            <h3 className="mb-[30px] text-2xl font-bold text-[#141414]">{t('features.title')}</h3>
            <div className='overflow-hidden rounded-2xl border'>
                {/* 已购买的-基础功能 */}
                <div className="flex h-[60px] items-center bg-[#F9FAFB] px-6 text-xl font-bold">
                    {t('basic.title')}
                </div>
                <List list={basicList} />
            </div>

            {/* 已购买的-高级功能*/}
            <div className='mt-[30px] overflow-hidden rounded-2xl border'>
                <div className="flex h-[60px] items-center bg-[#F9FAFB] px-6 text-xl font-bold">
                    {t('advanced.title')}
                </div>
                <List list={advancedList} />
            </div>
        </div>
    );
}

