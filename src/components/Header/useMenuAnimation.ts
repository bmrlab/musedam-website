import { useEffect, useState } from 'react'
import { AnimationSequence, stagger, useAnimate } from 'framer-motion'

export function useMenuAnimation(isOpen: boolean) {
  const [scope, animate] = useAnimate()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    if (!hasMounted) {
      // 标记组件已经挂载过一次，避免初始动画
      setHasMounted(true)
      return
    }

    const menuAnimations = isOpen
      ? [
          [
            'nav',
            { transform: 'translateY(0%)' },
            { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
          ],
          [
            'li',
            { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' },
            { delay: stagger(0.05), at: '-0.1' },
          ],
        ]
      : [
          [
            'li',
            { transform: 'scale(0.5)', opacity: 0, filter: 'blur(10px)' },
            { delay: stagger(0.05, { from: 'last' }), at: '<' },
          ],
          ['nav', { transform: 'translateY(-100%)' }, { at: '-0.1' }],
        ]

    animate(menuAnimations as AnimationSequence)
  }, [animate, isOpen])

  return scope
}
