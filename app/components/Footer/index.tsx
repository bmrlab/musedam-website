'use client'
import React, { useMemo } from 'react'

import Image from 'next/image'
import { FOOTER_ITERM } from './mock'

export function Footer() {
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

  return (
    <footer className="px-20 py-[60px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-start">
      <div className="grid gap-6">
        <a href="/public">
          <Image src="/logo.svg" width={48} height={48} alt="muse logo" />
        </a>
        <div>Language Selector</div>
        <div className="self-end">Social Link</div>
      </div>
      {Array.from(map.entries()).map(([group, item], i) => {
        return (
          <div key={i} className="flex flex-col gap-4">
            <h3 className="uppercase font-normal text-[16px] leading-[22px] text-black opacity-50">
              {group}
            </h3>
            <div className="flex flex-col gap-3">
              {item.map(({ link }, j) => {
                return (
                  <span key={j} className="font-normal text-[14px] leading-[18.2px] text-[#141414]">
                    {link.label}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </footer>
  )
}
