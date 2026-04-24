import type { Payload } from 'payload'

type SqlRow = Record<string, unknown>
type QueryResult<R extends SqlRow = SqlRow> = { rows: R[] }
type PgClient = {
  query: <R extends SqlRow = SqlRow>(text: string, params?: unknown[]) => Promise<QueryResult<R>>
  release: () => void
}
type PgPool = {
  query: <R extends SqlRow = SqlRow>(text: string, params?: unknown[]) => Promise<QueryResult<R>>
  connect: () => Promise<PgClient>
}

export type HelpTransferV2Payload = {
  formatVersion: 2
  exportedAt: string
  documents: HelpTransferV2Document[]
  media: Record<string, unknown>[]
}

export type HelpTransferV2Document = {
  category_title_en: string
  help_documents: Record<string, unknown>
  help_documents_locales: Record<string, unknown>[]
  help_documents_rels: Record<string, unknown>[]
}

export type HelpTransferV2ImportSummary = {
  documentsCreated: number
  documentsUpdated: number
  documentsSkipped: number
  mediaReused: number
  mediaCreated: number
  errors: Array<{ slug?: string; reason: string }>
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getPool = (payload: Payload): PgPool => {
  const db = payload.db as unknown as { pool: PgPool }
  return db.pool
}

export const validateHelpTransferV2Payload = (value: unknown): value is HelpTransferV2Payload => {
  if (!isObject(value)) return false
  if (value.formatVersion !== 2) return false
  if (typeof value.exportedAt !== 'string') return false
  if (!Array.isArray(value.documents) || !Array.isArray(value.media)) return false
  return true
}

const normalizeRelationshipId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (isObject(value) && typeof value.id === 'number') return value.id
  return null
}

const collectLexicalMediaIds = (node: unknown, mediaIds: Set<number>) => {
  if (Array.isArray(node)) {
    node.forEach((item) => collectLexicalMediaIds(item, mediaIds))
    return
  }
  if (!isObject(node)) return
  if (node.relationTo === 'media') {
    const id = normalizeRelationshipId(node.value)
    if (id) mediaIds.add(id)
  }
  Object.values(node).forEach((child) => collectLexicalMediaIds(child, mediaIds))
}

const collectMediaIdsFromLocaleRow = (row: Record<string, unknown>, mediaIds: Set<number>) => {
  const metaImage = row.meta_image_id
  if (typeof metaImage === 'number') mediaIds.add(metaImage)
  collectLexicalMediaIds(row.content, mediaIds)
}

const rewriteLexicalMediaIds = (node: unknown, mapper: Map<number, number>) => {
  if (Array.isArray(node)) {
    node.forEach((item) => rewriteLexicalMediaIds(item, mapper))
    return
  }
  if (!isObject(node)) return
  if (node.relationTo === 'media') {
    const oldId = normalizeRelationshipId(node.value)
    if (oldId && mapper.has(oldId)) {
      node.value = mapper.get(oldId)
    }
  }
  Object.values(node).forEach((child) => rewriteLexicalMediaIds(child, mapper))
}

const remapLocaleRowMedia = (
  row: Record<string, unknown>,
  mapper: Map<number, number>,
): Record<string, unknown> => {
  const out = { ...row }
  const mid = out.meta_image_id
  if (typeof mid === 'number') {
    if (mapper.has(mid)) out.meta_image_id = mapper.get(mid)
    else out.meta_image_id = null
  }
  if (out.content != null) {
    try {
      const parsed =
        typeof out.content === 'string' ? JSON.parse(out.content as string) : structuredClone(out.content)
      rewriteLexicalMediaIds(parsed, mapper)
      out.content = JSON.stringify(parsed)
    } catch {
      /* keep */
    }
  }
  return out
}

