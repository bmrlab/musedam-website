import type { CollectionSlug, File, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { blogPost1 } from './blog-post-1'
import { blogPost2 } from './blog-post-2'
import { blogPost3 } from './blog-post-3'
import { blogPost4 } from './blog-post-4'
import { blogPost5 } from './blog-post-5'
import { blogPost6 } from './blog-post-6'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]
// const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not

  payload.logger.info(`— Clearing media...`)
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  // for (const global of globals) {
  //   await payload.updateGlobal({
  //     slug: global,
  //     data: {
  //       navItems: [],
  //     },
  //   })
  // }

  for (const collection of collections) {
    try {
      await payload.delete({
        collection: collection,
        where: {
          id: {
            exists: true,
          },
        },
      })
      payload.logger.info(`— Cleared ${collection}`)
    } catch (error) {
      payload.logger.info(`— Skipped ${collection} (might be empty or have constraints)`)
    }
  }

  try {
    const pages = await payload.delete({
      collection: 'pages',
      where: {},
    })
    payload.logger.info(`— Cleared pages`)
  } catch (error) {
    payload.logger.info(`— Skipped pages (might be empty or have constraints)`)
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: 'demo-author@payloadcms.com',
      },
    },
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@payloadcms.com',
      password: 'password',
    },
  })

  let demoAuthorID: number | string = demoAuthor.id

  payload.logger.info(`— Seeding media...`)
  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const image1Doc = await payload.create({
    collection: 'media',
    data: image1,
    file: image1Buffer,
  })
  const image2Doc = await payload.create({
    collection: 'media',
    data: image2,
    file: image2Buffer,
  })
  const image3Doc = await payload.create({
    collection: 'media',
    data: image2,
    file: image3Buffer,
  })
  const imageHomeDoc = await payload.create({
    collection: 'media',
    data: image2,
    file: hero1Buffer,
  })

  payload.logger.info(`— Seeding categories...`)

  // 创建与设计图匹配的分类
  const digitalTransformationCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Digital Transformation',
    },
  })

  const workflowMasteryCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Workflow Mastery',
    },
  })

  const assetIntelligenceCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Asset Intelligence',
    },
  })

  const buildingBrandsCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Building Brands',
    },
  })

  const industrySpotlightCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Industry Spotlight',
    },
  })

  const contentLeadershipCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Content Leadership',
    },
  })

  const creativeOpsCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Creative Ops',
    },
  })

  const communityVoicesCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Community Voices',
    },
  })

  const pressNewsCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Press News',
    },
  })

  // 保留原有分类以兼容现有文章
  const technologyCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Technology',
    },
  })

  const newsCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'News',
    },
  })

  const financeCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'Finance',
    },
  })

  let image1ID: number | string = image1Doc.id
  let image2ID: number | string = image2Doc.id
  let image3ID: number | string = image3Doc.id
  let imageHomeID: number | string = imageHomeDoc.id

  if (payload.db.defaultIDType === 'text') {
    image1ID = `"${image1Doc.id}"`
    image2ID = `"${image2Doc.id}"`
    image3ID = `"${image3Doc.id}"`
    imageHomeID = `"${imageHomeDoc.id}"`
    demoAuthorID = `"${demoAuthorID}"`
  }

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post1, categories: [technologyCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post2, categories: [newsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...post3, categories: [financeCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  // 创建新的博客文章
  payload.logger.info(`— Seeding additional blog posts...`)

  const blogPost1Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...blogPost1, categories: [digitalTransformationCategory.id] })
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
    ),
  })

  const blogPost2Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...blogPost2, categories: [assetIntelligenceCategory.id] })
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
    ),
  })

  const blogPost3Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...blogPost3, categories: [buildingBrandsCategory.id] })
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
    ),
  })

  const blogPost4Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...blogPost4, categories: [workflowMasteryCategory.id] })
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
    ),
  })

  const blogPost5Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...blogPost5, categories: [industrySpotlightCategory.id] })
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
    ),
  })

  const blogPost6Doc = await payload.create({
    collection: 'posts',
    data: JSON.parse(
      JSON.stringify({ ...blogPost6, categories: [creativeOpsCategory.id] })
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID))
    ),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  // 为新博客文章添加相关文章
  await payload.update({
    id: blogPost1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [blogPost2Doc.id, blogPost3Doc.id],
    },
  })
  await payload.update({
    id: blogPost2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [blogPost1Doc.id, blogPost4Doc.id],
    },
  })
  await payload.update({
    id: blogPost3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [blogPost1Doc.id, blogPost5Doc.id],
    },
  })

  payload.logger.info(`— Seeding home page...`)

  await payload.create({
    collection: 'pages',
    data: JSON.parse(
      JSON.stringify(home)
        .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
    ),
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    data: JSON.parse(JSON.stringify(contactFormData)),
  })

  let contactFormID: number | string = contactForm.id

  if (payload.db.defaultIDType === 'text') {
    contactFormID = `"${contactFormID}"`
  }

  payload.logger.info(`— Seeding contact page...`)

  const contactPage = await payload.create({
    collection: 'pages',
    data: JSON.parse(
      JSON.stringify(contactPageData).replace(/"\{\{CONTACT_FORM_ID\}\}"/g, String(contactFormID)),
    ),
  })

  // payload.logger.info(`— Seeding header...`)

  // await payload.updateGlobal({
  //   slug: 'header',
  //   data: {
  //     navItems: [
  //       {
  //         link: {
  //           type: 'custom',
  //           label: 'Posts',
  //           url: '/posts',
  //         },
  //       },
  //       {
  //         link: {
  //           type: 'reference',
  //           label: 'Contact',
  //           reference: {
  //             relationTo: 'pages',
  //             value: contactPage.id,
  //           },
  //         },
  //       },
  //     ],
  //   },
  // })

  // payload.logger.info(`— Seeding footer...`)

  // await payload.updateGlobal({
  //   slug: 'footer',
  //   data: {
  //     navItems: [
  //       {
  //         link: {
  //           type: 'custom',
  //           label: 'Admin',
  //           url: '/admin',
  //         },
  //       },
  //       {
  //         link: {
  //           type: 'custom',
  //           label: 'Source Code',
  //           newTab: true,
  //           url: 'https://github.com/payloadcms/payload/tree/beta/templates/website',
  //         },
  //       },
  //       {
  //         link: {
  //           type: 'custom',
  //           label: 'Payload',
  //           newTab: true,
  //           url: 'https://payloadcms.com/',
  //         },
  //       },
  //     ],
  //   },
  // })

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
