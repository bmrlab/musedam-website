import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/utilities/cn'
import { getRandomItem } from '@/utilities/random'
import { preceptData } from '@/components/LandingPage/Precept/mock'
import { useEffect, useState } from 'react'

export default function FamousQuotes({ className }: { className?: string }) {
  const [data, setData] = useState(preceptData[0])

  useEffect(() => {
    setData(getRandomItem(preceptData))
  }, [])

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center bg-[#06063A] text-white',
        className,
      )}
    >
      <div className="z-[1] px-[80px] text-center flex justify-center gap-[60px] flex-col">
        <blockquote className="text-start font-mono text-[32px] font-light leading-[56px] text-white">
          <span className="text-[120px]">&ldquo;</span>
          {data.description}
        </blockquote>
        <cite className="flex items-center gap-4 not-italic">
          <Avatar className="h-[64px] w-[64px]">
            <AvatarImage src={data.avatar} alt="Sarah Thompson" />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div className="font-mono flex flex-col justify-items-start">
            <div className="font-medium text-[20px] leading-[26px] text-white">{data.name}</div>
            <div className="font-light text-[13px] leading-[16.9px] text-white/50">{data.role}</div>
          </div>
        </cite>
      </div>
      <div
        style={{
          background: 'linear-gradient(#0C1043, #262E56)',
        }}
        className="absolute top-1/2 right-[150px] translate-y-[-50%] rounded-full size-[589px]"
      ></div>
    </div>
  )
}
