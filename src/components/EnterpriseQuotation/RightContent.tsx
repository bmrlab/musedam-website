import { FC } from 'react'
import { useQuotationContext } from './index'
import { twx } from '@/utilities/cn'
import { useTranslation } from '@/app/i18n/client'
import { useQuoteDetailData } from './QuoteDetailData'


const TableLine = twx.div`min-h-[44px] justify-between px-5 py-2 border-b-[#BFBFBB] border-b text-[14px] flex items-center`

const QuoteDetailTable: FC = () => {
    const { t } = useTranslation('quotation')
    const { rows, subtotal, total } = useQuoteDetailData()

    return (
        <div className={'w-full border border-[#BFBFBB]'}>
            <TableLine className={"bg-[#E1E1DC] text-lg font-bold"}>{t('product.service.details')}</TableLine>
            <div className="text-sm">
                {rows.map((row, index) => (
                    <TableLine key={index}>
                        <span className={row.bold ? 'font-bold' : 'font-normal'}>{row.name}</span>
                        {!row.unit && !row.subtotal ? <span>{row.quantity}</span> : <>

                            <span>{row.quantity}</span>
                            <span>{row.unit}</span>
                            <span>{row.subtotal}</span></>}
                    </TableLine>
                ))}
                <TableLine className=" bg-[#E1E1DC] text-lg font-bold">
                    <span>{t('subtotal')}</span>
                    <span></span>
                    <span></span>
                    <span>{subtotal}</span>
                </TableLine>
                <TableLine className="border-none bg-[#E1E1DC] text-lg font-bold">
                    <span>{t('total')}</span>
                    <span></span>
                    <span></span>
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
        showFeatureList
    } = useQuotationContext()
    const { t } = useTranslation('quotation')
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

    const expansions = [
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
        }
    ]

    return (
        <div className="no-scrollbar size-full h-full overflow-scroll bg-[#F0F0EA] p-[60px] text-black">
            <div className="space-y-6">
                <div className="text-[40px] font-semibold">{t('quote.overview')}</div>
                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="grid grid-cols-2 gap-4 font-semibold">
                        <div>
                            <div className="mb-3 text-base">{t('customer.information')}</div>
                            <div className="space-y-2 text-sm" >
                                <p>{customerInfo.company}</p>
                                <p className='font-normal'>{customerInfo.contact}</p>
                                {!!customerInfo.email.length && <p className='font-normal'>Email: {customerInfo.email}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 text-base">{t('service.provider')}</div>
                            <div className="space-y-2 text-sm">
                                <p>{t('service.provider.name')}</p>
                                <p className='font-normal'>{t('service.provider.yourName')}</p>
                                {!!customerInfo.yourEmail.length && <p className='font-normal'>Email: {customerInfo.yourEmail}</p>}
                            </div>
                        </div>


                    </div>

                    {/* Product and Service Details */}
                    <QuoteDetailTable />

                    {/* Service Terms */}
                    <div>
                        <h3 className="mb-3 text-base font-bold text-[#141414]">{t('service.terms')}</h3>
                        <ul className="space-y-1 text-sm text-[#262626]">
                            <li>{t('service.terms.1')}</li>
                            <li>{t('service.terms.2')}</li>
                            <li>{t('service.terms.3')}</li>
                            {activeTab === 'private' && (
                                <li>{t('service.terms.4')}</li>
                            )}
                        </ul>
                    </div>

                    {/* 扩容价格 */}
                    <div className='border'>
                        <div className="px-5 py-[10px] text-sm font-bold">{t('capacity.expansion')}</div>
                        <div className="space-y-2 text-sm">
                            {expansions.map(({ name, description, value, globalValue }) => {
                                return <div className="flex justify-between border-t px-5 py-2" key={name}>
                                    <div className='flex flex-col gap-[2px]'>
                                        <span className=' font-euclid text-sm'>{name}</span>
                                        <span className='mr-6 whitespace-pre-line font-euclidlight text-xs text-[rgba(20,20,20,0.72)]'>
                                            {description}
                                        </span>
                                    </div>
                                    <div className="whitespace-pre-line text-end">
                                        {isGlobal ? globalValue : value}
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>

                    {/** 功能列表 */}
                    {/* {showFeatureList && <FeatureList />} */}
                </div>
            </div>
        </div >
    )
}

