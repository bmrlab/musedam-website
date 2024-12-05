import { useCallback, useEffect, useRef } from 'react'
import { useAnimation, useInView } from 'framer-motion'
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


  const controls = useAnimation();

  useEffect(() => {
    if (isMobile !== undefined && isBuildFinished(1)) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.6 }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isBuildFinished]);

  useEffect(() => {
    controls.set({ opacity: 0, x: isMobile ? '-10%' : '10%' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);


  return {
    ref,
    isBuildFinished,
    controls
  }
}
