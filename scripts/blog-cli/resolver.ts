import type { PayloadClient } from './client'

export class Resolver {
  private client: PayloadClient
  private categoryCache = new Map<string, number>()
  private authorCache = new Map<string, number>()
  private postSlugCache = new Map<string, number>()

  constructor(client: PayloadClient) {
    this.client = client
  }

  registerPost(slug: string, id: number): void {
    this.postSlugCache.set(slug, id)
  }

  async resolveCategory(name: string): Promise<number | null> {
    const cached = this.categoryCache.get(name)
    if (cached !== undefined) {
      return cached
    }

    const response = await this.client.find('categories', {
      'where[title][equals]': name,
      locale: 'zh',
      limit: '1',
    })

    const id = response.docs[0]?.id
    if (id === undefined) {
      return null
    }

    this.categoryCache.set(name, id)
    return id
  }

  async resolveAuthor(email: string): Promise<number | null> {
    const cached = this.authorCache.get(email)
    if (cached !== undefined) {
      return cached
    }

    const response = await this.client.find('users', {
      'where[email][equals]': email,
      limit: '1',
    })

    const id = response.docs[0]?.id
    if (id === undefined) {
      return null
    }

    this.authorCache.set(email, id)
    return id
  }

  async resolvePostBySlug(slug: string): Promise<number | null> {
    const cached = this.postSlugCache.get(slug)
    if (cached !== undefined) {
      return cached
    }

    const response = await this.client.find('posts', {
      'where[slug][equals]': slug,
      limit: '1',
    })

    const id = response.docs[0]?.id
    if (id === undefined) {
      return null
    }

    this.postSlugCache.set(slug, id)
    return id
  }

  async resolveCategories(names: string[]): Promise<number[]> {
    const resolved = await Promise.all(names.map(async (name) => {
      const id = await this.resolveCategory(name)
      if (id === null) {
        console.warn(`Category not found: ${name}`)
        return null
      }

      return id
    }))

    return resolved.filter((id): id is number => id !== null)
  }

  async resolveAuthors(emails: string[]): Promise<number[]> {
    const resolved = await Promise.all(emails.map(async (email) => {
      const id = await this.resolveAuthor(email)
      if (id === null) {
        console.warn(`Author not found: ${email}`)
        return null
      }

      return id
    }))

    return resolved.filter((id): id is number => id !== null)
  }

  async resolveRelatedPosts(slugs: string[]): Promise<number[]> {
    const resolved = await Promise.all(slugs.map(async (slug) => {
      const id = await this.resolvePostBySlug(slug)
      if (id === null) {
        console.warn(`Related post not found: ${slug}`)
        return null
      }

      return id
    }))

    return resolved.filter((id): id is number => id !== null)
  }
}
