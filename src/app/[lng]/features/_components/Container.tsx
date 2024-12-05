import { PropsWithChildren } from 'react'
import { cn } from '@/utilities/cn'
import { motion } from 'framer-motion'

import { FlexCenterContainer } from '@/components/StyleWrapper/Container'

export type FeaturesContainerProps = PropsWithChildren<
  {
    bgColor: string
    handleAnimationComplete: (step: number) => void
    containerClassName?: string
  } & React.HTMLAttributes<HTMLDivElement>
>

export default function FeaturesContainer({
  bgColor,
  handleAnimationComplete,
  className,
  children,
  containerClassName,
  ...props
}: FeaturesContainerProps) {
  return (
    <FlexCenterContainer
      style={{
        height: '100%',
        background: bgColor,
      }}
      className={cn('rounded-b-[30px] md:rounded-b-none', containerClassName)}
      {...props}
    >
      <motion.div
        className={cn(
          'grid w-full justify-items-center px-[24.09px] py-10 md:w-[640px] md:p-0',
          className,
        )}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.5 }}
        onAnimationComplete={() => handleAnimationComplete(0)}
      >
        {children}
      </motion.div>
    </FlexCenterContainer>
  )
}
