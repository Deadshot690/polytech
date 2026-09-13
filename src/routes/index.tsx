import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Recycle,
  FlaskConical,
  Boxes,
  ChevronDown,
  ShieldCheck,
  Gauge,
  Palette,
  Layers,
  Truck,
  Factory,
  Sparkles,
  Headset,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Section, SectionHeader, Reveal } from "@/components/site/Section";
import { PolymerPreviewCard } from "@/components/site/PolymerPreviewCard";
import { useLead } from "@/lib/lead-context";
import { industries, productCategories } from "@/data/site";
import heroVideo from "@/hero.mp4";

export const Route = createFileRoute("/")({
  component: Home,
});

const stats = [
  { v: "8 Yrs", l: "Years of expertise" },
  { v: "6k MT", l: "Annual capacity" },
  { v: "25+", l: "Polymer grades" },
  { v: "6", l: "Industries served" },
];

const features = [
  { icon: Boxes, t: "Homopolymer", s: "PCR PPHP" },
  { icon: Recycle, t: "Copolymer", s: "PCR PPCP" },
  { icon: Layers, t: "HDPE", s: "PCR HDPE" },
  { icon: FlaskConical, t: "Customized Compounds", s: "PCR Compounds" },
];

const loopSteps = [
  {
    n: "01",
    t: "Plastic Waste",
    d: "Post-consumer & post-industrial PP streams sourced through certified channels.",
  },
  {
    n: "02",
    t: "Collection & Sorting",
    d: "Automated optical sorting separates polymers by grade and colour.",
  },
  {
    n: "03",
    t: "Cleaning & Processing",
    d: "Multi-stage washing removes contaminants below industry thresholds.",
  },
  {
    n: "04",
    t: "Granule Production",
    d: "Two Stage Extruder yields uniform pellets with controlled MFI.",
  },
  {
    n: "05",
    t: "Manufacturing",
    d: "Granules ship to OEMs and converters across six industries.",
  },
  {
    n: "06",
    t: "Consumer Products",
    d: "Recycled-content products re-enter the loop, closing the cycle.",
  },
];

const reasons = [
  { icon: Sparkles, t: "High purity materials" },
  { icon: Gauge, t: "Consistent MFI" },
  { icon: ShieldCheck, t: "Quality assurance" },
  { icon: Palette, t: "Custom colour development" },
  { icon: Truck, t: "Reliable supply chain" },
  { icon: Leaf, t: "Sustainable manufacturing" },
  { icon: Recycle, t: "Recycled content" },
  { icon: Headset, t: "Dedicated technical support" },
];

const mfgStats = [
  { v: "8 Yrs", l: "Years operating" },
  { v: "6,000 MT", l: "Annual production capacity" },
  { v: "25+", l: "Product variants" },
  { v: "6", l: "Industries served" },
  { v: "110+", l: "Active clients" },
];

const susStats = [
  { v: "14,000+ T", l: "Plastic waste recycled" },
  { v: "32,000 T", l: "CO₂ emissions avoided" },
  { v: "85%", l: "Closed-loop water reuse" },
  { v: "40%", l: "Renewable energy target" },
];

