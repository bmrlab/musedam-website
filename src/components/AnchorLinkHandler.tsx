'use client'

import { useEffect } from 'react'

/**
 * 客户端组件，用于处理锚点链接的平滑滚动
 */
export function AnchorLinkHandler() {
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      
      // 检查是否是锚点链接
      if (target.tagName === 'A' && target.classList.contains('anchor-link')) {
        const anchor = target.getAttribute('data-anchor')
        if (anchor) {
          e.preventDefault()
          const targetElement = document.querySelector(anchor)
          if (targetElement) {
            targetElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }
      }
    }

    // 添加事件监听器
    document.addEventListener('click', handleAnchorClick)

    // 清理函数
    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return null // 这个组件不渲染任何内容
}
