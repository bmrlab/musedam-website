import { NextRequest, NextResponse } from 'next/server'

const APIGW_URL = process.env.MUSEDAM_API_GATEWAY

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: paths } = await params
    // Get the path segments and join them
    const path = paths.join('/')

    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url)

    // Build target URL with query parameters
    const targetUrl = new URL(`${APIGW_URL}/${path}`)
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value)
    })

    // Forward headers
    const headers = new Headers()
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') {
        headers.append(key, value)
      }
    })

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Gateway Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 暂时没有 POST 请求的需求
// export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
//   try {
//     const path = params.path.join('/')
//     const body = await request.json()

//     // Forward headers
//     const headers = new Headers()
//     request.headers.forEach((value, key) => {
//       if (key.toLowerCase() !== 'host') {
//         headers.append(key, value)
//       }
//     })
//     headers.append('Content-Type', 'application/json')

//     const response = await fetch(`${APIGW_URL}/${path}`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(body),
//     })

//     const data = await response.json()

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error('API Gateway Error:', error)
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     )
//   }
// }
