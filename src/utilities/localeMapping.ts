/**
 * 将 Next.js 路由中的语言代码转换为 Payload CMS 支持的 locale 格式
 * @param lng - Next.js 路由中的语言代码 (zh-CN, en-US)
 * @returns Payload CMS 支持的 locale 格式 (zh, en)
 */
export function convertLngToPayloadLocale(lng: string): 'zh' | 'en' {
  // 处理 zh-CN -> zh 的映射
  if (lng === 'zh-CN') {
    return 'zh'
  }
  
  // 处理 en-US -> en 的映射
  if (lng === 'en-US') {
    return 'en'
  }
  
  // 兼容处理：如果已经是简化格式，直接返回
  if (lng === 'zh' || lng === 'en') {
    return lng as 'zh' | 'en'
  }
  
  // 默认返回英文
  return 'en'
}

/**
 * 检查语言代码是否为中文
 * @param lng - 语言代码
 * @returns 是否为中文
 */
export function isChineseLocale(lng: string): boolean {
  return lng === 'zh-CN' || lng === 'zh'
}
