/**
 * 将文本转换为适合作为 HTML ID 的格式
 * 使用 encodeURIComponent 并进一步处理确保生成的 ID 完全兼容 CSS 选择器
 * @param text 原始文本
 * @returns 格式化的 ID 字符串
 */
export function generateHeadingId(text: string): string {
  if (!text) return ''

  const cleanText = text
    .trim()
    // 移除 HTML 标签
    .replace(/<[^>]*>/g, '')

  if (!cleanText) return 'heading'

  // 使用 encodeURIComponent 编码文本
  let encodedText = encodeURIComponent(cleanText)
    // 将 % 替换为 - 使其更易读
    .replace(/%/g, '-')

  // 进一步编码 encodeURIComponent 不处理的特殊字符
  // 这些字符在 CSS 选择器中可能有问题
  encodedText = encodedText
    .replace(/[()]/g, (match) => `-${match.charCodeAt(0).toString(16)}-`)
    .replace(/[*+.?^${}|[\]\\]/g, (match) => `-${match.charCodeAt(0).toString(16)}-`)
    .replace(/['"]/g, (match) => `-${match.charCodeAt(0).toString(16)}-`)
    // 清理多个连续的连字符
    .replace(/-+/g, '-')
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')

  // 确保 ID 以字母开头（CSS 选择器要求）
  if (/^\d/.test(encodedText)) {
    encodedText = `id-${encodedText}`
  }

  return encodedText || 'heading'
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
