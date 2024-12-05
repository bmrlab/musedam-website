import { ComponentType, useEffect, useMemo, useRef, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn, twx } from '@/utilities/cn'
import { HTMLMotionProps, motion, MotionProps } from 'framer-motion'

import { MotionImage } from '@/components/StyleWrapper/image'

interface BaseProps {
  width: number | string
  height: number | string
  className?: string
  containerClassName?: string
}

interface WithSkeletonProps {
  isLoading?: boolean
}

type MotionImageType = Omit<ImageProps, keyof MotionProps> & MotionProps
type MotionVideoType = HTMLMotionProps<'video'> & { src: string; type?: string }

function createSkeletonHOC<P extends BaseProps>(
  WrappedComponent: ComponentType<P>,
  type: 'image' | 'video',
) {
  return function WithSkeletonWrapper(props: P & WithSkeletonProps) {
    const {
      width,
      height,
      isLoading: _isLoading,
      className,
      containerClassName,
      ...restProps
    } = props
    const [isLoading, setIsLoading] = useState(_isLoading ?? true)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
      if (type !== 'video') return

      const video = videoRef.current
      if (!video) return

      const handleLoaded = () => {
        setIsLoading(false)
      }

      // 添加多个事件监听以提高可靠性
      const events = ['loadeddata', 'loadedmetadata', 'canplay']
      events.forEach((event) => {
        video.addEventListener(event, handleLoaded)
      })

      // 检查视频是否已经加载
      if (video.readyState >= 1) {
        handleLoaded()
      }

      return () => {
        events.forEach((event) => {
          video.removeEventListener(event, handleLoaded)
        })
      }
    }, [type])

    // 添加超时处理
    useEffect(() => {
      if (type !== 'video') return

      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
        }
      }, 5000)

      return () => clearTimeout(timeoutId)
    }, [isLoading, type])

    const loadHandlers = useMemo(() => {
      return type === 'video'
        ? {
            ref: videoRef,
            onLoadedData: () => setIsLoading(false),
          }
        : { onLoad: () => setIsLoading(false) }
    }, [type])

    return (
      <div className={cn('relative', containerClassName)} style={{ width, height }}>
        {isLoading && (
          <div
            className="absolute inset-0 rounded-[8px] bg-white"
            style={{
              width,
              height,
              boxShadow: '0px 2px 30px 4px rgba(0, 0, 0, 0.08)',
            }}
          />
        )}
        <WrappedComponent
          {...(restProps as P)}
          {...loadHandlers}
          width={width}
          height={height}
          className={cn(
            // 'transition-opacity duration-300 ease-in-out',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
        >
          {type === 'video' && 'src' in props ? (
            <source src={props.src as string} type={(props as any).type || 'video/mp4'} />
          ) : null}
        </WrappedComponent>
      </div>
    )
  }
}

// 创建专门的图片和视频 HOC
export const withImageSkeleton = <P extends MotionImageType & BaseProps>(
  Component: ComponentType<P>,
) => createSkeletonHOC(Component, 'image')

export const withVideoSkeleton = <P extends MotionVideoType & BaseProps>(
  Component: ComponentType<P>,
) => createSkeletonHOC(Component, 'video')

const MotionVideo = motion.create('video')

export const MotionVideoWithSkeleton = withVideoSkeleton(MotionVideo)

const ShadowImage = twx(Image)`shadow-[0_1.17px_17.6px_2.35px_#00000014]`
const ShadowImageRounded = twx(ShadowImage)`rounded-[4.69px]`

export const MotionImageWithSkeleton = withImageSkeleton(MotionImage)
export const MotionShadowImageRoundedWithSkeleton = withImageSkeleton(
  motion.create(ShadowImageRounded),
)
