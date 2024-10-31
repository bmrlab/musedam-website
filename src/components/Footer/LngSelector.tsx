import React, { useCallback, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Icons from '@/components/icon'
import { languages } from '@/app/i18n/settings'

export default function LngSelector({ language }: { language: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [lng, setLng] = useState(language)

  const onLngChange = useCallback(
    (value: string) => {
      router.replace(pathname.replace(lng, value), {
        scroll: true,
      })
      setLng(value)
    },
    [lng, pathname, router],
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
    <Select defaultValue={lng} value={lng} onValueChange={onLngChange}>
      <SelectTrigger className="w-full border-none p-0 shadow-none focus:ring-0">
        <div className="flex items-center gap-1.5">
          <Icons.locales width={18} height={18} />
          <p className="text-[14px] font-normal leading-[18.2px] text-[#141414]">
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
