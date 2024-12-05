import React from 'react'
import { LanguageProvider } from '@/providers/Language'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CountryProvider } from './Country'

export const Providers: React.FC<{
  lng: string
  country?: string
  children: React.ReactNode
}> = ({ lng, children, country }) => {
  return (
    <LanguageProvider lng={lng}>
      <CountryProvider initialCountry={country}>
        <ThemeProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
        </ThemeProvider>
      </CountryProvider>
    </LanguageProvider>
  )
}
