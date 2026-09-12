import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Heart, Building2, Award } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader, Reveal } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kohinoor Polytech" },
      { name: "description", content: "A sustainable polymer engineering company converting recycled polypropylene into premium industrial-grade granules." },
      { property: "og:title", content: "About — Kohinoor Polytech" },
      { property: "og:description", content: "A sustainable polymer engineering company converting recycled polypropylene into premium granules." },
    ],
  }),
  component: About,
});

const mvv = [
  { icon: Target, t: "Mission", d: "Convert plastic waste into premium industrial polymers, at scale, with uncompromised quality." },
  { icon: Eye, t: "Vision", d: "Lead the circular polymer economy across every industry we serve." },
  { icon: Heart, t: "Values", d: "Purity, consistency, sustainability and partnership in everything we make." },
];

const timeline = [
  { y: "2013", t: "Company founded" },
  { y: "2016", t: "PPCP production scaled" },
  { y: "2019", t: "Lab established" },
  { y: "2022", t: "Capacity doubled" },
  { y: "2025", t: "Circular-economy programme" },
];

const infra = [
  { t: "Twin-screw extrusion", d: "High-throughput lines with controlled MFI output." },
  { t: "Polymer lab", d: "Full QC suite for MFI, density, impact and colour." },
  { t: "Optical sorting", d: "Automated separation by grade and colour." },
  { t: "Warehousing", d: "Climate-controlled storage and reliable logistics." },
];

const certs = ["ISO 9001:2015", "ISO 14001:2015", "REACH", "RoHS", "EPR Registered", "BIS Certified"];

const leaders = ["Founder & CEO", "Head of Engineering", "Head of Sustainability"];

function About() {
  return (
    <div>
      <PageHero
        eyebrow="About Kohinoor"
        title="A sustainable polymer engineering company."
        subtitle="We convert recycled polypropylene into premium industrial-grade granules used by global converters and OEMs."
      />

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {mvv.map((m, i) => (
            <Reveal key={m.t} delay={i * 0.06}>
              <div className="glass card-lift h-full rounded-2xl p-6">
                <m.icon className="h-7 w-7 text-brand" />
                <div className="mt-3 font-display text-lg font-semibold">{m.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader eyebrow="Our story" title="From a Surat workshop to a national polymer manufacturer." />
        <div className="mt-10 grid gap-6 md:grid-cols-5">
          {timeline.map((e, i) => (
            <Reveal key={e.y} delay={i * 0.05}>
              <div className="glass rounded-2xl p-5">
                <div className="font-numeric text-2xl font-bold text-gradient">{e.y}</div>
                <div className="mt-2 text-sm text-muted-foreground">{e.t}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader eyebrow="Infrastructure" title="Built for precision at scale." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infra.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.05}>
              <div className="glass card-lift h-full rounded-2xl p-6">
                <Building2 className="h-6 w-6 text-brand-green" />
                <div className="mt-3 font-display font-semibold">{f.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader center eyebrow="Certifications" title="Certified quality and compliance." />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {certs.map((c) => (
            <span key={c} className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
              <Award className="h-4 w-4 text-brand" />{c}
            </span>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader center eyebrow="Leadership" title="The people behind Kohinoor." />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {leaders.map((l, i) => (
            <Reveal key={l} delay={i * 0.06}>
              <div className="glass card-lift rounded-2xl p-6 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-brand to-brand-green" />
                <div className="mt-4 font-display font-semibold">Leadership</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
