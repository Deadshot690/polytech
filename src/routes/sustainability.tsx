import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Users, Scale, Recycle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader, Reveal } from "@/components/site/Section";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Kohinoor Polytech" },
      { name: "description", content: "Engineering a circular polymer economy with measurable environmental impact." },
      { property: "og:title", content: "Sustainability — Kohinoor Polytech" },
      { property: "og:description", content: "Engineering a circular polymer economy with measurable environmental impact." },
    ],
  }),
  component: Sustainability,
});

const stats = [
  { v: "14,000 T", l: "Plastic waste recycled annually" },
  { v: "32,000 T", l: "CO₂ emissions avoided" },
  { v: "85%", l: "Water reused in closed loops" },
  { v: "40%", l: "Energy from renewables (2026 target)" },
];

const esg = [
  { icon: Leaf, t: "Environmental", d: "Recycled feedstock, closed-loop water, and renewable-energy targets across operations." },
  { icon: Users, t: "Social", d: "Safe workplaces, fair labour and community engagement in Surat and beyond." },
  { icon: Scale, t: "Governance", d: "Transparent reporting, certified compliance and responsible sourcing." },
];

const stages = [
  "Collect & sort waste streams",
  "Clean & decontaminate",
  "Compound & pelletise",
  "Deliver to manufacturers",
  "Products re-enter the loop",
];

function Sustainability() {
  return (
    <div>
      <PageHero eyebrow="Sustainability" title="Engineering a circular polymer economy." subtitle="Turning plastic waste into premium industrial compounds — measured, verified and reported." />
      <Section>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="glass card-lift rounded-2xl p-6">
              <div className="font-numeric text-2xl font-bold text-brand-green">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader center eyebrow="ESG framework" title="Responsible on every axis." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {esg.map((e, i) => (
            <Reveal key={e.t} delay={i * 0.06}>
              <div className="glass card-lift h-full rounded-2xl p-6">
                <e.icon className="h-7 w-7 text-brand-green" />
                <div className="mt-3 font-display text-lg font-semibold">{e.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader center eyebrow="Circular process" title="Closing the loop, stage by stage." />
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {stages.map((s, i) => (
            <Reveal key={s} delay={i * 0.05}>
              <div className="glass rounded-2xl p-5">
                <Recycle className="h-6 w-6 text-brand" />
                <div className="mt-3 text-sm">{s}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="glass-strong rounded-3xl p-10 text-center md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Our commitment to net-zero manufacturing by 2040.</h2>
          <Link to="/contact" className="btn-accent mt-8">Partner with us</Link>
        </div>
      </Section>
    </div>
  );
}
