# MuseDAM SEO 组件使用指南

本目录包含了为MuseDAM网站添加Schema.org结构化数据的组件，用于提升搜索引擎对网站内容的理解和展示效果。

## 组件概览

### 1. SchemaOrg.tsx
基础的结构化数据组件，支持多种Schema类型：
- `organization`: 组织信息
- `website`: 网站信息  
- `webpage`: 页面信息
- `article`: 文章内容
- `breadcrumb`: 面包屑导航

### 2. PageSEO.tsx
页面级别的SEO组件，自动添加基础的组织和网站信息，并根据页面类型提供相应的结构化数据。

### 3. FAQSchema.tsx
常见问题页面的结构化数据，支持问答形式的富媒体搜索结果展示。**可以直接集成到现有FAQ组件中，无需单独创建FAQ页面。**

## 使用方法

### 基础页面SEO
```tsx
import { PageSEO } from '@/components/SEO/PageSEO'

export default function MyPage() {
  return (
    <>
      <PageSEO 
        type="home"
        title="页面标题"
        description="页面描述"
        url="https://www.musedam.cc/zh-CN/page"
        image="https://www.musedam.cc/assets/image.jpg"
      />
      {/* 页面内容 */}
    </>
  )
}
```

### 博客文章页面
```tsx
<PageSEO 
  type="blog"
  title={post.title}
  description={post.description}
  url={`https://www.musedam.cc/${lng}/blog/${slug}`}
  image={post.image}
  articleData={{
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt
  }}
  breadcrumbs={[
    { name: '首页', url: `https://www.musedam.cc/${lng}` },
    { name: '博客', url: `https://www.musedam.cc/${lng}/blog` },
    { name: post.title, url: `https://www.musedam.cc/${lng}/blog/${slug}` }
  ]}
/>
```

### FAQ模块集成（推荐用法）
**无需单独创建FAQ页面，直接在现有FAQ组件中集成：**

```tsx
import { FAQSchema } from '@/components/SEO/FAQSchema'

export default function FAQComponent() {
  const faqData = [
    {
      question: "什么是MuseDAM？",
      answer: "MuseDAM是AI原生的企业数字资产管理平台..."
    },
    // ... 更多FAQ数据
  ];

  return (
    <>
      {/* 添加FAQ结构化数据 */}
      <FAQSchema faqs={faqData} />
      
      {/* 现有的FAQ UI组件 */}
      <div className="faq-container">
        {/* FAQ内容 */}
      </div>
    </>
  )
}
```

**或者更简洁的方式，直接在你的FAQ组件中导入：**

```tsx
// 在 src/components/Pricing/Enterprise/FAQ.tsx 中
import { FAQSchema } from '@/components/SEO/FAQSchema'

const FAQ = () => {
  // ... 现有代码
  
  return (
    <>
      <FAQSchema faqs={faqData} />
      {/* 现有的FAQ UI */}
    </>
  )
}
```

## 页面类型配置

PageSEO组件支持以下页面类型：
- `home`: 首页
- `blog`: 博客页面
- `feature`: 功能特性页面
- `about`: 关于我们页面
- `pricing`: 定价页面

每种类型都有预定义的面包屑导航配置。

## 测试验证

添加结构化数据后，可以使用以下工具进行测试：

1. **Google结构化数据测试工具**: https://search.google.com/test/rich-results
2. **Schema.org验证器**: https://validator.schema.org/
3. **Google Search Console**: 监控富媒体搜索结果的展示情况

## 注意事项

1. 确保所有URL都是完整的绝对路径
2. 图片URL需要是可访问的
3. 日期格式使用ISO 8601标准
4. 避免重复的Schema标记
5. 定期检查结构化数据的有效性
6. **FAQ结构化数据可以直接集成到现有FAQ组件中，无需创建额外页面**

## 预期效果

通过正确实施这些Schema.org标记，MuseDAM网站可以：

- 提升搜索引擎对内容的理解
- 在搜索结果中显示富媒体信息（包括FAQ的问答展示）
- 提高点击率和用户体验
- 支持语音搜索和AI助手
- 建立专业可信的品牌形象 