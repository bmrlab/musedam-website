'use client'

import { useState } from 'react'
import { cn } from '@/utilities/cn'

import useIsMobile from '@/hooks/useIsMobile'

interface HighlightTextProps {
  text: string
  color: string
  underlineHeight?: string
  className?: string
}

export default function HighlightText({
  text,
  color,
  underlineHeight,
  className,
}: HighlightTextProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useIsMobile()

  return (
    <span
      className={cn('relative inline-block cursor-pointer', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-[1] transition-colors duration-200">{text}</span>
      <span
        className="absolute bottom-0 left-0 w-full transition-all duration-200"
        style={{
          backgroundColor: color,
          height: isHovered ? '100%' : `${(underlineHeight ?? isMobile) ? 4 : 7}px`,
        }}
      />
    </span>
  )
}
