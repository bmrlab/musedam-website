import type { MDXComponents } from 'mdx/types'

// Keep MDX compatible with server-rendered documentation. Individual pages
// supply their own typography and code blocks through the components prop.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components
}
