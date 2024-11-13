'use client'

import { useCallback, useState } from 'react'

export default function useAnimationTrace({ initialStep = 0 } = {}) {
  const [animationStep, setAnimationStep] = useState(initialStep)

  const handleAnimationComplete = useCallback(
    (i: number) => {
      if (animationStep < i) {
        setAnimationStep(i)
      }
    },
    [animationStep],
  )

  const isBuildFinished = useCallback((i: number) => animationStep >= i, [animationStep])

  return { handleAnimationComplete, isBuildFinished }
}
