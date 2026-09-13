import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RotateCcw, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, Reveal } from "@/components/site/Section";
import { BlogCard } from "@/components/blog/BlogCard";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { blogPosts, blogCategories } from "@/data/blogs";
import { getFeaturedPost } from "@/lib/blog-service";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & Industrial Insights — Kohinoor Polytech" },
      {
        name: "description",
        content:
          "Explore manufacturing knowledge, polymer compounding insights, circular economy perspectives, and technology updates from Kohinoor Polytech.",
      },
      { property: "og:title", content: "Blog & Industrial Insights — Kohinoor Polytech" },
      {
        property: "og:description",
        content:
          "Explore manufacturing knowledge, polymer compounding insights, circular economy perspectives, and technology updates from Kohinoor Polytech.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogIndex,
});

const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 3;

export function BlogIndex() {
  const featuredArticle = useMemo(() => getFeaturedPost(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_PAGE_SIZE);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: blogPosts.length,
    };
    for (const cat of blogCategories) {
      counts[cat] = blogPosts.filter((p) => p.category === cat).length;
    }
    return counts;
  }, []);

  // Filtered posts (excluding the featured one if showing All and no search, or keep consistent)
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchCat =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      const matchCategory = post.category.toLowerCase().includes(q);

      return matchTitle || matchExcerpt || matchTags || matchCategory;
    });
  }, [selectedCategory, searchQuery]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_INCREMENT);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Hero Section */}
      <PageHero
        eyebrow="BLOG / INSIGHTS"
        title="Ideas, expertise & innovation"
        subtitle="Explore the latest insights, manufacturing knowledge, technology updates, company news and industry perspectives from Kohinoor Polytech."
      />

      <Section className="py-12 md:py-16">
        {/* 2. Featured Article Section */}
        {selectedCategory === "All" && !searchQuery.trim() && featuredArticle && (
          <Reveal>
            <div className="mb-16 md:mb-20">
              <FeaturedArticle post={featuredArticle} />
            </div>
          </Reveal>
        )}

        {/* 3. Controls: Category Filter & Search Bar */}
        <div className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter
            categories={["All", ...blogCategories]}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setVisibleCount(INITIAL_PAGE_SIZE);
            }}
            categoryCounts={categoryCounts}
          />

          <div className="shrink-0">
            <BlogSearch
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setVisibleCount(INITIAL_PAGE_SIZE);
              }}
              placeholder="Search insights & topics..."
            />
          </div>
        </div>

        {/* Active filter indication summary */}
        {(selectedCategory !== "All" || searchQuery.trim()) && (
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <p>
              Showing <span className="font-semibold text-foreground">{filteredPosts.length}</span>{" "}
              {filteredPosts.length === 1 ? "article" : "articles"}
              {selectedCategory !== "All" && (
                <>
                  {" "}
                  in <span className="font-semibold text-foreground">{selectedCategory}</span>
                </>
              )}
              {searchQuery.trim() && (
                <>
                  {" "}
                  matching "<span className="font-semibold text-foreground">{searchQuery}</span>"
                </>
              )}
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              <RotateCcw className="h-3 w-3" /> Reset filters
            </button>
          </div>
        )}

        {/* 4. Blog Grid */}
        {displayedPosts.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            <AnimatePresence mode="popLayout">
              {displayedPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                  className="flex"
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* 5. Polished Empty State */
          <div className="glass mt-12 rounded-3xl p-12 text-center md:p-16">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 font-display text-xl font-bold">No articles found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We couldn't find any articles matching your current filter or search criteria. Try
              adjusting your keywords or reset filters to see all articles.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> View All Articles
            </button>
          </div>
        )}

        {/* 6. Load More Section */}
        {hasMore && (
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="btn-ghost inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-all hover:border-brand/50"
            >
              Load More Articles
              <ChevronDown className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              Showing {displayedPosts.length} of {filteredPosts.length} articles
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
