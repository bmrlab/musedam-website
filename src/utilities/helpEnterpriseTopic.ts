export const ENTERPRISE_ONLY_HELP_TOPIC_SLUGS = [
  'enterprise',
  'advanced-modules',
  'getting-started',
] as const

export function isEnterpriseOnlyHelpTopic(slug: string | null | undefined): boolean {
  if (!slug) return false
  return (ENTERPRISE_ONLY_HELP_TOPIC_SLUGS as readonly string[]).includes(slug)
}
