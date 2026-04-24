import type { Payload } from 'payload'
import type { HelpDocument } from '@/payload-types'

type LocalizedValue<T> = T | Record<string, T>

type ExportedMedia = {
  sourceId: number
  filename?: string | null
  url?: string | null
  prefix?: string | null
  mimeType?: string | null
}

type ExportedTopic = {
  slug: string
  title: LocalizedValue<string>
  description?: LocalizedValue<string> | null
  bullets?: LocalizedValue<{ text: string }[]> | { text: string }[] | null
  index?: number | null
  _status?: string | null
  coverImage?: ExportedMedia | null
}

type ExportedCategory = {
  slug: string
  title: LocalizedValue<string>
  description?: LocalizedValue<string> | null
  index?: number | null
  _status?: string | null
  topicSlug: string
}

type ExportedDocument = {
  slug: string
  title: LocalizedValue<string>
  excerpt?: LocalizedValue<string> | null
  content?: unknown
  index?: number | null
  _status?: string | null
  categorySlug: string
  relatedArticleSlugs: string[]
  meta?: unknown
}

export type HelpTransferExportPayload = {
  formatVersion: 1
  exportedAt: string
  topics: ExportedTopic[]
  categories: ExportedCategory[]
  documents: ExportedDocument[]
  mediaManifest: ExportedMedia[]
}

type ImportSummary = {
  created: number
  updated: number
  skipped: number
  errors: Array<{ collection: string; slug: string; reason: string }>
  warnings?: Array<{ collection: string; slug: string; reason: string }>
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeRelationshipId = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (isObject(value) && typeof value.id === 'number') return value.id
  return null
}

const getMediaSnapshot = (doc: Record<string, unknown> | null): ExportedMedia | null => {
  if (!doc) return null
  const sourceId = typeof doc.id === 'number' ? doc.id : null
  if (!sourceId) return null
  return {
    sourceId,
    filename: typeof doc.filename === 'string' ? doc.filename : null,
    url: typeof doc.url === 'string' ? doc.url : null,
    prefix: typeof doc.prefix === 'string' ? doc.prefix : null,
    mimeType: typeof doc.mimeType === 'string' ? doc.mimeType : null,
  }
}

const pushMediaIfExists = (set: Map<number, ExportedMedia>, media: ExportedMedia | null) => {
  if (media && !set.has(media.sourceId)) {
    set.set(media.sourceId, media)
  }
}

const collectLexicalMediaIds = (node: unknown, mediaIds: Set<number>) => {
  if (Array.isArray(node)) {
    node.forEach((item) => collectLexicalMediaIds(item, mediaIds))
    return
  }

  if (!isObject(node)) {
    return
  }

  const relationTo = node.relationTo
  const value = node.value
  if (relationTo === 'media') {
    const id = normalizeRelationshipId(value)
    if (id) mediaIds.add(id)
  }

  Object.values(node).forEach((child) => collectLexicalMediaIds(child, mediaIds))
}

const rewriteLexicalMediaIds = (
  node: unknown,
  mapper: Map<number, number>,
  touched: { count: number },
) => {
  if (Array.isArray(node)) {
    node.forEach((item) => rewriteLexicalMediaIds(item, mapper, touched))
    return
  }

  if (!isObject(node)) return

  if (node.relationTo === 'media') {
    const oldId = normalizeRelationshipId(node.value)
    if (oldId && mapper.has(oldId)) {
      node.value = mapper.get(oldId)
      touched.count += 1
    }
  }

  Object.values(node).forEach((child) => rewriteLexicalMediaIds(child, mapper, touched))
}

const normalizeRelationshipValueInTree = (node: unknown) => {
  if (Array.isArray(node)) {
    node.forEach((item) => normalizeRelationshipValueInTree(item))
    return
  }

  if (!isObject(node)) return

  if ('relationTo' in node && 'value' in node) {
    const id = normalizeRelationshipId(node.value)
    if (id) {
      node.value = id
    }
  }

  Object.values(node).forEach((child) => normalizeRelationshipValueInTree(child))
}

