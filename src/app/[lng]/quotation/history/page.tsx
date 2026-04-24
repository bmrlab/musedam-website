import { Metadata } from 'next'
import { MetadataProps } from '@/types/page'
import { seoTranslation, ssTranslation } from '@/app/i18n'
import { getPageMetadata } from '@/utilities/getMetadata'
import { QuotationHistoryPageBody, QuotationHistoryCardView } from '@/components/QuotationHistory/QuotationHistoryPageBody'
import { getServerSession } from '@/utilities/auth'
import { fetchQuotationMyListServer, QuotationMyListItem } from '@/utilities/quotationMyList'
import { encodeNumber } from '@/utilities/numberCodec'

type Args = {
  params: Promise<{ lng: string }>
}

function toMilliseconds(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined
  if (typeof v === 'number' && !Number.isNaN(v)) return v > 1e12 ? v : v * 1000
  if (typeof v === 'string') {
    const trimmed = v.trim()
    if (/^\d+$/.test(trimmed)) {
      const n = Number(trimmed)
      return n > 1e12 ? n : n * 1000
    }
    const d = new Date(trimmed)
    if (!Number.isNaN(d.getTime())) return d.getTime()
  }
  return undefined
}

function formatDateTime(ms: number | undefined, lng: string): string | null {
  if (ms === undefined) return null
  const d = new Date(ms)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  if (lng === 'en-US') return `${m}/${day}/${y} ${h}:${min}`
  return `${y}/${m}/${day} ${h}:${min}`
}

function buildCards(items: QuotationMyListItem[], lng: string) {
  return items.map((item): QuotationHistoryCardView => {
    const modifiedMs =
      toMilliseconds(item.updateTime) ??
      toMilliseconds(item.modifiedTime) ??
      toMilliseconds(item.createTime) ??
      toMilliseconds(item.createdTime)
    const createdMs =
      toMilliseconds(item.createTime) ??
      toMilliseconds(item.createdTime) ??
      modifiedMs

    const modStr = formatDateTime(modifiedMs, lng)
    const creStr = formatDateTime(createdMs, lng)

    const nameRaw = item.customerCompany ?? item.name
    const customerName = nameRaw?.trim() ? nameRaw.trim() : ''

    return {
      id: item.id,
      hrefPath: `/quotation/${encodeNumber(item.id)}`,
      customerName,
      quoteDate: modStr ?? creStr,
      modifiedAt: modStr,
      createdAt: creStr,
      quotationNoLabel: item.quotationNo?.trim() ? item.quotationNo : `#${item.id}`,
      content: item.content,
    }
  })
}

export default async function QuotationHistoryPage({ params }: Args) {
  const { lng } = await params
  await ssTranslation(lng, 'quotation-history')
  await ssTranslation(lng, 'header')

  const user = await getServerSession()

  let gate: 'none' | 'login' | 'no_sale' = 'none'
  if (!user) gate = 'login'
  else if (!user.isSale) gate = 'no_sale'

  let list: QuotationMyListItem[] = []
  if (gate === 'none' && user) {
    list = await fetchQuotationMyListServer(user)
  }

  const cards = buildCards(list, lng)

  return <QuotationHistoryPageBody lng={lng} gate={gate} cards={cards} />
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { t } = await seoTranslation(params)
  const { lng } = await params

  return getPageMetadata({
    lng,
    title: `${t('pricing.title')} - Quotation History`,
    description: t('pricing.description'),
    url: 'quotation/history',
  })
}
