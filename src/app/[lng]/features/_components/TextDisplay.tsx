import { FlexColContainer } from '@/components/StyleWrapper/Container'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { Point, ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'

export type TextDisplayProps = ShowcaseProps

export default function TextDisplay({ title, description, points }: TextDisplayProps) {
  return (
    <FadeInUpContainer>
      <FlexColContainer className="gap-6 px-6 py-12 md:p-[80px]">
        <h1 className="text-start font-euclid text-[32px] font-normal leading-[40px] tracking-[1px] text-[#141414] md:text-[48px] md:leading-[54.91px]">
          {title}
        </h1>
        {description && <p className="font-mono text-[16px] font-medium leading-[24px] tracking-[2%] text-black">
          {description}
        </p>}
        <FlexColContainer className="gap-6">
          {points.map((point, index) => (
            <Point key={index} {...point}></Point>
          ))}
        </FlexColContainer>
      </FlexColContainer>
    </FadeInUpContainer>
  )
}
