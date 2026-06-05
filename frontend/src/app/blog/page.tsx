import { getAllPosts } from '@/lib/blog';
import BlogListClient from './BlogListClient';
import { SafeComponent } from "@/components/SafeComponent";

export default async function BlogPage() {
  // This runs on the server/build-worker where 'fs' is allowed
  const posts = getAllPosts();

  return (
    <SafeComponent name="BlogPage">
      <BlogListClient posts={posts} />
    </SafeComponent>
  );
}