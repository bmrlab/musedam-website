export const zhLng = 'zh-CN'
export const enLng = 'en-US'
export const fallbackLng = enLng
export const languages = [enLng, zhLng]
export const defaultNS = 'translation'
export const languageCookieName = 'x-lang'
export const countryCookieName = 'country'

export function getOptions(lng = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}

export function isZh(lng: string) {
  return lng === 'zh-CN'
}
