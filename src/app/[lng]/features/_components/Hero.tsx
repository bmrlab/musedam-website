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
}
export default function Hero({
  tag,
  title,
  description,
  tagColor,
  buttonText,
  buttonHref,
}: HeroProps) {
  return (
    <DotContainer className="flex shrink-0 flex-col justify-center bg-white px-6 py-[60px] md:min-h-[calc(100vh-70px)] md:px-20 md:py-[100px]">
      <div className="mb-2">
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
            'mb-[16px] font-baskervville text-[38px] font-normal leading-[43.47px] tracking-[1px] md:mb-6 md:text-[120px] md:leading-[132px]',
          )}
        >
          {title}
        </h1>
        <p className="mb-12 font-mono text-[14px] font-light leading-[28px] tracking-[2%] md:text-[24px] md:leading-[38.4px]">
          {description}
        </p>
      </FadeInUpContainer>
      <FadeInUpContainer className="flex h-[58px] items-center justify-center md:justify-between">
        <Link href={buttonHref ?? MUSEDAM_LOGIN_URL}>
          <BlackButton className="h-full rounded-full px-[52.2px] py-[19px] font-mono text-[16px] font-normal leading-5 text-white transition-colors hover:bg-gray-800">
            {buttonText}
          </BlackButton>
        </Link>
        <Icons.arrowDownRight className="hidden size-8 text-black md:block" />
      </FadeInUpContainer>
    </DotContainer>
  )
}
