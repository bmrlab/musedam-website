import { localizeDeveloperText } from './localize'
import englishPages from './pages.en.json'
import pages from './pages.json'
import traditionalPages from './pages.tw.json'
import { getDeveloperRegion, isDeveloperPageAvailable, regionalizeDeveloperBlocks } from './region'

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

/** 按部署区域过滤：去掉只在国内提供的页面，以及正文里只属于另一区域的片段和对应目录标题 */
function regionalizePages<
  T extends { slug: string; markdown: string; headings: { title: string }[] },
>(list: T[]) {
  const region = getDeveloperRegion()
  return list
    .filter((page) => isDeveloperPageAvailable(page.slug, region))
    .map((page) => {
      const { markdown, removed } = regionalizeDeveloperBlocks(page.markdown, region)
      if (markdown === page.markdown) return page
      const removedTitles = new Set(
        Array.from(removed.matchAll(/^#{2,4}\s+(.+)$/gm), (match) => match[1].trim()),
      )
      return {
        ...page,
        markdown,
        headings: page.headings.filter((heading) => !removedTitles.has(heading.title)),
      }
    })
}

export const getDeveloperPages = (lng: string) =>
  regionalizePages(lng === 'en-US' ? englishPages : lng === 'zh-TW' ? traditionalPages : pages)
export function getDeveloperNavigation(lng: string) {
  if (lng === 'zh-TW')
    return [
      { ...developerNavigation[0], title: '概覽', description: '選擇適合你的接入方式' },
      ...getDeveloperPages(lng).map(
        ({ slug, title, en, group, description, headings, markdown }) => ({
          slug,
          title,
          en,
          group,
          description,
          search: `${headings.map((h) => h.title).join(' ')} ${Array.from(markdown.matchAll(/(?:\/|musedam_)[a-z][a-z_-]+/g), (m) => m[0]).join(' ')}`,
        }),
      ),
    ]
  if (lng !== 'en-US')
    return [
      developerNavigation[0],
      ...getDeveloperPages(lng).map(
        ({ slug, title, en, group, description, headings, markdown }) => ({
          slug,
          title,
          en,
          group,
          description,
          search: `${headings.map((heading) => heading.title).join(' ')} ${Array.from(markdown.matchAll(/(?:\/|musedam_)[a-z][a-z_-]+/g), (match) => match[0]).join(' ')}`,
        }),
      ),
    ]
  return [
    {
      ...developerNavigation[0],
      title: 'Overview',
      description: 'Choose your integration path',
      search: 'overview developer platform',
    },
    ...getDeveloperPages(lng).map(
      ({ slug, title, en, group, description, headings, markdown }) => ({
        slug,
        title,
        en,
        group,
        description,
        search: `${headings.map((h) => h.title).join(' ')} ${Array.from(markdown.matchAll(/(?:\/|musedam_)[a-z][a-z_-]+/g), (m) => m[0]).join(' ')}`,
      }),
    ),
  ]
}

export const getDeveloperGroups = (lng: string) =>
  developerGroups.map((group) => ({ ...group, title: localizeDeveloperText(group.title, lng) }))
