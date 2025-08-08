import { FC } from 'react'
import { EFeatureView, TabEnum, useQuotationContext } from './index'
import { useTranslation } from '@/app/i18n/client'
import { QuoteDetailRow } from './QuoteDetailData'
import { useEnterprisePlan } from '../Pricing/Enterprise/listPlan'

export const FeatureList: FC<{ rows: QuoteDetailRow[] }> = ({ rows }) => {
    const {
        featureView,
    } = useQuotationContext()

    // 所有权益/映射
    const { basicGroupsByCode, advancedGroupsByCode, basicKeyToGroups, advancedKeyToGroup } = useEnterprisePlan()

    const { t } = useTranslation('quotation-feature')

    const featureListKeys = rows.map((v) => v.key).filter((v) => !!v) as string[]

    type DisplayRow = { name: string; value: string }

    const basicList: DisplayRow[] = (() => {
        const groups = featureListKeys.map(code => basicGroupsByCode[basicKeyToGroups[code]]).filter((v) => !!v)
        if (featureView === EFeatureView.OVERVIEW) {
            return groups.map(group => ({
                name: group.title,
                value: group.items.map(i => i.name).join(', ')
            }))
        }
        // DETAIL
        return groups.flatMap(group => group.items.map(item => ({ name: item.name, value: item.detail })))
    })()


    const advancedList: DisplayRow[] = (() => {
        const groups = featureListKeys.map(code => advancedGroupsByCode[advancedKeyToGroup[code]]).filter((v) => !!v)
        console.log("groups", groups)
        if (featureView === EFeatureView.OVERVIEW) {
            return groups.map(group => ({
                name: group.title,
                value: group.items.map(i => i.name).join(', ')
            }))
        }
        // DETAIL
        return groups.flatMap(group => group.items.map(item => ({ name: item.name, value: item.detail })))
    })()

    return (
        <div className='mt-[50px]'>
            <h3 className="mb-[30px] text-2xl font-bold text-[#141414]">{t('features.title')}</h3>
            <div className='overflow-hidden rounded-2xl border'>
                {/* 已购买的-基础功能 */}
                <div className="flex h-[60px] items-center bg-[#F9FAFB] px-6 text-xl font-bold">
                    {t('basic.title')}
                </div>
                <div>
                    {basicList.map(({ name, value }) => (
                        <div
                            className="grid grid-cols-5 justify-between border-t px-6 py-[18px] transition-colors"
                            key={name}
                        >
                            <div className='col-span-2 flex items-center'>
                                <span className="text-xl font-medium">{name}</span>
                            </div>
                            <div className="col-span-3 whitespace-pre-line text-start text-lg">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 已购买的-高级功能*/}
            <div className='mt-[30px] overflow-hidden rounded-2xl border'>
                <div className="flex h-[60px] items-center bg-[#F9FAFB] px-6 text-xl font-bold">
                    {t('advanced.title')}
                </div>
                <div className="space-y-0 text-xl">
                    {advancedList.map(({ name, value }) => (
                        <div
                            className="grid grid-cols-5 justify-between border-t px-6 py-[18px] transition-colors"
                            key={name}
                        >
                            <div className='col-span-2 flex items-center'>
                                <span className="text-xl font-medium">{name}</span>
                            </div>
                            <div className="col-span-3 whitespace-pre-line text-start text-lg">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

