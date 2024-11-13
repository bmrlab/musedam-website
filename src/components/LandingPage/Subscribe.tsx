'use client'

import { cn } from '@/utilities/cn'
import { Input } from '@/components/ui/input'

export default function SubscribeBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 bg-[rgb(237,237,237)] px-6 py-[60px] md:px-0 text-black',
        className,
      )}
    >
      <h2 className="text-center font-baskervville text-[38px] font-normal leading-[43.47px]  md:text-left md:text-[48px] md:leading-[54.91px]">
        Subscribe for exclusive updates and resources
      </h2>
      <div className="flex justify-center w-full flex-col gap-2.5 md:flex-row">
        <Input
          type="email"
          placeholder="Your work email"
          className="h-[54px] w-full rounded-[6px] border-none bg-white p-4 md:h-[50px] md:w-[420px] placeholder:font-light placeholder:font-mono placeholder:opacity-30"
        />
        <button className="text-white h-[54px] rounded-[6px] bg-black px-[56.5px] font-mono text-[16px] leading-[20.8px] md:h-[50px]">
          Subscribe
        </button>
      </div>
      <p className="font-mono text-[14px] font-light leading-[28px] tracking-[1%]">
        Kickstart your journey with our free trial →
      </p>
    </div>
  )
}
