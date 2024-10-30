import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Page, Post } from '@src/payload/payload-types'
import { staticHome } from '@src/payload/seed/home-static'
import { fetchDoc } from '@/_api/fetchDoc'
import { fetchDocs } from '@/_api/fetchDocs'
import { Blocks } from '../../components/Blocks'
import { generateMeta } from '../../_utilities/generateMeta'
import { Hero } from '@/[lng]/components/Hero'
import BlogHomePage from '@/[lng]/blog/home'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()

  if (slug === 'home') {
    try {
      const posts = await fetchDocs<Post>('posts')
      console.log('posts', posts)
      return <BlogHomePage posts={posts} />
    } catch (error) {
      // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
      // so swallow the error here and simply render the page with fallback data where necessary
      // in production you may want to redirect to a 404  page or at least log the error somewhere
      // console.error(error)
    }
  }

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page
  console.log('hero', hero)

  return (
    <React.Fragment>
      <Hero {...hero} />
      <Blocks
        blocks={layout}
        disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
      />
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<Page>('pages')
    return pages?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (_) {
    // don't throw an error if the fetch fails
    // this is so that we can render static fallback pages for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  if (!page) {
    if (slug === 'home') page = staticHome
  }

  console.log('page', page, isDraftMode)

  return generateMeta({ doc: page })
}
