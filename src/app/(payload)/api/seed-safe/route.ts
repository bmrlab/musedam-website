import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config: configPromise })

    console.log('🌱 Starting safe database seed...')

    // 创建分类
    console.log('📂 Creating categories...')

    const categories = [
      'Digital Transformation',
      'Workflow Mastery',
      'Asset Intelligence',
      'Building Brands',
      'Industry Spotlight',
      'Content Leadership',
      'Creative Ops',
      'Community Voices',
      'Press News'
    ]

    const createdCategories: Record<string, any> = {}

    for (const categoryTitle of categories) {
      try {
        const category = await payload.create({
          collection: 'categories',
          data: { title: categoryTitle }
        })
        createdCategories[categoryTitle] = category
        console.log(`✅ Created category: ${categoryTitle}`)
      } catch (error) {
        console.log(`⚠️  Category ${categoryTitle} might already exist`)
        // 尝试查找现有分类
        try {
          const existing = await payload.find({
            collection: 'categories',
            where: { title: { equals: categoryTitle } },
            limit: 1
          })
          if (existing.docs.length > 0) {
            createdCategories[categoryTitle] = existing.docs[0]
            console.log(`✅ Found existing category: ${categoryTitle}`)
          }
        } catch (findError) {
          console.log(`❌ Could not find category: ${categoryTitle}`)
        }
      }
    }

    // 创建演示用户（如果不存在）
    console.log('👤 Creating demo author...')
    let demoAuthor
    try {
      demoAuthor = await payload.create({
        collection: 'users',
        data: {
          email: 'demo@example.com',
          password: 'demo123456',
          name: 'Demo Author'
        }
      })
      console.log('✅ Created demo author')
    } catch (error) {
      // 用户可能已存在，尝试查找
      try {
        const users = await payload.find({
          collection: 'users',
          limit: 1
        })
        if (users.docs.length > 0) {
          demoAuthor = users.docs[0]
          console.log('✅ Using existing author')
        }
      } catch (findError) {
        console.log('⚠️  No author found, posts will be created without author')
      }
    }

    // 创建文章
    console.log('📝 Creating blog posts...')

    const posts = [
      {
        title: 'How to create a website from scratch in 11 steps',
        slug: 'how-to-create-website-from-scratch',
        category: 'Digital Transformation',
        content: 'This comprehensive guide will walk you through creating a website from scratch. Learn the essential steps, tools, and best practices for building a professional website that meets your goals and engages your audience effectively.'
      },
      {
        title: 'Mastering Digital Asset Management in 2024',
        slug: 'mastering-digital-asset-management-2024',
        category: 'Asset Intelligence',
        content: 'Learn how to effectively organize and manage your digital assets with modern DAM solutions. Discover best practices for storage, organization, metadata management, and distribution workflows that scale with your business.'
      },
      {
        title: 'Building Brands in the Digital Age',
        slug: 'building-brands-digital-age',
        category: 'Building Brands',
        content: 'Discover strategies for building strong brands in the digital landscape. From visual identity to voice and tone, learn how to create cohesive brand experiences across all digital touchpoints and channels.'
      },
      {
        title: 'Workflow Automation Best Practices',
        slug: 'workflow-automation-best-practices',
        category: 'Workflow Mastery',
        content: 'Streamline your processes with these workflow automation techniques. Learn how to identify automation opportunities, choose the right tools, and implement solutions that boost productivity and reduce manual work.'
      },
      {
        title: 'AI-Powered Content Creation: The Future is Here',
        slug: 'ai-powered-content-creation',
        category: 'Industry Spotlight',
        content: 'Explore how AI is transforming content creation workflows. From automated writing to intelligent image generation, discover the tools and techniques that are reshaping the creative industry.'
      },
      {
        title: 'Creative Operations at Scale',
        slug: 'creative-operations-at-scale',
        category: 'Creative Ops',
        content: 'Learn how to scale your creative operations effectively. Discover frameworks, processes, and tools that help creative teams maintain quality and efficiency as they grow and take on more complex projects.'
      }
    ]

    const createdPosts: any[] = []

    for (const postData of posts) {
      try {
        const category = createdCategories[postData.category]

        const post = await payload.create({
          collection: 'posts',
          data: {
            title: postData.title,
            slug: postData.slug,
            _status: 'published',
            publishedAt: new Date().toISOString(),
            authors: demoAuthor ? [demoAuthor.id] : [],
            categories: category ? [category.id] : [],
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: postData.content,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
            meta: {
              title: postData.title,
              description: postData.content.substring(0, 160) + '...'
            }
          }
        })
        createdPosts.push(post)
        console.log(`✅ Created post: ${postData.title}`)
      } catch (error) {
        console.log(`⚠️  Post ${postData.title} might already exist`)
      }
    }

    console.log('🎉 Safe seed completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        categories: Object.keys(createdCategories).length,
        posts: createdPosts.length,
        author: demoAuthor ? 1 : 0
      }
    })
  } catch (error) {
    console.error('❌ Safe seed failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return GET(request)
}
