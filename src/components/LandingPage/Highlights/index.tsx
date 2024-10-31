'use client'

import useIsMobile from '@/hooks/useIsMobile'
import HighlightsDesktop from './desktop'
import HighlightsMobile from './mobile'

export default function Highlights() {
  const isMobile = useIsMobile()
  return isMobile ? <HighlightsMobile /> : <HighlightsDesktop />
}
