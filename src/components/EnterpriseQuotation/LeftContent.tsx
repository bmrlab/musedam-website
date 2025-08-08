'use client'
import { LocaleSwitch } from '../Header/LocalSwitch'
import { LocaleLink } from '../LocalLink'
import Image from 'next/image'
import { FC, useCallback, useEffect, useState } from 'react'
import { TabEnum, useQuotationContext, ICustomerInfo, IAdvancedModules, IPrivateModules, EFeatureView } from './index'
import { usePricing, useBasicConfigs, useAdvancedConfigs, EAdvancedModules, EPrivateModules } from './config'
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
    disabled?: boolean
}


const NumControl = ({ value, step, max, min, onChange, disabled }: NumControlProps) => {

    const minDisabled = Boolean(disabled || value === min)
    const maxDisabled = Boolean(disabled || value === max)

    return <div className="flex items-center space-x-2">
        <Button
            size="sm"
            variant="outline"
            disabled={minDisabled}
            onClick={() => {
                if (minDisabled) return
                onChange(value - (step ?? 1))
            }}
            className={cn("size-6 rounded-full bg-white text-[#262626] disabled:cursor-not-allowed",
                minDisabled && 'border border-[rgba(197,206,224,0.2)] bg-[#414141]'
            )}
        >
            <Minus className="size-4" />
        </Button>
        <span className="min-w-[50px] text-center text-white">{value}</span>
        <Button
            size="sm"
            variant="outline"
            disabled={maxDisabled}
            onClick={() => {
                if (maxDisabled) return
                onChange(value + (step ?? 1))
            }}
            className={cn("size-6 rounded-full bg-white text-[#262626] disabled:cursor-not-allowed",
                maxDisabled && 'border border-[rgba(197,206,224,0.2)] bg-[#414141]'
            )}
        >
            <Plus className="size-4" />
        </Button>
    </div>
}


const TitleDiv = twx.h3`text-lg font-medium text-white-72 font-feature`

const BlockBox = twx.div`rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#141414] px-5 py-6 space-y-6`

const Label = twx.div`text-base leading-none text-white`

const HintParagraph = twx.p`text-xs text-white-50 font-light`

const DesParagraph = twx.p`text-sm text-white-72 font-light`


