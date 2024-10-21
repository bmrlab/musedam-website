'use client'

import React, { useCallback, useMemo, useState } from 'react'

import Image from 'next/image'
import { FOOTER_ITERM } from './mock'
import { languages } from '@/i18n/settings'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter } from 'next/navigation'
import Icons from '@/components/icon'

export default function Footer(params: { lng: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [lng, setLng] = useState(params.lng)
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

  const onLngChange = useCallback(
    (value: string) => {
      router.replace(pathname.replace(lng, value), {
        scroll: false,
      })
      setLng(value)
    },
    [lng, pathname, router],
  )

  return (
    <footer className="grid grid-cols-1 justify-items-start px-20 py-[60px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div className="grid gap-6">
        <Image src="/logo.svg" width={48} height={48} alt="muse logo" />
        <div>Language Selector</div>
        <Select defaultValue={lng} value={lng} onValueChange={onLngChange}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-1.5">
              <Icons.locales width={18} height={18} />
              <p className="text-[14px] font-normal leading-[18.2px] text-[#141414]">
                <SelectValue placeholder="Language" />
              </p>
            </div>
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
