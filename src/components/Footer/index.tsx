'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { useCountry } from '@/providers/Country'

import useIsMobile from '@/hooks/useIsMobile'
import useFooterData from '@/components/Footer/data'
import LngSelector from '@/components/Footer/LngSelector'
import FooterMobile from '@/components/Footer/mobile'
import SocialWidget from '@/components/Footer/Social'
import { useFooterTranslation } from '@/app/i18n/client'

import { LocaleLink } from '../LocalLink'

export default function Footer() {
  const { t } = useFooterTranslation()
  const isMobile = useIsMobile()
  const { isInChina } = useCountry()

  const { data } = useFooterData()
  const map = useMemo(() => {
    const map = new Map<
      string,
      {
        link: {
          label: string
          url?: string
        }
      }[]
    >()

    data
      .filter((d) => ![t('group.customers'), t('group.resources')].includes(d.group))
      .forEach((item) => {
        map.set(item.group, [...(map.get(item.group) || []), item.item])
      })
    return map
  }, [data, t])

  return isMobile ? (
    <FooterMobile isInChina={isInChina} />
  ) : (
    <>
      <footer className="grid grid-cols-1 justify-items-start bg-white px-20 py-[60px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 dark:bg-[#070707]">
        <div className="flex h-full w-[101px] flex-col gap-6">
          <Image src="/assets/logo.svg" width={48} height={48} alt="muse logo" />
          {isInChina && <LngSelector />}
          <div className="flex flex-1 flex-col justify-end">
            <SocialWidget />
          </div>
        </div>
        <div className="hidden lg:col-span-2 lg:block" />
        {Array.from(map.entries()).map(([group, item], i) => {
          return (
            <div key={i} className="flex select-none flex-col gap-4">
              <h3 className="font-mono text-[16px] font-normal uppercase leading-[22px] text-black opacity-50 dark:text-[rgba(255,255,255,0.5)]">
                {group}
              </h3>
              <div className="flex flex-col gap-3">
                {item.map(({ link }, j) => (
                  <LocaleLink key={j} href={link.url ?? ''}>
                    <span className="underline-animation font-mono text-[14px] font-light leading-[18.2px] text-[#141414] dark:text-white">
                      {link.label}
                    </span>
                  </LocaleLink>
                ))}
              </div>
            </div>
          )
        })}
      </footer>
      {/* https://applink.feishu.cn/client/message/link/open?token=AmOrmXGzAAADZ1FER5UfAAQ%3D */}
      {isInChina && (
        <div className=" flex w-full items-center justify-center space-x-4 border-t dark:border-t-[rgba(255,255,255,0.1)] px-[10px] py-[24px] text-[12px] font-light text-[#141414] dark:bg-[#070707] dark:text-white/60">
          <span>© 特赞（上海）信息科技有限公司</span>
          <a
            href="http://beian.miit.gov.cn"
            style={{
              marginRight: '4px',
            }}
          >
            沪ICP备15021426号-22
          </a>
          <span>
            <a
              className="flex items-center"
              target="_blank"
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010402010164"
            >
              <Image className="mr-[4px]" src="/police.png" alt="police" width={16} height={16} />
              <span>沪公网安备 31010402010164 号</span>
            </a>
          </span>
          <span>网信算备 310115402810501240017 号</span>
          <span>网信算备 310115402810501240033 号</span>
        </div>
      )}
    </>
  )
}
