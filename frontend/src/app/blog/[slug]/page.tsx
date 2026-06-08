import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Ensure this import is at the top

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  if (!posts || posts.length === 0) {
    return [{ slug: 'agentic-ai-development-2026' }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.frontmatter.title} | Optimize Maximal AI`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: 'article',
      publishedTime: post.frontmatter.date,
      authors: ['Optimize Maximal AI Team'],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Enterprise SEO: Structured Data for Google Rich Results
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimizemaximal.com';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.frontmatter.title,
    "description": post.frontmatter.excerpt,
    "datePublished": post.frontmatter.date,
    "author": [{ "@type": "Person", "name": "Optimize Maximal AI Team" }],
    "publisher": {
      "@type": "Organization",
      "name": "Optimize Maximal AI",
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/favicon.ico` }
    }
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto py-12 px-4 selection:bg-purple-500/30">
        {/* NEW: Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-black dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
        <header className="mb-12 border-b border-zinc-400 dark:border-zinc-700 pb-8">
          <p className="text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            {new Date(post.frontmatter.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          {/* Uses (--foreground) so it is always visible in both Light and Dark modes */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-(--foreground) uppercase leading-tight">
            {post.frontmatter.title}
          </h1>
        </header>

        {/* FIXED: Markdown Body - Binds all colors to (--foreground) variable */}
        <div
          className="prose max-w-none
                     /* 1. Force Text to Follow Theme Variable */
                     text-(--foreground)
                     prose-p:text-(--foreground)
                     prose-headings:text-(--foreground)
                     prose-strong:text-(--foreground)
                     prose-li:text-(--foreground)
                     
                     /* 2. Notebook Structure (Bold Headings + Underlines) */
                     prose-headings:font-bold prose-headings:tracking-normal
                     prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-2 prose-h1:border-b prose-h1:border-black/10 dark:prose-h1:border-white/10
                     prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-black/10 dark:prose-h2:border-white/10
                     prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2 prose-h3:font-semibold
                     
                     /* 3. Tighten Spacing */
                     prose-p:my-4 prose-p:leading-7
                     prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                     prose-li:my-1 prose-li:marker:text-(--foreground)
                     
                     /* Links */
                     prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                     
                     text-lg"
          dangerouslySetInnerHTML={{ __html: post.content as string }}
        />
      </article>
    </>
  );
}