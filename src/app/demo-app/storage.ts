import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3'

/** 上传的 demo 存在 S3_BUCKET 的该前缀下 */
const DEMO_PREFIX = 'demo-app/'

export type DemoFile = {
  /** 相对 DEMO_PREFIX 的路径，如 `AI识别对象/AI识别对象.html` */
  path: string
  size: number
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

export function isSafeSegment(segment: string) {
  return (
    segment !== '' &&
    segment !== '.' &&
    segment !== '..' &&
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
      if (!obj.Key || !/\.html?$/i.test(obj.Key)) continue
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
