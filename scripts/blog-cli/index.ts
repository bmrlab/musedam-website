import * as fs from 'node:fs'
import * as path from 'node:path'
import { PayloadClient } from './client'
import { Publisher } from './publisher'
import { Resolver } from './resolver'
import type { PublishResult } from './types'

function usage(): never {
  console.log(`
Usage:
  npx tsx scripts/blog-cli/index.ts publish <file.json|directory> [--force]
  npx tsx scripts/blog-cli/index.ts list [--status draft|published]

Environment variables:
  PAYLOAD_API_URL  PayloadCMS API base URL (e.g. https://site.com/api)
  PAYLOAD_API_KEY  PayloadCMS API Key

Examples:
  npx tsx scripts/blog-cli/index.ts publish ./posts/new-feature.json
  npx tsx scripts/blog-cli/index.ts publish ./posts/
  npx tsx scripts/blog-cli/index.ts publish ./posts/ --force
  npx tsx scripts/blog-cli/index.ts list --status draft
`)
  process.exit(1)
}

function getEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    console.error(`[error] Missing environment variable: ${name}`)
    process.exit(1)
  }

  return value
}

function collectJsonFiles(target: string): string[] {
  const resolved = path.resolve(target)

  try {
    const stat = fs.statSync(resolved)

    if (stat.isFile()) {
      if (!resolved.endsWith('.json')) {
        console.error(`[error] Not a JSON file: ${resolved}`)
        process.exit(1)
      }

      return [resolved]
    }

    if (stat.isDirectory()) {
      return fs
        .readdirSync(resolved)
        .filter((entry) => entry.endsWith('.json'))
        .sort()
        .map((entry) => path.join(resolved, entry))
    }
  } catch {
    // Fall through to the uniform error path below.
  }

  console.error(`[error] Not a file or directory: ${resolved}`)
  process.exit(1)
}

function parsePublishArgs(args: string[]): { force: boolean; target: string } {
  let force = false
  let target: string | undefined

  for (const arg of args) {
    if (arg === '--force') {
      if (force) {
        console.error('[error] Duplicate --force flag')
        usage()
      }

      force = true
      continue
    }

    if (arg.startsWith('--')) {
      console.error(`[error] Unknown flag: ${arg}`)
      usage()
    }

    if (target !== undefined) {
      console.error(`[error] Unexpected extra argument: ${arg}`)
      usage()
    }

    target = arg
  }

  if (target === undefined) {
    console.error('[error] Missing file or directory argument')
    usage()
  }

  return { force, target }
}

function parseListArgs(args: string[]): { status?: 'draft' | 'published' } {
  let status: 'draft' | 'published' | undefined

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--status') {
      const value = args[index + 1]

      if (value === undefined || value.startsWith('--')) {
        console.error('[error] Missing status value after --status')
        usage()
      }

      if (value !== 'draft' && value !== 'published') {
        console.error('[error] Invalid status value. Expected draft or published.')
        usage()
      }

      if (status !== undefined) {
        console.error('[error] Duplicate --status flag')
        usage()
      }

      status = value
      index += 1
      continue
    }

    if (arg.startsWith('--')) {
      console.error(`[error] Unknown flag: ${arg}`)
      usage()
    }

    console.error(`[error] Unexpected extra argument: ${arg}`)
    usage()
  }

  return { status }
}

function printResults(results: PublishResult[]): void {
  console.log('--- Results ---')

  for (const result of results) {
    const icon = result.status === 'error' ? '✗' : result.status === 'skipped' ? '⊘' : '✓'
    const segments = [
      `${icon} ${result.file}`,
      result.postId !== null ? `id=${result.postId}` : null,
      `status=${result.status}`,
      `action=${result.action}`,
      result.url ? `url=${result.url}` : null,
      result.scheduledAt ? `scheduledAt=${result.scheduledAt}` : null,
      result.error ? `error="${result.error}"` : null,
    ].filter((segment): segment is string => segment !== null)

    console.log(segments.join(' | '))
  }

  const ok = results.filter((result) => result.status === 'created' || result.status === 'resumed')
  const skipped = results.filter((result) => result.status === 'skipped')
  const errors = results.filter((result) => result.status === 'error')

  console.log(`Total: ${results.length} | OK: ${ok.length} | Skipped: ${skipped.length} | Errors: ${errors.length}`)

  if (errors.length > 0) {
    process.exit(1)
  }
}

async function cmdPublish(args: string[]): Promise<void> {
  const { force, target } = parsePublishArgs(args)
  const files = collectJsonFiles(target)

  if (files.length === 0) {
    console.error(`[error] No JSON files found: ${path.resolve(target)}`)
    process.exit(1)
  }

  const client = new PayloadClient({
    apiUrl: getEnv('PAYLOAD_API_URL'),
    apiKey: getEnv('PAYLOAD_API_KEY'),
  })
  const resolver = new Resolver(client)
  const publisher = new Publisher(client, resolver)

  console.log(`Found ${files.length} JSON file(s)`)
  const results =
    files.length === 1
      ? [await publisher.processFile(files[0], { force })]
      : await publisher.processBatch(files, { force })

  printResults(results)
}

async function cmdList(args: string[]): Promise<void> {
  const { status } = parseListArgs(args)

  const client = new PayloadClient({
    apiUrl: getEnv('PAYLOAD_API_URL'),
    apiKey: getEnv('PAYLOAD_API_KEY'),
  })

  const query: Record<string, string> = {
    limit: '50',
    sort: '-updatedAt',
    locale: 'zh',
    draft: 'true',
  }

  if (status) {
    query['where[_status][equals]'] = status
  }

  const response = await client.find('posts', query)

  console.log(`Found ${response.totalDocs} post(s):`)
  for (const doc of response.docs) {
    const statusText = typeof doc._status === 'string' ? doc._status : 'unknown'
    const slug = typeof doc.slug === 'string' ? doc.slug : ''
    const title = typeof doc.title === 'string' ? doc.title : ''
    console.log(`[${statusText}] id=${doc.id} slug=${slug} title=${title}`)
  }
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case 'publish':
      await cmdPublish(args)
      return
    case 'list':
      await cmdList(args)
      return
    default:
      usage()
  }
}

main().catch((error) => {
  console.error('[fatal]', error)
  process.exit(1)
})
