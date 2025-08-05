import React from 'react'
import { cn } from '@/utilities/cn'

interface AdaptiveTableProps {
  children: React.ReactNode
  className?: string
}

/**
 * 简化版自适应表格组件
 * 使用纯 CSS 解决方案，避免水合警告和页面抖动
 *
 * 工作原理：
 * 1. 容器使用 overflow-x-auto 处理水平滚动
 * 2. 表格使用 w-max 保持内容的自然宽度
 * 3. 当表格宽度小于容器时，通过 CSS 让表格占满容器
 * 4. 当表格宽度大于容器时，显示水平滚动条
 */
export function AdaptiveTable({ children, className }: AdaptiveTableProps) {
  return (
    <div
      className={cn(
        'no-scrollbar my-8 overflow-x-auto rounded-[12px] border border-[#E3E3E3]',
        // 使用 flex 布局来实现自适应
        'flex',
        className,
      )}
      style={{
        WebkitOverflowScrolling: 'auto',
        // 只限制水平方向的滚动链，保留垂直滚动传递给页面
        overscrollBehaviorX: 'none',
        overscrollBehaviorY: 'auto',
      }}
    >
      <table
        suppressHydrationWarning
        className="shrink-0"
        style={{
          // 关键：使用 CSS 来实现您要求的逻辑
          // 当内容宽度小于容器时，表格占满容器（类似 w-full）
          // 当内容宽度大于容器时，表格保持内容宽度（类似 w-max）
          width: 'max(100%, max-content)',
          minWidth: '100%',
        }}
      >
        {children}
      </table>
    </div>
  )
}
