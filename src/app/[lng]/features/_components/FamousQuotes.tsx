'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'
import { getRandomItem } from '@/utilities/random'

import useIsMobile from '@/hooks/useIsMobile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import usePreceptData from '@/components/LandingPage/Precept/data'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import useIsZhLng from '@/hooks/useIsZhLng'

export default function FamousQuotes({ className }: { className?: string }) {
  const { data: preceptData } = usePreceptData()
  const [data, setData] = useState(preceptData[0])
  const isMobile = useIsMobile()
  const { isZhLng } = useIsZhLng()
  useEffect(() => {
    setData(getRandomItem(preceptData))
  }, [preceptData])

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center bg-[#06063A] py-20 text-white md:h-[800px]',
        className,
      )}
    >
      <FadeInUpContainer className="z-[1] flex flex-col justify-center gap-[60px] px-6 text-center md:px-[80px]">
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
          <div className="flex flex-col justify-items-start gap-1.5 text-start font-mono">
            <div className={cn('text-[20px] leading-[26px] text-white', isZhLng ? ' font-medium' : 'font-normal')}>{data.name}</div>
            <div className="text-[13px] font-light leading-[16.9px] text-white/50">{data.role}</div>
          </div>
        </cite>
      </FadeInUpContainer>
      <div
        className={cn(
          'absolute right-6 md:right-[150px]',
          isMobile ? 'bottom-[65px]' : 'top-1/2 -translate-y-1/2',
        )}
      >
        <FadeInUpContainer
          style={{
            background: 'linear-gradient(#0C1043, #262E56)',
          }}
          className="size-[244px] rounded-full md:size-[589px]"
          transition={{
            delay: 0.5,
          }}
        ></FadeInUpContainer>
      </div>
    </div>
  )
}
