'use client'

import { useEffect } from 'react'

// 配置常量
const MOBILE_BREAKPOINT = 768 // 移动端断点 (px)
const MOBILE_OFFSET = 56      // 移动端标题高度偏移 (px)
const DESKTOP_OFFSET = 70     // 桌面端标题高度偏移 (px)

/**
 * 客户端组件，用于处理锚点链接的平滑滚动
 * 支持响应式偏移量：移动端 56px，桌面端 70px
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
            // 检测是否为移动端并设置相应的偏移量
            const isMobile = window.innerWidth < MOBILE_BREAKPOINT
            const offset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET

            // 获取目标元素的位置
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            // 平滑滚动到目标位置
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
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
