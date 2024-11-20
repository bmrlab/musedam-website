import React from 'react'
import { LanguageProvider } from '@/providers/Language'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  lng: string
  children: React.ReactNode
}> = ({ lng, children }) => {
  return (
    <LanguageProvider lng={lng}>
      <ThemeProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
