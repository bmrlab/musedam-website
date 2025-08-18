"use client"
import { useQuotationStore } from '@/providers/QuotationStore'
import { cn, twx } from '@/utilities/cn'
import { QuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { useCountry } from '@/providers/Country'
import { useLanguage } from '@/providers/Language'


const Table = twx.table`w-full mb-4 text-[#262626] font-normal`
const Th = twx.th`detail-th bg-[#F9FAFB] font-bold text-left md:px-6 md:py-[13px] px-3 py-[10px] border-b border-[#E1E1DC] md:text-lg text-base vertical-align-middle `
const Td = twx.td`detail-td md:px-6 md:py-[13px] px-3 py-[10px] border-b border-[#E1E1DC] md:text-base text-sm vertical-align-middle w-auto`
const ExportLine = twx.div`flex-content`
const Tr = twx.tr``

const TotalLine = twx.div`detail-total flex w-[540px] max-w-full  justify-between md:text-xl text-base md:px-6 md:py-[13px] px-3 py-[10px] font-semibold`

type QuoteDetailDataById = Pick<QuoteDetailData, 'rows' | 'subtotal' | 'total' | 'discountTotal'>

export const PreviewDetailTable: FC<{ info: QuoteDetailDataById, isExport?: boolean }> = ({ info, isExport }) => {
    const { rows, subtotal, total, discountTotal } = info
    const { t } = useTranslation('quotation')
    const { discount } = useQuotationStore()
    const { isInChina } = useCountry()
    const { language } = useLanguage()

    // 分离主套餐行和模块行
    const mainRows = rows.filter(row => !row.isModule)
    const moduleRows = rows.filter(row => row.isModule)

    return (<div>
        <div className={cn("mb-[30px] text-2xl font-bold", !isExport && ' px-6 md:px-[100px]')}>{t("product.service.details")}</div>

        <div className={isExport ? '' : 'no-scrollbar overflow-scroll px-6 md:px-[100px]'}>
            <Table>
                <thead>
                    <Tr>
                        <Th><ExportLine>{t("quite.product.name")}</ExportLine></Th>
                        <Th><ExportLine>{t("quite.product.quantity")}</ExportLine></Th>
                        <Th><ExportLine>{t("quite.product.unit.price")}</ExportLine></Th>
                        <Th className='text-right'><ExportLine>{t("subtotal")}</ExportLine></Th>
                    </Tr>
                </thead>
                <tbody>
                    {/* 主套餐 */}
                    {mainRows.map((row, i) => (
                        <Tr key={i} >
                            <Td className='min-w-[230px]'>
                                <div className={cn("flex-content flex flex-col gap-[2px]")}>
                                    <span className={cn(row.bold ? "font-bold" : "")}>{row.name}</span>
                                    {row.des && <span className='whitespace-pre-line text-xs font-light '>
                                        {row.des}
                                    </span>}
                                </div>
                            </Td>
                            <Td className='min-w-[120px]'><ExportLine>{row.quantity}</ExportLine></Td>
                            <Td className='min-w-[150px]'><ExportLine>{row.unit ?? '-'}</ExportLine></Td>
                            <Td className='min-w-[150px] text-right'><ExportLine>{row.subtotal ?? '-'}</ExportLine></Td>
                        </Tr>
                    ))}

                    {/* 模块行 */}
                    {moduleRows.length > 0 && (
                        <>
                            {moduleRows.map((row, i) => (
                                <Tr key={i}>
                                    <Td>
                                        <div className="flex-content flex flex-col gap-[2px] ">
                                            <span className={cn(row.bold ? "font-bold" : "")}>{row.name}</span>
                                            {row.des && <span className='whitespace-pre-line text-xs font-light '>
                                                {row.des}
                                            </span>}
                                        </div>
                                    </Td>
                                    <Td><ExportLine>{row.quantity}</ExportLine></Td>
                                    <Td><ExportLine>{row.unit ?? '-'}</ExportLine></Td>
                                    <Td className='text-right'><ExportLine>{row.subtotal ?? '-'}</ExportLine></Td>
                                </Tr>
                            ))}
                        </>
                    )}
                </tbody>
            </Table>
        </div>
        <div className={cn('flex w-full flex-col items-end', !isExport && 'px-6 md:px-[100px]')}>
            {/* 小计/合计 */}
            <TotalLine >
                <div>{t("subtotal")}</div>
                <div>{subtotal}</div>
            </TotalLine>

            {discountTotal && discount &&
                <TotalLine >
                    <span>{t('discount.subtotal', { discount: language === 'en-US' ? `${(10 - discount) * 10}%` : discount })}</span>
                    <span>{discountTotal}</span>
                </TotalLine>
            }
            {isInChina && <TotalLine >
                <span>{t("vat")}</span>
                <span>6%</span>
            </TotalLine>}
            <TotalLine className='all-total border-t border-[#E1E1DC] text-lg md:text-[22px]'>
                <div>{t("total")}</div>
                <div>{total}</div>
            </TotalLine>
        </div>
    </div>
    )
}
