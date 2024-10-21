'use client'
import React, { useMemo } from 'react'

import Image from 'next/image'
import { FOOTER_ITERM } from './mock'
import { languages } from '@/i18n/settings'
import { useTranslation } from '@/i18n/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Footer({ lng }) {
  const { t } = useTranslation(lng, 'footer')

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
    <footer className="grid grid-cols-1 justify-items-start px-20 py-[60px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div className="grid gap-6">
        <a href="/logo.svg">
          <Image src="/logo.svg" width={48} height={48} alt="muse logo" />
        </a>
        <div>Language Selector</div>
        <Select defaultValue={lng}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((l, index) => (
              <SelectItem key={index} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="self-end">Social Link</div>
      </div>
      {Array.from(map.entries()).map(([group, item], i) => {
        return (
          <div key={i} className="flex flex-col gap-4">
            <h3 className="text-[16px] font-normal uppercase leading-[22px] text-black opacity-50">
              {group}
            </h3>
            <div className="flex flex-col gap-3">
              {item.map(({ link }, j) => {
                return (
                  <span key={j} className="text-[14px] font-normal leading-[18.2px] text-[#141414]">
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
