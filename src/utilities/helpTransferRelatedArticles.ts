import type { Payload } from 'payload'

type SqlRow = Record<string, unknown>
type QueryResult<R extends SqlRow = SqlRow> = { rows: R[] }
type PgPool = {
  query: <R extends SqlRow = SqlRow>(text: string, params?: unknown[]) => Promise<QueryResult<R>>
  connect: () => {
    query: <R extends SqlRow = SqlRow>(text: string, params?: unknown[]) => Promise<QueryResult<R>>
    release: () => void
  }
}

const RELATED_PATH = 'relatedArticles'

export const HELP_RELATED_ARTICLES_FORMAT = 'help-related-articles-v1' as const

export type HelpRelatedArticlesExport = {
  formatVersion: typeof HELP_RELATED_ARTICLES_FORMAT
  exportedAt: string
  links: Array<{ parentSlug: string; relatedSlugs: string[] }>
}

export type HelpRelatedArticlesImportSummary = {
  parentsProcessed: number
  parentsSkipped: number
  relsInserted: number
  relsSkippedMissingRelated: number
  parentsMissingInDb: string[]
  samplesMissingRelated: Array<{ parentSlug: string; relatedSlug: string }>
}

const getPool = (payload: Payload): PgPool => {
  const db = payload.db as unknown as { pool: PgPool }
  return db.pool
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const validateHelpRelatedArticlesImportPayload = (
  value: unknown,
): value is HelpRelatedArticlesExport => {
  if (!isObject(value)) return false
  if (value.formatVersion !== HELP_RELATED_ARTICLES_FORMAT) return false
  if (typeof value.exportedAt !== 'string') return false
  if (!Array.isArray(value.links)) return false
  for (const item of value.links) {
    if (!isObject(item)) return false
    if (typeof item.parentSlug !== 'string' || !item.parentSlug.trim()) return false
    if (!Array.isArray(item.relatedSlugs)) return false
    for (const s of item.relatedSlugs) {
      if (typeof s !== 'string') return false
    }
  }
  return true
}

export const exportHelpRelatedArticles = async (payload: Payload): Promise<HelpRelatedArticlesExport> => {
  const pool = getPool(payload)
  const res = await pool.query<{
    parent_slug: string
    related_slug: string | null
    ord: number | null
    rel_id: number
  }>(
    `
    SELECT hp.slug AS parent_slug, hc.slug AS related_slug, hr."order" AS ord, hr.id AS rel_id
    FROM help_documents_rels hr
    INNER JOIN help_documents hp ON hp.id = hr.parent_id
    LEFT JOIN help_documents hc ON hc.id = hr.help_documents_id
    WHERE hr.path = $1
    ORDER BY hp.slug ASC, hr."order" ASC NULLS LAST, hr.id ASC
  `,
    [RELATED_PATH],
  )

  const byParent = new Map<string, string[]>()
  for (const row of res.rows) {
    const ps = row.parent_slug
    const rs = row.related_slug
    if (!ps || !rs) continue
    if (!byParent.has(ps)) byParent.set(ps, [])
    byParent.get(ps)!.push(rs)
  }

  const links = Array.from(byParent.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([parentSlug, relatedSlugs]) => ({ parentSlug, relatedSlugs }))

  return {
    formatVersion: HELP_RELATED_ARTICLES_FORMAT,
    exportedAt: new Date().toISOString(),
    links,
  }
}

export const importHelpRelatedArticles = async (
  payload: Payload,
  data: HelpRelatedArticlesExport,
  options: { dryRun: boolean },
): Promise<HelpRelatedArticlesImportSummary> => {
  const summary: HelpRelatedArticlesImportSummary = {
    parentsProcessed: 0,
    parentsSkipped: 0,
    relsInserted: 0,
    relsSkippedMissingRelated: 0,
    parentsMissingInDb: [],
    samplesMissingRelated: [],
  }

  const pool = getPool(payload)

  const pushSampleMissing = (parentSlug: string, relatedSlug: string) => {
    if (summary.samplesMissingRelated.length >= 40) return
    summary.samplesMissingRelated.push({ parentSlug, relatedSlug })
  }

  for (const link of data.links) {
    const parentSlug = link.parentSlug.trim()
    const parentRes = await pool.query<{ id: number }>(
      `SELECT id FROM help_documents WHERE slug = $1 LIMIT 1`,
      [parentSlug],
    )
    const parentRow = parentRes.rows[0]
    if (!parentRow?.id) {
      summary.parentsMissingInDb.push(parentSlug)
      summary.parentsSkipped += 1
      continue
    }
    const parentId = parentRow.id

    const seenRelated = new Set<string>()
    const resolvedIds: number[] = []
    for (const raw of link.relatedSlugs) {
      const relatedSlug = typeof raw === 'string' ? raw.trim() : ''
      if (!relatedSlug || seenRelated.has(relatedSlug)) continue
      seenRelated.add(relatedSlug)
      const relRes = await pool.query<{ id: number }>(
        `SELECT id FROM help_documents WHERE slug = $1 LIMIT 1`,
        [relatedSlug],
      )
      const rid = relRes.rows[0]?.id
      if (!rid) {
        summary.relsSkippedMissingRelated += 1
        pushSampleMissing(parentSlug, relatedSlug)
        continue
      }
      if (rid === parentId) continue
      resolvedIds.push(rid)
    }

    if (options.dryRun) {
      summary.parentsProcessed += 1
      summary.relsInserted += resolvedIds.length
      continue
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(`DELETE FROM help_documents_rels WHERE parent_id = $1 AND path = $2`, [
        parentId,
        RELATED_PATH,
      ])
      let order = 0
      for (const relatedId of resolvedIds) {
        await client.query(
          `INSERT INTO help_documents_rels ("order", parent_id, path, help_documents_id)
           VALUES ($1, $2, $3, $4)`,
          [order, parentId, RELATED_PATH, relatedId],
        )
        order += 1
        summary.relsInserted += 1
      }
      await client.query('COMMIT')
      summary.parentsProcessed += 1
    } catch {
      await client.query('ROLLBACK').catch(() => {})
      summary.parentsSkipped += 1
    } finally {
      client.release()
    }
  }

  return summary
}
