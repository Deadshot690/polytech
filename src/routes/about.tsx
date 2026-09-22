import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Building2, Award } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader, Reveal } from "@/components/site/Section";
import { getCurrentSiteName } from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  head: () => {
    const siteName = getCurrentSiteName();
    return {
      meta: [
        { title: `About — ${siteName}` },
        {
          name: "description",
          content:
            "We are engaged in the manufacturing and processing of high-quality plastic granules, specializing in Polypropylene (PP) and Post-Consumer Recycled (PCR) polymers.",
        },
        { property: "og:title", content: `About — ${siteName}` },
        {
          property: "og:description",
          content:
            "We are engaged in the manufacturing and processing of high-quality plastic granules, specializing in Polypropylene (PP) and Post-Consumer Recycled (PCR) polymers.",
        },
      ],
    };
  },
  component: About,
});

const mvv = [
  {
    icon: Target,
    t: "Our Mission",
    d: "To manufacture high-quality, sustainable plastic granules that seamlessly replace virgin polymers, empowering the packaging, automotive, and household industries to reduce their carbon footprint.",
  },
  {
    icon: Eye,
    t: "Our Vision",
    d: "To build a global name that everyone trusts, showing the world that a business can reach the highest peaks while keeping our earth green, safe, and beautiful for our children and their future.",
  },
];

const timeline = [
  { y: "2017", t: "Company founded in Surat" },
  { y: "2019", t: "Quality testing lab established" },
  { y: "2021", t: "Production capacity scaled" },
  { y: "2023", t: "PCR polymer lines expanded" },
  { y: "2025", t: "Circular supply chain programme" },
];

const infra = [
  { t: "Two Stage Extruder", d: "High-throughput lines with controlled MFI output." },
  { t: "Polymer lab", d: "Full QC suite for MFI, density, impact and colour." },
  // { t: "Optical sorting", d: "Automated separation by grade and colour." },
  { t: "Warehousing", d: "Climate-controlled storage and reliable logistics." },
];

const certs = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "REACH",
  "RoHS",
  "EPR Registered",
  "GRIS Certified",
];

const leaders = [
  {
    name: "Mohsin Memon",
    role: "CEO & Founder",
    image: "/Assets/leaders/mohsin-memon.png",
    bio: "Spearheads the strategic vision, technological roadmap, and sustainable polymer innovations that drive PCR Polymers LLP's growth and industry partnerships.",
  },
  {
    name: "Mustafa Memon",
    role: "Chief Operating Officer COO",
    image: "/Assets/leaders/mustafa-memon.jpg",
    bio: "Directs end-to-end manufacturing operations, plant engineering, and quality assurance to guarantee peak consistency across all polymer lines.",
  },
];

function About() {
  return (
    <div>
      <PageHero
        eyebrow="About PCR Polymers"
        title="A sustainable polymer engineering company."
        subtitle="We are engaged in the manufacturing and processing of high-quality plastic granules, specializing in Polypropylene (PP) and Post-Consumer Recycled (PCR) polymers. As a sustainable B2B supply chain partner, we convert plastic waste into premium, industrial-grade raw materials for the packaging, automotive, and household product industries."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {mvv.map((m, i) => (
            <Reveal key={m.t} delay={i * 0.06}>
              <div className="glass card-lift h-full rounded-2xl p-8">
                <m.icon className="h-8 w-8 text-brand" />
                <div className="mt-4 font-display text-xl font-bold">{m.t}</div>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader
          eyebrow="Our story"
          title="From a Surat workshop to a national polymer manufacturer."
        />
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
            <span
              key={c}
              className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              <Award className="h-4 w-4 text-brand" />
              {c}
            </span>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader center eyebrow="Leadership" title="The people behind PCR Polymers LLP." />
        <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
          {leaders.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.08}>
              <div className="glass card-lift group flex flex-col items-center overflow-hidden rounded-3xl p-6 text-center transition-all duration-300">
                <div className="relative h-60 w-60 overflow-hidden rounded-2xl border border-border/70 bg-secondary/50 shadow-md sm:h-64 sm:w-64">
                  <img
                    src={l.image}
                    alt={l.name}
                    className="h-full w-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 font-display text-xl font-bold">{l.name}</div>
                <div className="mt-1 text-sm font-semibold text-brand">{l.role}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
