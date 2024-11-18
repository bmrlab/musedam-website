import { Point, ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexColContainer } from '@/components/StyleWrapper/container'

export type TextDisplayProps = ShowcaseProps

export default function TextDisplay({ title, description, points }: TextDisplayProps) {
  return (
    <FlexColContainer className="p-[80px] gap-6">
      <h1 className="font-baskervville font-normal text-[48px] leading-[54.91px] tracking-[1px] text-[#141414] text-start">
        {title}
      </h1>
      <p className="font-mono font-medium text-[16px] leading-[24px] tracking-[2%] text-black">
        {description}
      </p>
      <FlexColContainer className="gap-6">
        {points.map((point, index) => (
          <Point key={index} {...point}></Point>
        ))}
      </FlexColContainer>
    </FlexColContainer>
  )
}