const EMPTY_LEXICAL_CONTENT = {
  root: {
    type: 'root',
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        textStyle: '',
        textFormat: 0,
        children: [
          {
            type: 'text',
            version: 1,
            text: '',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
          },
        ],
      },
    ],
  },
}

const SUPPORTED_LOCALES = ['en', 'zh'] as const

const isLexicalDocument = (value: unknown): value is Record<string, unknown> =>
  isObject(value) && isObject(value.root)

const buildEmptyLocalizedLexicalContent = () =>
  SUPPORTED_LOCALES.reduce<Record<string, unknown>>((acc, locale) => {
    acc[locale] = structuredClone(EMPTY_LEXICAL_CONTENT)
    return acc
  }, {})

const collectPlainText = (node: unknown, collector: string[]) => {
  if (typeof node === 'string') {
    collector.push(node)
    return
  }
  if (Array.isArray(node)) {
    node.forEach((item) => collectPlainText(item, collector))
    return
  }
  if (!isObject(node)) return

  if (typeof node.text === 'string') {
    collector.push(node.text)
  }
  Object.values(node).forEach((child) => collectPlainText(child, collector))
}

const buildLexicalContentFromPlainText = (text: string) => {
  const doc = structuredClone(EMPTY_LEXICAL_CONTENT) as Record<string, any>
  const paragraph = doc.root?.children?.[0]
  const textNode = paragraph?.children?.[0]
  if (textNode && typeof textNode === 'object') {
    textNode.text = text
  }
  return doc
}

const toLocalizedTextOnlyContent = (content: unknown, fallbackText?: LocalizedValue<string> | null) => {
  const out = buildEmptyLocalizedLexicalContent()
  const fallbackLocalized = buildLocalizedStrings(fallbackText ?? null)
  const rawText: Record<string, string> = { en: '', zh: '' }

  if (isObject(content)) {
    SUPPORTED_LOCALES.forEach((loc) => {
      if (loc in content) {
        const parts: string[] = []
        collectPlainText((content as Record<string, unknown>)[loc], parts)
        rawText[loc] = parts.join('').trim()
      }
    })
  } else {
    const parts: string[] = []
    collectPlainText(content, parts)
    const merged = parts.join('').trim()
    rawText.en = merged
    rawText.zh = merged
  }

  SUPPORTED_LOCALES.forEach((loc) => {
    const text = rawText[loc] || fallbackLocalized[loc] || ''
    out[loc] = buildLexicalContentFromPlainText(text)
  })
  return out
}

const collectLexicalMediaIdsFromExportContent = (content: unknown, mediaIds: Set<number>) => {
  if (!content) return
  if (isObject(content)) {
    const localizedRoots = SUPPORTED_LOCALES.filter(
      (loc) => loc in content && isLexicalDocument((content as Record<string, unknown>)[loc]),
    )
    if (localizedRoots.length > 0) {
      localizedRoots.forEach((loc) => {
        collectLexicalMediaIds((content as Record<string, unknown>)[loc], mediaIds)
      })
      return
    }
  }
  collectLexicalMediaIds(content, mediaIds)
}

const toLocalizedLexicalContent = (content: unknown) => {
  if (!isObject(content)) return buildEmptyLocalizedLexicalContent()

  const localeEntries = Object.entries(content).filter(([key, value]) =>
    SUPPORTED_LOCALES.includes(key as (typeof SUPPORTED_LOCALES)[number]) && isLexicalDocument(value),
  )
  if (localeEntries.length > 0) {
    const normalized = buildEmptyLocalizedLexicalContent()
    localeEntries.forEach(([locale, value]) => {
      normalized[locale] = value
    })
    return normalized
  }

  if (isLexicalDocument(content)) {
    const normalized = buildEmptyLocalizedLexicalContent()
    SUPPORTED_LOCALES.forEach((locale) => {
      normalized[locale] = content
    })
    return normalized
  }

  return buildEmptyLocalizedLexicalContent()
}

const sanitizeContentForImport = (content: unknown, fallbackText?: LocalizedValue<string> | null) =>
  toLocalizedTextOnlyContent(content, fallbackText)

