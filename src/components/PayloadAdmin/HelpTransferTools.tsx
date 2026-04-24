'use client'

import React, { useMemo, useState } from 'react'

type ApiResult = {
  success?: boolean
  error?: string
  dryRun?: boolean
  message?: string
  summary?: unknown
}

export default function HelpTransferTools() {
  const [contentFile, setContentFile] = useState<File | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [dryRunImport, setDryRunImport] = useState(false)
  const [dryRunMedia, setDryRunMedia] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [actionLabel, setActionLabel] = useState<string>('')

  const disabled = useMemo(() => Boolean(loading), [loading])

  const cardStyle: React.CSSProperties = {
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    background: 'var(--theme-elevation-50)',
  }

  const primaryButtonStyle: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid var(--theme-elevation-300)',
    background: 'var(--theme-text)',
    color: 'var(--theme-bg)',
    cursor: 'pointer',
    fontWeight: 600,
  }

  const secondaryTextStyle: React.CSSProperties = {
    margin: '6px 0 0',
    color: 'var(--theme-elevation-700)',
    fontSize: 13,
  }

  const callWithFile = async (url: string, file: File | null, dryRun: boolean) => {
    if (!file) {
      setResult({ error: '请先选择 JSON 文件' })
      return
    }
    const form = new FormData()
    form.set('file', file)
    form.set('dryRun', String(dryRun))
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: form,
    })
    const json = (await response.json()) as ApiResult
    setResult(
      response.ok
        ? json
        : {
            ...json,
            success: false,
          },
    )
  }

  const onExport = async () => {
    setActionLabel('导出帮助中心')
    setLoading('export')
    setResult(null)
    try {
      const response = await fetch('/api/help-transfer/export', {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        const json = (await response.json()) as ApiResult
        setResult(json)
        return
      }
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `help-center-export-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(objectUrl)
      setResult({ success: true, message: '导出完成，JSON 文件已开始下载。' })
    } finally {
      setLoading(null)
    }
  }

  const onImport = async () => {
    setActionLabel('导入帮助中心')
    setLoading('import')
    setResult(null)
    try {
      await callWithFile('/api/help-transfer/import', contentFile, dryRunImport)
    } finally {
      setLoading(null)
    }
  }

  const onSyncMedia = async () => {
    setActionLabel('同步帮助中心媒体')
    setLoading('media')
    setResult(null)
    try {
      await callWithFile('/api/help-transfer/media-sync', mediaFile || contentFile, dryRunMedia)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ margin: '16px 0 24px', maxWidth: 860 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 22 }}>帮助中心迁移工具</h3>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-700)' }}>
        当前为 <strong>v2</strong>：导出为 <code>formatVersion: 2</code>（help_documents 三表 + 引用 media
        行）。目标站导入时会按分类英文 title 解析 category_id，并按 filename+prefix 复用或拉取上传
        media。旧版 v1 整包 JSON 仍可导入；「同步媒体」仅适用于 v1。
      </p>

      <div style={cardStyle}>
        <h4 style={{ marginTop: 0 }}>1) 导出（v2 JSON）</h4>
        <button type="button" style={primaryButtonStyle} disabled={disabled} onClick={onExport}>
          {loading === 'export' ? '导出中...' : '导出帮助中心'}
        </button>
      </div>

      <div style={cardStyle}>
        <h4 style={{ marginTop: 0 }}>2) 导入（v2 或 v1 JSON）</h4>
        <input
          type="file"
          accept="application/json"
          onChange={(event) => setContentFile(event.target.files?.[0] ?? null)}
        />
        <p style={secondaryTextStyle}>当前文件：{contentFile ? contentFile.name : '未选择'}</p>
        <label style={{ display: 'block', margin: '10px 0', fontSize: 13 }}>
          <input type="checkbox" checked={dryRunImport} onChange={(e) => setDryRunImport(e.target.checked)} />{' '}
          先 dry-run（仅统计新增/更新，不写入）
        </label>
        {!dryRunImport && (
          <p style={{ margin: '8px 0', color: '#16a34a', fontSize: 13 }}>
            当前为正式导入模式，点击后会写入数据库。
          </p>
        )}
        <button type="button" style={primaryButtonStyle} disabled={disabled} onClick={onImport}>
          {loading === 'import' ? '导入中...' : '导入帮助中心'}
        </button>
      </div>

      <div style={cardStyle}>
        <h4 style={{ marginTop: 0 }}>3) 同步媒体（仅 v1）</h4>
        <input
          type="file"
          accept="application/json"
          onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
        />
        <p style={secondaryTextStyle}>
          当前文件：{mediaFile ? mediaFile.name : '未选择（将复用导入文件）'}。v2 导出请勿用此步骤。
        </p>
        <label style={{ display: 'block', margin: '10px 0', fontSize: 13 }}>
          <input type="checkbox" checked={dryRunMedia} onChange={(e) => setDryRunMedia(e.target.checked)} /> 先
          dry-run（仅统计将同步媒体数量）
        </label>
        <button type="button" style={primaryButtonStyle} disabled={disabled} onClick={onSyncMedia}>
          {loading === 'media' ? '同步中...' : '同步帮助中心媒体'}
        </button>
      </div>

      {loading && (
        <div
          style={{
            marginTop: 8,
            marginBottom: 10,
            borderRadius: 8,
            padding: '10px 12px',
            border: '1px solid var(--theme-elevation-300)',
            background: 'var(--theme-elevation-100)',
          }}
        >
          正在执行：{actionLabel}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 12,
            background: result.success ? 'rgba(22,163,74,0.12)' : 'rgba(239,68,68,0.12)',
            color: 'var(--theme-text)',
            border: `1px solid ${result.success ? 'rgba(22,163,74,0.5)' : 'rgba(239,68,68,0.5)'}`,
            padding: '12px 14px',
            borderRadius: 8,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {result.success ? `执行成功：${actionLabel}` : `执行失败：${actionLabel || '请求'}`}
          </div>
          {result.message && <div style={{ marginBottom: 8 }}>{result.message}</div>}
          <pre
            style={{
              margin: 0,
              padding: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'transparent',
            }}
          >
            {JSON.stringify(result.summary ?? result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
