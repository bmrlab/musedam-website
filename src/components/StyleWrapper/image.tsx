import { motion } from 'framer-motion'
import Image from 'next/image'
import { twx } from '@/utilities/cn'

export const MotionImage = motion.create(Image)

export const ShadowImage = twx(Image)`drop-shadow-[0px_4px_30px_4px_#00000014]`
export const MotionShadowImage = motion.create(ShadowImage)
