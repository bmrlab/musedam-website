"use client"
import { useQuotationContext } from '@/components/EnterpriseQuotation'
import { twx } from '@/utilities/cn'
import Image from 'next/image'

const Table = twx.table`w-full text-xl mb-8 text-[#262626] font-normal`
const Th = twx.th`bg-[#F9FAFB] font-bold text-left px-6 py-3 border-b border-[#E1E1DC]`
const Td = twx.td`px-6 py-3 border-b border-[#E1E1DC] align-top`
const Tr = twx.tr``
const SectionTr = twx.tr`bg-[#F9FAFB] font-bold text-xl`

const moduleNames = {
    advancedFeatures: 'Advanced Features',
    customSystemHomepage: 'Custom System Homepage',
    approvalWorkflow: 'Approval Workflow',
    complianceCheck: 'Compliance Check',
    customMetadataFields: 'Custom Metadata Fields',
    watermark: 'Watermark',
    enterpriseSSO: 'Enterprise Single Sign-On (SSO)',
    customerService: 'Customer Service',
    professionalServices: 'Professional Services & Support',
}

const PreviewDetailTable = () => {
    const {
        activeTab,
        advancedConfig,
        advancedModules,
        privateConfig,
        privateModules,
        basicConfig,
        subscriptionYears,
    } = useQuotationContext()
    // 定价
    const pricing = require('./config').pricing
    // 类型声明
    type RowType = {
        name: React.ReactNode,
        quantity: string,
        unit: string,
        subtotal: string,
        bold?: boolean,
    }
    // 计算明细
    let rows: RowType[] = []
    let modulesRows: RowType[] = []
    let subtotal = 0
    if (activeTab === 'advanced') {
        // 主套餐
        rows.push({
            name: 'MuseDAM Enterprise Plan',
            quantity: `${subscriptionYears} year`,
            unit: '-',
            subtotal: '-',
            bold: true,
        })
        // Seats
        rows.push({
            name: <><div>Member Seats</div><div className="text-xs font-light text-[#888]">Admin, Contributor, and Member roles configurable</div></>,
            quantity: `${advancedConfig.memberSeats} seat`,
            unit: `$240/seat/year`,
            subtotal: `$${advancedConfig.memberSeats * 240}`,
        })
        subtotal += advancedConfig.memberSeats * 240
        // Storage
        rows.push({
            name: <><div>Storage Space</div><div className="text-xs font-light text-[#888]">Monthly download traffic follows storage size</div></>,
            quantity: `${advancedConfig.storageSpace} TB`,
            unit: `$1200/TB/year`,
            subtotal: `$${advancedConfig.storageSpace * 1200}`,
        })
        subtotal += advancedConfig.storageSpace * 1200
        // Advanced Modules
        modulesRows = Object.keys(advancedModules).filter(key => advancedModules[key]).map(key => {
            let price = pricing.advanced.modules[key]
            subtotal += price
            return {
                name: moduleNames[key],
                quantity: '1 year',
                unit: `$${price.toLocaleString()}/year`,
                subtotal: `$${price.toLocaleString()}`,
            }
        })
    }
    // TODO: 其他tab（如private）可按需补充
    return (<div>
        <Table className='mb-[50px]'>
            <thead>
                <Tr>
                    <Th>Product Name</Th>
                    <Th>Quantity</Th>
                    <Th>Unit Price</Th>
                    <Th className='text-right'>Subtotal</Th>
                </Tr>
            </thead>
            <tbody>
                {/* 主套餐 */}
                <SectionTr>
                    <Td colSpan={4} className="!bg-white !font-bold !text-[16px] py-2">MuseDAM Enterprise Plan</Td>
                </SectionTr>
                {rows.slice(1, 3).map((row, i) => (
                    <Tr key={i}>
                        <Td>{row.name}</Td>
                        <Td>{row.quantity}</Td>
                        <Td>{row.unit}</Td>
                        <Td className='text-right'>{row.subtotal}</Td>
                    </Tr>
                ))}
                {/* Advanced Modules */}
                <SectionTr>
                    <Td colSpan={4} className="!bg-white !font-bold !text-[16px] py-2">Advanced Modules</Td>
                </SectionTr>
                {modulesRows.map((row, i) => (
                    <Tr key={i}>
                        <Td>{row.name}</Td>
                        <Td>{row.quantity}</Td>
                        <Td>{row.unit}</Td>
                        <Td className='text-right'>{row.subtotal}</Td>
                    </Tr>
                ))}
            </tbody>
        </Table>

        <div className='w-full flex flex-col items-end'>
            {/* 小计/合计 */}
            <Td className='w-[540px] flex justify-between font-semibold text-[22px] leading-[34px]'>
                <div >Subtotal</div>
                <div>${subtotal.toLocaleString()}</div>
            </Td>
            <Td className='w-[540px] flex justify-between font-bold text-2xl !border-none'>
                <div >Total</div>
                <div>${subtotal.toLocaleString()}</div>
            </Td>
        </div>
    </div>
    )
}

