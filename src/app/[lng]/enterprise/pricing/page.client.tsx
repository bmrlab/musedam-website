
'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useTheme } from '@/providers/Theme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
    return () => {
      setTheme('light')
    }
  }, [setTheme])

  return <React.Fragment />
}

export default PageClient
