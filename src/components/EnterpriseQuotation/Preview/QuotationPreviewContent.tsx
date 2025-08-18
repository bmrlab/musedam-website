"use client"
import { useQuotationStore } from '@/providers/QuotationStore'
import { cn, twx } from '@/utilities/cn'
import Image from 'next/image'
import { QuoteDetailData, useQuoteDetailData } from '../QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FeatureList } from '../FeaturList'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { IQuotationInfo } from '@/endpoints/quotation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '../../ui/button'
import { useLanguage } from '@/providers/Language'
import { PreviewDetailTable } from './PreviewDetailTable'
import { ExpandService, NotBuyDetailTable } from './NotBuyDetailTable'
import { useCountry } from '@/providers/Country'
import { DownloadIcon, EditIcon, Share2 } from 'lucide-react'
import { ShareDialog } from './ShareDialog'
import { ExportView } from './ExportView'
import { useRouter } from 'next/navigation'
import Loading from '@/components/LandingPage/loading'
import { SessionUser } from '@/types/user'

type QuoteDetailDataById = Pick<QuoteDetailData, 'subtotal' | 'total' | 'discountTotal'>

interface QuotationPreviewContentProps {
    info: IQuotationInfo
    showDownload: boolean
    showEdit: boolean
    showShare: boolean
    user: SessionUser | null
}

