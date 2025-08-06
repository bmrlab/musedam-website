// storage-adapter-import-placeholder
import * as process from 'node:process'
import path from 'path'
import { fileURLToPath } from 'url'
import { defaultLexical } from '@/fields/defaultLexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { zh } from '@payloadcms/translations/languages/zh'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp' // sharp-import

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import getServerSideURL from './utilities/getServerSideURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  localization: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
  },
  i18n: {
    supportedLanguages: { zh },
  },
  admin: {
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/svg',
          url: '/assets/favicon.svg',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '@/components/Logo/Logo',
        Icon: '@/components/Logo/Logo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false, // 禁用自动 push，都要用 migrate 命令，seeds 脚本会默认 push 一下导致后续 migration 无法执行
  }),
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        media: {
          prefix: process.env.S3_PATH_PREFIX!,
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION,
        forcePathStyle: true, // 对于 MinIO 等 S3 兼容服务必需
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {}
      }

      defaultJobsCollection.admin.hidden = false
      return defaultJobsCollection
    },
    autoRun: [
      {
        cron: '* * * * *', // 每分钟运行一次
        limit: 3, // 每次运行的任务数量限制
        queue: 'default', // 指定队列名称
      },
    ],
    shouldAutoRun: async () => {
      return !process.env.VERCEL
    },
  },
})
