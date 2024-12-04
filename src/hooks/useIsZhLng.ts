import { useMemo } from 'react'
import { useLanguage } from '@/providers/Language'

import { zhLng } from '@/app/i18n/settings'

export default function useIsZhLng() {
  const { language } = useLanguage()

  const isZhLng = useMemo(() => language === zhLng, [language])

  return { isZhLng }
}
