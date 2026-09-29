'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { localizeDeveloperText } from '@/data/developers/localize'
import { ArrowUpRight, BookOpen, FileText, Sparkles, X } from 'lucide-react'

import { CopyButton } from './CopyButton'

export function PromptDialog({
  prompt,
  markdown,
  english,
  indexUrl,
  markdownUrl,
}: {
  prompt: string
  markdown: string
  english: boolean
  indexUrl: string
  markdownUrl: string
}) {
  const lng = useParams<{ lng: string }>()?.lng ?? 'zh-CN'
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  function cancelClose() {
    clearTimeout(timer.current)
  }
  function show() {
    cancelClose()
    setOpen(true)
  }
  function hide() {
    cancelClose()
    setOpen(false)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!open) return
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  return (
    <div
      ref={root}
      className="dev-prompt-anchor"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') show()
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== 'mouse' ||
          (root.current?.contains(document.activeElement) &&
            document.activeElement !== trigger.current)
        )
          return
        cancelClose()
        timer.current = setTimeout(() => setOpen(false), 180)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          hide()
          trigger.current?.focus()
        }
      }}
    >
      <button
        ref={trigger}
        className="dev-copy dev-prompt-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-haspopup="dialog"
        onClick={show}
      >
        <Sparkles size={14} />
        {english ? 'Copy AI prompt' : localizeDeveloperText('复制提示词', lng)}
      </button>
      {open && (
        <div id={id} role="dialog" aria-labelledby={`${id}-title`} className="dev-prompt-dialog">
          <div className="dev-prompt-heading">
            <span className="dev-prompt-icon">
              <Sparkles size={21} strokeWidth={1.6} />
            </span>
            <div>
              <h2 id={`${id}-title`} className="dev-prompt-title">
                {english ? 'Agent prompt' : localizeDeveloperText('智能体提示词', lng)}
              </h2>
              <p className="dev-prompt-description">
                {english
                  ? 'Paste this into your AI coding assistant to read the relevant docs before implementing.'
                  : localizeDeveloperText(
                      '粘贴给 AI 编程助手，让它先阅读对应文档，再开始实现。',
                      lng,
                    )}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="dev-prompt-close"
            onClick={() => {
              hide()
              trigger.current?.focus()
            }}
            aria-label={english ? 'Close' : localizeDeveloperText('关闭', lng)}
          >
            <X size={20} />
          </button>
          <div className="dev-prompt-body">
            <div className="dev-prompt-preview-label">
              <span>{english ? 'PROMPT PREVIEW' : localizeDeveloperText('提示词预览', lng)}</span>
              <span>MuseDAM Developers</span>
            </div>
            <textarea
              className="dev-prompt-text"
              aria-label={english ? 'Prompt content' : localizeDeveloperText('提示词内容', lng)}
              value={prompt}
              readOnly
              spellCheck={false}
            />
            <div className="dev-prompt-links">
              <a href={indexUrl} target="_blank" rel="noreferrer">
                <BookOpen size={14} />
                {english ? 'Documentation index' : localizeDeveloperText('文档索引', lng)}
                <ArrowUpRight size={13} />
              </a>
              <a href={markdownUrl} target="_blank" rel="noreferrer">
                <FileText size={14} />
                {english ? 'Page Markdown' : localizeDeveloperText('本页 Markdown', lng)}
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="dev-prompt-actions">
            <CopyButton
              className="dev-prompt-secondary"
              text={markdown}
              english={english}
              label={
                english ? 'Copy page Markdown' : localizeDeveloperText('复制页面 Markdown', lng)
              }
            />
            <CopyButton
              className="dev-prompt-primary"
              text={prompt}
              english={english}
              label={english ? 'Copy AI prompt' : localizeDeveloperText('复制提示词', lng)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
