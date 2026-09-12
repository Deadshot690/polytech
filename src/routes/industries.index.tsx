import { createFileRoute, Link } from "@tanstack/react-router";
import { Factory, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, Reveal } from "@/components/site/Section";
import { industries } from "@/data/site";

export const Route = createFileRoute("/industries/")({
  head: () => ({
    meta: [
      { title: "Industries — Kohinoor Polytech" },
      { name: "description", content: "Trusted across seven verticals with engineered polymer grades." },
      { property: "og:title", content: "Industries — Kohinoor Polytech" },
      { property: "og:description", content: "Trusted across seven verticals with engineered polymer grades." },
    ],
  }),
  component: Industries,
});

function Industries() {
  return (
    <div>
      <PageHero eyebrow="Industries served" title="Trusted across seven verticals." subtitle="Engineered polymer grades tailored to the demands of each industry we serve." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.05}>
              <Link to="/industries/$slug" params={{ slug: ind.slug }} className="glass card-lift block h-full rounded-2xl p-6">
                <Factory className="h-6 w-6 text-brand" />
                <div className="mt-3 font-display text-lg font-semibold">{ind.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{ind.blurb}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
