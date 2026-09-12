import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, CheckCircle2, Boxes, Trophy } from "lucide-react";
import { Section, Reveal } from "@/components/site/Section";
import { useLead } from "@/lib/lead-context";
import { industries } from "@/data/site";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = industries.find((i) => i.slug === params.slug);
    if (!industry) throw notFound();
    return { industry };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.industry.name} — Kohinoor Polytech` },
          { name: "description", content: loaderData.industry.blurb },
          { property: "og:title", content: `${loaderData.industry.name} — Kohinoor Polytech` },
          { property: "og:description", content: loaderData.industry.blurb },
        ]
      : [{ title: "Industry not found" }, { name: "robots", content: "noindex" }],
  }),
  component: IndustryDetail,
  notFoundComponent: () => (
    <Section className="pt-32 text-center">
      <h1 className="text-3xl font-bold">Industry not found</h1>
      <Link to="/industries" className="btn-primary mt-6">Back to industries</Link>
    </Section>
  ),
});

function IndustryDetail() {
  const { industry } = Route.useLoaderData();
  const { openLead } = useLead();

  return (
    <Section className="pt-28">
      <Link to="/industries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to industries
      </Link>
      <h1 className="mt-6 text-3xl font-bold md:text-5xl">{industry.name}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{industry.blurb}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-2xl p-6">
            <div className="flex items-center gap-2 font-display font-semibold"><AlertTriangle className="h-5 w-5 text-brand" /> Challenges</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {industry.challenges.map((c: string) => <li key={c}>• {c}</li>)}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="glass h-full rounded-2xl p-6">
            <div className="flex items-center gap-2 font-display font-semibold"><CheckCircle2 className="h-5 w-5 text-brand-green" /> Our solutions</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {industry.solutions.map((s: string) => <li key={s}>• {s}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 glass rounded-2xl p-6">
        <div className="flex items-center gap-2 font-display font-semibold"><Boxes className="h-5 w-5 text-brand" /> Recommended grades</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {industry.grades.map((g: string) => <span key={g} className="chip">{g}</span>)}
        </div>
      </div>

      <div className="mt-6 glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-2 font-display text-lg font-semibold"><Trophy className="h-5 w-5 text-brand-green" /> Case study</div>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          <div><div className="text-xs uppercase tracking-wide text-muted-foreground">Problem</div><p className="mt-2 text-sm">{industry.caseStudy.problem}</p></div>
          <div><div className="text-xs uppercase tracking-wide text-muted-foreground">Solution</div><p className="mt-2 text-sm">{industry.caseStudy.solution}</p></div>
          <div><div className="text-xs uppercase tracking-wide text-muted-foreground">Result</div><p className="mt-2 text-sm">{industry.caseStudy.result}</p></div>
        </div>
        <button onClick={() => openLead()} className="btn-primary mt-6">Discuss your application</button>
      </div>
    </Section>
  );
}
