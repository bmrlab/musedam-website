import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { importHelpCenterContent, validateHelpTransferPayload } from '@/utilities/helpTransfer'
import { importHelpTransferV2, validateHelpTransferV2Payload } from '@/utilities/helpTransferV2'

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

    if (validateHelpTransferV2Payload(parsed)) {
      const summary = await importHelpTransferV2(payload, parsed, { dryRun })
      return NextResponse.json({
        success: true,
        dryRun,
        formatVersion: 2,
        message: dryRun
          ? 'Dry-run（v2）：仅统计，未写入数据库。'
          : '导入完成（v2：help_documents + media）。',
        inputCounts: {
          documents: parsed.documents.length,
          media: parsed.media.length,
        },
        summary,
      })
    }

    if (!validateHelpTransferPayload(parsed)) {
      return NextResponse.json({ error: 'Invalid help transfer format（需要 v2 或 v1 JSON）' }, { status: 400 })
    }

    const summary = await importHelpCenterContent(payload, parsed, { dryRun })
    const inputCounts = {
      topics: parsed.topics.length,
      categories: parsed.categories.length,
      documents: parsed.documents.length,
    }

    return NextResponse.json({
      success: true,
      dryRun,
      formatVersion: 1,
      message: dryRun ? 'Dry-run 模式：仅返回统计结果，未写入数据库。' : '导入完成并已写入数据库。',
      inputCounts,
      summary,
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
