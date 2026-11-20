import { createHash } from 'node:crypto'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3'

import type { DemoModule, ModuleRelease, ReleaseInfo } from './catalog'

/** 上传的 demo 存在 S3_BUCKET 的该前缀下 */
const DEMO_PREFIX = 'demo-app/'
const TMP_PREFIX = `${DEMO_PREFIX}.tmp/`
const RELEASE_PREFIX = `${DEMO_PREFIX}.modules/`

export const LINK_FILE_RE = /\.url\.json$/i

export function parseDemoUrl(value: string): string | null {
  if (value.length > 4096) return null
  try {
    const url = new URL(value.trim())
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

export const MAX_DEMO_BYTES = 64 * 1024 * 1024
export const UPLOAD_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type DemoFile = {
  /** 相对 DEMO_PREFIX 的路径，如 `AI识别对象/AI识别对象.html` */
  path: string
  size: number
  url?: string
  lastModified?: Date
}

let client: S3Client | null = null

function getClient() {
  client ??= new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  })
  return client
}

const bucket = () => process.env.S3_BUCKET!
const toKey = (segments: string[]) => DEMO_PREFIX + segments.join('/')

function releaseKey(demoModule: DemoModule) {
  return (
    RELEASE_PREFIX +
    createHash('sha256').update(`${demoModule.group}/${demoModule.name}`).digest('hex') +
    '.json'
  )
}

export async function getModuleRelease(demoModule: DemoModule): Promise<ModuleRelease | null> {
  try {
    const response = await getClient().send(
      new GetObjectCommand({ Bucket: bucket(), Key: releaseKey(demoModule) }),
    )
    return response.Body
      ? JSON.parse(new TextDecoder().decode(await response.Body.transformToByteArray()))
      : null
  } catch (error) {
    if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) return null
    throw error
  }
}

export async function listModuleReleases(): Promise<ModuleRelease[]> {
  const keys: string[] = []
  let token: string | undefined
  do {
    const response = await getClient().send(
      new ListObjectsV2Command({
        Bucket: bucket(),
        Prefix: RELEASE_PREFIX,
        ContinuationToken: token,
      }),
    )
    for (const item of response.Contents ?? []) if (item.Key?.endsWith('.json')) keys.push(item.Key)
    token = response.IsTruncated ? response.NextContinuationToken : undefined
  } while (token)
  return Promise.all(
    keys.map(async (Key) => {
      const response = await getClient().send(new GetObjectCommand({ Bucket: bucket(), Key }))
      if (!response.Body) throw new Error('Missing module metadata')
      return JSON.parse(
        new TextDecoder().decode(await response.Body.transformToByteArray()),
      ) as ModuleRelease
    }),
  )
}

export async function putModuleRelease(demoModule: DemoModule, release: ReleaseInfo) {
  const { group, name, skus, icon } = demoModule
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: releaseKey(demoModule),
      Body: new TextEncoder().encode(
        JSON.stringify({ module: { group, name, skus, ...(icon ? { icon } : {}) }, release }),
      ),
      ContentType: 'application/json',
    }),
  )
}

export function isSafeSegment(segment: string) {
  return (
    segment !== '' &&
    !segment.startsWith('.') &&
    !segment.includes('/') &&
    !segment.includes('\\') &&
    !segment.includes('\0')
  )
}

export async function listDemoFiles(): Promise<DemoFile[]> {
  const files: DemoFile[] = []
  let token: string | undefined
  do {
    const res = await getClient().send(
      new ListObjectsV2Command({ Bucket: bucket(), Prefix: DEMO_PREFIX, ContinuationToken: token }),
    )
    for (const obj of res.Contents ?? []) {
      if (
        !obj.Key ||
        obj.Key.slice(DEMO_PREFIX.length)
          .split('/')
          .some((part) => part.startsWith('.'))
      )
        continue
      if (LINK_FILE_RE.test(obj.Key)) {
        const link = await getDemoLink(obj.Key.slice(DEMO_PREFIX.length).split('/'))
        if (link) files.push(link)
        continue
      }
      if (!/\.html?$/i.test(obj.Key)) continue
      files.push({
        path: obj.Key.slice(DEMO_PREFIX.length),
        size: obj.Size ?? 0,
        lastModified: obj.LastModified,
      })
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)

  return files.sort((a, b) => a.path.localeCompare(b.path, 'zh-CN'))
}

/** 链接只存储地址，不由服务端抓取目标网页。 */
export async function putDemoLink(segments: string[], url: string) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: toKey(segments),
      Body: new TextEncoder().encode(JSON.stringify({ url })),
      ContentType: 'application/json',
    }),
  )
}

export async function getDemoLink(segments: string[]): Promise<DemoFile | null> {
  if (!LINK_FILE_RE.test(segments.at(-1) ?? '')) return null
  try {
    const response = await getClient().send(
      new GetObjectCommand({ Bucket: bucket(), Key: toKey(segments) }),
    )
    if (!response.Body) return null
    const data = JSON.parse(new TextDecoder().decode(await response.Body.transformToByteArray()))
    const url = typeof data.url === 'string' ? parseDemoUrl(data.url) : null
    return url
      ? { path: segments.join('/'), url, size: 0, lastModified: response.LastModified }
      : null
  } catch (error) {
    if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) return null
    throw error
  }
}

/** 读取 demo 文件；不存在时返回 null */
export async function getDemoFile(segments: string[]) {
  try {
    const res = await getClient().send(
      new GetObjectCommand({ Bucket: bucket(), Key: toKey(segments) }),
    )
    if (!res.Body) return null
    return {
      body: res.Body.transformToWebStream(),
      contentType: res.ContentType,
      lastModified: res.LastModified,
      etag: res.ETag,
    }
  } catch (error) {
    if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) return null
    throw error
  }
}

export async function putDemoFile(segments: string[], body: Uint8Array) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: toKey(segments),
      Body: body,
      ContentType: 'text/html; charset=utf-8',
    }),
  )
}

export async function deleteDemoFile(segments: string[]) {
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key: toKey(segments) }))
}

function tmpKey(uploadId: string, index: number) {
  return `${TMP_PREFIX}${uploadId}/${index}`
}

export async function putTempChunk(uploadId: string, index: number, body: Uint8Array) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: tmpKey(uploadId, index),
      Body: body,
    }),
  )
}

export async function assembleTempUpload(uploadId: string, total: number) {
  const parts: Uint8Array[] = []
  let size = 0
  for (let i = 0; i < total; i++) {
    const res = await getClient().send(
      new GetObjectCommand({ Bucket: bucket(), Key: tmpKey(uploadId, i) }),
    )
    if (!res.Body) throw new Error(`missing chunk ${i}`)
    const bytes = await res.Body.transformToByteArray()
    parts.push(bytes)
    size += bytes.length
    if (size > MAX_DEMO_BYTES) throw new Error('file too large')
  }
  const out = new Uint8Array(size)
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

export async function deleteTempUpload(uploadId: string) {
  const keys: string[] = []
  let token: string | undefined
  do {
    const res = await getClient().send(
      new ListObjectsV2Command({
        Bucket: bucket(),
        Prefix: `${TMP_PREFIX}${uploadId}/`,
        ContinuationToken: token,
      }),
    )
    for (const obj of res.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key)
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)

  await Promise.all(
    keys.map((Key) => getClient().send(new DeleteObjectCommand({ Bucket: bucket(), Key }))),
  )
}
