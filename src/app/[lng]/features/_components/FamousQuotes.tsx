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
        'h-[480px] md:h-[800px] relative flex w-full flex-col items-center justify-center bg-[#06063A] text-white',
        className,
      )}
    >
      <div className="z-[1] px-6 md:px-[80px] text-center flex justify-center gap-[60px] flex-col">
        <blockquote className="hidden md:block text-start font-mono text-[32px] font-light leading-[56px] text-white">
          <span className="text-[120px]">&ldquo;</span>
          {data.description}
        </blockquote>
        <blockquote className="md:hidden text-start font-mono text-[16px] font-light leading-[28px] text-white">
          &ldquo;
          {data.description}
        </blockquote>
        <cite className="flex items-center gap-4 not-italic">
          <Avatar className="h-[64px] w-[64px]">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback>{data.name}</AvatarFallback>
          </Avatar>
          <div className="text-start font-mono flex flex-col justify-items-start">
            <div className="font-medium text-[20px] leading-[26px] text-white">{data.name}</div>
            <div className="font-light text-[13px] leading-[16.9px] text-white/50">{data.role}</div>
          </div>
        </cite>
      </div>
      <div
        style={{
          background: 'linear-gradient(#0C1043, #262E56)',
        }}
        className={cn(
          'absolute rounded-full right-6 md:right-[150px] size-[244px] md:size-[589px]',
          isMobile ? 'bottom-[65px]' : 'top-1/2 translate-y-[-50%]',
        )}
      ></div>
    </div>
  )
}
