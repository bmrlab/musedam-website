'use client'

import { useEffect } from 'react'
import { generateHeadingId } from '@/utilities/generateHeadingId'

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

          let targetElement: Element | null = null

          // 如果锚点以 # 开头，需要处理锚点文本转换
          if (anchor.startsWith('#')) {
            // 提取 # 后的文本
            const anchorText = anchor.substring(1)

            if (anchorText) {
              try {
                // 解码 URL 编码的锚点文本（对未编码文本无影响）
                const decodedAnchorText = decodeURIComponent(anchorText)

                // 使用解码后的文本生成标准的 HTML ID
                const convertedId = generateHeadingId(decodedAnchorText)

                if (convertedId) {
                  targetElement = document.querySelector(`#${convertedId}`)
                }
              } catch (error) {
                // 如果解码失败，使用原始文本生成 ID
                const convertedId = generateHeadingId(anchorText)
                if (convertedId) {
                  targetElement = document.querySelector(`#${convertedId}`)
                }
              }
            }
          } else {
            // 非 # 开头的锚点，直接查找
            targetElement = document.querySelector(anchor)
          }

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
          } else {
            // 如果找不到目标元素，在控制台输出调试信息
            console.warn(`锚点链接目标元素未找到: ${anchor}`)
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
