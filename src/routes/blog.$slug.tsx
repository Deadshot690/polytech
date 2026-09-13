import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  Quote,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Section, Reveal } from "@/components/site/Section";
import { BlogCard } from "@/components/blog/BlogCard";
import { useLead } from "@/lib/lead-context";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-service";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    const relatedPosts = getRelatedPosts(post.slug, post.category, 3);
    return { post, relatedPosts };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) {
      return {
        meta: [
          { title: "Article Not Found — PCR Polymers LLP" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} — PCR Polymers LLP Insights` },
        { name: "description", content: post.excerpt },
        { name: "author", content: post.author.name },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.image },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:section", content: post.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.image },
      ],
    };
  },
  component: BlogDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <h1 className="font-display text-4xl font-bold text-gradient">Article Not Found</h1>
      <p className="mt-4 text-muted-foreground">
        The article you are looking for does not exist or may have been updated.
      </p>
      <div className="mt-8">
        <Link to="/blog" className="btn-primary">
          <ArrowLeft className="h-4 w-4" /> Back to all articles
        </Link>
      </div>
    </div>
  ),
});

function BlogDetail() {
  const { post, relatedPosts } = Route.useLoaderData();
  const { openLead } = useLead();

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--brand) 0%, var(--brand-green) 50%, transparent 80%)",
        }}
      />

      <article className="relative mx-auto max-w-4xl px-5 pt-28 pb-16 md:px-8 md:pt-36">
        {/* Navigation Breadcrumb */}
        <Reveal>
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" /> Share Article
            </button>
          </div>
        </Reveal>

        {/* Article Header */}
        <header className="mt-8">
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{post.category}</span>
              {post.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                  <Sparkles className="h-3 w-3" /> Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-5xl lg:leading-[1.15]">
              {post.title}
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-xl">
              {post.excerpt}
            </p>

            {/* Author & Timestamp Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border/70 py-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand font-bold text-xs">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{post.author.name}</div>
                  <div className="text-[11px] text-muted-foreground">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand" />
                  {post.displayDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-green" />
                  {post.readingTime}
                </span>
              </div>
            </div>
          </Reveal>
        </header>

        {/* Large Featured Image */}
        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-border/80 bg-secondary/30 shadow-2xl">
            <div className="relative aspect-[16/9] w-full">
              <img
                src={post.image}
                alt={post.imageAlt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="border-t border-border/60 bg-card/60 px-5 py-2.5 text-xs text-muted-foreground">
              {post.imageAlt} · Industrial & Technical Insights
            </div>
          </div>
        </Reveal>

        {/* Article Body Content */}
        <div className="mt-12 space-y-10 text-foreground/90 leading-relaxed md:text-lg">
          {/* Introduction */}
          <Reveal delay={0.15}>
            <p className="text-lg font-medium leading-relaxed md:text-xl text-foreground">
              {post.content.intro}
            </p>
          </Reveal>

          {/* Structured Sections */}
          {post.content.sections.map((sec, i) => (
            <Reveal key={sec.heading} delay={0.15 + i * 0.05}>
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {sec.heading}
                </h2>

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* Callout Quote if present */}
                {sec.callout && (
                  <div className="glass-strong my-6 rounded-2xl border-l-4 border-brand p-6">
                    <Quote className="h-6 w-6 text-brand/50 mb-2" />
                    <p className="font-display text-base font-medium italic text-foreground md:text-lg">
                      "{sec.callout}"
                    </p>
                  </div>
                )}

                {/* Bullet points if present */}
                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="my-5 space-y-2.5">
                    {sec.bulletPoints.map((item, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-sm md:text-base text-muted-foreground"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}

          {/* Key Takeaways Box */}
          {post.content.keyTakeaways && post.content.keyTakeaways.length > 0 && (
            <Reveal delay={0.25}>
              <div className="glass-strong rounded-3xl border border-brand/30 p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20 text-brand">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                    Key Technical Takeaways
                  </h3>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-1">
                  {post.content.keyTakeaways.map((takeaway, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/50 p-3.5 text-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                        {tIdx + 1}
                      </span>
                      <span className="text-foreground/90">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Conclusion */}
          <Reveal delay={0.3}>
            <div className="space-y-4 pt-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Conclusion
              </h2>
              <p className="text-muted-foreground leading-relaxed">{post.content.conclusion}</p>
            </div>
          </Reveal>

          {/* Tags */}
          <Reveal delay={0.35}>
            <div className="border-t border-border/70 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Topics:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Bottom CTA Card */}
          <Reveal delay={0.4}>
            <div className="glass-strong mt-12 rounded-3xl p-8 text-center md:p-12">
              <span className="chip mb-4">Engineering Partnership</span>
              <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Need customized polymer compounding?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
                Our technical engineering team works closely with converters and OEMs to formulate
                high-performance, sustainable polypropylene compounds tailored to your exact
                tooling.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openLead("Custom Polymer Compounding Inquiry")}
                  className="btn-primary"
                >
                  Request Technical Consultation
                </button>
                <Link to="/products" className="btn-ghost">
                  Explore Products
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-border/70 bg-secondary/20 py-16 md:py-24">
          <Section className="py-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="chip mb-2">Continue Reading</span>
                <h3 className="font-display text-2xl font-bold md:text-3xl">Related Insights</h3>
              </div>
              <Link
                to="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                View all articles <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link to="/blog" className="btn-ghost text-xs">
                View all articles
              </Link>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
