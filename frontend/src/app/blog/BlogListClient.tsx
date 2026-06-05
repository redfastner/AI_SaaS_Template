"use client";
import Link from 'next/link';

export default function BlogListClient({ posts }: { posts: any[] }) {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4 text-center">
      <div className="mb-16 space-y-4">
        <h1 className="text-5xl md:text-8xl font-light tracking-[-0.07em] uppercase leading-none text-(--foreground)">
          THE BLOG
        </h1>
        <p className="uppercase text-[10px] font-bold tracking-[0.25em] max-w-2xl mx-auto leading-relaxed text-(--foreground) opacity-70">
          Insights Into Future Trends Of Content Automation & Diffusion Models.
        </p>
      </div>

      <div className="max-w-3xl mx-auto text-left">
        {posts.length === 0 ? (
          <div className="p-16 border-2 border-(--border-color) bg-(--background) rounded-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-(--foreground) opacity-80">First post simmering. Check back tomorrow.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-8 border-2 border-(--border-color) bg-(--background) rounded-3xl transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold uppercase text-(--foreground)">{post.frontmatter.title}</h2>
                  <span className="text-[10px] font-black uppercase text-(--foreground) opacity-60">{post.frontmatter.date}</span>
                </div>
                <p className="text-sm line-clamp-2 text-(--foreground) opacity-80">{post.frontmatter.excerpt}</p>
                <div className="mt-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] group-hover:underline text-(--foreground)">
                    Read Technical Report — {'->'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}