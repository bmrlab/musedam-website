'use client'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export default function SubscribeBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 bg-[#07168D] py-[60px]',
        className,
      )}
    >
      <h2 className="text-[48px] font-normal leading-[54.91px] text-white">
        Subscribe for exclusive updates and resources
      </h2>
      <div className="flex gap-2.5">
        <Input
          type="email"
          placeholder="Your work email"
          className="h-[50px] w-[420px] rounded-[6px] border-none bg-white p-4"
        />
        <button className="h-full rounded-[6px] bg-[#043FFB] px-[56.5px] text-[16px] leading-[20.8px] text-white">
          Subscribe
        </button>
      </div>
      <p className="text-[14px] leading-[28px]">
        <span className="text-[#FAFAFA]">Kickstart your journey with our</span>
        <span className="text-[#0FF95C]"> free trial →</span>
      </p>
    </div>
  )
}
