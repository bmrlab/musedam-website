'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import type { Theme } from '@/providers/Theme/types'
import canUseDOM from '@/utilities/canUseDOM'

export interface ContextType {
  language: string
  setLanguage: (lng: string) => void
}

const initialContext: ContextType = {
  language: 'en',
  setLanguage: () => null,
}

const LanguageContext = createContext(initialContext)

export const LanguageProvider = ({ lng, children }: { lng: string; children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>(lng)

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): ContextType => useContext(LanguageContext)
