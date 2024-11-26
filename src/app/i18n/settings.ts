export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh']
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
