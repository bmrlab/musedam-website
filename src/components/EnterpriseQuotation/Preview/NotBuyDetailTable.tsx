"use client"
import { cn, twx } from '@/utilities/cn'
import { QuoteDetailData, useExpandServices, useQuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'


const Table = twx.table`w-full mb-4 text-[#262626] font-normal`
const Th = twx.th`detail-th bg-[#F9FAFB] font-bold text-left md:px-6 md:py-[13px] px-3 py-[10px] border-b border-[#E1E1DC] md:text-lg text-base vertical-align-middle `
const Td = twx.td`detail-td md:px-6 md:py-[13px] px-3 py-[10px] border-b border-[#E1E1DC] md:text-base text-sm vertical-align-middle`
const ExportLine = twx.div`flex-content`
const Tr = twx.tr``


export const NotBuyDetailTable: FC<{ rows: QuoteDetailData['rows'], isExport?: boolean }> = ({ rows, isExport }) => {
    const { allModules } = useQuoteDetailData()
    const notBuyRows = allModules.filter((v) => !rows.find(item => item.key === v.key))

    const { t } = useTranslation('quotation')
    return notBuyRows.length > 0 ? (
        <div className='mt-[120px]'>
            <div className="mb-[30px] text-2xl font-bold">
                {t('not.buy.modules')}
            </div>

            <div className={isExport ? '' : 'no-scrollbar overflow-scroll'}>
                <Table>
                    <thead>
                        <Tr>
                            <Th ><ExportLine>{t("quite.product.name")}</ExportLine></Th>
                            <Th ><ExportLine>{t("quite.product.quantity")}</ExportLine></Th>
                            <Th className='text-right'><ExportLine>{t("quite.product.unit.price")}</ExportLine></Th>
                        </Tr>
                    </thead>
                    <tbody>
                        {notBuyRows.map((row, i) => (
                            <Tr key={i}>
                                <Td className='min-w-[230px]'>
                                    <div className={cn("flex-content flex flex-col gap-[2px]")}>
                                        <span>{row.name}</span>
                                        {(row.previewDes || row.des) && <span className='whitespace-pre-line text-xs font-light'>
                                            {row.previewDes || row.des}
                                        </span>}
                                    </div>
                                </Td>
                                <Td className='min-w-[120px]'><ExportLine>{row.quantity}</ExportLine></Td>
                                <Td className='min-w-[150px] text-right'><ExportLine>{row.unit ?? '-'}</ExportLine></Td>
                            </Tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div >
    ) : <></>
}


export const ExpandService: FC<{ isExport?: boolean }> = ({ isExport }) => {
    const { t } = useTranslation('quotation')
    const expansions = useExpandServices()

    return <div className='mt-[120px]'>
        <div className="mb-[30px] text-2xl font-bold">
            {t("capacity.expansion")}
        </div>

        <div className={isExport ? '' : 'no-scrollbar overflow-scroll'}>
            <Table >
                <thead>
                    <Tr>
                        <Th className='min-w-[230px]'><ExportLine>{t("quite.product.name")}</ExportLine></Th>
                        <Th className='min-w-[120px]'><ExportLine>{t("quite.product.quantity")}</ExportLine></Th>
                        <Th className='min-w-[150px] text-right'><ExportLine>{t("quite.product.unit.price")}</ExportLine></Th>
                    </Tr>
                </thead>
                <tbody>
                    {expansions.map((row, i) => (
                        <Tr key={i}>
                            <Td >
                                <div className={cn("flex-content flex flex-col gap-[2px]")}>
                                    <span>{row.name}</span>
                                    {row.description && <span className='whitespace-pre-line text-xs font-light'>
                                        {row.description}
                                    </span>}
                                </div>
                            </Td>
                            <Td><ExportLine>{row.quantity}</ExportLine></Td>
                            <Td className='text-right'><ExportLine>{row.unit ?? '-'}</ExportLine></Td>
                        </Tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </div>
}