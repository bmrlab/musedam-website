'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import Image from 'next/image'

import { FlexCenterContainer } from '@/components/StyleWrapper/Container'

export default function Loading() {
  const [progress, setProgress] = useState(0)

  const pushProgress = useCallback(() => {
    setProgress((oldProgress) => {
      // 前80%快速加载
      const increment =
        oldProgress < 80
          ? Math.random() * 40 // 更大的增量实现快速加载
          : Math.random() * 10 // 80%之后放慢速度

      // 使用Math.floor确保整数
      return Math.floor(Math.min(oldProgress + increment, 99))
    })
  }, [setProgress])

  useLayoutEffect(() => {
    pushProgress()
  }, [pushProgress])

  useEffect(() => {
    const timer = setInterval(() => {
      pushProgress()
    }, 100)

    return () => {
      clearInterval(timer)
      setProgress(100)
    }
  }, [pushProgress])

  return (
    <div className="fixed top-0 z-[100] h-screen w-screen bg-black">
      <FlexCenterContainer className="flex size-full flex-col">
        <Image src="/assets/logo-dark.svg" width={100} height={100} alt="muse logo" />
        <div className="absolute bottom-[80px] flex w-[194px] flex-col items-center gap-4">
          <p className="font-mono text-[16px] font-light leading-[24px] text-white">{progress}%</p>
          <div
            className="h-[2px] self-start bg-[#043FFB] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </FlexCenterContainer>
    </div>
  )
}
