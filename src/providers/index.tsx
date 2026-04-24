import React from 'react'
import { LanguageProvider } from '@/providers/Language'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CountryProvider } from './Country'
import { QuotationStoreProvider } from './QuotationStore'
import { HelpEnterpriseGateUiProvider } from './HelpEnterpriseGateUi'

export const Providers: React.FC<{
  lng: string
  country?: string
  children: React.ReactNode
}> = ({ lng, children, country }) => {
  return (
    <CountryProvider initialCountry={country}>
      <LanguageProvider lng={lng}>

        <ThemeProvider>
          <HeaderThemeProvider>
            <QuotationStoreProvider>
              <HelpEnterpriseGateUiProvider>{children}</HelpEnterpriseGateUiProvider>
            </QuotationStoreProvider>
          </HeaderThemeProvider>
        </ThemeProvider>
      </LanguageProvider>

    </CountryProvider>
  )
}
