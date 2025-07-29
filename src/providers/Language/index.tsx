'use client'

import React, { createContext, useContext, useState } from 'react'

export interface ContextType {
  language: string
  setLanguage: (lng: string) => void
}

const initialContext: ContextType = {
  language: 'en-US',
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
