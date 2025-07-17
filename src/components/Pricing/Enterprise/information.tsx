'use client'

import { useState } from "react";
import { Trans } from 'react-i18next';
import { useInformationTranslation } from '@/app/i18n/client';
import { cn, twx } from "@/utilities/cn";
import Image from 'next/image'
import ContactUsDialog from "../ContactUsDialog";
import { useToast } from '@/hooks/use-toast'
import { EExpectTime, EOrgSize } from "@/utilities/feishu";
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useCountry } from "@/providers/Country";
import { CheckIcon } from "@radix-ui/react-icons";
import useIsMobile from "@/hooks/useIsMobile";
import { useLanguage } from "@/providers/Language";

const FormLabel = twx.label`mb-3 block md:text-sm text-[12px]`
const FormInput = twx.input`text-[14px] w-full border border-[#C5CEE0] rounded-lg px-4 h-[46px] focus:outline-none hover:ring-0 hover:border-[#141414] focus:ring-0 focus:border-[#141414] ease-in-out duration-300 transition-all`
export const Information = () => {
    const { isInChina } = useCountry()
    const { t } = useInformationTranslation();
    const { language } = useLanguage()
    const isEn = language === 'en-US'
    const { toast } = useToast()
    const getUrl = (fileName: string) => `/assets/Enterprise/Home/${fileName}`
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const isMobile = useIsMobile()

    // 合并所有表单项为一个对象
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        position: "",
        phone: "",
        teamSize: undefined as EOrgSize | undefined,
        expectTime: undefined as EExpectTime | undefined,
    });

    const handleChange = (key: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const teamSizes = [
        { label: t('form.size.2-10'), value: EOrgSize.TEN },
        { label: t('form.size.11-50'), value: EOrgSize.FIFTY },
        { label: t('form.size.51-200'), value: EOrgSize.TWO_HUNDRED },
        { label: t('form.size.201-500'), value: EOrgSize.FIVE_HUNDRED },
        { label: t('form.size.501-1,000'), value: EOrgSize.ONE_THOUSAND },
        { label: t('form.size.1000+'), value: EOrgSize.MORE_THOUSAND },
    ];

    const expectTimes = [
        { label: t('form.expect.1month'), value: EExpectTime.ONE_MONTH },
        { label: t('form.expect.3months'), value: EExpectTime.THREE_MONTH },
        { label: t('form.expect.6months'), value: EExpectTime.SIX_MONTH },
        { label: t('form.expect.1year'), value: EExpectTime.ONE_YEAR },
        { label: t('form.expect.notSure'), value: EExpectTime.NOT_SURE },
    ];

    // 统一 disable 校验
    // 手机号格式校验（中国大陆）
    const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone);
    const getIsDisabled = (form: typeof formData, isGlobal: boolean) => {
        if (isGlobal) {
            return !form.email || !form.name || !form.company || !form.position || !form.teamSize || !form.expectTime;
        } else {
            return !form.phone || !form.name || !form.company || !form.position || !form.teamSize || !form.expectTime;
        }
    };
    const isDisabled = getIsDisabled(formData, !isInChina);
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isDisabled) {
            toast({ duration: 2000, description: t('form.required') });
            return;
        }

        if (isInChina && !isValidPhone(formData.phone)) {
            toast({ duration: 2000, description: t('form.phone.invalid') });
            return
        }
        setSubmitting(true)
        try {
            const { name, email, company, position, teamSize, expectTime, phone } = formData;
            const submitData = { name, company, position, teamSize, expectTime };
            if (isInChina) {
                submitData['phone'] = phone
            } else {
                submitData['email'] = email
            }
            const res = await fetch('/api/feishu/book-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            })
            const data = await res.json()
            if (!data.success || (data.data && data.data.code !== 0)) {
                throw new Error(data.data?.msg || data.error)
            }
            toast({ duration: 2000, description: t('form.submitSuccess') });
            setOpen(true);
            setFormData({
                name: "",
                email: "",
                company: "",
                position: "",
                phone: "",
                teamSize: undefined,
                expectTime: undefined,
            });
        } catch (err) {
            toast({ duration: 2000, description: err.message ?? t('form.submitError') });
        }
        setSubmitting(false)
    }
    // 海外版暂时隐藏
    if (!isInChina) return <></>
    return (<>
        <div className="flex w-full justify-center bg-white font-euclid text-[#141414]">
            <div className="flex w-full flex-col items-start justify-between py-[60px] px-6 md:max-w-[1440px] md:flex-row md:px-[80px] md:py-[104px] h-fit">
                {/* 左侧介绍 */}
                <div className="md:h-full flex-col justify-between md:pr-[80px] flex flex-1">
                    <div>
                        <h1 className={cn("mb-4 font-feature md:text-[54px] md:font-medium md:text-start text-center",
                            isEn ? " text-[40px]" : " text-[32px]"
                        )}>
                            <Trans i18nKey="title" t={t} components={{ 1: <br /> }} />
                        </h1>
                        <p className="md:text-start text-center mb-[30px] md:mb-[60px] font-euclidlight text-base md:text-[22px] font-light text-[rgba(20,20,20,0.72)]">
                            <Trans i18nKey="desc" t={t} components={{ 1: isMobile ? <></> : <br /> }} />
                        </p>
                        <ul className={cn("md:mb-[60px] mb-[30px]",
                            isEn ? "text-lg space-y-5 " : "text-base space-y-3"
                        )}>
                            {(t('list', { returnObjects: true }) as string[]).map((item, idx) => (
                                <li className="flex items-start gap-[10px] font-euclid" key={idx}>
                                    <CheckIcon className="shrink-0 text-[#20C997]" width={24} height={24} />
                                    <span><Trans i18nKey={`list.${idx}`} t={t} components={{ 1: <strong /> }} /></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:block hidden">
                        <div className="mb-4 font-euclidlight text-base font-light">{t('security')}</div>
                        <div className="flex w-fit flex-row gap-6 rounded-full bg-[#F8F8F8] px-6 py-3">
                            {/* 认证徽章占位符，可替换为图片 */}
                            {[getUrl('ISO001.png'), getUrl('ISO017.png'), getUrl('ISO9001.png'), getUrl('MLPS3.png')].map((v) => {
                                return <Image src={v} width={200} height={100} alt={v} className="aspect-[1/1] size-16 rounded-full object-cover" key={v} />
                            })}
                        </div>
                    </div>
                </div>
                {/* 右侧表单 */}
                <div className="font-euclid shadow-none md:flex-1 w-full">
                    <h2 className="md:mb-10 mb-6 text-[28px] md:text-2xl font-medium text-center md:text-start">{t('form.title')}</h2>
                    <form className="grid h-full grid-cols-2 justify-between gap-x-3 gap-y-4 md:gap-y-[30px]" onSubmit={handleSubmit} >
                        <div className="col-span-2 md:col-span-1">
                            <FormLabel >{t('form.name.label')}</FormLabel>
                            <FormInput type="text" placeholder={t('form.name.placeholder')} value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                        </div>
                        {!isInChina ? <div className="col-span-2 md:col-span-1">
                            <FormLabel >{t('form.email.label')}</FormLabel>
                            <FormInput type="email" placeholder={t('form.email.placeholder')} value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                        </div> : <div className="col-span-2 md:col-span-1">
                            <FormLabel >{t('form.phone.label')}</FormLabel>
                            <FormInput type="phone" placeholder={t('form.phone.placeholder')} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                        </div>}
                        <div className="col-span-2 md:col-span-1">
                            <FormLabel >{t('form.company.label')}</FormLabel>
                            <FormInput type="text" placeholder={t('form.company.placeholder')} value={formData.company} onChange={e => handleChange('company', e.target.value)} />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <FormLabel >{t('form.position.label')}</FormLabel>
                            <FormInput type="text" placeholder={t('form.position.placeholder')} value={formData.position} onChange={e => handleChange('position', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                            <FormLabel >{t('form.size.label')}</FormLabel>
                            <RadioGroup.Root
                                className="grid md:grid-cols-3 grid-cols-2 gap-2"
                                defaultValue={formData.teamSize?.toString()}>
                                {teamSizes.map((item) => (
                                    <RadioGroup.Item
                                        id={item.value.toString()}
                                        value={item.value.toString()}
                                        className={cn('flex h-[46px] items-center justify-start rounded-lg border px-3 text-sm transition-all duration-300 ease-in-out',
                                            formData.teamSize === item.value ? "border-[#141414]" : "border-[#C5CEE0] bg-white hover:border-[#141414]",
                                        )}
                                        key={item.value}
                                        onClick={() => handleChange('teamSize', item.value)}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300 ',
                                                'transition-all duration-300 ease-in-out',
                                                formData.teamSize === item.value && 'border-[#141414]',
                                            )}>
                                            <RadioGroup.Indicator className="size-2 rounded-full bg-[#141414]" />
                                        </div>
                                        <span>{item.label}</span>
                                    </RadioGroup.Item>
                                ))}
                            </RadioGroup.Root>
                        </div>

                        <div className="col-span-2">
                            <FormLabel >{t('form.expect.label')}</FormLabel>
                            <RadioGroup.Root
                                className="grid md:grid-cols-3 grid-cols-2 gap-2"
                                defaultValue={formData.expectTime?.toString()}
                            >
                                {expectTimes.map((item, index) => {
                                    return (
                                        <RadioGroup.Item
                                            id={item.value.toString()}
                                            value={item.value.toString()}
                                            className={cn('flex h-[46px] items-center justify-start rounded-lg border px-3 text-sm transition-all duration-300 ease-in-out',
                                                formData.expectTime === item.value ? "border-[#141414]" : "border-[#C5CEE0] bg-white hover:border-[#141414]",
                                                index + 1 === expectTimes.length && 'col-span-2'
                                            )}

                                            key={item.value}
                                            onClick={() => handleChange('expectTime', item.value)}
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex size-4 items-center justify-center rounded-full border border-gray-300 ',
                                                    'transition-all duration-300 ease-in-out',
                                                    formData.expectTime === item.value && 'border-[#141414]',
                                                )}>
                                                <RadioGroup.Indicator className="size-2 rounded-full bg-[#141414]" />
                                            </div>
                                            <span>{item.label}</span>
                                        </RadioGroup.Item>
                                    )
                                })}
                            </RadioGroup.Root>

                            {/* <div className="grid grid-cols-3 gap-2">
                            {expectTimes.map((item, index) => (
                                <button
                                    type="button"
                                    key={item.value}
                                    className={cn('flex items-center justify-center rounded-lg border px-4 py-3 text-sm transition-all duration-300 ease-in-out',
                                        formData.expectTime === item.value ? "border-[#141414]" : "border-[#C5CEE0] bg-white",
                                        index + 1 === expectTimes.length && 'col-span-2'
                                    )}
                                    onClick={() => handleChange('expectTime', item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div> */}
                        </div>
                        <div className="col-span-2 mt-[10px]">
                            <button
                                disabled={submitting}
                                type="submit"
                                className={cn(
                                    "h-[50px] w-full rounded-lg bg-black text-[16px] font-medium text-white transition-all hover:bg-gray-900",
                                )}
                            >{t('form.submit')}</button>
                            <div className="mt-4 text-center text-xs text-gray-400">
                                <Trans i18nKey="privacy" t={t} components={{ 1: <a href={'/privacy'} target="_blank" className="underline underline-offset-4" /> }} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <ContactUsDialog open={open} setOpen={setOpen} />
    </>
    );
}