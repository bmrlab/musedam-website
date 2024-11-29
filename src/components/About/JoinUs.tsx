/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 11:32:41
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 11:33:22
 * @FilePath: /musedam-website/src/components/About/JonUs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2024-11-22 11:24:23
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2024-11-22 11:26:35
 * @FilePath: /musedam-website/src/components/About/OurStory.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import { useTranslation } from '@/app/i18n/client'

export default function JoinUs() {
    const { t } = useTranslation('company')

    return (
        <div className="min-h-screen w-full bg-white pt-10">
            <div className="flex flex-col justify-start md:flex-row md:justify-between">
                <div className="w-full flex-1 px-[30px] md:w-[48%] md:px-0">
                    <div className="relative w-full pt-[80%]">
                        <div className="absolute left-0 top-0 w-4/5">
                            <div className="w-full bg-joinBg1 bg-cover pt-[67%]"></div>
                        </div>

                        <div className="absolute bottom-0 right-0 w-[70%]">
                            <div className="w-full border-l-[9px] border-t-[9px] border-solid border-white bg-joinBg2 bg-cover pt-[47%]"></div>
                        </div>
                    </div>
                </div>
                <div className="w-full px-[30px] py-8 md:w-[48%] md:py-[60px]">
                    <div className="mx-auto w-full max-w-[450px] 2xl:max-w-[667px]">
                        <h1 className="text-12 font-euclid md:text-[68px]">
                            {t("about-us.join-us.title")}
                        </h1>
                        <h3 className="text-4 mb-10 font-mono font-light leading-6 text-[#141414]">
                            {t("about-us.join-us.subtitle")}
                        </h3>

                        <div className="max-w-[450px] space-y-2 font-mono text-[16px] font-light leading-6 tracking-[2%] text-[#141414]">
                            <div className="font-medium leading-7">
                                {t("about-us.join-us.position")}
                            </div>
                            <p className="">
                                {t("about-us.join-us.description")}
                            </p>
                            <br />
                            <p>
                                {t("about-us.join-us.apply")}{' '}
                                <a
                                    type="em"
                                    href="mailto:contact@musedam.cc"
                                    className="font-medium underline hover:opacity-75"
                                >
                                    contact@musedam.cc
                                </a>{' '}
                                {t("about-us.join-us.apply-suffix")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
