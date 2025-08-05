'use client'
import { LocaleSwitch } from '../Header/LocalSwitch'
import { LocaleLink } from '../LocalLink'
import Image from 'next/image'
import { FC, useCallback, useEffect, useState } from 'react'
import { TabEnum, useQuotationContext, ICustomerInfo, IAdvancedModules, IPrivateModules, EFeatureView } from './index'
import { usePricing, useBasicConfigs, useAdvancedConfigs } from './config'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Minus, Plus } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { cn, twx } from '@/utilities/cn'
import * as Switch from '@radix-ui/react-switch';
import { useTranslation } from '@/app/i18n/client'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { SessionUser } from '@/types/user'
import { saveQuotation } from '@/endpoints/quotation'
import { useQuoteDetailData } from './QuoteDetailData'
import { useLanguage } from '@/providers/Language'

interface NumControlProps {
    value: number,
    step?: number,
    max?: number,
    min?: number,
    onChange: (val: number) => void
}
const NumControl = ({ value, step, max, min, onChange }: NumControlProps) => {
    const [num, serNum] = useState(value)
    useEffect(() => {
        onChange(num)
    }, [num])

    return <div className="flex items-center space-x-2">
        <Button
            size="sm"
            variant="outline"
            onClick={() => {
                serNum(v => {
                    const newValue = v - (step ?? 1)
                    if (min !== undefined && newValue < min) {
                        return min
                    } else {
                        return newValue
                    }
                })
            }}
            className="size-6 rounded-full bg-white text-[#262626]"
        >
            <Minus className="size-4" />
        </Button>
        <span className="min-w-[50px] text-center text-white">{num}</span>
        <Button
            size="sm"
            variant="outline"
            onClick={() => {
                serNum(v => {
                    const newValue = v + (step ?? 1)
                    if (max !== undefined && newValue > max) {
                        return max
                    } else {
                        return newValue
                    }
                })
            }}
            className="size-6 rounded-full bg-white text-[#262626]"
        >
            <Plus className="size-4" />
        </Button>
    </div>
}


const TitleDiv = twx.h3`text-lg font-medium text-[rgba(255,255,255,0.72)] font-feature`

const BlockBox = twx.div`rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#141414] px-5 py-6 space-y-6`

