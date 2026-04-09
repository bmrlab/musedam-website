import { promises as fs } from 'node:fs'
import { basename } from 'node:path'

export interface PayloadClientConfig {
  apiUrl: string
  apiKey: string
}

export interface PayloadDoc {
  id: number
  [key: string]: unknown
}

export interface PayloadListResponse {
  docs: PayloadDoc[]
  totalDocs: number
}

type Query = Record<string, unknown>

export class PayloadClient {
  private readonly baseUrl: string
  private readonly headers: Headers

  constructor(config: PayloadClientConfig) {
    this.baseUrl = config.apiUrl.replace(/\/+$/, '')
    this.headers = new Headers({
      Authorization: `users API-Key ${config.apiKey}`,
    })
  }

  async find(collection: string, query?: Query): Promise<PayloadListResponse> {
    return this.request<PayloadListResponse>(`/${collection}`, {
      method: 'GET',
      query,
    })
  }

  async create<T extends PayloadDoc | Record<string, unknown>>(
    collection: string,
    data: T,
    query?: Query,
  ): Promise<T> {
    return this.request<T>(`/${collection}`, {
      method: 'POST',
      query,
      body: data,
    })
  }

  async update<T extends PayloadDoc | Record<string, unknown>>(
    collection: string,
    id: number | string,
    data: T,
    query?: Query,
  ): Promise<T> {
    return this.request<T>(`/${collection}/${id}`, {
      method: 'PATCH',
      query,
      body: data,
    })
  }

  async uploadMedia(filePath: string, alt: string): Promise<PayloadDoc> {
    const fileBuffer = await fs.readFile(filePath)
    const formData = new FormData()
    const file = new Blob([fileBuffer], { type: 'application/octet-stream' })

    formData.append('file', file, basename(filePath))
    formData.append('alt', alt)

    return this.request<PayloadDoc>('/media', {
      method: 'POST',
      body: formData,
      headers: {},
    })
  }

  async schedulePost(postId: number, publishAt: string): Promise<unknown> {
    return this.request<unknown>('/schedule-post', {
      method: 'POST',
      body: { postId, publishAt },
    })
  }

  private async request<T>(
    path: string,
    options: {
      method: string
      body?: unknown
      query?: Query
      headers?: HeadersInit
    },
  ): Promise<T> {
    const url = this.buildUrl(path, options.query)
    const headers = new Headers(this.headers)

    if (options.headers) {
      const extraHeaders = new Headers(options.headers)
      extraHeaders.forEach((value, key) => headers.set(key, value))
    }

    const init: RequestInit = {
      method: options.method,
      headers,
    }

    if (options.body instanceof FormData) {
      init.body = options.body
    } else if (options.body !== undefined) {
      headers.set('Content-Type', 'application/json')
      init.body = JSON.stringify(options.body)
    }

    const response = await fetch(url, init)

    if (!response.ok) {
      const responseText = await response.text()
      throw new Error(
        `Payload request failed (${options.method} ${url}): ${response.status} ${response.statusText}${responseText ? ` - ${responseText}` : ''}`,
      )
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  }

  private buildUrl(path: string, query?: Query): string {
    const url = new URL(path.replace(/^\//, ''), `${this.baseUrl}/`)

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        this.appendQueryParam(url.searchParams, key, value)
      }
    }

    return url.toString()
  }

  private appendQueryParam(searchParams: URLSearchParams, key: string, value: unknown): void {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        this.appendQueryParam(searchParams, key, item)
      }
      return
    }

    if (value instanceof Date) {
      searchParams.append(key, value.toISOString())
      return
    }

    if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value))
      return
    }

    searchParams.append(key, String(value))
  }
}
