import { cookies } from 'next/headers'

import { countryCookieName, isZh } from '@/app/i18n/settings'

export const getCountry = async (lng: string): Promise<string> => {
  // 从 Cookie 中获取国家信息
  const cookieStore = await cookies()
  return cookieStore.get(countryCookieName)?.value || (isZh(lng) ? 'CN' : 'US')
}

export const isInChina = async (lng: string): Promise<boolean> => {
  return (await getCountry(lng)) === 'CN'
}