const resolveLocalizedTextValue = (
  value: LocalizedValue<string> | null | undefined,
  locale: (typeof SUPPORTED_LOCALES)[number],
) => {
  if (typeof value === 'string') return value
  if (isObject(value)) {
    const exact = value[locale]
    if (typeof exact === 'string') return exact
    for (const fallbackLocale of SUPPORTED_LOCALES) {
      const fallback = value[fallbackLocale]
      if (typeof fallback === 'string') return fallback
    }
  }
  return ''
}

const buildLocalizedStrings = (value: LocalizedValue<string> | null | undefined) => {
  const out: Record<string, string> = {}
  SUPPORTED_LOCALES.forEach((loc) => {
    out[loc] = resolveLocalizedTextValue(value, loc)
  })
  if (!out.en && out.zh) out.en = out.zh
  if (!out.zh && out.en) out.zh = out.en
  return out
}

const buildLocalizedMetaForImport = (meta: unknown): Record<string, unknown> | null => {
  if (!isObject(meta)) return null
  const result: Record<string, unknown> = {}

  const localizeTextField = (field: 'title' | 'description') => {
    if (!(field in meta)) return
    const raw = meta[field]
    const slice: Record<string, string | null> = {}
    SUPPORTED_LOCALES.forEach((loc) => {
      slice[loc] = null
    })
    if (typeof raw === 'string') {
      SUPPORTED_LOCALES.forEach((loc) => {
        slice[loc] = raw
      })
    } else if (isObject(raw)) {
      const localizedShape = SUPPORTED_LOCALES.some((l) => l in raw)
      if (localizedShape) {
        SUPPORTED_LOCALES.forEach((loc) => {
          const v = raw[loc]
          slice[loc] = typeof v === 'string' ? v : null
        })
      }
    }
    result[field] = slice
  }

  const localizeImageField = () => {
    if (!('image' in meta)) return
    const raw = meta.image
    const slice: Record<string, number | null> = {}
    SUPPORTED_LOCALES.forEach((loc) => {
      slice[loc] = null
    })
    if (typeof raw === 'number') {
      SUPPORTED_LOCALES.forEach((loc) => {
        slice[loc] = raw
      })
      result.image = slice
      return
    }
    if (isObject(raw)) {
      const localizedShape = SUPPORTED_LOCALES.some((l) => l in raw)
      if (localizedShape) {
        SUPPORTED_LOCALES.forEach((loc) => {
          const v = raw[loc]
          if (typeof v === 'number') slice[loc] = v
          else if (isObject(v)) slice[loc] = normalizeRelationshipId(v) ?? null
          else slice[loc] = null
        })
      } else {
        const id = normalizeRelationshipId(raw) ?? null
        SUPPORTED_LOCALES.forEach((loc) => {
          slice[loc] = id
        })
      }
      result.image = slice
    }
  }

  localizeTextField('title')
  localizeTextField('description')
  localizeImageField()
  return Object.keys(result).length ? result : null
}

const repairHelpDocumentInvalidFields = async (
  payload: Payload,
  doc: ExportedDocument,
  categoryId: number,
): Promise<boolean> => {
  const existing = await findBySlug(payload, 'help-documents', doc.slug)
  const localizedTitle = buildLocalizedStrings(doc.title)
  const localizedExcerpt = buildLocalizedStrings(doc.excerpt ?? null)
  const status: HelpDocument['_status'] =
    doc._status === 'published' || doc._status === 'draft' ? doc._status : 'draft'

  const localeData = (locale: (typeof SUPPORTED_LOCALES)[number]) => {
    const data = {
      slug: doc.slug,
      title: localizedTitle[locale],
      excerpt: localizedExcerpt[locale],
      content: structuredClone(EMPTY_LEXICAL_CONTENT) as HelpDocument['content'],
      category: categoryId,
      _status: status,
    }
    return data
  }

  if (!existing?.id) {
    const created = await payload.create({
      collection: 'help-documents',
      locale: 'en',
      draft: false,
      data: localeData('en'),
      overrideAccess: true,
    })
    if (!created?.id) return false
    await payload.update({
      collection: 'help-documents',
      id: created.id,
      locale: 'zh',
      data: localeData('zh'),
      overrideAccess: true,
    })
    return true
  }

  for (const locale of SUPPORTED_LOCALES) {
    await payload.update({
      collection: 'help-documents',
      id: existing.id,
      locale,
      data: localeData(locale),
      overrideAccess: true,
    })
  }

  return true
}

