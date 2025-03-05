import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'

import { countryCookieName, fallbackLng, languageCookieName, languages } from '@/app/i18n/settings'

import { getCookieDomain } from './utilities/cookieDomain'

acceptLanguage.languages(languages)

// export const config = {
//   // matcher: '/:lng*'
//   matcher: [
//     '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|admin).*)',
//   ],
// }

const NON_I18N_PATH = /\.(.*)$|^favicon\.ico$|^\/(_next|assets)\/|^\/musedam-apigw\// // 不需要国际化的路径，如 API 网关、有扩展名结尾的静态资源

function handlePingRequest(req: NextRequest) {
  const path = req.nextUrl.pathname
  const region = process.env.DEPLOY_REGION
  const headers = Object.fromEntries(req.headers)
  return new NextResponse(JSON.stringify({ path, region, headers }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

function getRequestCountry(req: NextRequest, response: NextResponse) {
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

  if (country) {
    response.cookies.set(countryCookieName, country)
  }

  return country
}

// 确定语言并重定向
function determineLanguageAndSetCookie(req: NextRequest, response: NextResponse) {
  const domain =
    process.env.NODE_ENV === 'development'
      ? req.nextUrl.hostname
      : getCookieDomain(req.headers.get('host') ?? req.nextUrl.hostname)

  // If lng in path is valid, just response with cookie set
  const requestDefaultLanguage = languages.find((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))
  if (typeof requestDefaultLanguage !== 'undefined') {
    response.cookies.set(languageCookieName, requestDefaultLanguage!, { sameSite: 'lax', domain })
    return response
  }

  // Otherwise, use following logic to get a default lng
  // 1. use the valid language in referer header
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) {
      response.cookies.set(languageCookieName, lngInReferer, { sameSite: 'lax', domain })
      return response
    }
  }

  // 2. use compatible languages
  const requestCompatibleLanguage = ['zh', 'en'].find((loc) =>
    req.nextUrl.pathname.startsWith(`/${loc}`),
  )

  if (typeof requestCompatibleLanguage !== 'undefined') {
    const original = `${req.nextUrl.pathname}${req.nextUrl.search}`
    if (requestCompatibleLanguage === 'zh') {
      return NextResponse.redirect(new URL(original.replace('/zh', '/zh-CN'), req.url))
    }
    if (requestCompatibleLanguage === 'en') {
      return NextResponse.redirect(new URL(original.replace('/en', '/en-US'), req.url))
    }
  }

  // 3. use compatible cookie, accept-language header, etc.
  let lng: string | undefined | null = undefined

  if (req.cookies.has(languageCookieName)) {
    lng = acceptLanguage.get(req.cookies.get(languageCookieName)?.value)
  }
  if (!lng && req.headers.has('Accept-Language')) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  }
  if (!lng) {
    lng = process.env.DEPLOY_REGION === 'mainland' ? 'zh-CN' : 'en-US'
  }

  // Redirect if lng in path is not supported
  return NextResponse.redirect(
    new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url),
  )
}

function storeFirstVisitReferrer(req: NextRequest, response: NextResponse) {
  const cookieName = '_fv_s' // first visit source
  const referer = req.headers.get('referer')
  function getRefererName(refererUrl: string) {
    const domain = new URL(refererUrl).hostname
    return domain
  }
  if (referer && !req.cookies.has(cookieName)) {
    try {
      const refererName = getRefererName(referer)
      const domain = getCookieDomain(req.headers.get('host') ?? req.nextUrl.hostname)
      response.cookies.set(cookieName, refererName, {
        sameSite: 'lax',
        domain,
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 365, // 1 year
      })
    } catch (e) {
      console.log('Error in storeFirstVisitReferrer', e)
    }
  }
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.endsWith('.ping')) {
    return handlePingRequest(req)
  }

  const response = NextResponse.next()

  if (
    // req.nextUrl.pathname.indexOf('icon') > -1 ||
    // req.nextUrl.pathname.indexOf('chrome') > -1 ||
    NON_I18N_PATH.test(req.nextUrl.pathname)
  ) {
    return response
  }

  getRequestCountry(req, response)

  storeFirstVisitReferrer(req, response)

  return determineLanguageAndSetCookie(req, response)
}
