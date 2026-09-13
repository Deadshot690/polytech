import { Link } from "@tanstack/react-router";
import { Linkedin, Twitter, Youtube, Instagram } from "lucide-react";
import { toast } from "sonner";
import logo from "/Assets/logo_transparent_blue.png";
import { CONTACT, whatsappUrl, mapUrl } from "@/data/site";

const social = [
  { icon: Linkedin, label: "LinkedIn", href: CONTACT.linkedin },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Kohinoor Polytech" width={36} height={36} loading="lazy" className="h-9 w-9" />
            <span className="font-display text-lg font-bold">Kohinoor Polytech</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Premium PPHP, PPCP and custom polypropylene compounds engineered from recycled polymers for global
            industrial manufacturing.
          </p>
          <form
            className="mt-5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Subscribed to updates");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="btn-primary shrink-0 px-4 py-2 text-sm">Join</button>
          </form>
          <div className="mt-5 flex gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href !== "#" ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={s.label}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link to="/sustainability" className="hover:text-foreground">Sustainability</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Products</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground">Catalogue</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Request a quote</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">{CONTACT.email}</a></li>
            <li>
              <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-foreground">{CONTACT.phone}</a> /{" "}
              <a href={`tel:${CONTACT.phoneRaw2}`} className="hover:text-foreground">{CONTACT.phone2}</a>
            </li>
            <li><a href={mapUrl()} target="_blank" rel="noreferrer" className="hover:text-foreground">{CONTACT.address}</a></li>
            <li><a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn Company Profile</a></li>
            <li><a href={whatsappUrl()} target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp us</a></li>
          </ul>
        </div>
      </div>

      <div className="hairline">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} Kohinoor Polytech. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {["ISO 9001:2015", "RoHS Compliant", "REACH Registered", "Privacy", "Terms"].map((t) => (
              <a key={t} href="#" className="hover:text-foreground">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