const LightText = twx.div`text-[16px] leading-[16px] font-light text-[#141414] opacity-70`
export const QuotationPreviewContent = () => {
    const {
        customerInfo,
        activeTab,
        advancedConfig,
        advancedModules,
        privateConfig,
        privateModules,
        basicConfig,
        subscriptionYears,
    } = useQuotationContext()

    // 生成报价单号和日期
    const quoteNo = `MUSE${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })

    return (
        <div className="bg-white text-black min-h-screen flex flex-col items-center py-[120px] px-[100px]">
            <div className="w-full max-w-[1240px] bg-white rounded-xl">
                {/* 顶部Logo和标题 */}
                <div className="relative w-12 h-12">
                    <Image src="/assets/logo.svg" alt="Muse Logo" fill />
                </div>
                <div className="flex items-center justify-between mb-8 mt-2">
                    <div className="flex flex-col gap-2">
                        <div className="text-[48px] leading-[48px] font-bold">MuseDAM Quote</div>
                        <LightText >Quote No.: {quoteNo}</LightText>
                    </div>
                    <div className="text-right text-lg space-y-1">
                        <div className="font-bold leading-[22px]">Quote Date</div>
                        <div className='leading-[22px]'>{today}</div>
                        <LightText>Valid for 30 days</LightText>
                    </div>
                </div>
                {/* 客户信息和服务商信息 */}
                <div className="grid grid-cols-2 gap-4 bg-[#F9FAFB] p-6 mb-[50px] text-lg">
                    <div>
                        <div className="font-bold mb-3 text-5 leading-[22px]">Customer Information</div>
                        <div className="font-semibold">{customerInfo.company}</div>
                        <div className='text-[#141414] opacity-80'>{customerInfo.contact}</div>
                        {customerInfo.email && <div className='text-[#141414] opacity-80'>Email: {customerInfo.email}</div>}
                    </div>
                    <div>
                        <div className="font-bold mb-3 text-5 leading-[22px]">Service Provider</div>
                        <div className="font-semibold">Tezign (Shanghai) Information & Technology Co., Ltd.</div>
                        <div className='text-[#141414] opacity-80'>Contact: Account Manager</div>
                        <div className='text-[#141414] opacity-80'>Email: sales@musedam.cc</div>
                    </div>
                </div>
                <div className="text-[24px] font-bold mb-[30px]">Product and Service Details</div>

                {/* TODO 产品与服务明细表格 */}
                <PreviewDetailTable />
                {/* 服务条款 */}
                <div className="mt-[120px]">
                    <h3 className="mb-3 font-bold text-[#141414] text-2xl">Service Terms</h3>
                    <ul className="space-y-1 text-xl text-[#262626]">
                        <li>1. This quote is valid for 30 days.</li>
                        <li>2. Service begins upon contract signing and payment confirmation, valid for one year.</li>
                        <li>3. User seats, storage space, AI points and download traffic can be expanded based on actual business needs, with additional charges calculated according to the current service pricing.</li>
                        {activeTab === 'private' && (
                            <li>4. Storage space can be expanded as needed, with additional fees calculated according to current service pricing.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
} 