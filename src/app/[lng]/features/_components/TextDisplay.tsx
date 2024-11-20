import { Point, ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexColContainer } from '@/components/StyleWrapper/container'

export type TextDisplayProps = ShowcaseProps

export default function TextDisplay({ title, description, points }: TextDisplayProps) {
  return (
    <FlexColContainer className="gap-6 px-6 py-12 md:p-[80px]">
      <h1 className="text-start font-baskervville text-[48px] font-normal leading-[54.91px] tracking-[1px] text-[#141414]">
        {title}
      </h1>
      <p className="font-mono text-[16px] font-medium leading-[24px] tracking-[2%] text-black">
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
