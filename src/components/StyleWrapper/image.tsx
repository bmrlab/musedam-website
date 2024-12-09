import Image from 'next/image'
import { twx } from '@/utilities/cn'
import { motion } from 'framer-motion'

export const MotionImage = motion.create(Image)

export const ShadowImage = twx(Image)`drop-shadow-[0px_4px_30px_4px_#00000014]`
export const MotionShadowImage = motion.create(ShadowImage)

export const AnimationImagePreset = twx(
  Image,
)`animate-in fade-in ease-in-out duration-800 [animation-fill-mode:backwards]`

export const BottomToTopImage = twx(AnimationImagePreset)`slide-in-from-bottom-10`
export const TopToBottomImage = twx(AnimationImagePreset)`slide-in-from-top-10`
export const LeftToRightImage = twx(AnimationImagePreset)`slide-in-from-left-10`
export const RightToLeftImage = twx(AnimationImagePreset)`slide-in-from-right-10`