const testimonials = [
  "Kohinoor's MFI consistency changed our line efficiency overnight.",
  "Their recycled-content grades met our sustainability goals without compromising quality.",
  "The team responded like an extension of our engineering department.",
];

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { openLead } = useLead();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.14, 1.3]);

  return (
    <div>
      {/* HERO */}
      <div
        ref={heroRef}
        className="relative -mt-16 min-h-[100svh] overflow-hidden bg-[#061523] text-white"
      >
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[#061523]/55" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand) 22%, transparent), transparent 70%)",
          }}
        />
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 text-center"
        >
          <span className="chip mb-6 border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
            Sustainable Polymer Engineering
          </span>
          <h1 className="text-4xl font-bold leading-[1.05] md:text-7xl">
            Engineering the future of <span className="text-gradient">sustainable polymers.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
            Transforming recycled materials into high-performance industrial compounds for modern
            manufacturing — at scale, with uncompromised purity.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/products" className="btn-primary">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => openLead()} className="btn-ghost">
              Request a Quote
            </button>
            <Link to="/contact" className="btn-accent">
              Book Consultation
            </Link>
          </div>
          <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4">
                <div className="font-numeric text-2xl font-bold md:text-3xl">{s.v}</div>
                <div className="mt-1 text-xs text-slate-300">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-slate-300">
          <span>Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>

      {/* WHO WE ARE */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Who we are"
              title="A polymer engineering company built around the circular economy."
              subtitle="Kohinoor Polytech converts post-consumer and post-industrial polymers into premium PPHP, PPCP, HDPE and customized compounds. Every batch is validated for MFI stability, impurity control and colour consistency before it leaves our plant."
            />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div key={f.t} className="glass card-lift rounded-2xl p-5">
                  <f.icon className="h-6 w-6 text-brand" />
                  <div className="mt-3 font-display font-semibold">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.s}</div>
                </div>
              ))}
            </div>
          </div>
          <Reveal>
            <PolymerPreviewCard />
          </Reveal>
        </div>
      </Section>

      {/* CIRCULAR ECONOMY */}
      <Section className="border-t border-border">
        <SectionHeader
          center
          eyebrow="The circular economy"
          title="From waste stream to premium granules"
          subtitle="Our closed-loop process turns discarded polymers into industrial-grade material — verified at every stage."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loopSteps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="glass card-lift h-full rounded-2xl p-6">
                <div className="font-numeric text-3xl font-bold text-gradient">{s.n}</div>
                <div className="mt-2 font-display text-lg font-semibold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY KOHINOOR */}
      <Section className="border-t border-border">
        <SectionHeader center eyebrow="Why Kohinoor" title="Eight reasons to choose us." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.t} delay={i * 0.04}>
              <div className="glass card-lift flex h-full flex-col items-start gap-3 rounded-2xl p-6">
                <r.icon className="h-6 w-6 text-brand-green" />
                <div className="font-display font-semibold">{r.t}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PRODUCT CATEGORIES */}
      <Section className="border-t border-border">
        <SectionHeader
          eyebrow="Product categories"
          title="Engineered polymer ranges for every application."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.slice(0, 4).map((c, i) => {
            const icons = [Boxes, Recycle, Layers, FlaskConical];
            const Icon = icons[i % icons.length];
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
        <div className="mt-8">
          <Link to="/products" className="btn-primary">
            View the full catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* INDUSTRIES */}
      <Section className="border-t border-border">
        <SectionHeader center eyebrow="Industries served" title="Trusted across six verticals." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.04}>
              <div className="glass card-lift block h-full rounded-2xl p-6">
                <Factory className="h-6 w-6 text-brand" />
                <div className="mt-3 font-display text-lg font-semibold">{ind.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{ind.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* MANUFACTURING */}
      <Section className="border-t border-border">
        <SectionHeader
          eyebrow="Manufacturing excellence"
          title="A factory engineered for precision and scale."
          subtitle="Two Stage Extruder lines, in-line MFI monitoring and a fully equipped polymer lab — operating around the clock with stringent QC checkpoints."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {mfgStats.map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5 text-center">
              <div className="font-numeric text-2xl font-bold text-gradient">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* SUSTAINABILITY */}
      <Section className="border-t border-border">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Sustainability"
            title="Recycled content, measurable impact and responsible operations."
            subtitle="We turn plastic waste into premium industrial compounds while helping customers meet sustainability goals and regulatory targets."
          />
          <div className="grid grid-cols-2 gap-3">
            {susStats.map((s) => (
              <div key={s.l} className="glass card-lift rounded-2xl p-5">
                <div className="font-numeric text-2xl font-bold text-brand-green">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Link to="/sustainability" className="btn-accent">
            Explore sustainability <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="border-t border-border">
        <SectionHeader center title="Trusted by manufacturers who demand consistency." />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="glass card-lift h-full rounded-2xl p-6">
                <Quote className="h-7 w-7 text-brand" />
                <p className="mt-4 text-base">{t}</p>
                <div className="mt-4 flex items-center gap-1 text-brand-green">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs">Verified customer</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="border-t border-border">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div
            className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--brand) 40%, transparent), transparent 70%)",
            }}
          />
          <h2 className="relative text-3xl font-bold md:text-5xl">
            Ready to build your next polymer solution?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-muted-foreground">
            Let's discuss grades, colour, supply volume and application performance.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => openLead()} className="btn-primary">
              Request a Quote
            </button>
            <Link to="/contact" className="btn-ghost">
              Contact Sales
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
