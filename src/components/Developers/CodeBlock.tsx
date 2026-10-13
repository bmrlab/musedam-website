'use client'

import { useEffect, useRef, useState } from 'react'
import { Highlight, themes, type Language } from 'prism-react-renderer'

import { CopyButton } from './CopyButton'

export function CodeBlock({
  code,
  language = 'text',
  english = false,
  deferHighlight = false,
}: {
  code: string
  language?: string
  english?: boolean
  deferHighlight?: boolean
}) {
  const container = useRef<HTMLDivElement>(null)
  const [highlight, setHighlight] = useState(!deferHighlight)
  useEffect(() => {
    if (!deferHighlight || !container.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHighlight(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [deferHighlight])

  const supported = ['json', 'javascript', 'typescript', 'bash', 'html', 'css', 'python']
  return (
    <div className="dev-code" ref={container}>
      <div className="dev-code-header">
        <span>{language}</span>
        <CopyButton text={code} english={english} />
      </div>
      {highlight ? (
        <Highlight
          theme={themes.github}
          code={code.trimEnd()}
          language={(supported.includes(language) ? language : 'plain') as Language}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre tabIndex={0}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      ) : (
        <pre tabIndex={0}>{code.trimEnd()}</pre>
      )}
    </div>
  )
}