type HelpDocUpsertMode = { emptyContent?: boolean; stripMetaImages?: boolean }

const normalizeHelpDocUpsertMode = (mode: boolean | HelpDocUpsertMode) => {
  if (typeof mode === 'boolean') {
    return { emptyContent: mode, stripMetaImages: mode }
  }
  const emptyContent = mode.emptyContent ?? false
  const stripMetaImages = mode.stripMetaImages ?? emptyContent
  return { emptyContent, stripMetaImages }
}

const upsertHelpDocumentAllLocales = async (
  payload: Payload,
  doc: ExportedDocument,
  categoryId: number,
  mode: boolean | HelpDocUpsertMode = {},
): Promise<{ op: 'created' | 'updated'; id: number }> => {
  const { emptyContent } = normalizeHelpDocUpsertMode(mode)
  const localizedRaw = (emptyContent
    ? buildEmptyLocalizedLexicalContent()
    : sanitizeContentForImport(doc.content, doc.excerpt ?? doc.title)) as Record<string, unknown>

  SUPPORTED_LOCALES.forEach((loc) => {
    if (!isLexicalDocument(localizedRaw[loc])) {
      const other = SUPPORTED_LOCALES.find(
        (candidate) => candidate !== loc && isLexicalDocument(localizedRaw[candidate]),
      )
      localizedRaw[loc] = other
        ? structuredClone(localizedRaw[other])
        : structuredClone(EMPTY_LEXICAL_CONTENT)
    }
  })

  const data: Record<string, unknown> = {
    slug: doc.slug,
    title: buildLocalizedStrings(doc.title),
    excerpt: buildLocalizedStrings(doc.excerpt ?? null),
    content: localizedRaw,
    category: categoryId,
    index: doc.index ?? 999,
    _status: doc._status === 'published' || doc._status === 'draft' ? doc._status : 'draft',
    relatedArticles: [],
  }
  // Text-only import mode: skip SEO/meta image fields entirely to avoid invalid relationship IDs.

  const existing = await findBySlug(payload, 'help-documents', doc.slug)
  if (!existing?.id) {
    const created = await payload.create({
      collection: 'help-documents',
      data: data as any,
      draft: false,
      locale: 'en',
      overrideAccess: true,
    })
    return { op: 'created', id: created.id as number }
  }

  if (emptyContent) {
    // For fallback updates, preserve existing richtext to avoid re-validating bad imported content.
    delete data.content
  }

  await payload.update({
    collection: 'help-documents',
    id: existing.id,
    data: data as any,
    locale: 'en',
    overrideAccess: true,
  })
  return { op: 'updated', id: existing.id as number }
}

const findBySlug = async (
  payload: Payload,
  collection: 'help-topics' | 'help-categories' | 'help-documents',
  slug: string,
) => {
  const result = await payload.find({
    collection,
    limit: 1,
    where: { slug: { equals: slug } },
    locale: 'all' as any,
    overrideAccess: true,
    depth: 0,
  })

  return result.docs[0] || null
}

const createOrUpdate = async (
  payload: Payload,
  collection: 'help-topics' | 'help-categories' | 'help-documents',
  slug: string,
  data: Record<string, unknown>,
): Promise<'created' | 'updated'> => {
  const existing = await findBySlug(payload, collection, slug)
  if (!existing || typeof existing.id !== 'number') {
    await payload.create({
      collection,
      data,
      locale: 'all' as any,
      overrideAccess: true,
    } as any)
    return 'created'
  }

  await payload.update({
    collection,
    id: existing.id,
    data,
    locale: 'all' as any,
    overrideAccess: true,
  } as any)
  return 'updated'
}

const getMediaByIds = async (payload: Payload, ids: number[]) => {
  if (!ids.length) return []
  const result = await payload.find({
    collection: 'media',
    limit: ids.length,
    where: { id: { in: ids } },
    locale: 'all' as any,
    overrideAccess: true,
  })
  return result.docs
}

