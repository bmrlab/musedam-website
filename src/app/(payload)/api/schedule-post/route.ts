import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

const SchedulePostSchema = z.object({
  postId: z.number(),
  publishAt: z.string().datetime(),
})

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = SchedulePostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const publishDate = new Date(parsed.data.publishAt)

  if (publishDate.getTime() <= Date.now()) {
    return NextResponse.json({ error: 'publishAt must be in the future' }, { status: 400 })
  }

  let post

  try {
    post = await payload.findByID({
      collection: 'posts',
      id: parsed.data.postId,
      draft: true,
    })
  } catch {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (post._status === 'published') {
    return NextResponse.json({ error: 'Post is already published' }, { status: 409 })
  }

  await payload.jobs.queue({
    task: 'schedulePublish',
    input: {
      type: 'publish',
      doc: {
        relationTo: 'posts',
        value: parsed.data.postId,
      },
    },
    waitUntil: publishDate,
  })

  return NextResponse.json({
    success: true,
    postId: parsed.data.postId,
    scheduledAt: publishDate.toISOString(),
  })
}
