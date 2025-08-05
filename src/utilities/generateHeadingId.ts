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
    // 移除 emoji 和其他 Unicode 符号
    // 这个正则表达式匹配大部分 emoji 和符号
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // 替换空格和特殊字符为连字符
    // 保留字母、数字、中文字符（包括扩展中文字符集），其他字符替换为连字符
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]+/g, '-')
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
