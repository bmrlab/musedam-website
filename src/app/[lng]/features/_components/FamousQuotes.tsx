'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/utilities/cn'
import { getRandomItem } from '@/utilities/random'
import { preceptData } from '@/components/LandingPage/Precept/mock'
import { useEffect, useState } from 'react'
import useIsMobile from '@/hooks/useIsMobile'

export default function FamousQuotes({ className }: { className?: string }) {
  const [data, setData] = useState(preceptData[0])
  const isMobile = useIsMobile()

  useEffect(() => {
    setData(getRandomItem(preceptData))
  }, [])

  return (
    <div
      className={cn(
        'relative flex h-[480px] w-full flex-col items-center justify-center bg-[#06063A] text-white md:h-[800px]',
        className,
      )}
    >
      <div className="z-[1] flex flex-col justify-center gap-[60px] px-6 text-center md:px-[80px]">
        <blockquote className="hidden text-start font-mono text-[32px] font-light leading-[56px] text-white md:block">
          <span className="text-[120px]">&ldquo;</span>
          {data.description}
        </blockquote>
        <blockquote className="text-start font-mono text-[16px] font-light leading-[28px] text-white md:hidden">
          &ldquo;
          {data.description}
        </blockquote>
        <cite className="flex items-center gap-4 not-italic">
          <Avatar className="size-[64px]">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback>{data.name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-items-start text-start font-mono">
            <div className="text-[20px] font-medium leading-[26px] text-white">{data.name}</div>
            <div className="text-[13px] font-light leading-[16.9px] text-white/50">{data.role}</div>
          </div>
        </cite>
      </div>
      <div
        style={{
          background: 'linear-gradient(#0C1043, #262E56)',
        }}
        className={cn(
          'absolute right-6 size-[244px] rounded-full md:right-[150px] md:size-[589px]',
          isMobile ? 'bottom-[65px]' : 'top-1/2 -translate-y-1/2',
        )}
      ></div>
    </div>
  )
}
