'use client'

import { PropsWithChildren } from 'react'
import { HTMLMotionProps, motion } from 'framer-motion'

interface FadeInUpProps extends HTMLMotionProps<'div'> {
  amount?: number
  once?: boolean
}

function BaseAnimationContainer({
  children,
  amount = 0.5,
  once = true,
  ...props
}: PropsWithChildren<FadeInUpProps>) {
  return (
    <motion.div
      {...props}
      viewport={{
        amount,
        once,
      }}
    >
      {children}
    </motion.div>
  )
}

export const fadeInUpProperty = {
  initial: 'hidden',
  whileInView: 'visible',
  variants: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
  transition: {
    duration: 0.5,
    delay: 0,
    ease: 'easeOut',
  },
}

export const fadeInProperty = {
  initial: 'hidden',
  whileInView: 'visible',
  variants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },
  transition: {
    duration: 0.5,
    delay: 0,
    ease: 'easeOut',
  },
}

export const FadeInUpContainer = ({ children, ...props }: PropsWithChildren<FadeInUpProps>) => (
  <BaseAnimationContainer {...fadeInUpProperty} {...props}>
    {children}
  </BaseAnimationContainer>
)

export const FadeInContainer = ({ children, ...props }: PropsWithChildren<FadeInUpProps>) => (
  <BaseAnimationContainer {...fadeInProperty} {...props}>
    {children}
  </BaseAnimationContainer>
)
