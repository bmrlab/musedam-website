'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { cn } from '@/utilities/cn'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Option<T extends number> = { value: T; label: string }

const getTriggerClass = (dark?: boolean) =>
  cn(
    'h-[46px] w-full rounded-lg border px-4 text-[14px] shadow-none focus:outline-none focus:ring-0',
    dark
      ? 'border-[rgba(255,255,255,0.2)] bg-black text-white hover:border-white data-[placeholder]:text-[rgba(255,255,255,0.4)]'
      : 'border-[#C5CEE0] bg-white hover:border-[#141414] data-[placeholder]:text-[#C5CEE0]',
  )

const getContentClass = (dark?: boolean) =>
  cn(
    'z-50 max-h-60 overflow-y-auto',
    dark && 'border-[rgba(255,255,255,0.2)] bg-[#141414] text-white',
  )

export function FormSingleSelect<T extends number>({
  value,
  placeholder,
  options,
  dark,
  onChange,
}: {
  value: T | undefined
  placeholder: string
  options: Option<T>[]
  dark?: boolean
  onChange: (value: T) => void
}) {
  return (
    <Select
      value={value !== undefined ? String(value) : undefined}
      onValueChange={(v) => onChange(Number(v) as T)}
    >
      <SelectTrigger className={getTriggerClass(dark)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={getContentClass(dark)} position="popper">
        {options.map((item) => (
          <SelectItem key={item.value} value={String(item.value)} className={dark ? 'focus:bg-white/10' : ''}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function FormMultiSelect<T extends number>({
  values,
  placeholder,
  options,
  dark,
  onToggle,
}: {
  values: T[]
  placeholder: string
  options: Option<T>[]
  dark?: boolean
  onToggle: (value: T) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectedLabels = options.filter((o) => values.includes(o.value)).map((o) => o.label)
  const displayText = selectedLabels.length > 0 ? selectedLabels.join('、') : placeholder

  const checkboxClass = cn(
    'shadow-none transition-colors duration-300 ease-in-out',
    dark
      ? 'border-[rgba(255,255,255,0.3)] hover:border-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black'
      : 'border-gray-300 hover:border-[#141414] data-[state=checked]:border-[#141414] data-[state=checked]:bg-[#141414] data-[state=checked]:text-white',
  )

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          getTriggerClass(dark),
          'flex items-center justify-between gap-2 text-left',
          selectedLabels.length === 0 && (dark ? 'text-[rgba(255,255,255,0.4)]' : 'text-[#C5CEE0]'),
        )}
      >
        <span className="line-clamp-1 flex-1">{displayText}</span>
        <ChevronDownIcon className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-lg border p-1 shadow-md',
            dark ? 'border-[rgba(255,255,255,0.2)] bg-[#141414] text-white' : 'border-[#C5CEE0] bg-white text-[#141414]',
          )}
        >
          {options.map((item) => {
            const isActive = values.includes(item.value)
            return (
              <label
                key={item.value}
                className={cn(
                  'group flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-black/5',
                  dark && 'hover:bg-white/10',
                )}
              >
                <Checkbox
                  checked={isActive}
                  className={cn(
                    checkboxClass,
                    dark ? 'group-hover:border-white' : 'group-hover:border-[#141414]',
                  )}
                  onCheckedChange={() => onToggle(item.value)}
                />
                <span className="flex-1">{item.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
