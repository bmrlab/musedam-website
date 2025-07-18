export interface MockArticle {
  id: string
  title: string
  description: string
  category: string
  color: string
  image?: string
  isFeatured?: boolean
  isHero?: boolean
}

export interface MockCategory {
  id: string
  title: string
  count: number
}

// Mock 分类数据
export const mockCategories: MockCategory[] = [
  { id: 'all', title: 'All', count: 156 },
  { id: 'digital-transformation', title: 'Digital Transformation', count: 23 },
  { id: 'workflow-mastery', title: 'Workflow Mastery', count: 18 },
  { id: 'asset-intelligence', title: 'Asset Intelligence', count: 15 },
  { id: 'building-brands', title: 'Building Brands', count: 12 },
  { id: 'industry-spotlight', title: 'Industry Spotlight', count: 9 },
  { id: 'content-leadership', title: 'Content Leadership', count: 8 },
  { id: 'creative-ops', title: 'Creative Ops', count: 7 },
  { id: 'community-voices', title: 'Community Voices', count: 6 },
  { id: 'press-news', title: 'Press News', count: 4 },
]

// Hero 文章
export const mockHeroArticle: MockArticle = {
  id: 'hero-1',
  title: 'How to create a website from scratch in 11 steps',
  description: 'This is description this is description this is description this is description this is description this is description.',
  category: 'DIGITAL TRANSFORMATION',
  color: '#F5E6A3',
  isHero: true,
}

// Top Articles
export const mockTopArticles: MockArticle[] = [
  {
    id: 'top-1',
    title: 'This is description this is description this is description this',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'DIGITAL TRANSFORMATION',
    color: '#A855F7',
    isFeatured: true,
  },
  {
    id: 'top-2',
    title: 'This is description this is description this is description this',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'DIGITAL TRANSFORMATION',
    color: '#A855F7',
    isFeatured: true,
  },
  {
    id: 'top-3',
    title: 'This is description this is description this is description this',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'DIGITAL TRANSFORMATION',
    color: '#A855F7',
    isFeatured: true,
  },
]

// All Articles
export const mockAllArticles: MockArticle[] = [
  {
    id: 'article-1',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'DIGITAL TRANSFORMATION',
    color: '#3B82F6',
  },
  {
    id: 'article-2',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'DIGITAL TRANSFORMATION',
    color: '#A855F7',
  },
  {
    id: 'article-3',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'DIGITAL TRANSFORMATION',
    color: '#6366F1',
  },
  {
    id: 'article-4',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'WORKFLOW MASTERY',
    color: '#84CC16',
  },
  {
    id: 'article-5',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'BUILDING BRANDS',
    color: '#A16207',
  },
  {
    id: 'article-6',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'INDUSTRY SPOTLIGHT',
    color: '#DC2626',
  },
  {
    id: 'article-7',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'CREATIVE OPS',
    color: '#E5E7EB',
  },
  {
    id: 'article-8',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'COMMUNITY VOICES',
    color: '#059669',
  },
  {
    id: 'article-9',
    title: 'This is description this is description this is description this is ...',
    description: 'This is description this is description this is description this is description this is description.',
    category: 'PRESS NEWS',
    color: '#EA580C',
  },
]
