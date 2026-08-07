'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuotationStore } from '@/providers/QuotationStore'
import { cn } from '@/utilities/cn'
import { formatWithToLocaleString } from '@/utilities/formatPrice'
import * as Switch from '@radix-ui/react-switch'
import { Check, ChevronDown, Minus, Plus, Trash2, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { useTranslation } from '@/app/i18n/client'

import { useCustomServiceRoleOptions, usePricing } from './config'
import { ICustomService, ICustomServiceRoleLine } from './types'

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const createRoleLine = (detailId?: string): ICustomServiceRoleLine => ({
  id: createId('custom-role'),
  detailId,
  role: 'developer',
  quantity: 1,
})

const createService = (): ICustomService => {
  const detailId = createId('custom-detail')
  return {
    id: createId('custom-service'),
    name: '',
    roleByDetail: false,
    details: [{ id: detailId, description: '' }],
    roleLines: [createRoleLine()],
  }
}

interface RoleDropdownProps {
  line: ICustomServiceRoleLine
  onChange: (patch: Partial<ICustomServiceRoleLine>) => void
}

const RoleDropdown = ({ line, onChange }: RoleDropdownProps) => {
  const { t } = useTranslation('quotation')
  const options = useCustomServiceRoleOptions()
  const [open, setOpen] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [customName, setCustomName] = useState(line.customRoleName ?? '')
  const rootRef = useRef<HTMLDivElement>(null)

  const selected = options.find((option) => option.value === line.role)
  const label =
    line.role === 'custom' && line.customRoleName ? line.customRoleName : selected?.label

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setCustomizing(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const confirmCustomRole = () => {
    const name = customName.trim()
    if (!name) return
    onChange({ role: 'custom', customRoleName: name })
    setOpen(false)
    setCustomizing(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-7 items-center gap-1 whitespace-nowrap rounded border border-white/20 bg-transparent px-2 text-sm text-white"
      >
        <span>{label}</span>
        <ChevronDown className="size-3 shrink-0 text-white-50" />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+6px)] left-0 z-30 w-max min-w-[230px] overflow-hidden whitespace-nowrap rounded-lg border border-white/20 bg-[#141414] p-1 shadow-2xl">
          {options
            .filter((option) => option.value !== 'custom')
            .map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ role: option.value, customRoleName: undefined })
                  setOpen(false)
                }}
                className={cn(
                  'flex h-10 w-full items-center justify-between rounded px-3 text-left text-sm text-white hover:bg-[#2B2B2B]',
                  line.role === option.value && 'bg-[#2B2B2B]',
                )}
              >
                {option.label}
                {line.role === option.value && <Check className="size-4" />}
              </button>
            ))}

          {customizing ? (
            <div className="flex h-10 items-center gap-1 px-3">
              <Input
                autoFocus
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') confirmCustomRole()
                  if (event.key === 'Escape') setCustomizing(false)
                }}
                placeholder={t('custom.role.namePlaceholder')}
                className="h-8 flex-1 border-0 px-0 text-sm text-white focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="flex size-7 items-center justify-center rounded bg-white/10 text-white-72"
              >
                <X className="size-4" />
              </button>
              <button
                type="button"
                disabled={!customName.trim()}
                onClick={confirmCustomRole}
                className="flex size-7 items-center justify-center rounded bg-white/10 text-white disabled:opacity-30"
              >
                <Check className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCustomName(line.customRoleName ?? '')
                setCustomizing(true)
              }}
              className="flex h-10 w-full items-center gap-2 rounded px-3 text-left text-sm text-white hover:bg-[#2B2B2B]"
            >
              <Plus className="size-4" />
              {t('custom.role.custom')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export const CustomServiceContent = () => {
  const { t } = useTranslation('quotation')
  const { prefix } = usePricing()
  const roleOptions = useCustomServiceRoleOptions()
  const { customServices, setCustomServices } = useQuotationStore()

  const roleMap = useMemo(
    () => new Map(roleOptions.map((option) => [option.value, option])),
    [roleOptions],
  )

  const updateService = (id: string, updater: (service: ICustomService) => ICustomService) => {
    setCustomServices((services) =>
      services.map((service) => (service.id === id ? updater(service) : service)),
    )
  }

  const updateRoleLine = (
    serviceId: string,
    lineId: string,
    patch: Partial<ICustomServiceRoleLine>,
  ) => {
    updateService(serviceId, (service) => ({
      ...service,
      roleLines: service.roleLines.map((line) =>
        line.id === lineId ? { ...line, ...patch } : line,
      ),
    }))
  }

  const serviceCost = (service: ICustomService) =>
    service.roleLines.reduce(
      (sum, line) => sum + (roleMap.get(line.role)?.price ?? 0) * line.quantity,
      0,
    )

  return (
    <div className="space-y-4">
      {customServices.map((service) => (
        <div
          key={service.id}
          className="overflow-visible rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#141414]"
        >
          <div className="flex min-h-[52px] items-center gap-3 border-b border-white/10 px-4">
            <Input
              value={service.name}
              onChange={(event) =>
                updateService(service.id, (current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder={t('custom.service.namePlaceholder')}
              className="h-10 flex-1 border-0 px-0 text-base text-white focus-visible:ring-0"
            />
            <Switch.Root
              checked={service.roleByDetail}
              onCheckedChange={(checked) =>
                updateService(service.id, (current) => {
                  if (checked) {
                    return {
                      ...current,
                      roleByDetail: true,
                      roleLines: current.details.map((detail, index) => ({
                        ...(current.roleLines[index] ?? createRoleLine(detail.id)),
                        detailId: detail.id,
                      })),
                    }
                  }
                  return {
                    ...current,
                    roleByDetail: false,
                    roleLines: [
                      {
                        ...(current.roleLines[0] ?? createRoleLine()),
                        detailId: undefined,
                      },
                    ],
                  }
                })
              }
              className="relative h-[22px] w-[44px] shrink-0 rounded-full border border-white/20 bg-black transition-colors data-[state=checked]:border-[#3366FF] data-[state=checked]:bg-[#3366FF]"
            >
              <Switch.Thumb className="block size-[18px] translate-x-0.5 rounded-full bg-white-72 transition-transform data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-white" />
            </Switch.Root>
            <span className="hidden whitespace-nowrap text-xs text-white-50 sm:block">
              {t('custom.roleByDetail')}
            </span>
            <button
              type="button"
              aria-label={t('custom.service.delete')}
              onClick={() =>
                setCustomServices((services) => services.filter((item) => item.id !== service.id))
              }
              className="text-white-50 transition-colors hover:text-white"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="border-b border-white/10 px-4 py-3">
            {service.details.map((detail) => {
              const line = service.roleLines.find((item) => item.detailId === detail.id)
              return (
                <div key={detail.id} className="flex min-h-10 items-center gap-2">
                  <Input
                    value={detail.description}
                    onChange={(event) =>
                      updateService(service.id, (current) => ({
                        ...current,
                        details: current.details.map((item) =>
                          item.id === detail.id
                            ? { ...item, description: event.target.value }
                            : item,
                        ),
                      }))
                    }
                    placeholder={t('custom.detail.placeholder')}
                    className="h-9 flex-1 border-0 px-0 text-sm text-white focus-visible:ring-0"
                  />
                  {service.roleByDetail && line && (
                    <RoleDropdown
                      line={line}
                      onChange={(patch) => updateRoleLine(service.id, line.id, patch)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      updateService(service.id, (current) => {
                        const nextDetail = {
                          id: createId('custom-detail'),
                          description: '',
                        }
                        const index = current.details.findIndex((item) => item.id === detail.id)
                        const details = [...current.details]
                        details.splice(index + 1, 0, nextDetail)
                        return {
                          ...current,
                          details,
                          roleLines: current.roleByDetail
                            ? [...current.roleLines, createRoleLine(nextDetail.id)]
                            : current.roleLines,
                        }
                      })
                    }
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-white-50 hover:border-white/50 hover:text-white"
                  >
                    <Plus className="size-3" />
                  </button>
                  <button
                    type="button"
                    disabled={service.details.length === 1}
                    onClick={() =>
                      updateService(service.id, (current) => ({
                        ...current,
                        details: current.details.filter((item) => item.id !== detail.id),
                        roleLines: current.roleLines.filter((item) => item.detailId !== detail.id),
                      }))
                    }
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-white-50 hover:border-white/50 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="size-3" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="space-y-3 p-4">
            {service.roleLines.map((line) => {
              const option = roleMap.get(line.role)
              const label =
                line.role === 'custom' && line.customRoleName ? line.customRoleName : option?.label
              return (
                <div key={line.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {!service.roleByDetail && (
                      <RoleDropdown
                        line={line}
                        onChange={(patch) => updateRoleLine(service.id, line.id, patch)}
                      />
                    )}
                    {service.roleByDetail && (
                      <span className="truncate text-sm text-white">{label}</span>
                    )}
                    <span className="whitespace-nowrap text-xs text-white-50">
                      {prefix}
                      {formatWithToLocaleString(option?.price ?? 0)}
                      {t('custom.perPersonDay')}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      disabled={line.quantity <= 1}
                      onClick={() =>
                        updateRoleLine(service.id, line.id, {
                          quantity: Math.max(1, line.quantity - 1),
                        })
                      }
                      className="flex size-6 items-center justify-center rounded-full border border-white/20 bg-[#414141] text-white-50 disabled:opacity-50"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="min-w-4 text-center text-sm text-white">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateRoleLine(service.id, line.id, {
                          quantity: line.quantity + 1,
                        })
                      }
                      className="flex size-6 items-center justify-center rounded-full bg-white text-[#141414]"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 p-4">
            <span className="text-base text-white">{t('base.cost')}</span>
            <span className="text-xl font-medium text-white">
              {prefix}
              {formatWithToLocaleString(serviceCost(service))}
            </span>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setCustomServices((services) => [...services, createService()])}
        className="flex h-12 w-full items-center justify-center gap-2 rounded border border-dashed border-white/20 text-sm text-white-50 transition-colors hover:border-white/40 hover:text-white"
      >
        <Plus className="size-4" />
        {t('custom.service.add')}
      </button>

    </div>
  )
}
