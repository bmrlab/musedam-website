'use client'

import { useState } from "react";
import { Trans } from 'react-i18next';
import { useInformationTranslation } from '@/app/i18n/client';
import { cn, twx } from "@/utilities/cn";
import Image from 'next/image'
import ContactUsDialog from "../ContactUsDialog";
import { useToast } from '@/hooks/use-toast'
import { EExpectTime, EOrgSize } from "@/utilities/feishu";
import { env } from "process";
import { useCountry } from "@/providers/Country";

const FormInput = twx.input`w-full border border-[#C5CEE0] rounded-lg px-4 py-3 focus:outline-none hover:ring-1 hover:ring-black focus:ring-1 focus:ring-black`
export const Information = () => {
    const { isInChina } = useCountry()
    const { t } = useInformationTranslation();
    const { toast } = useToast()
    const getUrl = (fileName: string) => `/assets/Enterprise/Home/${fileName}`
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

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
            return !form.phone || !isValidPhone(form.phone) || !form.name || !form.company || !form.position || !form.teamSize || !form.expectTime;
        }
    };
    const isDisabled = getIsDisabled(formData, !isInChina);
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isDisabled) {
            if (isInChina && !isValidPhone(formData.phone)) {
                toast({ duration: 0, description: t('form.phone.invalid') });
            } else {
                toast({ duration: 2000, description: t('form.required') });
            }
            return;
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
    return (<>
        <div className="flex w-full flex-col items-start justify-between gap-8 bg-white p-4 font-euclid text-[#141414] md:flex-row md:px-[80px]  md:py-[104px]">
            {/* 左侧介绍 */}
            <div className="hidden flex-col justify-between md:flex md:flex-1">
                <div>
                    <h1 className="mb-4 font-feature text-[54px] font-medium leading-tight">
                        <Trans i18nKey="title" t={t} components={{ 1: <br /> }} />
                    </h1>
                    <p className="mb-[60px] text-[22px] font-light text-[rgba(20,20,20,0.72)]">
                        <Trans i18nKey="desc" t={t} components={{ 1: <br /> }} />
                    </p>
                    <ul className="mb-[60px] space-y-5 text-lg">
                        {(t('list', { returnObjects: true }) as string[]).map((item, idx) => (
                            <li className="flex items-start gap-[10px]" key={idx}>
                                <span className="text-xl text-green-500">✓</span>
                                <span><Trans i18nKey={`list.${idx}`} t={t} components={{ 1: <strong /> }} /></span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="mb-4 text-base font-light">{t('security')}</div>
                    <div className="flex w-fit flex-row gap-6 rounded-full bg-[#F8F8F8] px-6 py-3">
                        {/* 认证徽章占位符，可替换为图片 */}
                        {[getUrl('ISO001.png'), getUrl('ISO017.png'), getUrl('ISO9001.png'), getUrl('MLPS3.png')].map((v) => {
                            return <Image src={v} width={200} height={100} alt={v} className="aspect-[1/1] size-16 rounded-full object-cover" key={v} />
                        })}
                    </div>
                </div>
            </div>
            {/* 右侧表单 */}
            <div className="rounded-xl bg-white px-2 shadow-none md:flex-1 md:px-8 ">
                <h2 className="mb-10 text-2xl font-semibold">{t('form.title')}</h2>
                <form className="grid h-full grid-cols-2  justify-between gap-3" onSubmit={handleSubmit} >
                    <div className="col-span-2 md:col-span-1">
                        <label className="mb-3 block text-sm">{t('form.name.label')}</label>
                        <FormInput type="text" placeholder={t('form.name.placeholder')} value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    </div>
                    {!isInChina ? <div className="col-span-2 md:col-span-1">
                        <label className="mb-3 block text-sm">{t('form.email.label')}</label>
                        <FormInput type="email" placeholder={t('form.phone.placeholder')} value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                    </div> : <div className="col-span-2 md:col-span-1">
                        <label className="mb-3 block text-sm">{t('form.phone.label')}</label>
                        <FormInput type="phone" placeholder={t('form.phone.placeholder')} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                    </div>}
                    <div className="col-span-2 md:col-span-1">
                        <label className="mb-3 block text-sm">{t('form.company.label')}</label>
                        <FormInput type="text" placeholder={t('form.company.placeholder')} value={formData.company} onChange={e => handleChange('company', e.target.value)} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="mb-3 block text-sm">{t('form.position.label')}</label>
                        <FormInput type="text" placeholder={t('form.position.placeholder')} value={formData.position} onChange={e => handleChange('position', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                        <label className="mb-2 block text-sm">{t('form.size.label')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {teamSizes.map((item) => (
                                <button
                                    type="button"
                                    key={item.value}
                                    className={`flex items-center justify-center rounded-lg border px-4 py-3 text-sm transition-all
                                        ${formData.teamSize === item.value ? "border-black bg-gray-100" : "border-gray-200 bg-white"}`}
                                    onClick={() => handleChange('teamSize', item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="mb-2 block text-sm">{t('form.expect.label')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {expectTimes.map((item, index) => (
                                <button
                                    type="button"
                                    key={item.value}
                                    className={cn('flex items-center justify-center rounded-lg border px-4 py-3 text-sm transition-all',
                                        formData.expectTime === item.value ? "border-black bg-gray-100" : "border-gray-200 bg-white",
                                        index + 1 === expectTimes.length && 'col-span-2'
                                    )}
                                    onClick={() => handleChange('expectTime', item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-2 mt-7">
                        <button
                            disabled={submitting || isDisabled}
                            type="submit"
                            className={cn(
                                "h-[50px] w-full rounded-2xl text-[20px] font-medium text-white ",
                                isDisabled ? 'cursor-not-allowed bg-black/30' : 'bg-black transition-all hover:bg-gray-900'
                            )}
                        >{t('form.submit')}</button>
                        <div className="mt-4 text-center text-xs text-gray-400">
                            <Trans i18nKey="privacy" t={t} components={{ 1: <a href={'/privacy'} target="_blank" className="underline underline-offset-4" /> }} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <ContactUsDialog open={open} setOpen={setOpen} />

    </>
    );
}