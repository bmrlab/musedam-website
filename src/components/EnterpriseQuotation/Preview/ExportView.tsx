"use client"
import { cn, twx } from '@/utilities/cn'
import Image from 'next/image'
import { QuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FeatureList } from '../FeaturList'
import { FC, useMemo } from 'react'
import { PreviewDetailTable } from './PreviewDetailTable'
import { ExpandService, NotBuyDetailTable } from './NotBuyDetailTable'
import { useLanguage } from '@/providers/Language'
import { useCountry } from '@/providers/Country'

type QuoteDetailDataById = Pick<QuoteDetailData, 'rows' | 'subtotal' | 'total' | 'discountTotal'>

interface ExportViewProps {
    info: QuoteDetailDataById
    quoteNo: string
    generatedDay: number
    customerInfo: {
        yourEmail: string
        email: string
        company: string
        contact: string
    }
    showNoBuyFeature: boolean
    ref: React.RefObject<HTMLDivElement | null>
}

export const ExportView: FC<ExportViewProps> = ({
    info,
    quoteNo,
    generatedDay,
    customerInfo,
    showNoBuyFeature,
    ref
}) => {
    const { t } = useTranslation('quotation')
    const { language } = useLanguage()
    const { isInChina } = useCountry()
    const isGlobal = !isInChina
    const today = useMemo(() => generatedDay ? new Date(generatedDay).toLocaleDateString(language, { year: 'numeric', month: 'short', day: '2-digit' }) : '', [language, generatedDay])

    return (
        <div className="page-content w-full max-w-[1440px] bg-white px-[100px] py-[120px]" ref={ref}>
            {/* 第一页容器 */}
            <div className="first-page relative h-[1800px]" >
                {/* 顶部Logo和标题 */}
                <Image src="/assets/logo.svg" alt="Muse Logo" width={100} height={100} className='mb-2 h-12 w-auto' />
                <div className="mb-8 mt-[8px] flex flex-row items-center justify-between">
                    <div>
                        <div className="mb-2 text-[48px] font-bold">{t("quote.title")}</div>
                        <LightText >{t("quote.NO")}: {quoteNo}</LightText>
                    </div>
                    <div className="text-right text-lg">
                        <div className="mb-1 font-bold leading-[22px]">{t("quote.date")}</div>
                        <div className='mb-2 leading-[22px]'>{today}</div>
                        <LightText>{t("quote.valid.days")}</LightText>
                    </div>
                </div>
                {/* 客户信息和服务商信息 */}
                <div className="mb-[50px] grid grid-cols-2 gap-4 bg-[#F9FAFB] p-6 text-base">
                    <div>
                        <div className="text-5 mb-3 text-lg font-bold leading-[22px]">{t("customer.information")}</div>
                        <div className="font-semibold">{customerInfo.company}</div>
                        <div className='text-[#141414] opacity-80'>{customerInfo.contact}</div>
                        {customerInfo.email && <div className='text-[#141414] opacity-80'>Email: {customerInfo.email}</div>}
                    </div>
                    <div>
                        <div className="text-5 mb-3 text-lg font-bold  leading-[22px]">{t("service.provider")}</div>
                        <div className="font-semibold">{t(isGlobal ? "service.provider.name.global" : "service.provider.name")}</div>
                        <div className='text-[#141414] opacity-80'>{t("service.provider.yourName")}</div>
                        <div className='text-[#141414] opacity-80'>{t("contact.email")}：{customerInfo.yourEmail}</div>
                    </div>
                </div>

                {/* 产品与服务明细表格 */}
                <PreviewDetailTable info={info} isExport={true} />

                {/* 服务条款 */}
                <div className="absolute bottom-0">
                    <h3 className="mb-5 text-xl font-semibold text-[#141414]">{t("service.terms")}</h3>
                    <ul className="space-y-1 text-base  text-[#262626]">
                        <li>{t('service.terms.1')}</li>
                        <li>{t('service.terms.2')}</li>
                        <li>{t('service.terms.3')}</li>
                        <li>{t('service.terms.4')}</li>
                    </ul>
                </div>
            </div>
            {/* 分页符 - 第一页结束 */}
            <div className="page-break-after"></div>

            {/* 第二页 */}
            <div className="second-page" >
                <FeatureList rows={info.rows} isInExport={true} />
                {showNoBuyFeature && <NotBuyDetailTable rows={info.rows} isExport={true} />}
                <ExpandService isExport={true} />
            </div>
        </div>
    )
}

const LightText = twx.div`text-base font-light text-[#141414] opacity-70` 