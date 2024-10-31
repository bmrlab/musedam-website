'use client'

import { cn } from '@/utilities/cn'
import { Input } from '@/components/ui/input'

export default function SubscribeBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 bg-[#07168D] px-6 py-[60px] md:px-0',
        className,
      )}
    >
      <h2 className="text-center font-baskervville text-[38px] font-normal leading-[43.47px] text-white md:text-left md:text-[48px] md:leading-[54.91px]">
        Subscribe for exclusive updates and resources
      </h2>
      <div className="flex justify-center w-full flex-col gap-2.5 md:flex-row">
        <Input
          type="email"
          placeholder="Your work email"
          className="h-[54px] w-full rounded-[6px] border-none bg-white p-4 md:h-[50px] md:w-[420px]"
        />
        <button className="h-[54px] rounded-[6px] bg-[#043FFB] px-[56.5px] font-mono text-[16px] leading-[20.8px] text-white md:h-[50px]">
          Subscribe
        </button>
      </div>
      <p className="flex flex-col gap-0 md:gap-2 items-center font-mono text-[14px] leading-[28px] md:flex-row">
        <span className="text-[#FAFAFA]">Kickstart your journey with our</span>
        <span className="text-[#0FF95C]"> free trial →</span>
      </p>
    </div>
  )
}
