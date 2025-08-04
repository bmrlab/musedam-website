'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/cn'

interface AdaptiveTableProps {
  children: React.ReactNode
  className?: string
}

export function AdaptiveTable({ children, className }: AdaptiveTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const [tableWidth, setTableWidth] = useState<'w-full' | 'w-max'>('w-full')

  const checkTableWidth = useCallback(() => {
    if (!containerRef.current || !tableRef.current) return

    const container = containerRef.current
    const table = tableRef.current

    // 获取容器的可用宽度（减去 padding 和 border）
    const containerStyle = window.getComputedStyle(container)
    const containerPaddingLeft = parseFloat(containerStyle.paddingLeft)
    const containerPaddingRight = parseFloat(containerStyle.paddingRight)
    const containerBorderLeft = parseFloat(containerStyle.borderLeftWidth)
    const containerBorderRight = parseFloat(containerStyle.borderRightWidth)

    const availableWidth = container.clientWidth - containerPaddingLeft - containerPaddingRight - containerBorderLeft - containerBorderRight

    // 临时设置表格为 w-max 来获取其自然宽度
    table.style.width = 'max-content'
    const naturalTableWidth = table.scrollWidth

    // 根据比较结果设置宽度类
    if (naturalTableWidth > availableWidth) {
      setTableWidth('w-max')
    } else {
      setTableWidth('w-full')
    }

    // 清除临时样式
    table.style.width = ''
  }, [])

  useEffect(() => {
    // 初始检查
    checkTableWidth()

    // 监听窗口大小变化
    let resizeObserver: ResizeObserver | null = null
    let mutationObserver: MutationObserver | null = null

    // 检查浏览器支持
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(checkTableWidth)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }
    } else {
      // 降级方案：使用 window resize 事件
      window.addEventListener('resize', checkTableWidth)
    }

    // 监听表格内容变化
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(checkTableWidth)
      if (tableRef.current) {
        mutationObserver.observe(tableRef.current, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', checkTableWidth)
      }
      if (mutationObserver) {
        mutationObserver.disconnect()
      }
    }
  }, [checkTableWidth])

  return (
    <div
      ref={containerRef}
      className={cn(
        "no-scrollbar my-8 overflow-x-auto rounded-[12px] border border-[#E3E3E3]",
        className
      )}
      style={{
        WebkitOverflowScrolling: 'auto',
        overscrollBehavior: 'none',
        overscrollBehaviorX: 'none',
      }}
    >
      <table ref={tableRef} className={tableWidth}>
        {children}
      </table>
    </div>
  )
}
