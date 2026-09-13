import { blogPosts, blogCategories, type BlogPost, type BlogCategory } from "@/data/blogs";

export interface BlogFilterOptions {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
  categories: string[];
}

/**
 * Normalised Blog Service.
 * Currently consumes local mock data, structured so that Strapi REST/GraphQL
 * endpoints can replace this implementation directly.
 */
export async function getBlogPosts(options: BlogFilterOptions = {}): Promise<BlogListResponse> {
  const { category = "All", search = "", limit = 6, offset = 0 } = options;

  let filtered = [...blogPosts];

  // Filter by category
  if (category && category !== "All") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query (title, excerpt, category, tags)
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchExcerpt = p.excerpt.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchExcerpt || matchCategory || matchTags;
    });
  }

  const total = filtered.length;
  const paginatedPosts = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    posts: paginatedPosts,
    total,
    hasMore,
    categories: ["All", ...blogCategories],
  };
}

/**
 * Returns the primary featured post for the hero highlight.
 */
export function getFeaturedPost(): BlogPost {
  return blogPosts.find((p) => p.featured) || blogPosts[0];
}

/**
 * Returns a single blog post by slug.
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/**
 * Returns related articles for a given post, prioritizing the same category.
 */
export function getRelatedPosts(
  currentSlug: string,
  category: BlogCategory,
  limit = 3,
): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      const aSame = a.category === category ? 1 : 0;
      const bSame = b.category === category ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, limit);
}

/**
 * Returns list of blog categories.
 */
export function getBlogCategories(): string[] {
  return ["All", ...blogCategories];
}
