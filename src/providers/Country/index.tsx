'use client'

import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { Region } from '@/constant/enum/region'

interface CountryContextType {
  country?: string
  setCountry: (country: string) => void
  isInChina: boolean
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export const CountryProvider = ({
  children,
  initialCountry,
}: {
  children: ReactNode
  initialCountry?: string
}) => {
  const [country, setCountry] = useState<string | undefined>(initialCountry)

  const isInChina = useMemo(() => country === Region.MainLand, [country])
  return (
    <CountryContext.Provider value={{ country, setCountry, isInChina }}>
      {children}
    </CountryContext.Provider>
  )
}

export const useCountry = () => {
  const context = useContext(CountryContext)
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}
