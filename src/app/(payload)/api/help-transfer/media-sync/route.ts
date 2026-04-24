import { NextRequest, NextResponse } from 'next/server'
import { syncHelpCenterMedia, validateHelpTransferPayload } from '@/utilities/helpTransfer'
import { validateHelpTransferV2Payload } from '@/utilities/helpTransferV2'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const parseDryRunFlag = (value: FormDataEntryValue | null) => value === '1' || value === 'true'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sourceBaseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
    if (!sourceBaseUrl) {
      return NextResponse.json({ error: 'PAYLOAD_PUBLIC_SERVER_URL is required' }, { status: 500 })
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
      return NextResponse.json(
        {
          error:
            'v2 导出已内联 media，请直接使用「导入帮助中心」。media-sync 仅支持旧版 formatVersion:1 JSON。',
        },
        { status: 400 },
      )
    }

    if (!validateHelpTransferPayload(parsed)) {
      return NextResponse.json(
        { error: 'Invalid help transfer format or version' },
        { status: 400 },
      )
    }

    const summary = await syncHelpCenterMedia(payload, parsed, {
      sourceBaseUrl,
      dryRun,
      sourceAuthToken: process.env.HELP_MEDIA_SOURCE_AUTH_TOKEN,
    })

    return NextResponse.json({
      success: true,
      dryRun,
      message: dryRun ? 'Dry-run 模式：仅返回媒体同步预估结果，未执行写入。' : '媒体同步完成。',
      summary,
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
