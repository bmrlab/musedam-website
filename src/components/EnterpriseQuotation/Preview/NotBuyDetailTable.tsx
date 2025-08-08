"use client"
import { useQuotationContext } from '@/components/EnterpriseQuotation'
import { cn, twx } from '@/utilities/cn'
import { QuoteDetailData, useQuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { useCountry } from '@/providers/Country'


const Table = twx.table`w-full mb-8 text-[#262626] font-normal`
const Th = twx.th`bg-[#F9FAFB] font-bold text-left px-6 py-[13px] border-b border-[#E1E1DC] text-lg`
const Td = twx.td`px-6 py-[13px] border-b border-[#E1E1DC] text-base`
const Tr = twx.tr``

const TotalLine = twx.div`flex w-[540px] justify-between text-xl px-6 py-[13px] font-semibold leading-[34px]`


export const NotBuyDetailTable: FC<{ rows: QuoteDetailData['rows'] }> = ({ rows }) => {
    const { allModules } = useQuoteDetailData()
    const notBuyRows = allModules.filter((v) => !rows.find(item => item.key === v.key))

    console.log("allModules", allModules, rows)
    const { t } = useTranslation('quotation')
    return (<div className='mt-[50px]'>
        <div className="mb-[30px] text-2xl font-bold">
            未选模块报价供参考
        </div>
        <Table className='mb-4 text-[#262626]'>
            <thead>
                <Tr>
                    <Th>{t("quite.product.name")}</Th>
                    <Th>{t("quite.product.quantity")}</Th>
                    <Th>{t("quite.product.unit.price")}</Th>
                    <Th className='text-right'>{t("subtotal")}</Th>
                </Tr>
            </thead>
            <tbody>
                {/* 模块行 */}
                {notBuyRows.length > 0 && (
                    <>
                        {notBuyRows.map((row, i) => (
                            <Tr key={i}>
                                <Td className={cn("flex flex-col gap-[2px]", row.bold ? "font-bold" : "")}>
                                    <span>{row.name}</span>
                                    {(row.previewDes || row.des) && <span className='whitespace-pre-line text-xs font-light'>
                                        {row.previewDes || row.des}
                                    </span>}
                                </Td>
                                <Td>{row.quantity}</Td>
                                <Td>{row.unit ?? '-'}</Td>
                                <Td className='text-right'>{row.subtotal ?? '-'}</Td>
                            </Tr>
                        ))}
                    </>
                )}
            </tbody>
        </Table>
    </div>
    )
}
