import { useCallback, useMemo } from 'react'

import useIsZhLng from '@/hooks/useIsZhLng'

export default function usePublicUrl(basePath: string) {
  const { isZhLng } = useIsZhLng()
  const realBasePath = useMemo(() => (isZhLng ? `${basePath}/ZH` : basePath), [basePath, isZhLng])

  const getUrl = useCallback(
    (path: string) => {
      return `${realBasePath}/${path}`
    },
    [realBasePath],
  )

  return { getUrl, realBasePath }
}
