import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'

import { cookieName, countryCookieName, fallbackLng, languages } from '@/app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|admin).*)',
  ],
}

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.endsWith('.ping')) {
    const path = req.nextUrl.pathname
    const region = process.env.DEPLOY_REGION
    const headers = Object.fromEntries(req.headers)
    return new NextResponse(JSON.stringify({ path, region, headers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
    return NextResponse.next()
  }

  // 获取IP地址所属国家 - vercel
  const country = (
    req.headers.get('x-vercel-ip-country') || req.headers.get('ali-ip-country')
  )?.toUpperCase()

  // vercel 没拿到的话，用 GeoJS 再获取一下。现在不需要了
  // if (!country) {
  //   try {
  //     const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json')
  //     const geoData = await geoResponse.json()
  //     country = geoData.country === 'China' ? 'CN' : geoData.country
  //   } catch (error) {
  //     console.error('Failed to fetch country information:', error)
  //   }
  // }

  const response = NextResponse.next()
  if (country) response.cookies.set(countryCookieName, country)
  let lng: string | undefined | null = country === 'CN' ? 'zh' : 'en'

  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next') &&
    !PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url),
    )
  }
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return response
}
