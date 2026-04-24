import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { exportHelpTransferV2 } from '@/utilities/helpTransferV2'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await exportHelpTransferV2(payload)
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="help-center-export-${stamp}.json"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
