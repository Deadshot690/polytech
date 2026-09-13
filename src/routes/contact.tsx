import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/Section";
import { CONTACT, whatsappUrl, mapUrl } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PCR Polymers LLP" },
      {
        name: "description",
        content:
          "Reach out to PCR Polymers LLP for pricing, bulk orders, technical datasheets, and sample testing.",
      },
      { property: "og:title", content: "Contact — PCR Polymers LLP" },
      {
        property: "og:description",
        content: "Contact our sales desk for quotes, samples and custom compounds.",
      },
    ],
  }),
  component: Contact,
});

const topics = ["Sales Inquiry", "Sample Request", "Custom Compound", "Green Partnerships"];

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(5, "Tell us a little more"),
});

const Orb = ({ className, delay }: { className: string; delay: number }) => (
  <motion.div
    className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

function Contact() {
  const [topic, setTopic] = useState(topics[0]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      const leads = JSON.parse(localStorage.getItem("kp_leads") || "[]");
      leads.push({ ...form, topic, at: new Date().toISOString() });
      localStorage.setItem("kp_leads", JSON.stringify(leads));
    } catch {
      /* local-only fallback */
    }
    const msg = `New ${topic} from ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone || "-"}%0ACompany: ${form.company || "-"}%0AMessage: ${form.message}`;
    window.open(whatsappUrl(msg), "_blank");
    setSent(true);
  };

  const details = [
    { icon: Mail, t: "Email", v: CONTACT.email, href: `mailto:${CONTACT.email}` },
    {
      icon: Phone,
      t: "Phone",
      v: `${CONTACT.phone} / ${CONTACT.phone2}`,
      href: `tel:${CONTACT.phoneRaw}`,
    },
    { icon: MessageCircle, t: "WhatsApp", v: "Chat with sales", href: whatsappUrl() },
    { icon: Linkedin, t: "LinkedIn", v: "PCR Polymers LLP", href: CONTACT.linkedin },
    { icon: MapPin, t: "Address", v: CONTACT.address, href: mapUrl() },
  ];

  return (
    <div className="relative overflow-hidden">
      <Orb className="left-[-6rem] top-24 h-80 w-80 bg-brand/25" delay={0} />
      <Orb className="right-[-6rem] top-96 h-80 w-80 bg-brand-green/20" delay={2} />

      <Section className="relative pt-28">
        <div className="max-w-3xl">
          <span className="chip mb-5">Contact</span>
          <h1 className="text-4xl font-bold md:text-6xl">Let's build together.</h1>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="glass-strong rounded-3xl p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <CheckCircle2 className="h-14 w-14 text-brand-green" />
                <h2 className="mt-4 text-2xl font-bold">Message Sent Successfully!</h2>
                <p className="mt-3 max-w-sm text-muted-foreground">
                  Thank you for contacting us. We have opened WhatsApp to connect you directly with
                  our sales desk.
                </p>
              </motion.div>
            ) : (
              <>
                <h2 className="font-display text-xl font-semibold">Send a Message</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a category and fill in your project details.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      type="button"
                      className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${topic === t ? "btn-primary" : "btn-ghost"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <form onSubmit={submit} className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cn">Name</Label>
                    <Input
                      id="cn"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="ce">Email</Label>
                      <Input
                        id="ce"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@company.com"
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cp">Phone</Label>
                      <Input
                        id="cp"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 ..."
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cc">Company</Label>
                    <Input
                      id="cc"
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="Company"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cm">Message</Label>
                    <Textarea
                      id="cm"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell us about your requirement..."
                      rows={4}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn-primary mt-2">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <div className="font-display text-lg font-semibold">Head Office & Plant</div>
              <p className="mt-2 text-sm text-muted-foreground">{CONTACT.address}</p>
            </div>
            {details.map((d) => (
              <a
                key={d.t}
                href={d.href}
                target="_blank"
                rel="noreferrer"
                className="glass card-lift flex items-start gap-4 rounded-2xl p-5"
              >
                <d.icon className="mt-0.5 h-6 w-6 text-brand" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{d.t}</div>
                  <div className="text-sm font-medium">{d.v}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
