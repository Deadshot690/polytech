import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section, Reveal } from "@/components/site/Section";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Kohinoor Polytech" },
      { name: "description", content: "A look inside our plant, granules and quality lab." },
      { property: "og:title", content: "Gallery — Kohinoor Polytech" },
      { property: "og:description", content: "A look inside our plant, granules and quality lab." },
    ],
  }),
  component: Gallery,
});

const tiles = [
  { label: "Factory floor", grad: "from-brand to-brand-2" },
  { label: "Granule close-up · Blue", grad: "from-brand-2 to-brand-cyan" },
  { label: "Twin-screw extrusion line", grad: "from-slate-600 to-slate-800" },
  { label: "Quality lab", grad: "from-brand-cyan to-brand-green" },
  { label: "Granule close-up · Red", grad: "from-rose-500 to-red-700" },
  { label: "Sorting station", grad: "from-amber-500 to-orange-700" },
  { label: "Packing line", grad: "from-brand to-brand-green" },
  { label: "Granule close-up · Yellow", grad: "from-yellow-400 to-amber-600" },
  { label: "Drone view · Plant", grad: "from-brand-2 to-slate-700" },
  { label: "Team at work", grad: "from-brand to-brand-cyan" },
  { label: "Granule close-up · Green", grad: "from-brand-green to-emerald-700" },
];

function Gallery() {
  return (
    <div>
      <PageHero eyebrow="Gallery" title="Inside Kohinoor Polytech." subtitle="A visual tour of our plant, processes and products." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.03}>
              <div className={`card-lift relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${t.grad}`}>
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-sm font-medium text-white">{t.label}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
