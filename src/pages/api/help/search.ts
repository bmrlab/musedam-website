import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        const locale = searchParams.get('locale') || 'zh'


        if (!query || query.trim().length === 0) {
            return NextResponse.json({ results: [] })
        }

        const payload = await getPayload({ config: configPromise })

        // 将语言代码转换为 Payload locale 格式
        const payloadLocale = locale === 'en' ? 'en' : 'zh'
        // 搜索帮助文档
        const searchResults = await payload.find({
            collection: 'help-documents',
            depth: 2,
            limit: 10,
            overrideAccess: false,
            where: {
                _status: { equals: 'published' },
                or: [
                    {
                        title: {
                            contains: query,
                        },
                    },
                    {
                        excerpt: {
                            contains: query,
                        },
                    },
                ],
            },
            sort: '-updatedAt',
            locale: payloadLocale,
        })


        // 格式化搜索结果
        const formattedResults = searchResults.docs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            slug: doc.slug,
            excerpt: doc.excerpt,
            category: doc.category ? {
                id: typeof doc.category === 'object' ? doc.category.id : doc.category,
                title: typeof doc.category === 'object' ? doc.category.title : undefined,
                topic: typeof doc.category === 'object' && doc.category.topic ? {
                    id: typeof doc.category.topic === 'object' ? doc.category.topic.id : doc.category.topic,
                    title: typeof doc.category.topic === 'object' ? doc.category.topic.title : undefined,
                } : undefined,
            } : null,
        }))


        return NextResponse.json({
            results: formattedResults,
            total: searchResults.totalDocs,
            query,
        })

    } catch (error) {
        console.error('Search API error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error: error
        })

        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
} 