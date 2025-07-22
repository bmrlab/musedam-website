import { PropsWithLng } from '@/types/page'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { FC } from 'react'
import { pricing, BasicConfigs, AdvancedConfigs } from './config'
import { useQuotationContext } from './index'
import { cn, twx } from '@/utilities/cn'


const TableLine = twx.div`min-h-[44px] justify-between px-5 py-2 border-b-[#BFBFBB] border-b text-[14px] flex`

const QuoteDetailTable: FC = () => {
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
    // 计算总价逻辑同RightContent
    const calculateTotal = () => {
        if (activeTab === 'basic') {
            const memberCost = basicConfig.memberSeats * pricing.basic.memberSeatPrice
            const storageCost = basicConfig.storageSpace * pricing.basic.storageSpacePrice
            const aiCost = basicConfig.aiPoints * pricing.basic.aiPointsPrice
            return pricing.basic.baseCost + memberCost + storageCost + aiCost
        } else if (activeTab === 'advanced') {
            const memberCost = advancedConfig.memberSeats * pricing.advanced.memberSeatPrice
            const storageCost = advancedConfig.storageSpace * pricing.advanced.storageSpacePrice
            const aiCost = advancedConfig.aiPoints * pricing.advanced.aiPointsPrice
            let modulesCost = 0
            Object.keys(advancedModules).forEach(key => {
                if (advancedModules[key] && pricing.advanced.modules[key]) {
                    modulesCost += pricing.advanced.modules[key]
                }
            })
            return pricing.advanced.baseCost + memberCost + storageCost + aiCost + modulesCost
        } else if (activeTab === 'private') {
            const baseCost = privateConfig.licenseType === 'saas'
                ? pricing.private.saasBaseCost
                : pricing.private.perpetualBaseCost
            const memberCost = privateConfig.memberSeats * pricing.private.memberSeatPrice
            let modulesCost = 0
            Object.keys(privateModules).forEach(key => {
                if (privateModules[key] && pricing.private.modules[key]) {
                    if (key === 'operationMaintenance') {
                        modulesCost += pricing.private.modules[key] * privateModules.maintenanceYears
                    } else {
                        modulesCost += pricing.private.modules[key]
                    }
                }
            })
            return baseCost + memberCost + modulesCost
        }
        return 0
    }
    return (
        <div className={'w-full border border-[#BFBFBB]'}>
            <TableLine className={"text-lg font-bold bg-[#E1E1DC]"}>Product and Service Details</TableLine>
            <div className="text-sm">
                {activeTab === 'basic' && (
                    <>
                        <TableLine >
                            <span className='font-bold text-sm'>MuseDAM Basic Edition</span>
                            <span>{subscriptionYears} year(s)</span>
                        </TableLine>
                        {BasicConfigs.map(({ key, title, hint }) => (
                            <TableLine key={key}>
                                <div className='flex flex-col gap-[2px] text-[#262626] font-normal'>
                                    <span>
                                        {title}
                                        {' ('}
                                        <>{key === 'memberSeats' && `${basicConfig.memberSeats} seats`}
                                            {key === 'storageSpace' && `${basicConfig.storageSpace}GB`}
                                            {key === 'aiPoints' && `${4000 * basicConfig.aiPoints} points/month`}
                                        </>{')'}
                                    </span>
                                    {hint?.at(-1) && <span className='text-[#141414] font-light'>{hint.at(-1)}</span>}
                                </div>
                                <span>
                                    {key === 'memberSeats' && `$${basicConfig.memberSeats * pricing.basic.memberSeatPrice}/year`}
                                    {key === 'storageSpace' && `$${basicConfig.storageSpace * pricing.basic.storageSpacePrice}/year`}
                                    {key === 'aiPoints' && `$${Math.round(basicConfig.aiPoints * pricing.basic.aiPointsPrice)}/year`}
                                </span>
                            </TableLine>
                        ))}
                    </>
                )}
                {activeTab === 'advanced' && (
                    <>
                        <TableLine>
                            <span>MuseDAM Enterprise Edition</span>
                            <span>${subscriptionYears} year(s)</span>
                        </TableLine>
                        {AdvancedConfigs.map(({ key, title, hint }) => (
                            <TableLine key={key}>
                                <div className='flex flex-col gap-[2px] text-[#262626] font-normal'>
                                    <span>
                                        {title}
                                        {' ('}
                                        <>{key === 'memberSeats' && `${advancedConfig.memberSeats} seats`}
                                            {key === 'storageSpace' && `${advancedConfig.storageSpace}GB`}
                                            {key === 'aiPoints' && `${4000 * advancedConfig.aiPoints} points/month`}
                                        </>{')'}
                                    </span>
                                    {hint?.at(-1) && <span className='text-[#141414] font-light'>{hint.at(-1)}</span>}
                                </div>
                                <span>
                                    {key === 'memberSeats' && `$${advancedConfig.memberSeats * pricing.advanced.memberSeatPrice}/year`}
                                    {key === 'storageSpace' && `$${advancedConfig.storageSpace * pricing.advanced.storageSpacePrice}/year`}
                                    {key === 'aiPoints' && `$${Math.round(advancedConfig.aiPoints * pricing.advanced.aiPointsPrice)}/year`}
                                </span>
                            </TableLine>
                        ))}
                        <TableLine>
                            <h4 className="font-semibold ">Advanced Modules</h4>
                        </TableLine>
                        {Object.keys(advancedModules).map(key => {
                            if (advancedModules[key]) {
                                const moduleNames = {
                                    advancedFeatures: 'Advanced Features',
                                    customSystemHomepage: 'Custom System Homepage',
                                    approvalWorkflow: 'Approval Workflow',
                                    complianceCheck: 'Compliance Check',
                                    customMetadataFields: 'Custom Metadata Fields',
                                    watermark: 'Watermark',
                                    enterpriseSSO: 'Enterprise Single Sign-On (Feishu, Dingding)',
                                    customerService: 'Customer Service',
                                    professionalServices: 'Professional Services & Support'
                                }
                                return (
                                    <TableLine key={key} >
                                        <span>{moduleNames[key]}</span>
                                        <span>${pricing.advanced.modules[key]}/year</span>
                                    </TableLine>
                                )
                            }
                            return null
                        })}
                    </>
                )}
                {activeTab === 'private' && (
                    <>
                        <TableLine>
                            <span>MuseDAM Software License</span>
                            <span>${subscriptionYears} year(s)</span>
                        </TableLine>
                        <TableLine>
                            <span>Member Seats ({privateConfig.memberSeats} seats)</span>
                            <span>${privateConfig.memberSeats * pricing.private.memberSeatPrice}/year</span>
                        </TableLine>
                        <TableLine>
                            <h4 className="font-semibold">Advanced Modules</h4>
                        </TableLine>
                        {Object.keys(privateModules).filter(key => key !== 'privateImplementation' && key !== 'operationMaintenance' && key !== 'maintenanceYears').map(key => {
                            if (privateModules[key]) {
                                const moduleNames = {
                                    advancedFeatures: 'Advanced Features',
                                    customSystemHomepage: 'Custom System Homepage',
                                    approvalWorkflow: 'Approval Workflow',
                                    complianceCheck: 'Compliance Check',
                                    customMetadataFields: 'Custom Metadata Fields',
                                    watermark: 'Watermark',
                                    enterpriseSSO: 'Enterprise Single Sign-On (SSO)',
                                    customerService: 'Customer Service',
                                    professionalServices: 'Professional Services & Support'
                                }
                                return (
                                    <TableLine key={key}>
                                        <span>{moduleNames[key]}</span>
                                        <span>${pricing.private.modules[key]}/year</span>
                                    </TableLine>
                                )
                            }
                            return null
                        })}
                        {privateModules.privateImplementation && (
                            <TableLine >
                                <span>Private Deployment Implementation</span>
                                <span>${pricing.private.modules.privateImplementation}</span>
                            </TableLine>
                        )}
                        {privateModules.operationMaintenance && (
                            <TableLine >
                                <span>Operation and Maintenance ({privateModules.maintenanceYears} times/year)</span>
                                <span>${pricing.private.modules.operationMaintenance * privateModules.maintenanceYears}/year</span>
                            </TableLine>
                        )}
                    </>
                )}
                <TableLine className=" bg-[#E1E1DC] text-lg font-bold">
                    <span>Subtotal</span>
                    <span>${calculateTotal()}</span>
                </TableLine>
                <TableLine className="bg-[#E1E1DC] text-lg font-bold border-none">
                    <span>Total</span>
                    <span>${calculateTotal() * subscriptionYears}</span>
                </TableLine>
            </div>
        </div>
    )
}

