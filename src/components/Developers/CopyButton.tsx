'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { localizeDeveloperText } from '@/data/developers/localize'
import { Check, Copy } from 'lucide-react'

export function CopyButton({
  text,
  label,
  english = false,
  className = '',
}: {
  text: string
  english?: boolean
  label?: string
  className?: string
}) {
  const lng = useParams<{ lng: string }>()?.lng ?? 'zh-CN'
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  useEffect(() => {
    if (status !== 'copied') return
    const timeout = setTimeout(() => setStatus('idle'), 2000)
    return () => clearTimeout(timeout)
  }, [status])
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }
  return (
    <button type="button" className={`dev-copy ${className}`} onClick={copy} aria-live="polite">
      {status === 'copied' ? <Check size={14} /> : <Copy size={14} />}
      {status === 'copied'
        ? english
          ? 'Copied'
          : localizeDeveloperText('已复制', lng)
        : status === 'error'
          ? english
            ? 'Copy failed; select manually'
            : localizeDeveloperText('复制失败，请手动选择', lng)
          : label || (english ? 'Copy' : localizeDeveloperText('复制', lng))}
    </button>
  )
}
