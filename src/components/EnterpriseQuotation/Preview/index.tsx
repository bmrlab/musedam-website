"use client"
import { useQuotationContext } from '@/components/EnterpriseQuotation'
import { cn, twx } from '@/utilities/cn'
import Image from 'next/image'
import { QuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FeatureList } from '../FeaturList'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { getQuotation } from '@/endpoints/quotation'
import Loading from '../../LandingPage/loading'
import { useToast } from '@/hooks/use-toast'
import html2pdf from 'html2pdf.js';
import { Button } from '../../ui/button'
import { useLanguage } from '@/providers/Language'
import { PreviewDetailTable } from './PreviewDetailTable'
import { NotBuyDetailTable } from './NotBuyDetailTable'
import { useCountry } from '@/providers/Country'


type QuoteDetailDataById = Pick<QuoteDetailData, 'rows' | 'subtotal' | 'total' | 'discountTotal'>

export const QuotationPreviewContent: FC<{ id: string, orgId?: string, userId?: string }> = (props) => {
    const { t } = useTranslation('quotation')
    const isInChina = useCountry()
    // const { rows, subtotal, total } = useQuoteDetailData()
    const [info, setQuoteInfo] = useState<QuoteDetailDataById | undefined>()
    const [quoteNo, setQuoteNo] = useState('')
    const [generatedDay, setGeneratedDay] = useState<number>()
    const { toast } = useToast()
    const { changeLocale, language } = useLanguage()
    const contentRef = useRef<HTMLDivElement>(null)

    const {
        customerInfo,
        setCustomerInfo,
        subscriptionYears,
        setFeatureView,
        setDiscount,
        showNoBuyFeature,
        setShowNoBuyFeature
    } = useQuotationContext()

    // 导出pdf
    const exportToPDF = () => {
        const element = contentRef.current;
        const opt = {
            margin: 10,
            filename: 'exported.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    useEffect(() => {
        if (!props.id || !props.orgId || !props.userId) {
            toast({
                duration: 2000,
                description: "无效的用户或报价单"
            })
            return
        }
        getQuotation(isInChina ? 'mainland' : 'global',
            { quotationId: props.id, orgId: props.orgId, userId: props.userId })
            .then((res) => {
                const content = JSON.parse(res.content)
                if (content.lang) {
                    changeLocale(content.lang)
                }
                setCustomerInfo({
                    yourEmail: res.contactEmail,
                    email: res.customerEmail ?? '',
                    company: res.customerCompany,
                    contact: res.customerContact ?? '',

                })
                // 折扣
                setDiscount(res.discount ?? undefined)
                // 订单号
                setQuoteNo(res.quotationNo ?? '')
                // 生成日期
                setGeneratedDay(res.createTime)
                // 功能清单
                setFeatureView(content.featureView)
                // 显示为购买功能报价
                setShowNoBuyFeature(content.showNoBuyFeature)

                const totalCost = (res.annualPrice / 100) * res.subscriptionYears
                const discountTotalNum = ((res.discount || 10) / 10) * totalCost

                setQuoteInfo({
                    rows: content.rows,
                    subtotal: content.prefix + totalCost.toLocaleString(),
                    discountTotal: res.discount ? content.prefix + discountTotalNum.toLocaleString() : undefined,
                    total: content.prefix + (discountTotalNum * (isInChina ? 1.06 : 1)).toLocaleString(),
                })
            }).catch((err) => {
                toast({
                    duration: 2000,
                    description: err.message ?? "报价单ID无效"
                })
            })
    }, [])

    const today = useMemo(() => generatedDay ? new Date(generatedDay).toLocaleDateString(language, { year: 'numeric', month: 'short', day: '2-digit' }) : '', [language, generatedDay])

    if (!info) {
        return <Loading />
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-white px-[100px] py-[120px] text-black">
            <Button className='absolute right-[100px] top-10' onClick={exportToPDF}>{t("quote.export")}</Button>
            <div className="w-full max-w-[1240px] rounded-xl bg-white" ref={contentRef}>
                {/* 顶部Logo和标题 */}
                <div className="relative size-12">
                    <Image src="/assets/logo.svg" alt="Muse Logo" fill />
                </div>
                <div className="mb-8 mt-2 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="text-[48px] font-bold leading-[48px]">{t("quote.title")}</div>
                        <LightText >{t("quote.NO")}: {quoteNo}</LightText>
                    </div>
                    <div className="space-y-1 text-right text-lg">
                        <div className="font-bold leading-[22px]">{t("quote.date")}</div>
                        <div className='leading-[22px]'>{today}</div>
                        <LightText>{t("quote.valid.days")}</LightText>
                    </div>
                </div>
                {/* 客户信息和服务商信息 */}
                <div className="mb-[50px] grid grid-cols-2 gap-4 bg-[#F9FAFB] p-6 text-lg">
                    <div>
                        <div className="text-5 mb-3 font-bold leading-[22px]">{t("customer.information")}</div>
                        <div className="font-semibold">{customerInfo.company}</div>
                        <div className='text-[#141414] opacity-80'>{customerInfo.contact}</div>
                        {customerInfo.email && <div className='text-[#141414] opacity-80'>Email: {customerInfo.email}</div>}
                    </div>
                    <div>
                        <div className="text-5 mb-3 font-bold leading-[22px]">{t("service.provider")}</div>
                        <div className="font-semibold">{t("service.provider.name")}</div>
                        <div className='text-[#141414] opacity-80'>{t("service.provider.yourName")}</div>
                        <div className='text-[#141414] opacity-80'>{t("contact.email")}：{customerInfo.yourEmail}</div>
                    </div>
                </div>

                {/* 产品与服务明细表格 */}
                <PreviewDetailTable info={info} />


                {/* 服务条款 */}
                <div className="mt-[120px]">
                    <h3 className="mb-5 text-xl font-semibold text-[#141414]">{t("service.terms")}</h3>
                    <ul className="space-y-1 text-base  text-[#262626]">
                        <li>{t('service.terms.1')}</li>
                        <li>{t('service.terms.2')}</li>
                        <li>{t('service.terms.3')}</li>
                        <li>{t('service.terms.4')}</li>
                    </ul>
                </div>
                {/* 第二页 */}
                <FeatureList rows={info.rows} />

                {/* 第三页 */}
                {showNoBuyFeature && <NotBuyDetailTable rows={info.rows} />}
            </div>
        </div>
    )
}

const LightText = twx.div`text-[16px] leading-[16px] font-light text-[#141414] opacity-70`
