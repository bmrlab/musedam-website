import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useUrlQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (query: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams?.toString())
      query.forEach(({ name, value }) => {
        params.set(name, value)
      })

      return params.toString()
    },
    [searchParams],
  )

  const createAndRemoveQueryString = useCallback(
    (query: { name: string; value: string }[], remove: string[]) => {
      const params = new URLSearchParams(searchParams?.toString())
      query.forEach(({ name, value }) => {
        params.set(name, value)
      })
      remove.forEach((name) => params.delete(name))
      return params.toString()
    },
    [searchParams],
  )

  const removeQueryString = useCallback(
    (names: string[]) => {
      const params = new URLSearchParams(searchParams?.toString())
      names.forEach((name) => params.delete(name))
      return params.toString()
    },
    [searchParams],
  )

  const routeWithQuery = useCallback(
    (query: { name: string; value: string }[]) => {
      router.push(pathname + '?' + createQueryString(query), {
        scroll: false,
      })
    },
    [createQueryString, pathname, router],
  )

  const routeWithRemove = useCallback(
    (query: string[]) => {
      router.push(pathname + '?' + removeQueryString(query), {
        scroll: false,
      })
    },
    [router, pathname, removeQueryString],
  )

  const routeWithQueryAndRemove = useCallback(
    ({ query, remove }: { query: { name: string; value: string }[]; remove: string[] }) => {
      router.push(pathname + '?' + createAndRemoveQueryString(query, remove), {
        scroll: false,
      })
    },
    [router, pathname, createAndRemoveQueryString],
  )

  return {
    routeWithQuery,
    routeWithRemove,
    routeWithQueryAndRemove,
  }
}
