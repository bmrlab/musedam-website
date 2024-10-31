import { useCallback, useRef } from 'react'
import { useInView } from 'framer-motion'
import useIsMobile from '@/hooks/useIsMobile'

export function useAnimationControl(
  _isBuildFinished: (i: number) => boolean,
  options = { once: true, amount: 0.5 },
) {
  const isMobile = useIsMobile()
  const ref = useRef(null)

  // @ts-ignore
  const isInView = useInView(ref, {
    once: options.once,
    amount: options.amount,
  })

  const isBuildFinished = useCallback(
    (i: number) => {
      if (isMobile) {
        return _isBuildFinished(i) && isInView
      } else {
        return _isBuildFinished(i)
      }
    },
    [_isBuildFinished, isInView, isMobile],
  )

  return {
    ref,
    isBuildFinished,
  }
}
