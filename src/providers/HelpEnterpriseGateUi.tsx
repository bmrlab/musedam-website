'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type HelpEnterpriseGateUiContextValue = {
  registerGate: () => void
  unregisterGate: () => void
  hideFooterFromGate: boolean
}

const HelpEnterpriseGateUiContext = createContext<HelpEnterpriseGateUiContextValue | null>(null)

export function HelpEnterpriseGateUiProvider({ children }: { children: React.ReactNode }) {
  const [gateCount, setGateCount] = useState(0)

  const registerGate = useCallback(() => {
    setGateCount((c) => c + 1)
  }, [])

  const unregisterGate = useCallback(() => {
    setGateCount((c) => Math.max(0, c - 1))
  }, [])

  const hideFooterFromGate = gateCount > 0

  const value = useMemo(
    () => ({ registerGate, unregisterGate, hideFooterFromGate }),
    [registerGate, unregisterGate, hideFooterFromGate],
  )

  return (
    <HelpEnterpriseGateUiContext.Provider value={value}>{children}</HelpEnterpriseGateUiContext.Provider>
  )
}

export function useHelpEnterpriseGateUi(): HelpEnterpriseGateUiContextValue {
  const ctx = useContext(HelpEnterpriseGateUiContext)
  if (!ctx) {
    throw new Error('useHelpEnterpriseGateUi must be used within HelpEnterpriseGateUiProvider')
  }
  return ctx
}

/** 挂载在 HelpCenterEnterpriseGate 内，通知布局隐藏 Footer */
export function HelpEnterpriseGateClientMarker() {
  const { registerGate, unregisterGate } = useHelpEnterpriseGateUi()

  useEffect(() => {
    registerGate()
    return () => unregisterGate()
  }, [registerGate, unregisterGate])

  return null
}
