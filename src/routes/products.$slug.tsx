import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText, Layers, Palette, Package } from "lucide-react";
import { Section, Reveal } from "@/components/site/Section";
import { useLead } from "@/lib/lead-context";
import { products } from "@/data/site";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — PCR Polymers LLP` },
          { name: "description", content: loaderData.product.blurb },
          { property: "og:title", content: `${loaderData.product.name} — PCR Polymers LLP` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Product not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <Section className="pt-32 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="mt-3 text-muted-foreground">This grade doesn't exist in our catalogue.</p>
      <Link to="/products" className="btn-primary mt-6">
        Back to products
      </Link>
    </Section>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { openLead } = useLead();

  const meta = [
    { icon: Layers, t: "Application", v: product.application },
    { icon: Palette, t: "Colour", v: product.color },
    { icon: Package, t: "Form", v: product.form },
  ];

  return (
    <div>
      <Section className="pt-28">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="chip">{product.tag}</span>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => openLead(product.name)} className="btn-primary">
                Request Quote
              </button>
              <a href="#specs" className="btn-ghost">
                <FileText className="h-4 w-4" /> Technical datasheet
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {meta.map((m) => (
                <div key={m.t} className="glass rounded-2xl p-4">
                  <m.icon className="h-5 w-5 text-brand" />
                  <div className="mt-2 text-xs text-muted-foreground">{m.t}</div>
                  <div className="text-sm font-medium">{m.v}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div id="specs" className="glass-strong rounded-3xl p-6">
              <h2 className="font-display text-lg font-semibold">Technical specifications</h2>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {product.specs.map((s: { label: string; value: string }) => (
                    <tr key={s.label} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4 text-muted-foreground">{s.label}</td>
                      <td className="py-3 text-right font-medium">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>

        <div className="glass-strong mt-12 rounded-3xl p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Need a sample of {product.name}?</h2>
          <p className="mt-3 text-muted-foreground">
            Our technical team will validate the grade for your application.
          </p>
          <button onClick={() => openLead(product.name)} className="btn-primary mt-6">
            Request a sample
          </button>
        </div>
      </Section>
    </div>
  );
}
