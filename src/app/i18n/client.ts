'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/providers/Language'
import i18next, { FlatNamespace, KeyPrefix } from 'i18next'
// import LocizeBackend from 'i18next-locize-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { useCookies } from 'react-cookie'
import {
  FallbackNs,
  initReactI18next,
  UseTranslationOptions,
  useTranslation as useTranslationOrg,
  UseTranslationResponse,
} from 'react-i18next'

import { cookieName, getOptions, languages } from './settings'
import { getDomain } from '@/utilities/cookieDomain'

const runsOnServerSide = typeof window === 'undefined'

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
    ),
  )
  // .use(LocizeBackend) // locize backend could be used on client side, but prefer to keep it in sync with server side
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : [],
  })

export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const [cookies, setCookie] = useCookies([cookieName])
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  const { language: lng } = useLanguage()
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // useEffect(() => {
    //   if (cookies['x-lang'] === lng) return
    //   setCookie(cookieName, lng, { path: '/' })
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [lng, cookies['x-lang']])
  }
  return ret
}

export const useHeaderTranslation = () => useTranslation('header')
export const useFooterTranslation = () => useTranslation('footer')
export const useHighlightTranslation = () => useTranslation('highlight')
export const usePreceptTranslation = () => useTranslation('precept')
export const useFeaturesTranslation = () => useTranslation('features')
export const useLandingPageTranslation = () => useTranslation('landing-page')
