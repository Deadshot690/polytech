import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Section, Reveal } from "@/components/site/Section";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Kohinoor Polytech" },
      { name: "description", content: "Case studies showing measurable results across industries." },
      { property: "og:title", content: "Projects — Kohinoor Polytech" },
      { property: "og:description", content: "Case studies showing measurable results across industries." },
    ],
  }),
  component: Projects,
});

const cases = [
  {
    title: "Automotive interior trim conversion",
    problem: "An OEM needed a recycled-content grade with stable low-temperature impact.",
    solution: "Impact-modified PPCP with validated performance and colour matching.",
    result: "15% cost reduction with no drop in part quality.",
  },
  {
    title: "Thin-wall packaging line optimisation",
    problem: "A converter faced short shots and slow cycles on thin-wall tubs.",
    solution: "A 35 MFI high-flow copolymer improved fill and cooling.",
    result: "12% faster cycles and fewer rejects.",
  },
  {
    title: "Stackable paint pail redesign",
    problem: "A paint brand needed sturdier, stackable pails.",
    solution: "A stiffer homopolymer improved top-load strength.",
    result: "20% higher stack height in warehouses.",
  },
  {
    title: "Raffia tape stabilisation",
    problem: "A weaver had tape breakage from MFI drift.",
    solution: "Tightly controlled raffia grade with consistent MFI.",
    result: "Downtime cut by a third.",
  },
];

function Projects() {
  return (
    <div>
      <PageHero eyebrow="Projects" title="Results that speak for themselves." subtitle="Real-world case studies across the industries we serve." />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="glass card-lift h-full rounded-2xl p-6">
                <div className="font-display text-lg font-semibold">{c.title}</div>
                <div className="mt-4 space-y-3 text-sm">
                  <p><span className="font-semibold text-brand">Problem: </span><span className="text-muted-foreground">{c.problem}</span></p>
                  <p><span className="font-semibold text-brand">Solution: </span><span className="text-muted-foreground">{c.solution}</span></p>
                  <p><span className="font-semibold text-brand-green">Result: </span><span className="text-muted-foreground">{c.result}</span></p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
