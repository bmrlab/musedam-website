import { PropsWithChildren } from 'react'
import { Circle } from 'lucide-react'

import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'

type PointsProps = { keyword: string; description: string }

export type ShowcaseProps = {
  title: string
  description?: string
  points: PointsProps[]
}

export default function Showcase({
  title,
  description,
  points,
  children,
}: PropsWithChildren<ShowcaseProps>) {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2">
      <div className="col-span-1">{children}</div>
      <FadeInUpContainer className="col-span-1 p-6 md:p-20">
        <h2 className="font-baskervville text-[48px] font-normal leading-[54.91px] tracking-[1px]">
          {title}
        </h2>
        <p className="mt-6 font-mono text-[16px] font-light leading-6 tracking-[2%]">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-6">
          {points.map((point, index) => (
            <Point key={`${point}-${index}`} {...point} />
          ))}
        </div>
      </FadeInUpContainer>
    </div>
  )
}

export const Point = ({ keyword, description }: PointsProps) => {
  return (
    <div className="flex items-start">
      <FlexCenterContainer className="h-[28px] px-2">
        <Circle className="size-1 fill-current" />
      </FlexCenterContainer>
      <div className="space-y-2 font-mono text-[16px] tracking-[2%]">
        <h2 className="font-medium leading-[28px]">{keyword}</h2>
        <p className="font-light leading-6">{description}</p>
      </div>
    </div>
  )
}
