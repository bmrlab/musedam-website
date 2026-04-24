'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

import { deleteQuotationHistoryItem } from '@/app/[lng]/quotation/history/actions'
import { LocaleLink } from '@/components/LocalLink'
import { LocaleSwitch } from '@/components/Header/LocalSwitch'
import { useHeaderTranslation, useTranslation } from '@/app/i18n/client'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utilities/cn'

export type QuotationHistoryCardView = {
  id: number
  hrefPath: string
  customerName: string
  quoteDate: string | null
  modifiedAt: string | null
  createdAt: string | null
  quotationNoLabel: string
  content?: string
}

type Gate = 'none' | 'login' | 'no_sale'

export function QuotationHistoryPageBody({
  lng,
  gate,
  cards,
}: {
  lng: string
  gate: Gate
  cards: QuotationHistoryCardView[]
}) {
  const { t } = useTranslation('quotation-history')
  const { t: tHeader } = useHeaderTranslation()
  const PAGE_SIZE = 12
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [cards.length])

  const hasMore = visibleCount < cards.length
  const visibleCards = cards.slice(0, visibleCount)

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, cards.length))
      },
      { rootMargin: '180px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [cards.length, hasMore])

  if (gate === 'login') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Image src="/assets/logo-dark.svg" width={100} height={100} alt="Muse" className="mb-8" />
        <p className="mb-8 max-w-sm text-lg text-white/90">{t('gate.loginTitle')}</p>
        <Link
          href={`/${lng}/auth`}
          className="rounded-xl bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-white/90"
        >
          {t('gate.loginCta')}
        </Link>
      </div>
    )
  }

  if (gate === 'no_sale') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <Image src="/assets/logo-dark.svg" width={100} height={100} alt="Muse" className="mb-8" />
        <p className="mb-8 max-w-sm text-lg text-white/90">{tHeader('not.sale.user')}</p>
        <Link
          href={`/${lng}/pricing`}
          className="rounded-xl bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-white/90"
        >
          {tHeader('not.sale.user.button')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-4 py-5 md:px-10 md:py-6">
        <LocaleLink href="/" className="flex shrink-0 items-center opacity-90 transition hover:opacity-100">
          <Image src="/assets/logo-dark.svg" width={88} height={28} alt="Muse" className="h-7 w-auto" />
        </LocaleLink>
        <div className="flex items-center gap-4">
          <LocaleLink
            href="/pricing"
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/90 transition hover:border-white/40 hover:text-white"
          >
            {t('backToPricing')}
          </LocaleLink>
          <LocaleSwitch />
        </div>
      </header>

      <main className="px-4 pb-16 pt-2 md:px-10 md:pt-0">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="font-feature text-3xl font-medium tracking-tight md:text-[44px] md:leading-tight">
            {t('title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/50 md:text-base">{t('subtitle')}</p>

          {cards.length === 0 ? (
            <div className="mt-20 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-20 text-center">
              <p className="text-white/60">{t('empty.title')}</p>
              <LocaleLink
                href="/quotation"
                className="mt-6 rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
              >
                {t('empty.cta')}
              </LocaleLink>
            </div>
          ) : (
            <ul className="mt-10 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCards.map((card) => (
                <HistoryCard key={card.id} lng={lng} card={card} />
              ))}
            </ul>
          )}
          {cards.length > 0 ? (
            <div className="mt-8 flex flex-col items-center">
              <div ref={loadMoreRef} className="h-1 w-full" aria-hidden />
              {!hasMore ? <p className="mt-4 text-sm text-white/45">{t('list.noMore')}</p> : null}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

function HistoryCard({
  lng,
  card,
}: {
  lng: string
  card: QuotationHistoryCardView
}) {
  const { t } = useTranslation('quotation-history')
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const rootRef = useRef<HTMLLIElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const openDeleteDialog = useCallback(() => {
    setOpen(false)
    setConfirmOpen(true)
  }, [])

  const nameText = card.customerName.trim() || t('untitled')
  const modifiedLine = card.modifiedAt ? `${t('meta.modified')}${card.modifiedAt}` : null
  const createdLine = card.createdAt ? `${t('meta.created')}${card.createdAt}` : null

  const previewConfig = useMemo(() => {
    if (!card.content?.trim()) return null
    try {
      const content = JSON.parse(card.content) as {
        advancedConfig?: { memberSeats?: number; storageSpace?: number }
      }
      return content.advancedConfig ?? null
    } catch {
      return null
    }
  }, [card.content])

  const seatCountText =
    typeof previewConfig?.memberSeats === 'number' && previewConfig.memberSeats > 0
      ? String(previewConfig.memberSeats)
      : '—'
  const storageSpaceText =
    typeof previewConfig?.storageSpace === 'number' && previewConfig.storageSpace > 0
      ? `${previewConfig.storageSpace} TB`
      : '—'

  const executeDelete = useCallback(async () => {
    setDeleting(true)
    try {
      const res = await deleteQuotationHistoryItem(card.id, lng)
      if (!res.ok) {
        toast({ description: t('actions.deleteFailed'), duration: 2800 })
      } else {
        setConfirmOpen(false)
        toast({ description: t('actions.deleteSuccess'), duration: 2200 })
        router.refresh()
      }
    } finally {
      setDeleting(false)
    }
  }, [card.id, lng, router, t, toast])

  return (
    <li ref={rootRef} className={cn('relative', deleting && 'pointer-events-none opacity-50')}>
      <Dialog.Root
        open={confirmOpen}
        onOpenChange={(next) => {
          if (!deleting) setConfirmOpen(next)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-[101] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-6 shadow-2xl outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
            onPointerDownOutside={(e) => {
              if (deleting) e.preventDefault()
            }}
            onEscapeKeyDown={(e) => {
              if (deleting) e.preventDefault()
            }}
          >
            <div className="flex items-start justify-between gap-4 pr-2">
              <Dialog.Title className="text-lg font-medium leading-snug text-white">
                {t('dialog.deleteTitle')}
              </Dialog.Title>
              <Dialog.Close
                type="button"
                disabled={deleting}
                className="shrink-0 rounded-lg p-1 text-white/45 outline-none transition hover:bg-white/10 hover:text-white/80 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Close"
              >
                <Cross2Icon className="size-5" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-4 text-sm leading-relaxed text-white/50">
              {t('dialog.deleteMessage')}
            </Dialog.Description>
            <div className="mt-8 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={deleting}
                  className="rounded-xl border border-white/20 bg-transparent px-5 py-2.5 text-sm font-medium text-white outline-none transition hover:border-white/35 hover:bg-white/5 disabled:opacity-50"
                >
                  {t('dialog.cancel')}
                </button>
              </Dialog.Close>
              <button
                type="button"
                disabled={deleting}
                onClick={executeDelete}
                className="rounded-xl bg-[#D94B6A] px-5 py-2.5 text-sm font-medium text-white outline-none transition hover:bg-[#c7435f] disabled:opacity-60"
              >
                {t('dialog.confirmDelete')}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] text-black/80 shadow-lg shadow-black/40">

        <div className="aspect-7/5] overflow-hidden bg-[#262626] p-2 pb-0">
          <div className="rounded-t-2xl bg-white px-[15px] pt-[20px]">
            <div className="flex items-start justify-between bg-white">
              <div>
                <Image src="/assets/logo.svg" alt="Muse Logo" width={18} height={18} className="h-[18px] w-auto" />
                <p className="mt-1 text-[17px] font-semibold leading-none ">{t('preview.docTitle')}</p>
                <p className="mt-1 text-[9px] text-black/50">
                  {t('preview.quoteNo')}: {card.quotationNoLabel}
                </p>
              </div>
              <div className="pt-1 text-right">
                <p className="text-[9px] font-semibold ">{t('preview.quoteDate')}</p>
                <p className="mt-0.5 text-[9px] ">{card.quoteDate ?? '—'}</p>
                <p className="mt-0.5 text-[9px] text-black/50">{t('preview.validDays')}</p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 rounded bg-black/[0.03] p-2 text-[9px]">
              <div>
                <p className="text-black/45">{t('preview.customerInfo')}</p>
                <p className="mt-0.5 truncate font-medium ">{nameText}</p>
              </div>
              <div>
                <p className="text-black/45">{t('preview.serviceProvider')}</p>
                <p className="mt-0.5 truncate font-medium ">{t('preview.providerName')}</p>
                <p className="truncate text-black/55">{t('preview.providerContact')}</p>
              </div>
            </div>

            <p className="mt-2 text-[10px] font-semibold">{t('preview.productServiceDetails')}</p>
            <div className="mt-1 grid grid-cols-12 gap-1 border-b border-black/10 pb-1 text-[9px] text-black/45">
              <span className="col-span-5">{t('preview.colProduct')}</span>
              <span className="col-span-2 text-center">{t('preview.colQty')}</span>
              <span className="col-span-2 text-right">{t('preview.colPrice')}</span>
              <span className="col-span-3 text-right">{t('preview.colTotal')}</span>
            </div>
            <div className="mt-1 space-y-1 text-[9px] text-black/80">
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-5 truncate font-medium">{t('preview.sampleProduct')}</span>
                <span className="col-span-2 text-center">1</span>
                <span className="col-span-2 text-right">—</span>
                <span className="col-span-3 text-right">—</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-5 truncate">
                  {t('preview.memberSeat')}
                </span>
                <span className="col-span-2 text-center">{seatCountText}</span>
                <span className="col-span-2 text-right">—</span>
                <span className="col-span-3 text-right">—</span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-black/70">
                <span className="col-span-5 truncate">
                  {t('preview.storageSpace')}
                </span>
                <span className="col-span-2 text-center">{storageSpaceText}</span>
                <span className="col-span-2 text-right">—</span>
                <span className="col-span-3 text-right">—</span>
              </div>
            </div>
          </div>
        </div>


        <div className="relative px-4 pb-4 pt-3">
          <p className="pr-10 text-[15px] font-medium leading-snug text-white">{nameText}</p>
          {modifiedLine ? (
            <p className="mt-1.5 text-xs text-white/45">{modifiedLine}</p>
          ) : null}
          {createdLine ? (
            <p className="mt-0.5 text-xs text-white/45">{createdLine}</p>
          ) : null}

          <div className="absolute bottom-3 right-3">
            <button
              type="button"
              aria-label="menu"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpen((v) => !v)
              }}
              className="flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <MoreHorizontal className="size-5" />
            </button>
            {open ? (
              <div className="absolute bottom-full right-0 z-20 mb-1 min-w-[120px] overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f] py-1 shadow-xl">
                <LocaleLink
                  href={card.hrefPath}
                  className="block px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {t('actions.edit')}
                </LocaleLink>
                <button
                  type="button"
                  className="block w-full px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-white/5"
                  onClick={openDeleteDialog}
                >
                  {t('actions.delete')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  )
}
