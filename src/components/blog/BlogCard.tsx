import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/data/blogs";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="glass card-lift relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 p-5 transition-all duration-300 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/5"
      >
        {/* Card Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary/50">
          <img
            src={post.image}
            alt={post.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 will-change-transform group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* Category Chip floating on image */}
          <div className="absolute left-3 top-3">
            <span className="chip backdrop-blur-md bg-card/85 text-[11px] font-semibold tracking-wide shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="mt-5 flex flex-1 flex-col justify-between">
          <div>
            {/* Title */}
            <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-brand md:text-xl">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </div>

          {/* Card Footer: Metadata & Link */}
          <div className="mt-6 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-brand" />
                  {post.displayDate}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-brand-green" />
                  {post.readingTime}
                </span>
              </div>

              {/* Action Link */}
              <span className="inline-flex items-center gap-1.5 font-medium text-brand transition-colors group-hover:text-brand-2">
                Read
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
