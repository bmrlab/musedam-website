import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import {
  importHelpRelatedArticles,
  validateHelpRelatedArticlesImportPayload,
} from '@/utilities/helpTransferRelatedArticles'

const parseDryRunFlag = (value: FormDataEntryValue | null) => value === '1' || value === 'true'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const dryRun = parseDryRunFlag(formData.get('dryRun'))

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    const text = await file.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 })
    }

    if (!validateHelpRelatedArticlesImportPayload(parsed)) {
      return NextResponse.json(
        { error: `Invalid format（需要 formatVersion: "help-related-articles-v1"）` },
        { status: 400 },
      )
    }

    const summary = await importHelpRelatedArticles(payload, parsed, { dryRun })

    return NextResponse.json({
      success: true,
      dryRun,
      message: dryRun
        ? 'Dry-run：仅统计，未写入 help_documents_rels。'
        : '导入完成：已按 slug 重写各文档的「关联文章」关系（path=relatedArticles）。',
      summary,
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