export const QuotationPreviewContent: FC<QuotationPreviewContentProps> = ({ info, showDownload, showEdit, showShare, user }) => {
    const { t } = useTranslation('quotation')
    const { isInChina } = useCountry()
    const router = useRouter()
    const [quoteInfo, setQuoteInfo] = useState<QuoteDetailDataById | undefined>()
    const [shareDialogOpen, setShareDialogOpen] = useState(false)
    const { toast } = useToast()
    const { language, changeLocale } = useLanguage()
    const contentRef = useRef<HTMLDivElement>(null)
    const { rows } = useQuoteDetailData()

    const {
        customerInfo,
        setCustomerInfo,
        setSubscriptionYears,
        setFeatureView,
        setDiscount,
        showNoBuyFeature,
        setShowNoBuyFeature,
        setAdvancedModules,
        setAdvancedConfig,
        setEditInfo
    } = useQuotationStore()

    // 初始化数据
    useEffect(() => {
        if (info) {
            try {
                const content = JSON.parse(info.content)
                if (content.lang) {
                    changeLocale(content.lang)
                }
                const realDiscount = info.discount ? info.discount / 100 : undefined

                setCustomerInfo({
                    yourEmail: info.contactEmail,
                    email: info.customerEmail ?? '',
                    company: info.customerCompany,
                    contact: info.customerContact ?? '',
                })

                if (content.advancedConfig) {
                    setAdvancedConfig(content.advancedConfig)
                }

                if (content.advancedModules) {
                    setAdvancedModules(content.advancedModules)
                }
                setDiscount(realDiscount)
                setFeatureView(content.featureView)
                setShowNoBuyFeature(content.showNoBuyFeature)
                setSubscriptionYears(info.subscriptionYears)

                const totalCost = (info.annualPrice / 100) * info.subscriptionYears
                const discountTotalNum = ((realDiscount || 10) / 10) * totalCost

                setQuoteInfo({
                    subtotal: content.prefix + totalCost.toLocaleString(),
                    discountTotal: realDiscount ? content.prefix + discountTotalNum.toLocaleString() : undefined,
                    total: content.prefix + (discountTotalNum * (isInChina ? 1.06 : 1)).toLocaleString(),
                })
            } catch (error) {
                console.error('Error parsing quotation content:', error)
                toast({
                    duration: 2000,
                    description: t('share.dialog.update.failed')
                })
            }
        }
    }, [info, isInChina, setCustomerInfo, setAdvancedConfig, setAdvancedModules, setDiscount, setFeatureView, setShowNoBuyFeature, setSubscriptionYears, toast, changeLocale, t])

    const exportToPDF = async () => {
        const element = contentRef.current;
        if (!element) return;

        const pageWidth = 1440;
        const pageHeight = 2037;
        const contentWidth = element.offsetWidth;
        const contentHeight = element.scrollHeight;

        const scale = Math.min(1, pageWidth / contentWidth);
        const availablePageHeight = pageHeight - 240;
        const finalScale = Math.min(scale, availablePageHeight / contentHeight, 0.9);

        // 创建临时样式并确保高优先级
        const style = document.createElement('style');
        style.textContent = `
        .page-content .flex-content {
            margin-top:-7px;
            margin-bottom: 7px !important;
        }
        .page-content .detail-th{
            padding: 13px 24px !important;
            font-size: 18px !important;
        }
        .page-content .detail-td{
            padding: 13px 24px !important;
            font-size: 16px !important;
        }
        .page-content .detail-total{
            padding: 13px 24px !important;
            font-size: 18px !important;
        }
        .page-content .all-total{
            font-size: 22px !important;
        }
        `;
        document.head.appendChild(style);

        const opt = {
            margin: 0,
            filename: `MueDAM报价单-${info.quotationNo?.replaceAll('-', '') || 'unknown'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
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

        // 检测最后一页是否为空，如果为空则隐藏分页符
        const pageBreaks = element.querySelectorAll('.page-break-after');
        if (pageBreaks.length > 0) {
            const lastPageBreak = pageBreaks[pageBreaks.length - 1] as HTMLElement;
            const nextElement = lastPageBreak.nextElementSibling;

            // 检查最后一页是否有内容
            if (nextElement && nextElement.classList.contains('second-page')) {
                const secondPageContent = nextElement.innerHTML.trim();
                // 如果第二页内容很少或为空，则隐藏分页符
                if (secondPageContent.length < 100) {
                    lastPageBreak.style.display = 'none';
                }
            }
        }

        const html2pdf = (await import('html2pdf.js')).default;

        html2pdf().set(opt).from(element).save().then(() => {
            document.head.removeChild(style);
            // 恢复分页符显示
            if (pageBreaks.length > 0) {
                const lastPageBreak = pageBreaks[pageBreaks.length - 1] as HTMLElement;
                lastPageBreak.style.display = '';
            }
        }).catch((error) => {
            console.error('PDF export error:', error);
            document.head.removeChild(style);
            // 恢复分页符显示
            if (pageBreaks.length > 0) {
                const lastPageBreak = pageBreaks[pageBreaks.length - 1] as HTMLElement;
                lastPageBreak.style.display = '';
            }
        });
    };

    const handleShare = () => {
        setShareDialogOpen(true)
    }

    const handleEdit = () => {
        setEditInfo(info)
        router.push(`/${language}/quotation`)
    }

    const today = useMemo(() => {
        return info.createTime ? new Date(info.createTime).toLocaleDateString(language, {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }) : ''
    }, [language, info.createTime])

    if (!quoteInfo) {
        return <Loading />
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-white text-black">
            {/* 操作按钮 */}
            <div className='absolute right-[24px] top-[30px] z-[1] flex max-w-[1440px] justify-end gap-[6px] md:right-[100px] md:top-[76px] md:gap-2'>
                {showEdit && (
                    <Button className='size-[40px] rounded-[8px] md:size-[44px] md:rounded-2xl [&_svg]:size-5 md:[&_svg]:size-6' onClick={handleEdit}>
                        <EditIcon />
                    </Button>
                )}
                {showShare && <Button className='size-[40px] rounded-[8px] md:size-[44px] md:rounded-2xl [&_svg]:size-5 md:[&_svg]:size-6' onClick={handleShare}>
                    <Share2 />
                </Button>}
                {showDownload && (
                    <Button className='size-[40px] rounded-[8px] md:size-[44px] md:rounded-2xl [&_svg]:size-5 md:[&_svg]:size-6' onClick={exportToPDF}>
                        <DownloadIcon />
                    </Button>
                )}
            </div>

            <div className={cn(
                "w-full max-w-[1440px] bg-white py-[30px] md:py-[120px]",
            )} >
                {/* 第一页容器增加相对定位 */}
                <div className="first-page relative" >
                    <div className='px-6  md:px-[100px]'>
                        {/* 顶部Logo和标题 */}
                        <Image src="/assets/logo.svg" alt="Muse Logo" width={100} height={100} className='mb-2 h-12 w-auto' />
                        <div className="mb-6 mt-[8px] flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="mb-2 text-[36px] font-bold md:text-[48px]">{t("quote.title")}</div>
                                <LightText>{t("quote.NO")}: {info.quotationNo || 'N/A'}</LightText>
                            </div>
                            <div className="text-sm md:text-right md:text-lg">
                                <div className="mb-1 font-bold leading-[22px]">{t("quote.date")}</div>
                                <div className='mb-2 leading-[22px]'>{today}</div>
                                <LightText>{t("quote.valid.days")}</LightText>
                            </div>
                        </div>

                        {/* 客户信息和服务商信息 */}
                        <div className="mb-[50px] grid grid-cols-1 gap-4 bg-[#F9FAFB] p-6 text-base md:grid-cols-2">
                            <div>
                                <div className="text-5 mb-3 text-lg font-bold leading-[22px]">{t("customer.information")}</div>
                                <div className="font-semibold">{customerInfo.company}</div>
                                <div className='text-[#141414] opacity-80'>{customerInfo.contact}</div>
                                {customerInfo.email && <div className='text-[#141414] opacity-80'>Email: {customerInfo.email}</div>}
                            </div>
                            <div>
                                <div className="text-5 mb-3 text-lg font-bold leading-[22px]">{t("service.provider")}</div>
                                <div className="font-semibold">{t("service.provider.name")}</div>
                                <div className='text-[#141414] opacity-80'>{t("service.provider.yourName")}</div>
                                <div className='text-[#141414] opacity-80'>{t("contact.email")}：{customerInfo.yourEmail}</div>
                            </div>
                        </div>
                    </div>


                    {/* 产品与服务明细表格 */}
                    <PreviewDetailTable info={{ ...quoteInfo, rows }} />

                    {/* 服务条款 - 添加ref并调整样式 */}
                    <div
                        className="mt-[50px] px-6 md:px-[100px]"
                    >
                        <h3 className="mb-5 text-xl font-semibold text-[#141414]">{t("service.terms")}</h3>
                        <ul className="space-y-1 text-[13px] text-[#262626] md:text-base">
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
                <div className="second-page " >
                    <div className='px-6 md:px-[100px]'><FeatureList rows={rows} /></div>
                    {showNoBuyFeature && <NotBuyDetailTable rows={rows} />}
                    <ExpandService />
                </div>
            </div>

            {/* 分享对话框 */}
            <ShareDialog
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
                info={info}
                user={user} // 这里需要根据实际情况传入用户信息
            />

            {/* 导出视图（隐藏） */}
            {showDownload && (
                <div className='hidden'>
                    <ExportView
                        info={{ ...quoteInfo, rows }}
                        quoteNo={info.quotationNo || ''}
                        generatedDay={info.createTime || 0}
                        customerInfo={customerInfo}
                        showNoBuyFeature={showNoBuyFeature}
                        ref={contentRef}
                    />
                </div>
            )}
        </div>
    )
}

const LightText = twx.div`md:text-base text-sm font-light text-[#141414] opacity-70` 