import React, { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/providers/Language'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Icons from '@/components/icon'
import { languages } from '@/app/i18n/settings'

export default function LngSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()

  const onLngChange = useCallback(
    (value: string) => {
      router.replace(pathname.replace(language, value), {
        scroll: true,
      })
      setLanguage(value)
    },
    [language, pathname, router, setLanguage],
  )

  const LANGUAGES = [
    {
      key: 'en',
      label: 'English',
    },
    {
      key: 'zh',
      label: '简体中文',
    },
  ]

  return (
    <Select defaultValue={language} value={language} onValueChange={onLngChange}>
      <SelectTrigger className="w-full border-none p-0 shadow-none focus:ring-0">
        <div className="flex items-center gap-1.5">
          <Icons.locales width={18} height={18} />
          <p className="font-mono text-[14px] font-normal leading-[18.2px] text-[#141414]">
            <SelectValue placeholder="Language" />
          </p>
        </div>
      </SelectTrigger>
      <SelectContent className="border-none p-0.5 shadow-[0px_2px_30px_4px_rgba(0,0,0,0.08)]">
        {languages.map((l, index) => (
          <SelectItem
            key={index}
            value={l}
            className="cursor-pointer rounded-[8px] font-mono focus:bg-[#F4F5F6] data-[state=checked]:text-[#043FFB]"
          >
            {LANGUAGES.find(({ key }) => key === l)?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
