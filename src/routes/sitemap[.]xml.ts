import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products, industries } from "../data/site";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/", "/about", "/products", "/industries", "/sustainability",
          "/projects", "/gallery", "/blog", "/contact",
        ];
        const dynamic = [
          ...products.map((p) => `/products/${p.slug}`),
          ...industries.map((i) => `/industries/${i.slug}`),
        ];
        const all = [...staticPaths, ...dynamic];

        const urls = all
          .map((p) => `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`)
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
