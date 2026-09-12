import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, Reveal } from "@/components/site/Section";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Insights — Kohinoor Polytech" },
      { name: "description", content: "Perspectives on recycled polymers, MFI control and sustainable manufacturing." },
      { property: "og:title", content: "Insights — Kohinoor Polytech" },
      { property: "og:description", content: "Perspectives on recycled polymers, MFI control and sustainable manufacturing." },
    ],
  }),
  component: Blog,
});

const posts = [
  { title: "Why MFI consistency matters for high-speed lines", cat: "Engineering", date: "Jun 2026", read: "5 min", grad: "from-brand to-brand-2" },
  { title: "Closing the loop: recycled PP in automotive", cat: "Sustainability", date: "May 2026", read: "6 min", grad: "from-brand-green to-brand-cyan" },
  { title: "Colour development for recycled compounds", cat: "Colour", date: "Apr 2026", read: "4 min", grad: "from-brand-2 to-brand-green" },
  { title: "Meeting EPR targets with recycled content", cat: "Compliance", date: "Mar 2026", read: "7 min", grad: "from-brand-cyan to-brand" },
  { title: "Twin-screw extrusion, explained", cat: "Process", date: "Feb 2026", read: "5 min", grad: "from-slate-600 to-brand-2" },
  { title: "The economics of the circular polymer economy", cat: "Industry", date: "Jan 2026", read: "8 min", grad: "from-brand to-brand-green" },
];

function Blog() {
  return (
    <div>
      <PageHero eyebrow="Insights" title="Ideas from the polymer lab." subtitle="Perspectives on recycled polymers, MFI control and sustainable manufacturing." />
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.04}>
              <article className="glass card-lift h-full overflow-hidden rounded-2xl">
                <div className={`relative aspect-[16/9] bg-gradient-to-br ${p.grad}`}>
                  <div className="absolute inset-0 grid-bg opacity-20" />
                </div>
                <div className="p-6">
                  <span className="chip">{p.cat}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{p.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.read}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
