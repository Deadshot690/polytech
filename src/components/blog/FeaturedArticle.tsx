import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import type { BlogPost } from "@/data/blogs";

export function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <div className="relative">
      {/* Featured Header Eyebrow */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
          <Sparkles className="h-3.5 w-3.5" /> Featured Insight
        </span>
      </div>

      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="glass-strong card-lift group relative block overflow-hidden rounded-3xl border border-border/80 p-6 md:p-8 lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Featured Image (5 cols on lg) */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary/60 lg:col-span-6 lg:aspect-[4/3]">
            <img
              src={post.image}
              alt={post.imageAlt}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50" />
            <div className="absolute bottom-4 left-4">
              <span className="chip backdrop-blur-md bg-card/85 text-xs font-semibold shadow-sm">
                {post.category}
              </span>
            </div>
          </div>

          {/* Featured Content (7 cols on lg) */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
              <span>{post.category.toUpperCase()} PERSPECTIVE</span>
            </div>

            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-brand md:text-3xl lg:text-4xl">
              {post.title}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-brand" />
                {post.displayDate}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-brand-green" />
                {post.readingTime}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="text-muted-foreground">By {post.author.name}</span>
            </div>

            {/* Read Button */}
            <div className="mt-8">
              <span className="btn-primary inline-flex">
                Read Article
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
