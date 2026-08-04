'use client'

import { FC, useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { cn } from '@/utilities/cn'

interface ModuleInfoIconProps {
  description: string
  className?: string
}

/** 模块功能描述 Info：默认 20% 透明度，hover 100% + tooltip */
export const ModuleInfoIcon: FC<ModuleInfoIconProps> = ({ description, className }) => {
  const [open, setOpen] = useState(false)
  if (!description) return null

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label="info"
            className={cn(
              'inline-flex size-5 shrink-0 items-center justify-center rounded-sm',
              'opacity-20 transition-opacity hover:opacity-100 focus-visible:opacity-100',
              'outline-none',
              className,
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen((v) => !v)
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M15.7273 10C15.7273 6.83691 13.1631 4.27273 10 4.27273C6.83691 4.27273 4.27273 6.83691 4.27273 10C4.27273 13.1631 6.83691 15.7273 10 15.7273C13.1631 15.7273 15.7273 13.1631 15.7273 10ZM17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                fill="white"
              />
              <path
                d="M9.36364 12.5455V10C9.36364 9.64855 9.64855 9.36364 10 9.36364C10.3515 9.36364 10.6364 9.64855 10.6364 10V12.5455C10.6364 12.8969 10.3515 13.1818 10 13.1818C9.64855 13.1818 9.36364 12.8969 9.36364 12.5455Z"
                fill="white"
              />
              <path
                d="M10.0062 6.81818C10.3577 6.81818 10.6426 7.10309 10.6426 7.45455C10.6426 7.806 10.3577 8.09091 10.0062 8.09091H10C9.64855 8.09091 9.36364 7.806 9.36364 7.45455C9.36364 7.10309 9.64855 6.81818 10 6.81818H10.0062Z"
                fill="white"
              />
            </svg>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="start"
            sideOffset={6}
            className="z-[200] max-w-[280px] rounded-md bg-[#333] px-3 py-2 text-[12px] leading-[18px] text-white shadow-lg"
          >
            {description}
            <Tooltip.Arrow className="fill-[#333]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
