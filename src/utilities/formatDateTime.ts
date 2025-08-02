import { format } from 'date-fns'

export const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  // 使用 date-fns 格式化为 "May 11, 2025" 格式
  return format(date, 'MMMM d, yyyy')
}

export const formatZhDateTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  // 使用 date-fns 格式化为 "2025-7-29" 格式
  return format(date, 'yyyy-M-d')
}
