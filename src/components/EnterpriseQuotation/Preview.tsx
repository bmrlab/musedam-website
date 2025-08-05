"use client"
import { useQuotationContext } from '@/components/EnterpriseQuotation'
import { twx } from '@/utilities/cn'
import Image from 'next/image'
import { QuoteDetailData } from './QuoteDetailData'
import { useTranslation } from 'react-i18next'
import { FeatureList } from './FeaturList'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { getQuotation } from '@/endpoints/quotation'
import Loading from '../LandingPage/loading'
import { useToast } from '@/hooks/use-toast'
import html2pdf from 'html2pdf.js';
import { Button } from '../ui/button'
import { useLanguage } from '@/providers/Language'


const Table = twx.table`w-full text-xl mb-8 text-[#262626] font-normal`
const Th = twx.th`bg-[#F9FAFB] font-bold text-left px-6 py-3 border-b border-[#E1E1DC]`
const Td = twx.td`px-6 py-3 border-b border-[#E1E1DC] align-top`
const Tr = twx.tr``


type QuoteDetailDataById = Pick<QuoteDetailData, 'rows' | 'subtotal' | 'total'>


export const QuotationPreviewContent: FC<{ id: string, orgId?: string, userId?: string }> = (props) => {
    const { t } = useTranslation('quotation')
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

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
        activeTab,
        showFeatureList,
        setShowFeatureList,
        subscriptionYears,
        setFeatureView
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
        getQuotation(isGlobal ? 'global' : 'mainland',
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
                setQuoteNo(res.quotationNo ?? '')
                setGeneratedDay(res.createTime)
                setFeatureView(content.featureView)
                setShowFeatureList(content.showFeatureList)
                setQuoteInfo({
                    rows: content.rows,
                    subtotal: content.prefix + (content.subtotal / 100).toLocaleString(),
                    total: content.prefix + ((content.subtotal / 100) * subscriptionYears).toLocaleString(),
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
                <div className="mb-[30px] text-2xl font-bold">{t("product.service.details")}</div>

                {/* TODO 产品与服务明细表格 */}
                <PreviewDetailTable info={info} />
                {/* 服务条款 */}
                <div className="mt-[120px]">
                    <h3 className="mb-3 text-2xl font-bold text-[#141414]">{t("service.terms")}</h3>
                    <ul className="space-y-1 text-xl leading-[1.5em] text-[#262626]">
                        <li>{t('service.terms.1')}</li>
                        <li>{t('service.terms.2')}</li>
                        <li>{t('service.terms.3')}</li>
                        {activeTab === 'private' && (
                            <li>{t('service.terms.4')}</li>
                        )}
                    </ul>
                </div>
                {showFeatureList && <FeatureList />}
            </div>
        </div>
    )
}

const PreviewDetailTable: FC<{ info: QuoteDetailDataById }> = ({ info }) => {
    const { rows, subtotal, total } = info
    const { t } = useTranslation('quotation')

    // 分离主套餐行和模块行
    const mainRows = rows.filter(row => !row.isModule)
    const moduleRows = rows.filter(row => row.isModule)

    return (<div>
        <Table className='mb-[50px]'>
            <thead>
                <Tr>
                    <Th>{t("quite.product.name")}</Th>
                    <Th>{t("quite.product.quantity")}</Th>
                    <Th>{t("quite.product.unit.price")}</Th>
                    <Th className='text-right'>{t("subtotal")}</Th>
                </Tr>
            </thead>
            <tbody>
                {/* 主套餐 */}
                {mainRows.map((row, i) => (
                    <Tr key={i} >
                        <Td className={row.bold ? "font-bold" : ""}>{row.name}</Td>
                        <Td>{row.quantity}</Td>
                        <Td>{row.unit ?? '-'}</Td>
                        <Td className='text-right'>{row.subtotal ?? '-'}</Td>
                    </Tr>
                ))}

                {/* 模块行 */}
                {moduleRows.length > 0 && (
                    <>
                        <Tr>
                            <Td colSpan={4} className="!text-[20px] !font-bold">{t("advanced.modules")}</Td>
                        </Tr>
                        {moduleRows.map((row, i) => (
                            <Tr key={i}>
                                <Td>{row.name}</Td>
                                <Td>{row.quantity}</Td>
                                <Td>{row.unit ?? '-'}</Td>
                                <Td className='text-right'>{row.subtotal ?? '-'}</Td>
                            </Tr>
                        ))}
                    </>
                )}
            </tbody>
        </Table>

        <div className='flex w-full flex-col items-end'>
            {/* 小计/合计 */}
            <Td className='flex w-[540px] justify-between text-[22px] font-semibold leading-[34px]'>
                <div>{t("subtotal")}</div>
                <div>{subtotal}</div>
            </Td>
            <Td className='flex w-[540px] justify-between !border-none text-2xl font-bold'>
                <div>{t("total")}</div>
                <div>{total}</div>
            </Td>
        </div>
    </div>
    )
}

const LightText = twx.div`text-[16px] leading-[16px] font-light text-[#141414] opacity-70`
