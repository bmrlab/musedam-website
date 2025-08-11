import { FC, useMemo } from 'react'
import { useQuotationContext } from './index'
import { twx } from '@/utilities/cn'
import { useTranslation } from '@/app/i18n/client'
import { useQuoteDetailData } from './QuoteDetailData'
import { useCountry } from '@/providers/Country'
import { useLanguage } from '@/providers/Language'


const TableLine = twx.div`min-h-[44px] justify-between px-5 py-2 border-b-[#BFBFBB] border-b text-[14px] flex items-center`

const InfoLine = twx.p`font-normal text-[rgba(20,20,20,0.8)]`


const QuoteDetailTable: FC = () => {
    const { t } = useTranslation('quotation')
    const { rows, subtotal, total, discountTotal } = useQuoteDetailData()
    const { discount } = useQuotationContext()
    const { isInChina } = useCountry()
    const { language } = useLanguage()

    return (
        <div className={'w-full border border-[#BFBFBB]'}>
            <TableLine className={"bg-[#E1E1DC] text-lg font-bold"}>{t('product.service.details')}</TableLine>
            <div className="text-sm">
                {rows.map((row, index) => (
                    <TableLine key={index}>
                        <div className='flex flex-col gap-[2px]'>
                            <span className={row.bold ? 'font-bold' : 'font-normal'}>
                                {row.name}
                            </span>
                            {row.des && <span className='whitespace-pre-line text-xs font-light text-[#141414]'>{row.des}</span>}
                        </div>
                        {!row.unit && !row.quantity ?
                            <span>{row.quantity}</span> :
                            <span>{row.unit}</span>}
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
        activeTab,
        discount
    } = useQuotationContext()
    const { t } = useTranslation('quotation')
    const { isInChina } = useCountry()

    const expansions = useMemo(() => [
        {
            name: t('expansion.memberSeats'),
            description: t('expansion.memberSeats.desc'),
            value: t('advanced.memberSeats.des'),
            globalValue: t('advanced.memberSeats.des.global'),
        },

        {
            name: t('expansion.storageSpace'),
            description: t('expansion.storageSpace.desc'),
            value: '¥5,000/TB' + t("per.year"),
            globalValue: '$1,000/TB' + t("per.year"),
        },

        {
            name: t('expansion.aiPoints'),
            description: t('expansion.aiPoints.desc'),
            // TODO 待修改
            value: '¥5,000\n /20,000' + t('expansion.points'),
            globalValue: '$1,000\n /20,000' + t('expansion.points')
        },

        {
            name: t('expansion.downloadData'),
            description: t('expansion.downloadData.desc'),
            value: '¥150/TB',
            globalValue: '$30/TB',
        },
        ...(!isInChina ? [] : [{
            name: t('expansion.GA'),
            description: t('expansion.GA.desc'),
            value: `¥30,000${t("per.year")}\n /10TB`,
        }])
    ], [t, isInChina])

    return (
        <div className="no-scrollbar size-full h-full overflow-scroll bg-[#F0F0EA] p-[60px] text-black">
            <div className="text-[40px] font-semibold">{t('quote.overview')}</div>
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
                        {expansions.map(({ name, description, value, globalValue }) => {
                            return <div className="flex justify-between border-t px-5 py-2" key={name}>
                                <div className='flex max-w-[389px] flex-col gap-[2px]'>
                                    <span className='font-euclid text-sm'>{name}</span>
                                    <span className='mr-6 whitespace-pre-line font-euclidlight text-xs text-[rgba(20,20,20,0.72)]'>
                                        {description}
                                    </span>
                                </div>
                                <div className="whitespace-pre-line text-end">
                                    {isInChina ? value : globalValue}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}