export const RightContent: FC = () => {
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

    const expansions = [
        {
            name: 'Member Seats',
            description: 'Admin, Contributor, and Member roles configurable',
            value: '$300/seat/year'
        },

        {
            name: 'Storage Space',
            description: 'Monthly download traffic follows storage size',
            value: activeTab === 'basic' ? '1,000/TB' : '1,200/TB'
        },

        {
            name: 'AI Points Expansion',
            description: 'One-time permanent team AI points (valid until consumed);\n AI points can be used for manual AI search, tagging, parsing, and content creation',
            value: '1000\n /20,000 points'
        },

        {
            name: 'Download Data Expansion',
            description: 'Download data package (valid until consumed)',
            value: '30/TB'
        }
    ]

    return (
        <div className="no-scrollbar size-full overflow-scroll bg-[#F0F0EA] h-full p-[60px] text-black">
            <div className="space-y-6">
                <div className="text-[40px] font-semibold">MuseDAM Quote Overview</div>
                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="grid grid-cols-2 gap-4 font-semibold">
                        <div>
                            <div className="mb-3 text-base">Customer Information</div>
                            <div className="space-y-2 text-base " >
                                <p>{customerInfo.company}</p>
                                <p>{customerInfo.contact}</p>
                                {!!customerInfo.email.length && <p>Email: {customerInfo.email}</p>}
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 text-base ">Service Provider</div>
                            <div className="space-y-2 text-sm">
                                Tezign (Shanghai) Information & Technology Co., Ltd.
                            </div>
                        </div>
                    </div>

                    {/* Product and Service Details */}
                    <QuoteDetailTable />

                    {/* Service Terms */}
                    <div>
                        <h3 className="mb-3 font-bold text-[#141414] text-base">Service Terms</h3>
                        <ul className="space-y-1 text-sm text-[#262626]">
                            <li>1. This quote is valid for 30 days.</li>
                            <li>2. Service begins upon contract signing and payment confirmation, valid for one year.</li>
                            <li>3. User seats, storage space, AI points and download traffic can be expanded based on actual business needs, with additional charges calculated according to the current service pricing.</li>
                            {activeTab === 'private' && (
                                <li>4. Storage space can be expanded as needed, with additional fees calculated according to current service pricing.</li>
                            )}
                        </ul>
                    </div>

                    {/* Capacity Expansion */}
                    <div className='border'>
                        <div className="font-bold px-5 py-[10px] text-sm">Capacity Expansion</div>
                        <div className="space-y-2 text-sm">
                            {expansions.map(({ name, description, value }) => {
                                return <div className="flex justify-between border-t px-5 py-2" key={name}>
                                    <div className='flex flex-col gap-[2px]'>
                                        <span className=' font-euclid text-sm'>{name}</span>
                                        <span className='font-euclidlight text-xs whitespace-pre-line'>{description}</span>
                                    </div>
                                    <div className="whitespace-pre-line text-end">
                                        ${value}
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

