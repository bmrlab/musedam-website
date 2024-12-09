import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { cn } from '@/utilities/cn'

import { Badge } from '@/components/ui/badge'
import Icons from '@/components/icon'
import { BlackButton } from '@/components/StyleWrapper/button'
import { DotContainer } from '@/components/StyleWrapper/Container'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'

export type HeroProps = {
  tag: string
  title: string
  description: string
  tagColor: string
  buttonText: string
  buttonHref?: string
  lng: string
}
export default function Hero({
  tag,
  title,
  description,
  tagColor,
  buttonText,
  buttonHref,
  lng,
}: HeroProps) {
  return (
    <DotContainer className="flex shrink-0 flex-col justify-center bg-white px-6 py-[60px] md:min-h-[calc(100vh-70px)] md:px-20 md:py-[100px]">
      <div className="mb-8">
        <Badge
          style={{
            background: tagColor,
          }}
          className="cursor-default rounded-full font-mono text-[12px] font-normal leading-5 text-black shadow-none"
        >
          {tag}
        </Badge>
      </div>
      <FadeInUpContainer>
        <h1
          className={cn(
            'mb-[16px] font-euclid text-[32px] font-normal leading-[41.6px] tracking-[1px] md:mb-6 ',
            lng === 'zh'
              ? 'md:text-[80px] md:leading-[90px]'
              : 'md:text-[100px] md:leading-[110px]',
          )}
        >
          {title}
        </h1>
        <p className="mb-12 font-mono text-[14px] font-light leading-[28px] tracking-[2%] md:text-[24px] md:leading-[38.4px]">
          {description}
        </p>
      </FadeInUpContainer>
      <FadeInUpContainer className="flex  items-center justify-center  md:justify-between">
        <Link href={buttonHref ?? MUSEDAM_LOGIN_URL + `?local=${lng}`}>
          <BlackButton className="h-[50px] w-[240px] rounded-full px-[52.2px] font-mono leading-5 text-white transition-colors hover:bg-gray-800 md:h-[58px] md:py-[19px]">
            {buttonText}
          </BlackButton>
        </Link>
        <Icons.arrowDownRight className="mt-[50px] hidden size-8 animate-[bounce-y_1.5s_ease-in-out_infinite] text-black md:block" />
      </FadeInUpContainer>
    </DotContainer>
  )
}
