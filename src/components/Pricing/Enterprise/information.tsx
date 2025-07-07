'use client'

import { useState } from "react";
import { Trans } from 'react-i18next';
import { useInformationTranslation } from '@/app/i18n/client';
import { twx } from "@/utilities/cn";
import Image from 'next/image'

const FormInput = twx.input`w-full border border-[#C5CEE0] rounded-lg px-4 py-3 focus:outline-none hover:ring-1 hover:ring-black focus:ring-1 focus:ring-black`
export const Information = () => {
    const { t } = useInformationTranslation();
    const [teamSize, setTeamSize] = useState<string>("");
    const getUrl = (fileName: string) => `/assets/Enterprise/Home/${fileName}`

    const teamSizes = [
        { label: "2-10", value: "2-10" },
        { label: "11-50", value: "11-50" },
        { label: "51-200", value: "51-200" },
        { label: "201-500", value: "201-500" },
        { label: "501-1,000", value: "501-1,000" },
        { label: "1,000+", value: "1000+" },
    ];
    return (
        <div className="bg-white text-[#141414] w-full flex flex-row justify-between items-start p-4 md:px-[80px] md:py-[104px] gap-8">
            {/* 左侧介绍 */}
            <div className="w-1/2 flex flex-col justify-between h-full">
                <div>
                    <h1 className="text-[54px] font-medium leading-tight mb-4">
                        <Trans i18nKey="title" t={t} components={{ 1: <br /> }} />
                    </h1>
                    <p className="text-[22px] text-[rgba(20,20,20,0.72)] mb-[60px] font-light">
                        <Trans i18nKey="desc" t={t} components={{ 1: <br /> }} />
                    </p>
                    <ul className="mb-[60px] space-y-5 text-lg">
                        {(t('list', { returnObjects: true }) as string[]).map((item, idx) => (
                            <li className="flex items-start gap-[10px]" key={idx}>
                                <span className="text-green-500 text-xl">✓</span>
                                <span><Trans i18nKey={`list.${idx}`} t={t} components={{ 1: <strong /> }} /></span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="text-base font-light mb-4">{t('security')}</div>
                    <div className="flex flex-row gap-6 bg-[#F8F8F8] px-6 py-3 rounded-full w-fit">
                        {/* 认证徽章占位符，可替换为图片 */}
                        {[getUrl('ISO001.png'), getUrl('ISO017.png'), getUrl('ISO9001.png'), getUrl('MLPS3.png')].map((v) => {
                            return <Image src={v} width={200} height={100} alt={v} className="aspect-[1/1] size-16 rounded-full object-cover" key={v} />
                        })}
                    </div>
                </div>
            </div>
            {/* 右侧表单 */}
            <div className="w-1/2 h-full bg-white rounded-xl shadow-none px-8 ">
                <form className="h-full gap-4 flex flex-col justify-between">
                    <h2 className="text-2xl font-semibold mb-6">{t('form.title')}</h2>

                    <div>
                        <label className="block text-sm mb-1">{t('form.name.label')}</label>
                        <FormInput type="text" placeholder={t('form.name.placeholder')} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">{t('form.email.label')}</label>
                        <FormInput type="email" placeholder={t('form.email.placeholder')} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">{t('form.company.label')}</label>
                        <FormInput type="text" placeholder={t('form.company.placeholder')} />
                    </div>
                    <div>
                        <label className="block text-sm mb-2">{t('form.size.label')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {teamSizes.map((item) => (
                                <button
                                    type="button"
                                    key={item.value}
                                    className={`flex items-center justify-center border rounded-lg px-4 py-3 text-sm transition-all
                                        ${teamSize === item.value ? "border-black bg-gray-100" : "border-gray-200 bg-white"}`}
                                    onClick={() => setTeamSize(item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="mt-6 w-full bg-black text-white rounded-lg py-4 text-lg font-semibold transition-all hover:bg-gray-900">{t('form.submit')}</button>
                        <div className="text-xs text-gray-400 text-center mt-4">
                            <Trans i18nKey="privacy" t={t} components={{ 1: <a href={'/privacy'} target="_blank" className="underline underline-offset-4" /> }} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}