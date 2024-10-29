'use client'

import React, { useMemo } from 'react'

import Image from 'next/image'
import { FOOTER_ITERM } from './mock'

import SocialWidget from '@/[lng]/components/Footer/Social'
import useIsMobile from '@/hooks/useIsMobile'
import FooterMobile from '@/[lng]/components/Footer/mobile'
import LngSelector from '@/[lng]/components/Footer/LngSelector'

export default function Footer({ lng }: { lng: string }) {
  const isMobile = useIsMobile()
  const map = useMemo(() => {
    const map = new Map<
      string,
      {
        link: {
          label: string
        }
      }[]
    >()
    FOOTER_ITERM.forEach(item => {
      map.set(item.group, [...(map.get(item.group) || []), item.item])
    })
    return map
  }, [])

  return isMobile ? (
    <FooterMobile lng={lng} />
  ) : (
    <footer className="grid grid-cols-1 justify-items-start bg-white px-20 py-[60px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div className="flex h-full w-[101px] flex-col gap-6">
        <Image src="/logo.svg" width={48} height={48} alt="muse logo" />
        <LngSelector language={lng} />
        <div className="flex flex-1 flex-col justify-end">
          <SocialWidget />
        </div>
      </div>
      {Array.from(map.entries()).map(([group, item], i) => {
        return (
          <div key={i} className="flex flex-col gap-4">
            <h3 className="font-mono text-[16px] font-normal uppercase leading-[22px] text-black opacity-50">
              {group}
            </h3>
            <div className="flex flex-col gap-3">
              {item.map(({ link }, j) => (
                <span
                  key={j}
                  className="font-mono text-[14px] font-normal leading-[18.2px] text-[#141414]"
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </footer>
  )
}
