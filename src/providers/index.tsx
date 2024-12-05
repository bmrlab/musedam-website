import React from 'react'
import { LanguageProvider } from '@/providers/Language'

import { CountryProvider } from './Country'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  lng: string
  children: React.ReactNode
}> = ({ lng, children }) => {
  return (
    <LanguageProvider lng={lng}>
      <CountryProvider initialCountry={process.env.NEXT_PUBLIC_DEPLOY_REGION?.toLowerCase()}>
        <ThemeProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
        </ThemeProvider>
      </CountryProvider>
    </LanguageProvider>
  )
}
