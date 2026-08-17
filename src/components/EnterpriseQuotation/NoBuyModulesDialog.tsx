'use client'

import { FC, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { cn } from '@/utilities/cn'
import { QuoteDetailRow } from './QuoteDetailData'

interface NoBuyModulesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 可展示的未选模块候选 */
  candidates: QuoteDetailRow[]
  /** 已勾选的模块 key，undefined 表示全选 */
  value: string[] | undefined
  onConfirm: (keys: string[]) => void
}

/** 「展示未选模块报价」勾选弹窗：选择报价单里要列出哪些未选模块 */
export const NoBuyModulesDialog: FC<NoBuyModulesDialogProps> = ({
  open,
  onOpenChange,
  candidates,
  value,
  onConfirm,
}) => {
  const { t } = useTranslation('quotation')
  const allKeys = candidates.map((v) => v.key!).filter(Boolean)
  const [selected, setSelected] = useState<string[]>(allKeys)

  // 每次打开时按当前配置回填（未配置过则默认全选）
  useEffect(() => {
    if (!open) return
    setSelected(value ? allKeys.filter((k) => value.includes(k)) : allKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value])

  const allChecked = allKeys.length > 0 && selected.length === allKeys.length

  const toggle = (key: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, key] : prev.filter((k) => k !== key)))
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[80vh] w-[560px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#141414] p-6 text-white shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <Dialog.Title className="text-lg font-semibold">
              {t('noBuy.dialog.title')}
            </Dialog.Title>
            <Dialog.Close className="rounded-lg p-1 transition-colors hover:bg-white/10">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="mb-3 flex items-center gap-2 border-b border-[rgba(255,255,255,0.1)] pb-3">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(c: boolean) => setSelected(c ? allKeys : [])}
              className="size-4 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm">
              {t('noBuy.dialog.selectAll')}
              <span className="ml-2 text-white-50">
                {selected.length}/{allKeys.length}
              </span>
            </span>
          </div>

          <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto">
            {candidates.length === 0 && (
              <p className="py-6 text-center text-sm text-white-50">{t('noBuy.dialog.empty')}</p>
            )}
            {candidates.map((row) => {
              const key = row.key!
              const checked = selected.includes(key)
              return (
                <label key={key} className="flex cursor-pointer items-start gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c: boolean) => toggle(key, c)}
                    className="mt-[2px] size-4 shrink-0 border-white/20 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                  />
                  <span className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <span className="text-sm">{row.name}</span>
                    <span className="shrink-0 text-sm text-white-50">{row.unit ?? '-'}</span>
                  </span>
                </label>
              )
            })}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <Button
              variant="outline"
              className={cn(
                'h-9 rounded-lg border-[rgba(255,255,255,0.2)] bg-transparent px-4 text-sm text-white',
                'hover:bg-white/10 hover:text-white',
              )}
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              className="h-9 rounded-lg bg-white px-4 text-sm text-[#0e0e0e] hover:bg-white/80"
              onClick={() => {
                onConfirm(selected)
                onOpenChange(false)
              }}
            >
              {t('confirm')}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
