import { cn, twx } from '@/utilities/cn'
import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import Image from 'next/image'

export type FeaturesCardProps = {
  title: string
  description: string
  iconUrl: string
  bgColor: string
  iconBgColor: string
}

export default function FeaturesCard({
  title,
  description,
  bgColor,
  iconBgColor,
  iconUrl,
  className,
}: FeaturesCardProps & { className?: string }) {
  return (
    <div
      style={{ background: bgColor }}
      className={cn('flex flex-col rounded-[20px] py-12 px-6 cursor-pointer', className)}
    >
      <h1 className="text-nowrap font-baskervville font-normal text-[36px] leading-[41.19px] tracking-[1px]">
        {title}
      </h1>
      <Divider className="my-3" />
      <p className="text-[18px] leading-[28px] text-black/60">{description}</p>
      <div className="flex-1 flex items-end">
        <FlexCenterContainer
          style={{ background: iconBgColor }}
          className="w-full h-[293px] rounded-full relative"
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
