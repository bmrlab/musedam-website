"use client"
import { useQuotationStore } from '@/providers/QuotationStore'
import { cn, twx } from '@/utilities/cn'
import Image from 'next/image'
import { QuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FeatureList } from '../FeaturList'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { addQuotationDownloadRecord, getQuotation } from '@/endpoints/quotation'
import Loading from '../../LandingPage/loading'
import { useToast } from '@/hooks/use-toast'
import html2pdf from 'html2pdf.js';
import { Button } from '../../ui/button'
import { useLanguage } from '@/providers/Language'
import { PreviewDetailTable } from './PreviewDetailTable'
import { ExpandService, NotBuyDetailTable } from './NotBuyDetailTable'
import { useCountry } from '@/providers/Country'
import { StyleSheetManager } from 'styled-components';
import { decodeNumber } from '@/utilities/numberCodec'
import { SessionUser } from '@/types/user'

type QuoteDetailDataById = Pick<QuoteDetailData, 'rows' | 'subtotal' | 'total' | 'discountTotal'>

export const QuotationPreviewContent: FC<{ id: string, user: SessionUser | null }> = (props) => {
    const { t } = useTranslation('quotation')
    const { isInChina } = useCountry()
    const [info, setQuoteInfo] = useState<QuoteDetailDataById | undefined>()
    const [quoteNo, setQuoteNo] = useState('')
    const [generatedDay, setGeneratedDay] = useState<number>()
    const { toast } = useToast()
    const { changeLocale, language } = useLanguage()
    const contentRef = useRef<HTMLDivElement>(null)
    // 新增：用于追踪服务条款容器
    const termsRef = useRef<HTMLDivElement>(null)
    const quotationId = decodeNumber(decodeURIComponent(props.id));

    const {
        customerInfo,
        setCustomerInfo,
        subscriptionYears,
        setFeatureView,
        setDiscount,
        showNoBuyFeature,
        setShowNoBuyFeature
    } = useQuotationStore()

    const exportToPDF = () => {
        const element = contentRef.current;
        if (!element) return;
        if (props.user?.orgId && props.user?.token) {
            addQuotationDownloadRecord(isInChina ? 'mainland' : 'global', {
                userId: props.user?.userId,
                orgId: props.user?.orgId,
                token: props.user?.token,
            }, {
                quotationId: quotationId
            })
        }
        const pageWidth = 1440;
        const pageHeight = 2037;
        const contentWidth = element.offsetWidth;
        const contentHeight = element.scrollHeight;

        const scale = Math.min(1, pageWidth / contentWidth);
        const availablePageHeight = pageHeight - 240;
        const finalScale = Math.min(scale, availablePageHeight / contentHeight, 0.9);

        // 新增：PDF导出前临时调整服务条款位置
        // const termsElement = termsRef.current;
        // if (termsElement) {
        //     termsElement.style.position = 'absolute';
        //     termsElement.style.bottom = '120px';
        //     termsElement.style.width = 'calc(100% - 200px)'; // 匹配页面内边距
        // }
        // 创建临时样式并确保高优先级
        const style = document.createElement('style');
        // 使用!important确保样式优先级，添加媒体查询覆盖可能的打印样式
        style.textContent = `
        .flex-content {
            margin-top:-7px;
            margin-bottom: 7px !important;
        }
        `;
        document.head.appendChild(style);

        const opt = {
            margin: 0,
            filename: `MueDAM报价单-${quoteNo.replaceAll('-', '')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                // 提高缩放倍数（2或3，根据内容复杂度调整）
                scale: Math.max(3, finalScale * 2),
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
                windowWidth: contentWidth,
                windowHeight: contentHeight,
                letterRendering: true
            },
            jsPDF: {
                unit: 'px',
                format: [pageWidth, pageHeight],
                orientation: 'portrait',
                compress: true
            },
            pagebreak: {
                mode: ['css'],
                before: '.page-break-before',
                after: '.page-break-after',
            }
        };



        // 先强制重绘元素
        if (element) {
            element.style.display = 'none';
            element.offsetHeight; // 触发重绘
            element.style.display = '';
        }

        html2pdf().set(opt).from(element).save().then(() => {
            document.head.removeChild(style);
        }).catch((error) => {
            console.error('PDF export error:', error);
            document.head.removeChild(style);
        });
    };

    useEffect(() => {
        if (!props.id || !props.user?.orgId || !props.user?.userId) {
            toast({
                duration: 2000,
                description: "无效的用户或报价单"
            })
            return
        }
        getQuotation(isInChina ? 'mainland' : 'global',
            { quotationId: quotationId, orgId: props.user?.orgId, userId: props.user?.userId })
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

                setDiscount(res.discount ?? undefined)
                setQuoteNo(res.quotationNo ?? '')
                setGeneratedDay(res.createTime)
                setFeatureView(content.featureView)
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
        <div className="flex min-h-screen flex-col items-center bg-white  text-black">
            <Button className='absolute right-[100px] top-[76px] h-[44px] w-[148px] rounded-2xl' onClick={exportToPDF}>
                {t("quote.export")}
            </Button>

            <StyleSheetManager enableVendorPrefixes>
                <div className={cn(
                    "page-content w-full max-w-[1440px] bg-white px-[100px] py-[120px]",
                )} ref={contentRef} >
                    {/* 第一页容器增加相对定位 */}
                    <div className="first-page relative h-[1800px]" >
                        {/* 顶部Logo和标题 */}
                        <Image src="/assets/logo.svg" alt="Muse Logo" width={100} height={100} className='mb-2 h-12 w-auto' />
                        <div className="mb-8 mt-[8px] flex items-center justify-between">
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
                                <div className="font-semibold">{t("service.provider.name")}</div>
                                <div className='text-[#141414] opacity-80'>{t("service.provider.yourName")}</div>
                                <div className='text-[#141414] opacity-80'>{t("contact.email")}：{customerInfo.yourEmail}</div>
                            </div>
                        </div>

                        {/* 产品与服务明细表格 */}
                        <PreviewDetailTable info={info} />

                        {/* 服务条款 - 添加ref并调整样式 */}
                        <div
                            ref={termsRef}
                            className="absolute bottom-0"
                        >
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
                        <FeatureList rows={info.rows} />
                        {showNoBuyFeature && <NotBuyDetailTable rows={info.rows} />}
                        <ExpandService />
                    </div>

                    {/* 第三页 */}
                    {/* <div className="page-break-after"></div>
                    <div className="third-page">
                    </div> */}
                </div>
            </StyleSheetManager>
        </div>
    )
}

const LightText = twx.div`text-[16px] leading-[16px] font-light text-[#141414] opacity-70`