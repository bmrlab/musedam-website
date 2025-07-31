import { BlogPageSkeleton } from '@/components/Blog/skeleton/BlogPageSkeleton'

export default function Loading() {
  return (
    <BlogPageSkeleton 
      showHero={true}
      showTopArticles={true}
      showAllArticles={true}
    />
  )
}
