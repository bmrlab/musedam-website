'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export interface ContextType {
  language: string
  setLanguage: (lng: string) => void
  changeLocale: (lng?: string) => void
}

const initialContext: ContextType = {
  language: 'en-US',
  setLanguage: () => null,
  changeLocale: () => null
}

const LanguageContext = createContext(initialContext)

export const LanguageProvider = ({ lng, children }: { lng: string; children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>(lng)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const changeLocale = useCallback((lang?: 'en-US' | 'zh-CN') => {
    if (lang && language == lang) return

    let otherLocale = language === 'zh-CN' ? 'en-US' : 'zh-CN'
    if (lang) {
      otherLocale = lang
    }

    const currentParams = searchParams ? new URLSearchParams(searchParams) : undefined
    const queryString = currentParams?.toString()
    const newPathname = pathname?.replace(/^\/(en-US|zh-CN)/, '/' + otherLocale) || ''
    const newUrl = `${newPathname}${queryString ? `?${queryString}` : ''}`
    router.replace(newUrl)
    setLanguage(otherLocale)
  }, [language, searchParams, pathname, router])


  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): ContextType => useContext(LanguageContext)