export const buildHelpCenterExport = async (payload: Payload): Promise<HelpTransferExportPayload> => {
  const topicsResult = await payload.find({
    collection: 'help-topics',
    limit: 1000,
    sort: 'index',
    locale: 'all' as any,
    overrideAccess: true,
    depth: 1,
  })
  const categoriesResult = await payload.find({
    collection: 'help-categories',
    limit: 5000,
    sort: 'index',
    locale: 'all' as any,
    overrideAccess: true,
    depth: 1,
  })
  const docsResult = await payload.find({
    collection: 'help-documents',
    limit: 10000,
    sort: 'index',
    locale: 'all' as any,
    overrideAccess: true,
    depth: 2,
  })

  const topicIdToSlug = new Map<number, string>()

  const topics: ExportedTopic[] = topicsResult.docs
    .map((topic: any) => {
      if (!topic?.slug) return null
      if (typeof topic.id === 'number') {
        topicIdToSlug.set(topic.id, topic.slug)
      }
      return {
        slug: topic.slug,
        title: topic.title,
        description: topic.description ?? null,
        bullets: topic.bullets ?? null,
        index: topic.index ?? null,
        _status: topic._status ?? null,
        coverImage: null,
      } satisfies ExportedTopic
    })
    .filter(Boolean) as ExportedTopic[]

  const categoryIdToSlug = new Map<number, string>()
  const categories: ExportedCategory[] = categoriesResult.docs
    .map((category: any) => {
      if (!category?.slug) return null
      if (typeof category.id === 'number') {
        categoryIdToSlug.set(category.id, category.slug)
      }
      const topicSlugFromObject =
        isObject(category.topic) && typeof category.topic.slug === 'string' ? category.topic.slug : null
      const topicId = normalizeRelationshipId(category.topic)
      const topicSlug = topicSlugFromObject || (topicId ? topicIdToSlug.get(topicId) : null)
      if (!topicSlug) return null
      return {
        slug: category.slug,
        title: category.title,
        description: category.description ?? null,
        index: category.index ?? null,
        _status: category._status ?? null,
        topicSlug,
      } satisfies ExportedCategory
    })
    .filter(Boolean) as ExportedCategory[]

  const docIdToSlug = new Map<number, string>()
  docsResult.docs.forEach((doc: any) => {
    if (doc?.slug && typeof doc.id === 'number') {
      docIdToSlug.set(doc.id, doc.slug)
    }
  })

  const documents: ExportedDocument[] = docsResult.docs
    .map((doc: any) => {
      if (!doc?.slug) return null
      const categorySlugFromObject =
        isObject(doc.category) && typeof doc.category.slug === 'string' ? doc.category.slug : null
      const categoryId = normalizeRelationshipId(doc.category)
      const categorySlug = categorySlugFromObject || (categoryId ? categoryIdToSlug.get(categoryId) : null)
      if (!categorySlug) return null

      const relatedArticleSlugs = Array.isArray(doc.relatedArticles)
        ? doc.relatedArticles
            .map((item: any) => {
              if (isObject(item) && typeof item.slug === 'string') return item.slug
              const relatedId = normalizeRelationshipId(item)
              return relatedId ? docIdToSlug.get(relatedId) || null : null
            })
            .filter(Boolean)
        : []
      return {
        slug: doc.slug,
        title: doc.title,
        excerpt: doc.excerpt ?? null,
        content: toLocalizedTextOnlyContent(doc.content, doc.excerpt ?? doc.title),
        index: doc.index ?? null,
        _status: doc._status ?? null,
        categorySlug,
        relatedArticleSlugs,
        meta: null,
      } satisfies ExportedDocument
    })
    .filter(Boolean) as ExportedDocument[]

  return {
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    topics,
    categories,
    documents,
    mediaManifest: [],
  }
}

export const validateHelpTransferPayload = (value: unknown): value is HelpTransferExportPayload => {
  if (!isObject(value)) return false
  if (value.formatVersion !== 1) return false
  return (
    Array.isArray(value.topics) &&
    Array.isArray(value.categories) &&
    Array.isArray(value.documents) &&
    Array.isArray(value.mediaManifest)
  )
}

