export const zhLng = 'zh'
export const enLng = 'en'
export const fallbackLng = enLng
export const languages = [fallbackLng, zhLng]
export const defaultNS = 'translation'
export const cookieName = 'i18next'
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
  return lng === 'zh'
}
