'use client'

import { Highlight, themes, type Language } from 'prism-react-renderer'

import { CopyButton } from './CopyButton'

export function CodeBlock({
  code,
  language = 'text',
  english = false,
}: {
  code: string
  language?: string
  english?: boolean
}) {
  const supported = ['json', 'javascript', 'typescript', 'bash', 'html', 'css', 'python']
  return (
    <div className="dev-code">
      <div className="dev-code-header">
        <span>{language}</span>
        <CopyButton text={code} english={english} />
      </div>
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
    </div>
  )
}
