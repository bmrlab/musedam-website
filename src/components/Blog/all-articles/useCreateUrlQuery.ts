import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useCreateUrlQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  const removeQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.delete(name)

      return params.toString()
    },
    [searchParams],
  )

  const routeWithQuery = useCallback(
    (query: { name: string; value: string }) => {
      router.push(pathname + '?' + createQueryString(query.name, query.value), {
        scroll: false,
      })
    },
    [createQueryString, pathname, router],
  )

  const routeWithRemoveQuery = useCallback(
    (query: string) => {
      router.push(pathname + '?' + removeQueryString(query), {
        scroll: false,
      })
    },
    [router, pathname, removeQueryString],
  )

  return {
    routeWithQuery,
    routeWithRemoveQuery,
  }
}