export const importHelpCenterContent = async (
  payload: Payload,
  data: HelpTransferExportPayload,
  options: { dryRun: boolean },
) => {
  const summary: ImportSummary = { created: 0, updated: 0, skipped: 0, errors: [], warnings: [] }
  const topicSlugToId = new Map<string, number>()
  const categorySlugToId = new Map<string, number>()
  const docSlugToId = new Map<string, number>()

  for (const topic of data.topics) {
    if (!topic.slug) {
      summary.skipped += 1
      continue
    }
    try {
      if (options.dryRun) {
        const exists = await findBySlug(payload, 'help-topics', topic.slug)
        summary[exists ? 'updated' : 'created'] += 1
        continue
      }
      const op = await createOrUpdate(payload, 'help-topics', topic.slug, {
        slug: topic.slug,
        title: topic.title,
        description: topic.description ?? null,
        bullets: topic.bullets ?? [],
        index: topic.index ?? 999,
        _status: topic._status ?? 'draft',
        coverImage: null,
      })
      summary[op] += 1
      const saved = await findBySlug(payload, 'help-topics', topic.slug)
      if (saved?.id) topicSlugToId.set(topic.slug, saved.id)
    } catch (error) {
      summary.errors.push({ collection: 'help-topics', slug: topic.slug, reason: String(error) })
    }
  }

  for (const category of data.categories) {
    if (!category.slug) {
      summary.skipped += 1
      continue
    }
    const topicId = topicSlugToId.get(category.topicSlug)
    if (!topicId && !options.dryRun) {
      summary.errors.push({
        collection: 'help-categories',
        slug: category.slug,
        reason: `topic slug not found: ${category.topicSlug}`,
      })
      continue
    }
    try {
      if (options.dryRun) {
        const exists = await findBySlug(payload, 'help-categories', category.slug)
        summary[exists ? 'updated' : 'created'] += 1
        continue
      }
      const op = await createOrUpdate(payload, 'help-categories', category.slug, {
        slug: category.slug,
        title: category.title,
        description: category.description ?? null,
        topic: topicId,
        index: category.index ?? 999,
        _status: category._status ?? 'draft',
      })
      summary[op] += 1
      const saved = await findBySlug(payload, 'help-categories', category.slug)
      if (saved?.id) categorySlugToId.set(category.slug, saved.id)
    } catch (error) {
      summary.errors.push({ collection: 'help-categories', slug: category.slug, reason: String(error) })
    }
  }

  for (const doc of data.documents) {
    if (!doc.slug) {
      summary.skipped += 1
      continue
    }
    const categoryId = categorySlugToId.get(doc.categorySlug)
    if (options.dryRun) {
      const exists = await findBySlug(payload, 'help-documents', doc.slug)
      summary[exists ? 'updated' : 'created'] += 1
      continue
    }
    if (!categoryId) {
      summary.errors.push({
        collection: 'help-documents',
        slug: doc.slug,
        reason: `category slug not found: ${doc.categorySlug}`,
      })
      continue
    }
    try {
      const upserted = await upsertHelpDocumentAllLocales(payload, doc, categoryId, {})
      summary[upserted.op] += 1
      docSlugToId.set(doc.slug, upserted.id)
    } catch (error) {
      const reason = String(error)
      const contentInvalid = reason.includes('Content > Content')
      const metaImageInvalid = reason.includes('Meta Image')
      if (contentInvalid || metaImageInvalid) {
        try {
          const fallback = await upsertHelpDocumentAllLocales(payload, doc, categoryId, {
            emptyContent: contentInvalid,
            stripMetaImages: contentInvalid || metaImageInvalid,
          })
          summary[fallback.op] += 1
          docSlugToId.set(doc.slug, fallback.id)
          summary.warnings?.push({
            collection: 'help-documents',
            slug: doc.slug,
            reason: contentInvalid
              ? '原始富文本或 SEO 图校验失败，已降级为占位正文并清除 SEO 配图后导入'
              : 'SEO 配图在目标环境无效，已清除 SEO 配图后导入',
          })
          continue
        } catch (fallbackError) {
          try {
            const repaired = await repairHelpDocumentInvalidFields(payload, doc, categoryId)
            if (repaired) {
              summary.updated += 1
              const repairedDoc = await findBySlug(payload, 'help-documents', doc.slug)
              if (repairedDoc?.id) docSlugToId.set(doc.slug, repairedDoc.id)
              summary.warnings?.push({
                collection: 'help-documents',
                slug: doc.slug,
                reason: 'fallback 再次失败，已按语言重置为占位正文并清除 SEO 配图',
              })
              continue
            }
          } catch (repairError) {
            summary.errors.push({
              collection: 'help-documents',
              slug: doc.slug,
              reason: `fallback failed: ${String(fallbackError)}; repair failed: ${String(repairError)}`,
            })
            continue
          }

          summary.errors.push({
            collection: 'help-documents',
            slug: doc.slug,
            reason: `fallback failed: ${String(fallbackError)}`,
          })
          continue
        }
      }
      summary.errors.push({ collection: 'help-documents', slug: doc.slug, reason })
    }
  }

  if (!options.dryRun) {
    for (const doc of data.documents) {
      const docId = docSlugToId.get(doc.slug)
      if (!docId) continue
      const relationIds = doc.relatedArticleSlugs
        .map((slug) => docSlugToId.get(slug))
        .filter((id): id is number => typeof id === 'number')
      try {
        await payload.update({
          collection: 'help-documents',
          id: docId,
          data: {
            relatedArticles: relationIds,
          },
          locale: 'all' as any,
          overrideAccess: true,
        })
      } catch (error) {
        summary.errors.push({
          collection: 'help-documents',
          slug: doc.slug,
          reason: `update relatedArticles failed: ${String(error)}`,
        })
      }
    }
  }

  return summary
}