const buildAbsoluteMediaUrl = (row: Record<string, unknown>): string | null => {
  const url = row.url
  if (typeof url !== 'string' || !url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base =
    process.env.HELP_TRANSFER_MEDIA_SOURCE_URL?.replace(/\/$/, '') ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  if (!base) return null
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}

export const exportHelpTransferV2 = async (payload: Payload): Promise<HelpTransferV2Payload> => {
  const pool = getPool(payload)
  const docRes = await pool.query(
    `
    SELECT hd.id, hd.slug, hd.author_id, hd.category_id, hd.index, hd._status, hd.updated_at, hd.created_at,
           hcl.title AS category_title_en
    FROM help_documents hd
    LEFT JOIN help_categories_locales hcl
      ON hcl._parent_id = hd.category_id AND hcl._locale = 'en'
    ORDER BY hd.id ASC
  `,
  )

  const ids = (docRes.rows as Record<string, unknown>[])
    .map((r) => Number(r.id))
    .filter((n) => Number.isFinite(n))
  if (!ids.length) {
    return {
      formatVersion: 2,
      exportedAt: new Date().toISOString(),
      documents: [],
      media: [],
    }
  }

  const locRes = await pool.query(
    `SELECT * FROM help_documents_locales WHERE _parent_id = ANY($1::int[]) ORDER BY _parent_id, _locale`,
    [ids],
  )
  const relRes = await pool.query(
    `SELECT * FROM help_documents_rels WHERE parent_id = ANY($1::int[]) ORDER BY parent_id, id`,
    [ids],
  )

  const localesByParent = new Map<number, Record<string, unknown>[]>()
  for (const row of locRes.rows as Record<string, unknown>[]) {
    const pid = Number(row._parent_id)
    if (!Number.isFinite(pid)) continue
    if (!localesByParent.has(pid)) localesByParent.set(pid, [])
    localesByParent.get(pid)!.push(row)
  }

  const relsByParent = new Map<number, Record<string, unknown>[]>()
  for (const row of relRes.rows as Record<string, unknown>[]) {
    const pid = Number(row.parent_id)
    if (!Number.isFinite(pid)) continue
    if (!relsByParent.has(pid)) relsByParent.set(pid, [])
    relsByParent.get(pid)!.push(row)
  }

  const mediaIds = new Set<number>()
  for (const row of locRes.rows as Record<string, unknown>[]) {
    collectMediaIdsFromLocaleRow(row, mediaIds)
  }

  let mediaRows: Record<string, unknown>[] = []
  if (mediaIds.size) {
    const mRes = await pool.query(`SELECT * FROM media WHERE id = ANY($1::int[]) ORDER BY id`, [
      Array.from(mediaIds),
    ])
    mediaRows = mRes.rows as Record<string, unknown>[]
  }

  const documents: HelpTransferV2Document[] = (docRes.rows as Record<string, unknown>[]).map((row) => {
    const category_title_en = typeof row.category_title_en === 'string' ? row.category_title_en : ''
    const { category_title_en: _drop, ...hd } = row
    const id = Number(hd.id)
    return {
      category_title_en,
      help_documents: hd as Record<string, unknown>,
      help_documents_locales: localesByParent.get(id) ?? [],
      help_documents_rels: relsByParent.get(id) ?? [],
    }
  })

  return {
    formatVersion: 2,
    exportedAt: new Date().toISOString(),
    documents,
    media: mediaRows,
  }
}

const resolveCategoryId = async (
  client: PgClient,
  categoryTitleEn: string,
): Promise<number | null> => {
  const trimmed = categoryTitleEn.trim()
  if (!trimmed) return null
  const r = await client.query<{ id: number }>(
    `SELECT hc.id
     FROM help_categories hc
     INNER JOIN help_categories_locales hcl ON hcl._parent_id = hc.id
     WHERE hcl._locale = 'en' AND hcl.title = $1
     LIMIT 2`,
    [trimmed],
  )
  if (r.rows.length !== 1) return null
  return r.rows[0].id
}

const upsertMediaOnTarget = async (
  payload: Payload,
  row: Record<string, unknown>,
  dryRun: boolean,
): Promise<{ id: number; reused: boolean } | { error: string }> => {
  const pool = getPool(payload)
  const filename = typeof row.filename === 'string' ? row.filename : null
  if (!filename) return { error: 'media row missing filename' }
  const prefix = row.prefix === null || row.prefix === undefined ? null : String(row.prefix)

  const found = await pool.query<{ id: number }>(
    `SELECT id FROM media WHERE filename = $1 AND (prefix IS NOT DISTINCT FROM $2) LIMIT 1`,
    [filename, prefix],
  )
  if (found.rows[0]) {
    return { id: found.rows[0].id, reused: true }
  }

  if (dryRun) {
    const fake = typeof row.id === 'number' ? (row.id as number) : 0
    return { id: fake, reused: false }
  }

  const sourceUrl = buildAbsoluteMediaUrl(row)
  if (!sourceUrl) {
    return {
      error:
        'cannot resolve media download URL (set HELP_TRANSFER_MEDIA_SOURCE_URL or use absolute url in export)',
    }
  }

  const headers: Record<string, string> = {}
  if (process.env.HELP_MEDIA_SOURCE_AUTH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.HELP_MEDIA_SOURCE_AUTH_TOKEN}`
  }
  const response = await fetch(sourceUrl, { headers })
  if (!response.ok) return { error: `download failed ${response.status}` }
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mimeType =
    typeof row.mime_type === 'string' && row.mime_type ? row.mime_type : 'application/octet-stream'

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: typeof row.alt === 'string' ? row.alt : filename,
      ...(prefix !== null ? { prefix } : {}),
    },
    file: {
      data: buffer,
      mimetype: mimeType,
      name: filename,
      size: buffer.byteLength,
    },
    overrideAccess: true,
  })

  const newId = typeof created.id === 'number' ? created.id : Number(created.id)
  if (!Number.isFinite(newId)) return { error: 'created media missing id' }
  return { id: newId, reused: false }
}

export const importHelpTransferV2 = async (
  payload: Payload,
  data: HelpTransferV2Payload,
  options: { dryRun: boolean },
): Promise<HelpTransferV2ImportSummary> => {
  const summary: HelpTransferV2ImportSummary = {
    documentsCreated: 0,
    documentsUpdated: 0,
    documentsSkipped: 0,
    mediaReused: 0,
    mediaCreated: 0,
    errors: [],
  }

  const pool = getPool(payload)
  const mediaMapper = new Map<number, number>()

  for (const row of data.media) {
    const srcId = typeof row.id === 'number' ? row.id : Number(row.id)
    if (!Number.isFinite(srcId)) continue
    const result = await upsertMediaOnTarget(payload, row, options.dryRun)
    if ('error' in result) {
      summary.errors.push({ reason: `media id ${srcId}: ${result.error}` })
      continue
    }
    mediaMapper.set(srcId, result.id)
    if (result.reused) summary.mediaReused += 1
    else if (!options.dryRun) summary.mediaCreated += 1
  }

  const client = await pool.connect()
  try {
    if (!options.dryRun) {
      await client.query('BEGIN')
    }

    const oldDocIdToNew = new Map<number, number>()
    const slugToNewId = new Map<string, number>()

    for (const doc of data.documents) {
      const slug = typeof doc.help_documents.slug === 'string' ? doc.help_documents.slug : ''
      if (!slug) {
        summary.errors.push({ reason: 'document missing slug' })
        summary.documentsSkipped += 1
        continue
      }

      const categoryId = await resolveCategoryId(client, doc.category_title_en)
      if (!categoryId) {
        summary.errors.push({
          slug,
          reason: `no single help_categories match for category_title_en="${doc.category_title_en}"`,
        })
        summary.documentsSkipped += 1
        continue
      }

      const oldId = Number(doc.help_documents.id)
      const authorVal = doc.help_documents.author_id
      const authorId =
        authorVal === null || authorVal === undefined || authorVal === ''
          ? null
          : Number(authorVal)
      const indexVal = doc.help_documents.index
      const indexNum = indexVal === null || indexVal === undefined || indexVal === '' ? 999 : Number(indexVal)
      const rawStatus =
        typeof doc.help_documents._status === 'string' ? doc.help_documents._status : 'draft'
      const statusVal = rawStatus === 'published' || rawStatus === 'draft' ? rawStatus : 'draft'

      if (options.dryRun) {
        const exists = await client.query(`SELECT id FROM help_documents WHERE slug = $1`, [slug])
        if (exists.rows[0]) summary.documentsUpdated += 1
        else summary.documentsCreated += 1
        if (Number.isFinite(oldId)) oldDocIdToNew.set(oldId, oldId)
        continue
      }

      const existedBefore = await client.query(`SELECT id FROM help_documents WHERE slug = $1`, [slug])
      const hadRow = existedBefore.rows.length > 0

      const ins = await client.query<{ id: number }>(
        `INSERT INTO help_documents (slug, author_id, category_id, "index", _status, updated_at, created_at)
         VALUES ($1, $2, $3, $4, $5::enum_help_documents_status, now(), now())
         ON CONFLICT (slug) DO UPDATE SET
           author_id = EXCLUDED.author_id,
           category_id = EXCLUDED.category_id,
           "index" = EXCLUDED."index",
           _status = EXCLUDED._status,
           updated_at = now()
         RETURNING id`,
        [slug, Number.isFinite(authorId as number) ? authorId : null, categoryId, indexNum, statusVal],
      )

      const newId = ins.rows[0]?.id
      if (!Number.isFinite(newId)) {
        summary.errors.push({ slug, reason: 'upsert help_documents returned no id' })
        summary.documentsSkipped += 1
        continue
      }

      if (hadRow) summary.documentsUpdated += 1
      else summary.documentsCreated += 1

      if (Number.isFinite(oldId)) oldDocIdToNew.set(oldId, newId)
      slugToNewId.set(slug, newId)
    }

    if (!options.dryRun) {
      for (const doc of data.documents) {
        const slug = typeof doc.help_documents.slug === 'string' ? doc.help_documents.slug : ''
        if (!slug) continue
        const newId = slugToNewId.get(slug)
        if (!Number.isFinite(newId)) continue

        await client.query(`DELETE FROM help_documents_locales WHERE _parent_id = $1`, [newId])
        for (const loc of doc.help_documents_locales) {
          const remapped = remapLocaleRowMedia(loc as Record<string, unknown>, mediaMapper)
          const title = typeof remapped.title === 'string' ? remapped.title : ''
          const excerpt =
            remapped.excerpt === null || remapped.excerpt === undefined ? null : String(remapped.excerpt)
          const metaTitle =
            remapped.meta_title === null || remapped.meta_title === undefined
              ? null
              : String(remapped.meta_title)
          const metaDesc =
            remapped.meta_description === null || remapped.meta_description === undefined
              ? null
              : String(remapped.meta_description)
          const metaImage =
            remapped.meta_image_id === null || remapped.meta_image_id === undefined
              ? null
              : Number(remapped.meta_image_id)
          const locale = typeof remapped._locale === 'string' ? remapped._locale : 'en'
          const contentJson =
            typeof remapped.content === 'string' ? remapped.content : JSON.stringify(remapped.content ?? {})
          await client.query(
            `INSERT INTO help_documents_locales
              (title, excerpt, content, meta_title, meta_image_id, meta_description, _locale, _parent_id)
             VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7::"_locales", $8)`,
            [title, excerpt, contentJson, metaTitle, metaImage, metaDesc, locale, newId],
          )
        }

        await client.query(`DELETE FROM help_documents_rels WHERE parent_id = $1`, [newId])
        for (const rel of doc.help_documents_rels) {
          const orderVal = rel.order === null || rel.order === undefined ? null : Number(rel.order)
          const pathVal = typeof rel.path === 'string' ? rel.path : 'relatedArticles'
          const relatedOld = rel.help_documents_id
          const relatedOldNum =
            typeof relatedOld === 'number' ? relatedOld : relatedOld != null ? Number(relatedOld) : null
          if (relatedOldNum == null || !Number.isFinite(relatedOldNum)) continue
          const relatedNew = oldDocIdToNew.get(relatedOldNum)
          if (relatedNew == null) continue
          await client.query(
            `INSERT INTO help_documents_rels ("order", parent_id, path, help_documents_id)
             VALUES ($1, $2, $3, $4)`,
            [orderVal, newId, pathVal, relatedNew],
          )
        }
      }
    }

    if (!options.dryRun) {
      await client.query('COMMIT')
    }
  } catch (e) {
    if (!options.dryRun) {
      await client.query('ROLLBACK').catch(() => {})
    }
    summary.errors.push({ reason: String(e) })
  } finally {
    client.release()
  }

  return summary
}
