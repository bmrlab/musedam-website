import { useCallback, useState } from 'react'

export default function useAnimationComplete({
  totalAnimations,
  onAnimationComplete,
}: {
  totalAnimations: number
  onAnimationComplete: () => void
}) {
  const [animationCount, setAnimationCount] = useState(0)

  const handleAnimationComplete = useCallback(() => {
    let newCount = animationCount
    setAnimationCount((prev) => {
      newCount = prev + 1
      return newCount
    })
    if (newCount === totalAnimations) {
      onAnimationComplete()
    }
  }, [animationCount, onAnimationComplete, totalAnimations])

  return {
    animationCount,
    handleAnimationComplete,
  }
}
