import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Post } from '@src/payload/payload-types'
import Link from 'next/link'

export default function BlogHomePage({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen w-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">博客</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-6 text-2xl font-semibold">最新文章</h2>
            <div className="space-y-6">
              {posts.map((post, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {post.hero.richText[0].children[0].text}
                    </p>
                    <Link href={`/blog/posts/${post.slug}`}>
                      <Button className="mt-4" variant="outline">
                        阅读更多
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>搜索</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索文章..." className="pl-8" />
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>分类</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button variant="link" className="p-0">
                      技术
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0">
                      生活
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="p-0">
                      旅行
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
