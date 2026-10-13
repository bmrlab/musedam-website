import { localizeDeveloperText } from './localize'
import englishPages from './pages.en.json'
import pages from './pages.json'
import traditionalPages from './pages.tw.json'

export const developerPages = pages
export const developerGroups = [
  { id: 'start', title: '开始', en: 'GET STARTED' },
  { id: 'api', title: '开放 API', en: 'OPEN API' },
  { id: 'apps', title: '第三方集成', en: 'INTEGRATIONS' },
  { id: 'mcp', title: 'MCP 与 AI 工具', en: 'MCP & AI TOOLS' },
  { id: 'examples', title: '场景与示例', en: 'USE CASES & EXAMPLES' },
]

export const developerNavigation = [
  {
    slug: 'landing',
    title: '概览',
    en: 'Overview',
    group: 'start',
    description: '选择适合你的接入方式',
    search: 'overview 开放平台',
  },
  ...pages.map(({ slug, title, en, group, description, headings, markdown }) => ({
    slug,
    title,
    en,
    group,
    description,
    search: `${headings.map((heading) => heading.title).join(' ')} ${Array.from(markdown.matchAll(/(?:\/|musedam_)[a-z][a-z_-]+/g), (match) => match[0]).join(' ')}`,
  })),
]

export const getDeveloperPages = (lng: string) =>
  lng === 'en-US' ? englishPages : lng === 'zh-TW' ? traditionalPages : pages
export function getDeveloperNavigation(lng: string) {
  if (lng === 'zh-TW')
    return [
      { ...developerNavigation[0], title: '概覽', description: '選擇適合你的接入方式' },
      ...traditionalPages.map(({ slug, title, en, group, description, headings, markdown }) => ({
        slug,
        title,
        en,
        group,
        description,
        search: `${headings.map((h) => h.title).join(' ')} ${Array.from(markdown.matchAll(/(?:\/|musedam_)[a-z][a-z_-]+/g), (m) => m[0]).join(' ')}`,
      })),
    ]
  if (lng !== 'en-US') return developerNavigation
  return [
    {
      ...developerNavigation[0],
      title: 'Overview',
      description: 'Choose your integration path',
      search: 'overview developer platform',
    },
    ...englishPages.map(({ slug, title, en, group, description, headings, markdown }) => ({
      slug,
      title,
      en,
      group,
      description,
      search: `${headings.map((h) => h.title).join(' ')} ${Array.from(markdown.matchAll(/(?:\/|musedam_)[a-z][a-z_-]+/g), (m) => m[0]).join(' ')}`,
    })),
  ]
}

export const getDeveloperGroups = (lng: string) =>
  developerGroups.map((group) => ({ ...group, title: localizeDeveloperText(group.title, lng) }))
