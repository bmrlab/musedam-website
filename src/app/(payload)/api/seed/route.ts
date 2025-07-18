import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { seed } from '@/endpoints/seed'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // 创建一个模拟的 PayloadRequest 对象
    const req = {
      payload,
      user: null,
      locale: 'en',
      fallbackLocale: 'en',
    } as any

    await seed({ payload, req })

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!' 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return GET(request)
}
