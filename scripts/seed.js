const { getPayload } = require('payload')
const configPromise = require('../dist/payload.config.js').default

async function runSeed() {
  try {
    console.log('🌱 Starting database seed...')
    
    const payload = await getPayload({ config: configPromise })
    
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
    
    const createdCategories = {}
    
    for (const categoryTitle of categories) {
      try {
        const category = await payload.create({
          collection: 'categories',
          data: { title: categoryTitle }
        })
        createdCategories[categoryTitle] = category.id
        console.log(`✅ Created category: ${categoryTitle}`)
      } catch (error) {
        console.log(`⚠️  Category ${categoryTitle} might already exist`)
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
      const users = await payload.find({
        collection: 'users',
        limit: 1
      })
      if (users.docs.length > 0) {
        demoAuthor = users.docs[0]
        console.log('✅ Using existing author')
      }
    }
    
    // 创建文章
    console.log('📝 Creating blog posts...')
    
    const posts = [
      {
        title: 'How to create a website from scratch in 11 steps',
        slug: 'how-to-create-website-from-scratch',
        category: 'Digital Transformation',
        content: 'This comprehensive guide will walk you through creating a website from scratch...'
      },
      {
        title: 'Mastering Digital Asset Management in 2024',
        slug: 'mastering-digital-asset-management',
        category: 'Asset Intelligence',
        content: 'Learn how to effectively organize and manage your digital assets...'
      },
      {
        title: 'Building Brands in the Digital Age',
        slug: 'building-brands-digital-age',
        category: 'Building Brands',
        content: 'Discover strategies for building strong brands in the digital landscape...'
      },
      {
        title: 'Workflow Automation Best Practices',
        slug: 'workflow-automation-best-practices',
        category: 'Workflow Mastery',
        content: 'Streamline your processes with these workflow automation techniques...'
      },
      {
        title: 'AI-Powered Content Creation',
        slug: 'ai-powered-content-creation',
        category: 'Industry Spotlight',
        content: 'Explore how AI is transforming content creation workflows...'
      },
      {
        title: 'Creative Operations at Scale',
        slug: 'creative-operations-at-scale',
        category: 'Creative Ops',
        content: 'Learn how to scale your creative operations effectively...'
      }
    ]
    
    for (const postData of posts) {
      try {
        const categoryId = createdCategories[postData.category]
        
        const post = await payload.create({
          collection: 'posts',
          data: {
            title: postData.title,
            slug: postData.slug,
            _status: 'published',
            publishedAt: new Date().toISOString(),
            authors: demoAuthor ? [demoAuthor.id] : [],
            categories: categoryId ? [categoryId] : [],
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
        console.log(`✅ Created post: ${postData.title}`)
      } catch (error) {
        console.log(`⚠️  Post ${postData.title} might already exist`)
      }
    }
    
    console.log('🎉 Seed completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

runSeed()
