import { cn, twx } from '@/utilities/cn'
import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import Image from 'next/image'

export type FeaturesCardProps = {
  title: string
  description: string
  iconUrl: string
  bgColor: string
  iconBgColor: string
  darkness?: boolean
}

export default function FeaturesCard({
  title,
  description,
  bgColor,
  iconBgColor,
  iconUrl,
  className,
  darkness,
}: FeaturesCardProps & { className?: string }) {
  return (
    <div
      style={{ background: bgColor }}
      className={cn('flex cursor-pointer flex-col rounded-[20px] p-6 md:py-12', className)}
    >
      <h1
        className={cn(
          'text-nowrap font-baskervville text-[30px] font-normal leading-[34.32px] tracking-[1px] text-black md:text-[36px] md:leading-[41.19px]',
          darkness && 'text-white',
        )}
      >
        {title}
      </h1>
      <Divider className={cn('my-3', darkness && 'border-white')} />
      <p
        className={cn(
          'font-mono text-[16px] font-light leading-[22px] text-[#141414]',
          darkness && 'text-white',
        )}
      >
        {description}
      </p>
      <div className="flex flex-1 items-end">
        <FlexCenterContainer
          style={{ background: iconBgColor }}
          className="relative h-[232px] w-full rounded-full md:h-[293px]"
        >
          <Image src={iconUrl} fill alt={title} />
        </FlexCenterContainer>
      </div>
    </div>
  )
}

const Divider = twx.div`
  w-full
  border-t
  border-black
  transition-none
`

export function FeaturesRectIconCard({
  title,
  description,
  bgColor,
  iconBgColor,
  iconUrl,
  className,
  darkness,
}: FeaturesCardProps & { className?: string }) {
  return (
    <div
      style={{ background: bgColor }}
      className={cn('flex cursor-pointer flex-col rounded-[24px] px-6 py-[30px]', className)}
    >
      <h1
        className={cn(
          'text-nowrap font-baskervville text-[30px] font-normal leading-[34.32px] tracking-[1px] text-black',
          darkness && 'text-white',
        )}
      >
        {title}
      </h1>
      <Divider className={cn('my-3', darkness && 'border-white')} />
      <p
        className={cn(
          'font-mono text-[16px] font-light leading-[22px] text-[#141414]',
          darkness && 'text-white',
        )}
      >
        {description}
      </p>
      <div className="flex flex-1 items-end">
        <FlexCenterContainer
          style={{ background: iconBgColor }}
          className="relative h-[199px] w-full rounded-[20px]"
        >
          <Image src={iconUrl} fill alt={title} />
        </FlexCenterContainer>
      </div>
    </div>
  )
}
