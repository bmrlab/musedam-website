/**
 * 将文本转换为适合作为 HTML ID 的格式
 * @param text 原始文本
 * @returns 格式化的 ID 字符串
 */
export function generateHeadingId(text: string): string {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    // 移除 HTML 标签
    .replace(/<[^>]*>/g, '')
    // 替换空格和特殊字符为连字符
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')
    // 确保不为空
    || 'heading'
}

/**
 * 确保 ID 在给定的 ID 列表中是唯一的
 * @param baseId 基础 ID
 * @param existingIds 已存在的 ID 列表
 * @returns 唯一的 ID
 */
export function ensureUniqueId(baseId: string, existingIds: string[]): string {
  let uniqueId = baseId
  let counter = 1
  
  while (existingIds.includes(uniqueId)) {
    uniqueId = `${baseId}-${counter}`
    counter++
  }
  
  return uniqueId
}

/**
 * 从文本内容生成唯一的标题 ID
 * @param text 标题文本
 * @param existingIds 已存在的 ID 列表
 * @returns 唯一的标题 ID
 */
export function createUniqueHeadingId(text: string, existingIds: string[] = []): string {
  const baseId = generateHeadingId(text)
  return ensureUniqueId(baseId, existingIds)
}
