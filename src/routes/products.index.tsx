import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight, Boxes, Recycle, FlaskConical, Layers } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader, Reveal } from "@/components/site/Section";
import { Input } from "@/components/ui/input";
import { products, productCategories } from "@/data/site";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — PCR Polymers LLP" },
      {
        name: "description",
        content:
          "Browse technical specifications for our PPHP, PPCP and custom polypropylene compound grades.",
      },
      { property: "og:title", content: "Products — PCR Polymers LLP" },
      {
        property: "og:description",
        content: "Engineered PCR PPHP, PCR PPCP, customized compounds and PCR HDPE granules.",
      },
    ],
  }),
  component: Products,
});

const filters = ["All", "PPHP", "PPCP", "Compound", "HDPE"] as const;

function Products() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");

  const filtered = products.filter(
    (p) =>
      (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  const categoryIcons = [Boxes, Recycle, Layers, FlaskConical];

  return (
    <div>
      <PageHero
        eyebrow="Products"
        title="Premium polymer product range."
        subtitle="Engineered PCR PPHP, PCR PPCP, customized compounds and PCR HDPE granules."
      />

      <Section>
        <SectionHeader eyebrow="Product categories" title="Ranges for every application." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((c, i) => {
            const Icon = categoryIcons[i % categoryIcons.length];
            return (
              <Reveal key={c.name} delay={i * 0.05}>
                <div className="glass card-lift h-full rounded-2xl p-6">
                  <Icon className="h-6 w-6 text-brand" />
                  <div className="mt-3 font-display text-lg font-semibold">{c.name}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${filter === f ? "btn-primary" : "btn-ghost"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search grades…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="glass card-lift block h-full rounded-2xl p-6"
              >
                <span className="chip">{p.tag}</span>
                <div className="mt-4 font-display text-lg font-semibold">{p.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  View details <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground">No grades match your search.</p>
          )}
        </div>
      </Section>
    </div>
  );
}