const buildSourceMediaUrl = (sourceBaseUrl: string, media: ExportedMedia) => {
  if (!media.url) return null
  if (media.url.startsWith('http://') || media.url.startsWith('https://')) return media.url
  const base = sourceBaseUrl.endsWith('/') ? sourceBaseUrl.slice(0, -1) : sourceBaseUrl
  const path = media.url.startsWith('/') ? media.url : `/${media.url}`
  return `${base}${path}`
}

const findMediaByStableKey = async (payload: Payload, media: ExportedMedia) => {
  if (!media.filename) return null
  const where = media.prefix
    ? {
        and: [{ filename: { equals: media.filename } }, { prefix: { equals: media.prefix } }],
      }
    : { filename: { equals: media.filename } }
  const result = await payload.find({
    collection: 'media',
    limit: 1,
    where: where as any,
    overrideAccess: true,
    locale: 'all' as any,
  })
  return result.docs[0] || null
}

const findReferencedMediaIds = (data: HelpTransferExportPayload): Set<number> => {
  const ids = new Set<number>()
  data.topics.forEach((topic) => {
    if (topic.coverImage?.sourceId) ids.add(topic.coverImage.sourceId)
  })
  data.documents.forEach((doc) => {
    collectLexicalMediaIdsFromExportContent(doc.content, ids)
    if (isObject(doc.meta) && doc.meta.image !== undefined) {
      const img = doc.meta.image
      if (isObject(img)) {
        const localizedShape = SUPPORTED_LOCALES.some((l) => l in img)
        if (localizedShape) {
          SUPPORTED_LOCALES.forEach((loc) => {
            const v = (img as Record<string, unknown>)[loc]
            const id = normalizeRelationshipId(v)
            if (id) ids.add(id)
          })
        } else {
          const id = normalizeRelationshipId(img)
          if (id) ids.add(id)
        }
      } else if (typeof img === 'number') {
        ids.add(img)
      }
    }
  })
  return ids
}