const Cost = ({ cost, costTitle }: { cost: number, costTitle?: string }) => {
    const { t } = useTranslation('quotation')
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'
    const prefix = isGlobal ? '$' : '¥'
    return <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between text-white ">
            <Label className="text-lg font-normal">{costTitle ?? t("base.cost")}</Label>
            <span className="flex items-center text-xl font-medium">{prefix}{formatWithToLocaleString(cost)}<span className='text-sm'>/year</span></span>
        </div>
    </div>
}
export const LeftContent: FC<{ user: SessionUser }> = ({ user }) => {
    const { t } = useTranslation('quotation')
    const basicConfigs = useBasicConfigs()
    const advancedConfigs = useAdvancedConfigs()
    const { pricing, moduleNames } = usePricing()
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'
    const prefix = isGlobal ? '$' : '¥'
    const { toast } = useToast()
    const router = useRouter()
    const { language } = useLanguage()
    const { rows, subtotalNum, years } = useQuoteDetailData()

    const {
        customerInfo,
        setCustomerInfo,
        activeTab,
        setActiveTab,
        advancedConfig,
        setAdvancedConfig,
        advancedModules,
        setAdvancedModules,
        privateConfig,
        setPrivateConfig,
        privateModules,
        setPrivateModules,
        basicConfig,
        setBasicConfig,
        showFeatureList,
        setShowFeatureList,
        subscriptionYears,
        setSubscriptionYears,
        featureView,
        setFeatureView
    } = useQuotationContext()

    // 計算總價
    const calculateTotal = () => {
        if (activeTab === TabEnum.BASIC) {
            const memberCost = basicConfig.memberSeats * pricing.basic.memberSeatPrice
            const storageCost = basicConfig.storageSpace * pricing.basic.storageSpacePrice
            const aiCost = basicConfig.aiPoints * pricing.basic.aiPointsPrice
            return pricing.basic.baseCost + memberCost + storageCost + aiCost
        } else if (activeTab === TabEnum.ADVANCED) {
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
        } else if (activeTab === TabEnum.PRIVATE) {
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

    const tabs = [
        {
            key: TabEnum.BASIC,
            label: t('tab.basic')
        },
        {
            key: TabEnum.ADVANCED,
            label: t('tab.advanced')
        },
        // {
        //     key: TabEnum.PRIVATE,
        //     label:t('tab.private')
        // }
    ]


    // 更新數量
    const updateQuantity = (tab: TabEnum, field: string, value: number) => {
        if (tab === TabEnum.BASIC) {
            setBasicConfig({
                ...basicConfig,
                [field]: Math.max(0, value)
            })
        } else if (tab === TabEnum.ADVANCED) {
            setAdvancedConfig({
                ...advancedConfig,
                [field]: Math.max(0, value)
            })
        } else if (tab === TabEnum.PRIVATE) {
            setPrivateConfig({
                ...privateConfig,
                [field]: Math.max(0, value)
            })
        }
    }

    // 處理輸入變化
    const handleInputChange = (field: keyof ICustomerInfo, value: string) => {
        setCustomerInfo({
            ...customerInfo,
            [field]: value
        })
    }

    // 處理模組勾選
    const handleModuleChange = (tab: TabEnum, module: keyof IAdvancedModules | keyof IPrivateModules, checked: boolean) => {
        if (tab === TabEnum.ADVANCED) {
            setAdvancedModules({
                ...advancedModules,
                [module]: checked
            })
        } else if (tab === TabEnum.PRIVATE) {
            setPrivateModules({
                ...privateModules,
                [module]: checked
            })
        }
    }

    const formInfo = [
        {
            id: 'company',
            label: t("customer.company"),
            required: true
        }, {
            id: 'contact',
            label: t("customer.contact")
        }, {
            id: 'email',
            label: t("customer.email")
        }, {
            id: 'yourEmail',
            label: t("your.email"),
            required: true
        }
    ]
    const allModules = Object.keys(moduleNames).map((key) => {
        return { key: key, label: moduleNames[key], price: pricing.advanced.modules[key] }
    })

    const handleGenerate = useCallback(async () => {
        if (!user.orgId || !user.token) {
            toast({
                duration: 2000,
                description: '您当前所在的团队无生成报价单权限',
            })
            return
        }
        let content = {
            rows: rows,
            showFeatureList: showFeatureList,
            lang: language
        }
        if (showFeatureList) {
            content['featureView'] = featureView
        }
        try {
            const id = await saveQuotation(isGlobal ? 'global' : 'mainland', {
                userId: user.userId,
                orgId: user.orgId,
                token: user.token,
            }, {
                customerContact: customerInfo.contact,
                contactEmail: customerInfo.yourEmail,
                customerEmail: customerInfo.email,
                customerCompany: customerInfo.company,
                annualPrice: Math.round(subtotalNum * 100),
                content: JSON.stringify(content),
                subscriptionYears: years,
            })
            router.push(`${window.location.pathname}/${id}`)
        } catch (err) {
            toast({
                description: err.message ?? '报价单保存失败',
                duration: 2000
            })
        }
    }, [customerInfo, subtotalNum, showFeatureList, rows, years, featureView, user, language])

    return (
        <div className="no-scrollbar h-full overflow-scroll bg-black pb-20 text-white">
            <div className='sticky top-0 flex items-center justify-between p-5 pr-[60px]'>
                <div className="shrink-0 px-4">
                    <LocaleLink href="/">
                        <div className="relative size-9">
                            <Image src="/assets/logo-dark.svg" fill alt="muse logo" />
                        </div>
                    </LocaleLink>
                </div>
                <LocaleSwitch />
            </div>

            <div className='quote-form px-[60px]'>
                <h1 className='md:text-[64px]'>{t('title')}</h1>
                <div className='mt-2 text-[18px] font-light text-[rgba(255,255,255,0.72)]'>{t('subtitle')}</div>
            </div>

            <div className="mt-10 space-y-10 px-[60px] text-[rgba(255,255,255,0.72)]">
                {/* 客戶資訊 */}
                <div className="grid grid-cols-2 gap-4">
                    {formInfo.map(({ id, label, required }) => {
                        return <div className="col-span-1 space-y-3" key={id}>
                            <Label htmlFor="company" className={cn("text-sm font-medium", required && '')}>
                                {required && <span className="mr-1 ">*</span>}
                                {label}
                            </Label>
                            <Input
                                id={id}
                                placeholder={t('placeholder.company')}
                                value={customerInfo[id as keyof ICustomerInfo]}
                                onChange={(e) => handleInputChange(id as keyof ICustomerInfo, e.target.value)}
                                className=" h-[44px] rounded-none border-[rgba(255,255,255,0.2)] font-medium text-white"
                            />
                        </div>
                    })}
                </div>

                {/* 部署類型選擇 */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="h-[46px] w-fit rounded-[26px] border border-[rgba(255,255,255,0.2)] bg-[#141414] p-1">
                        {tabs.map(({ key, label }) => {
                            const isActive = activeTab === key
                            return <TabsTrigger
                                value={key}
                                className={cn("h-full rounded-[26px] border border-transparent px-[14px]",
                                    isActive && 'border-white text-white'
                                )}
                                key={key}
                            >
                                {label}
                            </TabsTrigger>
                        }
                        )}
                    </TabsList>

                    {/* Basic Tab */}
                    <TabsContent value="basic" className="mt-6 space-y-4">
                        <BlockBox>
                            <div className="flex w-full items-center justify-between space-x-2">
                                <div>
                                    <Label className="text-white">{t('basic.plan')}</Label>
                                    <p className="text-sm text-gray-500">{t('by.year')}</p>
                                </div>
                                <NumControl value={subscriptionYears} onChange={setSubscriptionYears} min={1} />
                            </div>
                            {basicConfigs.map(({ title, hint, des, key, min }) => {
                                return <div className="flex w-full items-center justify-between space-x-2" key={key}>
                                    <div>
                                        <Label className="mb-[6px] text-[16px] text-white">{title}</Label>
                                        {hint.map((item, i) => <p className=" text-xs text-gray-500" key={`hint${i}`}>{item}</p>)}
                                        <p className="text-sm text-[rgba(255,255,255,0.72)]">{des}</p>
                                    </div>
                                    <NumControl value={basicConfig[key]} onChange={(val) => {
                                        updateQuantity(TabEnum.BASIC, key, val)
                                    }} min={min} />
                                </div>
                            })}

                            {/* Base Cost */}
                            <Cost cost={calculateTotal()} />
                        </BlockBox>
                    </TabsContent>

                    {/* Advanced Tab */}
                    <TabsContent value="advanced" className="mt-6 space-y-4">
                        <BlockBox>
                            <div className="flex w-full items-center justify-between space-x-2">
                                <div>
                                    <Label className="text-white">{t('advanced.plan')}</Label>
                                    <p className="text-sm text-gray-500">{t('by.year')}</p>
                                </div>
                                <NumControl value={subscriptionYears} onChange={setSubscriptionYears} min={1} />
                            </div>
                            {advancedConfigs.map(({ title, hint, des, key, min }) => {
                                return <div className="flex w-full items-center justify-between space-x-2" key={key}>
                                    <div>
                                        <Label className="mb-[6px] text-[16px] text-white">{title}</Label>
                                        {hint.map((item, i) => <p className=" text-xs text-gray-500" key={`hint${i}`}>{item}</p>)}
                                        <p className="text-sm text-[rgba(255,255,255,0.72)]">
                                            {des}
                                        </p>
                                    </div>
                                    <NumControl value={advancedConfig[key]} onChange={(val) => {
                                        updateQuantity(TabEnum.ADVANCED, key, val)
                                    }} min={min} />
                                </div>
                            })}

                            {/* Base Cost */}
                            <Cost
                                cost={Math.round(pricing.advanced.baseCost + advancedConfig.memberSeats * pricing.advanced.memberSeatPrice + advancedConfig.storageSpace * pricing.advanced.storageSpacePrice + advancedConfig.aiPoints * pricing.advanced.aiPointsPrice)}
                            />
                        </BlockBox>

                        {/* 高级模块 */}
                        <div className="space-y-4">
                            <TitleDiv>{t('advanced.modules')}</TitleDiv>
                            <BlockBox >
                                {allModules.map((module) => (
                                    <div key={module.key} className="flex items-center justify-between">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id={module.key}
                                                checked={!!advancedModules[module.key]}
                                                onCheckedChange={(checked) => handleModuleChange(TabEnum.ADVANCED, module.key as keyof IAdvancedModules, checked as boolean)}
                                                className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                            />
                                            <div>
                                                <div className="mb-[6px] text-[16px] text-white" >{module.label}</div>
                                                <p className="text-xs text-gray-500">{prefix}{formatWithToLocaleString(module.price)}{t("per.year")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}


                                {/* Advanced Cost */}
                                <Cost cost={Object.keys(advancedModules).reduce((total, key) => {
                                    return total + (advancedModules[key] ? pricing.advanced.modules[key] : 0)
                                }, 0)}
                                    costTitle={t('advanced.cost')} />
                            </BlockBox>
                        </div>
                    </TabsContent>

                    {/* Private Deployment Tab */}
                    <TabsContent value="private" className="mt-6 space-y-4">
                        {/* License Type Selection */}
                        <div className="space-y-4">
                            <TitleDiv>{t('museDAMSoftware')}</TitleDiv>
                            <RadioGroup.Root
                                value={privateConfig.licenseType}
                                className='space-y-3'
                            >
                                {['saas', 'perpetual'].map((type) => {
                                    return (
                                        <BlockBox className="flex w-full items-center space-x-2 space-y-0" key={type}>
                                            <RadioGroup.Item
                                                className={cn(
                                                    'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300 ',
                                                    'transition-all duration-300 ease-in-out hover:border-[#3366FF]',
                                                    type === privateConfig.licenseType && 'border-[#3366FF]',
                                                )}
                                                value={type}
                                                id={type}
                                                onClick={() => {
                                                    setPrivateConfig({ ...privateConfig, licenseType: type as 'saas' | 'perpetual' })
                                                }}
                                            >
                                                <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                                            </RadioGroup.Item>
                                            <Label htmlFor={type} className="font-normal text-white">
                                                {type === 'saas' ? t('saasStandardEnterpriseEdition') : t('perpetualLicenseCurrentStandardEnterpriseEdition')}
                                            </Label>
                                        </BlockBox>
                                    )
                                })}
                            </RadioGroup.Root>

                            {/* Member Seats */}
                            <BlockBox >
                                <div className="flex w-full items-center justify-between space-x-2 space-y-0">
                                    <div>
                                        <Label className="mb-[6px] text-[16px] text-white">{t('member.seat')}</Label>
                                        <p className=" text-xs text-gray-500" >{t('adminContributorAndMemberRolesConfigurable')}</p>
                                        <p className="text-sm text-[rgba(255,255,255,0.72)]">{t('memberSeatPrice')}</p>
                                    </div>
                                    <NumControl value={privateConfig.memberSeats} onChange={(val) => {
                                        updateQuantity(TabEnum.PRIVATE, 'memberSeats', val)
                                    }} />
                                </div>
                                {/* Base Cost */}
                                <Cost cost={(privateConfig.licenseType === 'saas' ? pricing.private.saasBaseCost : pricing.private.perpetualBaseCost) + privateConfig.memberSeats * pricing.private.memberSeatPrice} />
                            </BlockBox>
                        </div>
                        {/* Advanced Modules */}
                        <div className="space-y-4">
                            <TitleDiv>{t('advanced.modules')}</TitleDiv>
                            <BlockBox>
                                {allModules.map((module) => (
                                    <div key={module.key} className="flex items-center justify-between">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id={`private-${module.key}`}
                                                checked={!!privateModules[module.key]}
                                                onCheckedChange={(checked) => handleModuleChange(TabEnum.PRIVATE, module.key as keyof IPrivateModules, checked as boolean)}
                                                className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                            />
                                            <div>
                                                <div className="mb-[6px] text-[16px] text-white" >{module.label}</div>
                                                <p className="text-xs text-gray-500">{prefix}{formatWithToLocaleString(module.price)}{t("per.year")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Advanced Cost */}
                                <Cost
                                    cost={Object.keys(privateModules).filter(key => key !== 'privateImplementation' && key !== 'operationMaintenance' && key !== 'maintenanceYears').reduce((total, key) => {
                                        return total + (privateModules[key] ? pricing.private.modules[key] : 0)
                                    }, 0)}
                                    costTitle={t('advancedCost')} />
                            </BlockBox>
                        </div>
                        {/* Implementation */}
                        <div className="space-y-4">
                            <TitleDiv>{t('implementation')}</TitleDiv>
                            <BlockBox>
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="privateImplementation"
                                        checked={!!privateModules.privateImplementation}
                                        onCheckedChange={(checked) => handleModuleChange(TabEnum.PRIVATE, 'privateImplementation', checked as boolean)}
                                        className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <div>
                                        <div className="mb-[6px] text-[16px] text-white" >{t('privateDeploymentImplementation')}</div>
                                        <p className="text-xs text-gray-500">{t('privateDeploymentImplementationDescription')}</p>
                                        <p className="text-xs text-gray-500">{prefix}{pricing.private.modules.privateImplementation}/{t('implementation')}</p>
                                    </div>
                                </div>

                                {/* Implementation Cost */}
                                <Cost costTitle={t('implementationCost')} cost={privateModules.privateImplementation ? pricing.private.modules.privateImplementation : 0} />
                            </BlockBox>
                        </div>

                        {/* Operation and Maintenance */}
                        <div className="space-y-4">
                            <TitleDiv>{t('operation.maintenance')}</TitleDiv>
                            <BlockBox>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start space-x-2">
                                        <Checkbox
                                            id="operationMaintenance"
                                            checked={!!privateModules.operationMaintenance}
                                            onCheckedChange={(checked) => handleModuleChange(TabEnum.PRIVATE, 'operationMaintenance', checked as boolean)}
                                            className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                        />
                                        <div>
                                            <div className="mb-[6px] text-[16px] text-white" >{t('productOperationAndMaintenanceServices')}</div>
                                            <p className="text-xs text-gray-500">{t('productOperationAndMaintenanceServicesDescription')}</p>
                                        </div>
                                    </div>
                                </div>

                                {privateModules.operationMaintenance && (
                                    <div className="ml-6 space-y-2">
                                        <Label className="text-base text-white">{t('privateEditionMajorIterations')}</Label>
                                        <p className="text-xs text-gray-500">{t('privateEditionMajorIterationsDescription')}</p>
                                        <p className="text-sm text-[rgba(255,255,255,0.72)]">{t('privateEditionMajorIterationsPrice')}</p>
                                        <RadioGroup.Root
                                            value={privateModules.maintenanceYears.toString()}
                                            onValueChange={(value) => setPrivateModules({ ...privateModules, maintenanceYears: parseInt(value) })}
                                            className="mt-3 flex space-x-4"
                                        >

                                            {['2', '4', '6'].map((timeNum) => {
                                                const isActive = timeNum === privateModules.maintenanceYears.toString()
                                                return (
                                                    <div className="flex h-[20px] flex-1 items-center gap-3 " key={timeNum}>
                                                        <RadioGroup.Item
                                                            className={cn(
                                                                'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300',
                                                                'transition-all duration-300 ease-in-out hover:border-[#3366FF]',
                                                                isActive && 'border-[#3366FF]',
                                                            )}
                                                            value={timeNum}
                                                            id={timeNum}
                                                            onClick={() => {
                                                                setPrivateModules({ ...privateModules, maintenanceYears: parseInt(timeNum) })
                                                            }}
                                                        >
                                                            <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                                                        </RadioGroup.Item>
                                                        <Label htmlFor={timeNum} className="text-white">
                                                            {timeNum + ' ' + t('timesPerYear')}
                                                        </Label>
                                                    </div>
                                                )
                                            })}
                                        </RadioGroup.Root>
                                    </div>
                                )}
                                {/* Service Cost */}
                                <Cost cost={privateModules.operationMaintenance ? pricing.private.modules.operationMaintenance * privateModules.maintenanceYears : 0} costTitle={t('serviceCost')} />
                            </BlockBox>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Show Feature List */}
                <div className="space-y-5">
                    <div className='flex items-center justify-between'>
                        <TitleDiv>{t('feature.list')}</TitleDiv>
                        <Switch.Root checked={showFeatureList} onCheckedChange={setShowFeatureList}
                            className={cn("bg-blackA9 relative h-[22px] w-[44px] cursor-pointer rounded-full outline-none  disabled:cursor-not-allowed ",
                                !showFeatureList ? ' bg-[rgb(91,86,80)]' : 'data-[state=checked]:bg-[#3366FF]'
                            )}
                        >
                            <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
                        </Switch.Root>

                    </div>

                    <RadioGroup.Root
                        className="flex h-[68px] gap-6"
                        defaultValue={featureView}
                    >
                        {[EFeatureView.OVERVIEW, EFeatureView.DETAIL].map((listType) => {
                            return (
                                <BlockBox className="flex h-full flex-1 items-center space-x-2 space-y-0" key={listType}>
                                    <RadioGroup.Item
                                        className={cn(
                                            'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300 ',
                                            'transition-all duration-300 ease-in-out hover:border-[#3366FF]',
                                            listType === featureView && 'border-[#3366FF]',
                                        )}
                                        value={listType}
                                        id={listType}
                                        onClick={() => {
                                            setFeatureView(listType)
                                        }}
                                    >
                                        <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                                    </RadioGroup.Item>
                                    <Label htmlFor={listType} className="text-white">
                                        {listType === 'overview' ? t('feature.overview') : t('feature.details')}
                                    </Label>
                                </BlockBox>
                            )
                        })}
                    </RadioGroup.Root>
                </div>
            </div>

            {/* Generate Button */}
            <Button
                className="ml-[60px] mt-10 h-[48px] w-[165px] rounded-lg bg-white text-lg font-medium text-[#0e0e0e] transition-all duration-300 ease-in-out hover:bg-[ragb(255,255,255,0.6)]"
                onClick={() => {
                    if (!customerInfo['company']?.length || !customerInfo['yourEmail']?.length) {
                        toast({
                            duration: 800,
                            description: t("form.required"),
                        })
                        return;
                    }
                    handleGenerate()
                }}
            >
                {t('generate.now')}
            </Button>
        </div >
    )
}