const Cost = ({ cost, costTitle }: { cost: number, costTitle?: string }) => {
    const { t } = useTranslation('quotation')
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'
    const prefix = isGlobal ? '$' : '¥'
    return <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between text-white ">
            <Label className=" text-lg font-normal">{costTitle ?? t("base.cost")}</Label>
            <span className="flex items-center text-xl font-medium">{prefix}{formatWithToLocaleString(cost)}<span className='text-sm'>/year</span></span>
        </div>
    </div>
}
export const LeftContent: FC<{ user?: SessionUser }> = ({ user }) => {
    const { t } = useTranslation('quotation')
    const basicConfigs = useBasicConfigs()
    const advancedConfigs = useAdvancedConfigs()
    const { pricing } = usePricing()
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'
    const prefix = isGlobal ? '$' : '¥'
    const { toast } = useToast()
    const router = useRouter()
    const { language } = useLanguage()

    const { rows, totalNumPerYear, years, basicCostPerYear, subtotal, total, discountTotal } = useQuoteDetailData()
    const advancedPricing = pricing.advanced.modules
    const [openDiscount, setOpenDiscount] = useState(false)

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
        subscriptionYears,
        setSubscriptionYears,
        featureView,
        setFeatureView,
        discount,
        setDiscount,
        showNoBuyFeature,
        setShowNoBuyFeature
    } = useQuotationContext()

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
    const handleModuleChange = (tab: TabEnum, module: keyof IAdvancedModules | keyof IPrivateModules, checked: boolean | number) => {
        if (tab === TabEnum.ADVANCED) {
            setAdvancedModules((st) => ({
                ...st,
                [module]: checked
            }))
        } else if (tab === TabEnum.PRIVATE) {
            setPrivateModules((st) => ({
                ...st,
                [module]: checked
            }))
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

    const handleGenerate = useCallback(async () => {
        if (!user?.orgId || !user.token) {
            toast({
                duration: 2000,
                description: '您当前所在的团队无生成报价单权限',
            })
            return
        }
        let content = {
            rows,
            prefix,
            featureView,
            showNoBuyFeature,
            lang: language,
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
                annualPrice: Math.round(totalNumPerYear * 100),
                content: JSON.stringify(content),
                discount: discount,
                subscriptionYears: years,
            })
            router.push(`${window.location.pathname}/${id}`)
        } catch (err) {
            toast({
                description: err.message ?? '报价单保存失败',
                duration: 2000
            })
        }
    }, [user, rows, prefix, featureView, showNoBuyFeature, language, toast, isGlobal, customerInfo, totalNumPerYear, discount, years, router])


    const renderBasics = () => {
        const planName = {
            [TabEnum.BASIC]: t('basic.plan'),
            [TabEnum.ADVANCED]: t('advanced.plan'),
            [TabEnum.PRIVATE]: t('private.plan')
        }
        return <BlockBox>
            <div className="flex w-full items-center justify-between space-x-2">
                <div className='space-y-[6px]'>
                    <Label className="text-white">{planName[activeTab]}</Label>
                    <p className="text-sm text-gray-500">{t('by.year')}</p>
                </div>
                <NumControl value={subscriptionYears} onChange={setSubscriptionYears} min={1} />
            </div>
            {basicConfigs.map(({ title, hint, des, key, min, tag }) => {
                return <div className="flex w-full items-center justify-between space-x-2" key={key}>
                    <div className='space-y-[6px]'>
                        <Label className="flex items-center gap-3 text-[16px] text-white">
                            {title}
                            {tag &&
                                <div className='flex h-6 items-center justify-center rounded-sm border border-[rgba(255,255,255,0.2)] px-[6px] text-[14px] font-light'>
                                    {tag}
                                </div>
                            }
                        </Label>
                        <div className='space-y-0'>{hint.map((item, i) => <HintParagraph key={`hint${i}`}>{item}</HintParagraph>)}</div>
                        <DesParagraph>{des}</DesParagraph>
                    </div>
                    <NumControl
                        value={activeTab === TabEnum.BASIC ? basicConfig[key] : advancedConfig[key]}
                        onChange={(val) => {
                            updateQuantity(activeTab, key, val)
                        }}
                        min={min}
                    />
                </div>
            })}

            {/* Base Cost */}
            <Cost cost={basicCostPerYear} />
        </BlockBox>
    }


    const renderModuleItem = (module: typeof advancedConfigs[number]) => {
        const { key, min, unit } = module
        return <div key={key} className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
                <Checkbox
                    disabled={module.disabled}
                    id={key}
                    checked={!!advancedModules[key]}
                    onCheckedChange={(checked: boolean) => {
                        handleModuleChange(TabEnum.ADVANCED, module.key, min !== undefined ? (checked ? min : 0) : checked)
                        if (module.subModules?.length) {
                            module.subModules.map((v) => {
                                if (v.disabled) {
                                    handleModuleChange(TabEnum.ADVANCED,
                                        v.key,
                                        v.min !== undefined ? (checked ? v.min : 0) : checked
                                    )
                                }
                            })
                        }
                    }}
                    className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <div className='space-y-[6px]'>
                    <Label >{module.label}</Label>
                    {module.hint && <HintParagraph>{module.hint}</HintParagraph>}
                    {!module.noPrice && <DesParagraph >{prefix}{' '}{formatWithToLocaleString(module.price ?? 0)}{unit ?? t("per.year")}</DesParagraph>}
                </div>
            </div>

            {typeof advancedModules[key] === 'number' &&
                <NumControl
                    key={advancedModules[key]}
                    value={advancedModules[key] as number}
                    onChange={(val) => {
                        handleModuleChange(TabEnum.ADVANCED, key, val)
                    }}
                    disabled={!advancedModules[key]}
                    min={min}
                />}
        </div>
    }

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
                <div className='mt-2 text-[18px] font-light text-white-72'>{t('subtitle')}</div>
            </div>

            <div className="mt-10 space-y-10 px-[60px] text-white-72">
                {/* 客戶資訊 */}
                <div className="grid grid-cols-2 gap-4">
                    {formInfo.map(({ id, label, required }) => {
                        return <div className="col-span-1 space-y-3" key={id}>
                            <Label className={cn("text-sm font-medium", required && '')}>
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

                {/* 套餐类型选择 */}
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
                        {renderBasics()}
                    </TabsContent>

                    {/* 高级版 */}
                    <TabsContent value="advanced" className="mt-6 space-y-4">
                        {/* 基础模块 */}
                        {renderBasics()}

                        {/* 高级版 - 高级模块  */}
                        <div className="space-y-4">
                            <TitleDiv>{t('advanced.modules')}</TitleDiv>
                            <BlockBox >
                                {advancedConfigs.map((module) => (
                                    <div key={module.key} className="">
                                        {renderModuleItem(module)}
                                        {!!module.subModules?.length && <div className={cn(
                                            'ml-[26px]',
                                            module.subFlex === 'row' ? 'mt-3 flex items-center gap-[40px]' : 'mt-[6px] space-y-[6px]'
                                        )}>
                                            {
                                                module.subModules?.map((v) => {
                                                    return renderModuleItem(v)
                                                })
                                            }
                                        </div>}
                                    </div>
                                ))}

                                {/* Advanced Cost */}
                                <Cost
                                    cost={
                                        Object.keys(advancedModules).filter((v) => !!advancedModules[v]).reduce((total, key) => {
                                            const value = advancedModules[key];
                                            const price = advancedPricing[key]
                                            if (!price) return total
                                            return total + price * (typeof value === 'number' ? value : 1)
                                        }, 0)
                                    }
                                    costTitle={t('advanced.cost')}
                                />
                            </BlockBox>
                        </div>
                    </TabsContent>

                    {/* 私有化版-暂时没有 */}
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
                                            <Label className="font-normal text-white">
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
                                        <Label>{t('member.seat')}</Label>
                                        <HintParagraph >{t('adminContributorAndMemberRolesConfigurable')}</HintParagraph>
                                        <DesParagraph>{t('memberSeatPrice')}</DesParagraph>
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
                                {advancedConfigs.map((module) => (
                                    <div key={module.key} className="flex items-center justify-between">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id={`private-${module.key}`}
                                                checked={!!privateModules[module.key]}
                                                onCheckedChange={(checked) => handleModuleChange(TabEnum.PRIVATE, module.key as keyof IPrivateModules, checked as boolean)}
                                                className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                            />
                                            <div className='space-y-[6px]'>
                                                <div >{module.label}</div>
                                                <HintParagraph>{prefix}{formatWithToLocaleString(module.price)}{t("per.year")}</HintParagraph>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Advanced Cost */}
                                <Cost
                                    cost={Object.keys(privateModules).filter(key => key !== EPrivateModules.PRIVATE_IMPLEMENTATION && key !== EPrivateModules.OPERATION_MAINTENANCE && key !== 'maintenanceYears').reduce((total, key) => {
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
                                        onCheckedChange={(checked) => handleModuleChange(TabEnum.PRIVATE, EPrivateModules.PRIVATE_IMPLEMENTATION, checked as boolean)}
                                        className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                    <div className='space-y-[6px]'>
                                        <Label>{t('privateDeploymentImplementation')}</Label>
                                        <HintParagraph>
                                            {t('privateDeploymentImplementationDescription')}
                                            <br />
                                            {prefix}{pricing.private.modules.privateImplementation}/{t('implementation')}
                                        </HintParagraph>
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
                                            onCheckedChange={(checked) => handleModuleChange(TabEnum.PRIVATE, EPrivateModules.OPERATION_MAINTENANCE, checked as boolean)}
                                            className="mt-1 size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                        />
                                        <div className='space-y-[6px]'>
                                            <Label>{t('productOperationAndMaintenanceServices')}</Label>
                                            <HintParagraph>{t('productOperationAndMaintenanceServicesDescription')}</HintParagraph>
                                        </div>
                                    </div>
                                </div>

                                {privateModules.operationMaintenance && (
                                    <div className="ml-6 space-y-2">
                                        <Label className="text-base text-white">{t('privateEditionMajorIterations')}</Label>
                                        <HintParagraph>{t('privateEditionMajorIterationsDescription')}</HintParagraph>
                                        <DesParagraph>{t('privateEditionMajorIterationsPrice')}</DesParagraph>
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
                                                        <Label className="text-white">
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



                {/* 优惠设置 */}
                <div className="space-y-5">
                    <div className='flex items-center justify-between'>
                        <TitleDiv>优惠设置</TitleDiv>
                        <Switch.Root
                            checked={openDiscount}
                            onCheckedChange={(open) => {
                                if (open) {
                                    setDiscount(9.5)
                                } else {
                                    setDiscount(undefined)
                                }
                                setOpenDiscount(open)
                            }
                            }
                            className={cn("bg-blackA9 relative h-[22px] w-[44px] cursor-pointer rounded-full outline-none  disabled:cursor-not-allowed ",
                                !openDiscount ? ' bg-[rgb(91,86,80)]' : 'data-[state=checked]:bg-[#3366FF]'
                            )}
                        >
                            <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
                        </Switch.Root>
                    </div>

                    {openDiscount && <BlockBox className='flex items-center justify-between space-y-0'>
                        <div className='space-y-[6px]'>
                            <Label>
                                请输入折扣数值
                            </Label>
                            <DesParagraph>最低折扣不得低于 8 折</DesParagraph>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <Input
                                value={discount}
                                type='number'
                                onChange={(e) => {
                                    const val = Math.floor(Number(e.target.value))
                                    setDiscount(val >= 8 ? val : 8)
                                }}
                                className="h-[44px] w-[115px] rounded-none border-[rgba(255,255,255,0.2)] font-medium text-white"
                            />
                            <span className='text-base'>折</span>
                        </div>
                    </BlockBox>}
                </div>

                {/* 功能明细展示 */}
                <div className="space-y-5">
                    <TitleDiv>{t('feature.list')}</TitleDiv>
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
                                    <Label className="text-white">
                                        {listType === EFeatureView.OVERVIEW ? t('feature.overview') : t('feature.details')}
                                    </Label>
                                </BlockBox>
                            )
                        })}
                    </RadioGroup.Root>
                </div>

                {/* 未选模块报价 */}
                <div className="space-y-5">
                    <TitleDiv>未选模块报价</TitleDiv>
                    <RadioGroup.Root
                        className="flex h-[68px] gap-6"
                        defaultValue={showNoBuyFeature.toString()}
                    >
                        {[false, true].map((radio) => {
                            return (
                                <BlockBox className="flex h-full flex-1 items-center space-x-2 space-y-0" key={radio + 'feature--all'}>
                                    <RadioGroup.Item
                                        className={cn(
                                            'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300 ',
                                            'transition-all duration-300 ease-in-out hover:border-[#3366FF]',
                                            showNoBuyFeature === radio && 'border-[#3366FF]',
                                        )}
                                        value={radio.toString()}
                                        id={radio.toString()}
                                        onClick={() => {
                                            setShowNoBuyFeature(radio)
                                        }}
                                    >
                                        <RadioGroup.Indicator className="size-2 rounded-full bg-[#3366FF]" />
                                    </RadioGroup.Item>
                                    <Label className="text-white">
                                        {radio ? '展示未选模块报价' : '不展示未选模块报价'}
                                    </Label>
                                </BlockBox>
                            )
                        })}
                    </RadioGroup.Root>
                </div>
            </div >

            {/* Generate Button */}
            <Button
                className="ml-[60px] mt-10 h-[48px] w-[160px] rounded-2xl bg-white text-lg font-medium text-[#0e0e0e] transition-all duration-300 ease-in-out hover:bg-[ragb(255,255,255,0.6)]"
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
            </Button >
        </div >
    )
}