export const syncHelpCenterMedia = async (
  payload: Payload,
  data: HelpTransferExportPayload,
  options: { sourceBaseUrl: string; dryRun: boolean; sourceAuthToken?: string },
) => {
  const referencedIds = findReferencedMediaIds(data)
  const manifestMap = new Map<number, ExportedMedia>()
  data.mediaManifest.forEach((item) => manifestMap.set(item.sourceId, item))

  const mapper = new Map<number, number>()
  const summary = {
    scanned: referencedIds.size,
    synced: 0,
    skipped: 0,
    failed: [] as Array<{ sourceId: number; reason: string }>,
    patchedDocuments: 0,
    patchedTopics: 0,
  }

  for (const sourceId of referencedIds) {
    const media = manifestMap.get(sourceId)
    if (!media) {
      summary.failed.push({ sourceId, reason: 'media not found in manifest' })
      continue
    }

    const existing = await findMediaByStableKey(payload, media)
    if (existing?.id) {
      mapper.set(sourceId, existing.id)
      summary.skipped += 1
      continue
    }

    if (options.dryRun) {
      summary.synced += 1
      continue
    }

    const sourceUrl = buildSourceMediaUrl(options.sourceBaseUrl, media)
    if (!sourceUrl) {
      summary.failed.push({ sourceId, reason: 'missing source media url' })
      continue
    }

    try {
      const response = await fetch(sourceUrl, {
        headers: options.sourceAuthToken
          ? {
              Authorization: `Bearer ${options.sourceAuthToken}`,
            }
          : undefined,
      })
      if (!response.ok) {
        summary.failed.push({ sourceId, reason: `download failed: ${response.status}` })
        continue
      }
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (!media.filename) {
        summary.failed.push({ sourceId, reason: 'missing filename' })
        continue
      }

      const created = await payload.create({
        collection: 'media',
        data: {
          alt: media.filename,
          prefix: media.prefix ?? undefined,
        },
        file: {
          data: buffer,
          mimetype: media.mimeType || 'application/octet-stream',
          name: media.filename,
          size: buffer.byteLength,
        },
        overrideAccess: true,
      })
      if (created?.id) {
        mapper.set(sourceId, created.id)
        summary.synced += 1
      } else {
        summary.failed.push({ sourceId, reason: 'created media missing id' })
      }
    } catch (error) {
      summary.failed.push({ sourceId, reason: String(error) })
    }
  }

  if (!options.dryRun) {
    for (const topic of data.topics) {
      if (!topic.coverImage?.sourceId) continue
      const mapped = mapper.get(topic.coverImage.sourceId)
      if (!mapped) continue
      const existing = await findBySlug(payload, 'help-topics', topic.slug)
      if (!existing?.id) continue
      await payload.update({
        collection: 'help-topics',
        id: existing.id,
        data: { coverImage: mapped },
        locale: 'all' as any,
        overrideAccess: true,
      })
      summary.patchedTopics += 1
    }

    for (const doc of data.documents) {
      const existing = await findBySlug(payload, 'help-documents', doc.slug)
      if (!existing?.id) continue

      const touched = { count: 0 }
      const contentPatch = sanitizeContentForImport(doc.content) as Record<string, unknown>
      SUPPORTED_LOCALES.forEach((loc) => {
        const node = contentPatch[loc]
        if (isLexicalDocument(node)) {
          rewriteLexicalMediaIds(node, mapper, touched)
        }
      })

      const metaLocalized = buildLocalizedMetaForImport(doc.meta)
      let metaOut: Record<string, unknown> | null = null
      if (metaLocalized && isObject(metaLocalized.image)) {
        metaOut = structuredClone(metaLocalized) as Record<string, unknown>
        const img = metaOut.image as Record<string, number | null | unknown>
        SUPPORTED_LOCALES.forEach((loc) => {
          const raw = img[loc]
          const oldId =
            typeof raw === 'number' ? raw : raw !== undefined && raw !== null ? normalizeRelationshipId(raw) : null
          if (!oldId) return
          const mapped = mapper.get(oldId)
          if (mapped) {
            if (img[loc] !== mapped) touched.count += 1
            img[loc] = mapped
          } else {
            if (img[loc] !== null) touched.count += 1
            img[loc] = null
          }
        })
      } else if (metaLocalized) {
        metaOut = structuredClone(metaLocalized) as Record<string, unknown>
      }

      if (touched.count === 0) continue

      const updateData: Record<string, unknown> = { content: contentPatch }
      if (metaOut) {
        updateData.meta = metaOut
      }

      await payload.update({
        collection: 'help-documents',
        id: existing.id,
        data: updateData,
        locale: 'all' as any,
        overrideAccess: true,
      })
      summary.patchedDocuments += 1
    }
  }

  return summary
}
