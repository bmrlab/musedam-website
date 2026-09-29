'use client'

import { useEffect, useState } from 'react'
import { localizeDeveloperText } from '@/data/developers/localize'

type Heading = { id: string; title: string; level: number }
export function TableOfContents({ headings, lng }: { headings: Heading[]; lng: string }) {
  const [active, setActive] = useState(headings[0]?.id ?? '')
  useEffect(() => {
    setActive(headings[0]?.id ?? '')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -65% 0px', threshold: 0 },
    )
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])
  return (
    <aside className="dev-toc">
      <nav aria-label={lng === 'en-US' ? 'On this page' : localizeDeveloperText('本页目录', lng)}>
        <p>{lng === 'en-US' ? 'ON THIS PAGE' : localizeDeveloperText('本页目录', lng)}</p>
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`${active === heading.id ? 'active' : ''} ${heading.level === 3 ? 'subheading' : ''}`}
            aria-current={active === heading.id ? 'location' : undefined}
            onClick={() => setActive(heading.id)}
          >
            {heading.title}
          </a>
        ))}
      </nav>
      <div className="dev-toc-help">
        <span>
          {lng === 'en-US'
            ? 'Building an integration?'
            : localizeDeveloperText('需要接入支持？', lng)}
        </span>
        <a href={`/${lng}/book-demo`}>
          {lng === 'en-US'
            ? 'Talk to our team ↗'
            : localizeDeveloperText('联系 MuseDAM 团队 ↗', lng)}
        </a>
      </div>
    </aside>
  )
}
