'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import useIsMobile from '@/hooks/useIsMobile'
import useFooterData from '@/components/Footer/data'
import LngSelector from '@/components/Footer/LngSelector'
import FooterMobile from '@/components/Footer/mobile'
import SocialWidget from '@/components/Footer/Social'
import { useFooterTranslation } from '@/app/i18n/client'

export default function Footer() {
  const { t } = useFooterTranslation()
  const isMobile = useIsMobile()

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
    <FooterMobile />
  ) : (
    <footer className="grid grid-cols-1 justify-items-start bg-white px-20 py-[60px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div className="flex h-full w-[101px] flex-col gap-6">
        <Image src="/logo.svg" width={48} height={48} alt="muse logo" />
        <LngSelector />
        <div className="flex flex-1 flex-col justify-end">
          <SocialWidget />
        </div>
      </div>
      <div className="hidden lg:col-span-2 lg:block" />
      {Array.from(map.entries()).map(([group, item], i) => {
        return (
          <div key={i} className="flex select-none flex-col gap-4">
            <h3 className="font-mono text-[16px] font-normal uppercase leading-[22px] text-black opacity-50">
              {group}
            </h3>
            <div className="flex flex-col gap-3">
              {item.map(({ link }, j) => (
                <Link key={j} href={link.url ?? ''}>
                  <span className="underline-animation font-mono text-[14px] font-normal leading-[18.2px] text-[#141414] after:h-[1.5px]">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </footer>
  )
}
