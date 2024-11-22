'use client'

import { HTMLMotionProps, motion } from 'framer-motion'

interface FadeInUpProps extends HTMLMotionProps<'div'> {
  duration?: number
  delay?: number
}

export function FadeInUpContainer({
  children,
  duration = 0.5,
  delay = 0,
  ...props
}: FadeInUpProps) {
  return (
    <motion.div {...props} {...fadeInUpProperty}>
      {children}
    </motion.div>
  )
}

export const fadeInUpProperty = {
  initial: 'hidden',
  animate: 'visible',
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
