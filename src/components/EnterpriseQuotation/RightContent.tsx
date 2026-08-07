import { FC, useEffect, useState } from 'react'
import { useQuotationStore } from '@/providers/QuotationStore'
import { cn, twx } from '@/utilities/cn'
import { useTranslation } from '@/app/i18n/client'
import { useExpandServices, useQuoteDetailData } from './QuoteDetailData'
import { useCountry } from '@/providers/Country'
import { useLanguage } from '@/providers/Language'


const TableLine = twx.div`min-h-[44px] justify-between px-5 py-2 border-b-[#BFBFBB] border-b text-[14px] flex items-center`

const InfoLine = twx.p`font-normal text-[rgba(20,20,20,0.8)]`


/** 「优惠折扣」列：0-1 的折扣系数，默认跟随【优惠设置】×0.1 */
const RowDiscountInput: FC<{ rowKey: string; defaultFactor: number }> = ({
    rowKey,
    defaultFactor,
}) => {
    const { rowDiscounts, setRowDiscount } = useQuotationStore()
    const override = rowDiscounts[rowKey]
    const [draft, setDraft] = useState<string>('')

    // 【优惠设置】变更后覆盖被清空，这里同步回默认值
    useEffect(() => {
        setDraft(String(override ?? defaultFactor))
    }, [override, defaultFactor])

    const commit = () => {
        if (draft === '') {
            setRowDiscount(rowKey, undefined)
            return
        }
        const parsed = Number(draft)
        if (Number.isNaN(parsed)) {
            setRowDiscount(rowKey, undefined)
            return
        }
        const next = Math.min(1, Math.max(0, Math.round(parsed * 10000) / 10000))
        // 与默认值一致时不作为覆盖保存，便于跟随后续优惠设置变更
        setRowDiscount(rowKey, next === defaultFactor ? undefined : next)
        setDraft(String(next))
    }

    return (
        <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
            }}
            className={cn(
                'h-7 w-full rounded border border-[#BFBFBB] bg-transparent px-1 text-center text-xs',
                'appearance-none [-moz-appearance:textfield]',
                '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                'focus:border-[#141414] focus:outline-none',
            )}
        />
    )
}

const QuoteDetailTable: FC = () => {
    const { t } = useTranslation('quotation')
    const { rows, subtotal, total, discountTotal } = useQuoteDetailData()
    const { discount } = useQuotationStore()
    const { isInChina } = useCountry()
    const { language } = useLanguage()

    const showDiscountColumn = discount !== undefined
    const defaultFactor = Math.round(((discount ?? 10) / 10) * 10000) / 10000

    return (
        <div className={'w-full border border-[#BFBFBB]'}>
            <TableLine className={"bg-[#E1E1DC] text-lg font-bold"}>{t('product.service.details')}</TableLine>
            <div className="text-sm">
                {showDiscountColumn && (
                    <TableLine className="bg-[#F0F0EA] text-xs font-bold">
                        <span />
                        <span className="w-[88px] shrink-0 text-center">{t('discount.column')}</span>
                    </TableLine>
                )}
                {rows.map((row, index) => (
                    <TableLine key={index}>
                        <div className='flex flex-col gap-[2px]'>
                            <span className={row.bold ? 'font-bold' : 'font-normal'}>
                                {row.name}
                            </span>
                            {row.des && <span className='whitespace-pre-line text-xs font-light text-[#141414]'>{row.des}</span>}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                            <span>
                                {row.unit ?? (row.subtotal || row.quantity || '')}
                            </span>
                            {showDiscountColumn && (
                                <span className="w-[88px] shrink-0">
                                    {/* 赠送 / 零价行无需折扣 */}
                                    {row.key && row.billingMode !== 'gift' && !!row.amount ? (
                                        <RowDiscountInput rowKey={row.key} defaultFactor={defaultFactor} />
                                    ) : null}
                                </span>
                            )}
                        </div>
                    </TableLine>
                ))}
                <TableLine className=" bg-[#E1E1DC] text-sm font-bold">
                    <span>{t('subtotal')}</span>
                    <span>{subtotal}</span>
                </TableLine>
                {discountTotal && discount &&
                    <TableLine className=" bg-[#E1E1DC]  text-sm font-bold">
                        <span>{t('discount.subtotal', { discount: language === 'en-US' ? `${Math.round((10 - discount) * 10 * 100) / 100}%` : discount })}</span>
                        <span>{discountTotal}</span>
                    </TableLine>
                }
                {isInChina && <TableLine className=" bg-[#E1E1DC]  text-sm font-bold">
                    <span>{t("vat")}</span>
                    <span>6%</span>
                </TableLine>}
                <TableLine className="border-none bg-[#E1E1DC] text-base font-bold">
                    <span>{t('total')}</span>
                    <span>{total}</span>
                </TableLine>
            </div>
        </div>
    )
}

export const RightContent: FC = () => {
    const {
        customerInfo,
        editInfo
    } = useQuotationStore()
    const { t } = useTranslation('quotation')

    const expansions = useExpandServices()

    return (
        <div className="no-scrollbar size-full h-full overflow-scroll bg-[#F0F0EA] p-[60px] text-black">
            <div className="text-[40px] font-semibold">{t('quote.overview')}</div>
            {editInfo && <div className='text-sm text-[#141414]'>{t("quote.NO")}: {editInfo.quotationNo}</div>}
            <div className=''>
                {/* Customer Information */}
                <div className="my-10 grid grid-cols-2 gap-[30px] font-semibold">
                    <div>
                        <div className="mb-3 text-base">{t('customer.information')}</div>
                        <div className="space-y-2 text-sm" >
                            <p>{customerInfo.company}</p>
                            <InfoLine>{customerInfo.contact}</InfoLine>
                            {!!customerInfo.email.length && <InfoLine>Email: {customerInfo.email}</InfoLine>}
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 text-base">{t('service.provider')}</div>
                        <div className="space-y-2 text-sm">
                            <p>{t('service.provider.name')}</p>
                            <InfoLine>{t('service.provider.yourName')}</InfoLine>
                            {!!customerInfo.yourEmail.length && <InfoLine>Email: {customerInfo.yourEmail}</InfoLine>}
                        </div>
                    </div>


                </div>

                {/* Product and Service Details */}
                <QuoteDetailTable />

                {/* Service Terms */}
                <div className='mb-3 mt-10'>
                    <h3 className="mb-3 text-base font-bold text-[#141414]">{t('service.terms')}</h3>
                    <ul className="text-sm text-[#262626]">
                        <li>{t('service.terms.1')}</li>
                        <li>{t('service.terms.2')}</li>
                        <li>{t('service.terms.3')}</li>
                        <li>{t('service.terms.4')}</li>
                    </ul>
                </div>

                {/* 扩容价格 */}
                <div className='border'>
                    <div className="px-5 py-[10px] text-sm font-bold">{t('capacity.expansion')}</div>
                    <div className="space-y-2 text-sm">
                        {expansions.map(({ name, description, value }) => {
                            return <div className="flex justify-between border-t px-5 py-2" key={name}>
                                <div className='flex max-w-[389px] flex-col gap-[2px]'>
                                    <span className='font-euclid text-sm'>{name}{t('expansion')}</span>
                                    <span className='mr-6 whitespace-pre-line font-euclidlight text-xs text-[rgba(20,20,20,0.72)]'>
                                        {description}
                                    </span>
                                </div>
                                <div className="flex items-center whitespace-pre-line text-end">
                                    {value}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}

