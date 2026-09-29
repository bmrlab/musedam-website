'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localizeDeveloperText } from '@/data/developers/localize'
import { BookOpen, ChevronDown, Search, X } from 'lucide-react'

type Item = {
  slug: string
  title: string
  en: string
  group: string
  description: string
  search: string
}
type Group = { id: string; title: string; en: string }

export function DeveloperSidebar({
  lng,
  items,
  groups,
}: {
  lng: string
  items: Item[]
  groups: Group[]
}) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const english = lng === 'en-US'
  const filtered = items.filter((item) =>
    `${item.title} ${item.en} ${item.description} ${item.search}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )
  return (
    <aside className="dev-sidebar">
      <Link className="dev-brand" href={`/${lng}/developers/landing`}>
        <span>
          {english ? 'Developer Center' : localizeDeveloperText('开发者中心', lng)}
          <small>{english ? 'Documentation' : 'Developers'}</small>
        </span>
      </Link>
      <button
        className="dev-mobile-menu"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="developer-navigation"
      >
        <BookOpen size={16} />
        {english ? 'Documentation' : localizeDeveloperText('文档导航', lng)}
        <ChevronDown size={16} />
      </button>
      <div className={`dev-sidebar-content ${open ? 'is-open' : ''}`} id="developer-navigation">
        <div className="dev-search">
          <Search size={15} />
          <input
            aria-label={
              english ? 'Search documentation' : localizeDeveloperText('搜索文档或接口', lng)
            }
            placeholder={
              english ? 'Search docs or endpoints' : localizeDeveloperText('搜索文档或接口…', lng)
            }
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={english ? 'Clear search' : localizeDeveloperText('清除搜索', lng)}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <nav
          aria-label={
            english ? 'Developer documentation' : localizeDeveloperText('开发者文档', lng)
          }
        >
          {groups.map((group) => {
            const matches = filtered.filter((item) => item.group === group.id)
            return (
              matches.length > 0 && (
                <div className="dev-nav-group" key={group.id}>
                  <p>{english ? group.en : group.title}</p>
                  {matches.map((item) => (
                    <Link
                      key={item.slug}
                      className={pathname?.endsWith(`/${item.slug}`) ? 'active' : ''}
                      href={`/${lng}/developers/${item.slug}`}
                      aria-current={pathname?.endsWith(`/${item.slug}`) ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {english ? item.en : item.title}
                      {item.slug === 'mcp' && <span className="dev-nav-badge">MCP</span>}
                    </Link>
                  ))}
                </div>
              )
            )
          })}
          {filtered.length === 0 && (
            <p className="dev-empty" role="status">
              {english
                ? 'No matching docs. Try API, MCP or assets.'
                : localizeDeveloperText('未找到相关文档，试试「素材」「MCP」或接口名称。', lng)}
            </p>
          )}
        </nav>
      </div>
    </aside>
  )
}
