import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimizemaximal.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  
  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    // OPTIMIZATION: Use the actual blog post date instead of "today"
    lastModified: new Date(post.frontmatter.date),
  }))

  return [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
    { url: `${siteUrl}/terms`, lastModified: new Date() },
    ...postEntries,
  ]
}