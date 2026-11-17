import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
  Share2,
  Download,
  Building2,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BusinessProfile, downloadVCard } from "@/lib/qr-config";

interface DigitalBusinessCardProps {
  profile: BusinessProfile;
  isExpanded?: boolean;
}

export function DigitalBusinessCard({ profile, isExpanded = false }: DigitalBusinessCardProps) {
  const [sharing, setSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cleanPhone = (profile.phone || "").replace(/[^\d+]/g, "");
  const cleanPhoneRaw = cleanPhone.replace(/\+/g, "");

  const fullAddress = [
    profile.address,
    profile.city,
    profile.state,
    profile.postalCode,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  const handleSaveContact = () => {
    downloadVCard(profile);
    toast.success("Contact file (.vcf) downloaded!", {
      description: `Added ${profile.contactPerson} (${profile.companyName}) to your downloads.`,
    });
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : profile.website;
    const shareData = {
      title: `${profile.companyName} — ${profile.contactPerson}`,
      text: `${profile.contactPerson} | ${profile.designation} at ${profile.companyName} (${profile.tagline})`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        setSharing(true);
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        // Dismissed
      } finally {
        setSharing(false);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        toast.success("Card link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      subvalue: profile.phoneSecondary ? `Alt: ${profile.phoneSecondary}` : null,
      href: `tel:${cleanPhone}`,
      actionText: "Call",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: profile.whatsapp,
      href: `https://wa.me/${cleanPhoneRaw}?text=${encodeURIComponent(
        `Hello ${profile.contactPerson}, I would like to inquire about ${profile.companyName} polymer products.`,
      )}`,
      actionText: "Chat",
      highlight: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      actionText: "Email",
    },
    {
      icon: Globe,
      label: "Website",
      value: (profile.website || "").replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: profile.website,
      actionText: "Visit",
    },
    {
      icon: MapPin,
      label: "Plant & Headquarters",
      value: fullAddress || profile.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress || profile.address)}`,
      actionText: "Map",
    },
  ];

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: profile.linkedin },
    { icon: Instagram, label: "Instagram", href: profile.instagram },
    { icon: Facebook, label: "Facebook", href: profile.facebook },
  ].filter((s) => Boolean(s.href));

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative w-full ${isExpanded ? "max-w-2xl mx-auto" : "max-w-full"}`}
    >
      {/* Decorative ambient backdrop */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-indigo-600/20 blur-xl opacity-75 pointer-events-none" />

      {/* Main Business Card Surface */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 pt-7 pb-6 text-white border-b border-white/10">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-inner">
                <img
                  src={profile.logo || "/Assets/logo_transparent_blue.png"}
                  alt={profile.companyName}
                  className="h-full w-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                    {profile.companyName}
                  </h2>
                  <span className="chip bg-blue-500/20 text-blue-200 border-blue-400/30 text-[10px] py-0.5 px-2">
                    Official
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 font-medium">{profile.tagline}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              disabled={sharing}
              aria-label="Share contact card"
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors border border-white/10"
              title="Share Card"
            >
              {copiedLink ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Contact Person Highlight */}
          <div className="mt-6 flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="relative">
              <img
                src={profile.avatar || "/Assets/leaders/mohsin-memon.png"}
                alt={profile.contactPerson}
                className="h-16 w-16 rounded-2xl object-cover object-top border-2 border-white/30 shadow-md bg-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                {profile.contactPerson}
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div className="text-sm font-medium text-cyan-300">{profile.designation}</div>
              <div className="mt-0.5 text-xs text-white/60">
                Polymer Granules & Custom Compounds Desk
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Company Narrative */}
          <p className="text-sm leading-relaxed text-muted-foreground border-b border-border/60 pb-4">
            {profile.description}
          </p>

          {/* Primary Action Button: Save Contact */}
          <div className="mt-5">
            <Button
              onClick={handleSaveContact}
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all btn-primary"
            >
              <Download className="mr-2 h-5 w-5" />
              Save Contact to Phone
            </Button>
            <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
              Downloads a verified .vcf card directly compatible with iOS & Android
            </p>
          </div>

          {/* Quick Action Grid */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <a
              href={`tel:${cleanPhone}`}
              className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-secondary/50 p-3 text-center transition-all hover:bg-secondary hover:border-primary/40 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Phone className="h-4 w-4" />
              </div>
              <span className="mt-2 text-xs font-semibold text-foreground">Call Now</span>
              <span className="text-[10px] text-muted-foreground">Direct Line</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhoneRaw}?text=${encodeURIComponent(
                `Hello ${profile.contactPerson}, I would like to inquire about ${profile.companyName} products.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-center transition-all hover:bg-emerald-500/10 hover:border-emerald-500/50 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="mt-2 text-xs font-semibold text-foreground">WhatsApp</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Instant Chat
              </span>
            </a>

            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-secondary/50 p-3 text-center transition-all hover:bg-secondary hover:border-primary/40 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Globe className="h-4 w-4" />
              </div>
              <span className="mt-2 text-xs font-semibold text-foreground">Website</span>
              <span className="text-[10px] text-muted-foreground">Browse Catalog</span>
            </a>

            <button
              onClick={handleShare}
              type="button"
              className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-secondary/50 p-3 text-center transition-all hover:bg-secondary hover:border-primary/40 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Share2 className="h-4 w-4" />
              </div>
              <span className="mt-2 text-xs font-semibold text-foreground">
                {copiedLink ? "Copied!" : "Share"}
              </span>
              <span className="text-[10px] text-muted-foreground">Send Card</span>
            </button>
          </div>

          {/* Detailed Contact List */}
          <div className="mt-6 space-y-2.5">
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Direct Contact Details
            </div>

            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 p-3 transition-colors hover:bg-secondary/70 group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate">
                      {item.value}
                    </div>
                    {item.subvalue && (
                      <div className="text-[11px] text-muted-foreground">{item.subvalue}</div>
                    )}
                  </div>
                </div>

                <span className="shrink-0 flex items-center text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.actionText}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </span>
              </a>
            ))}
          </div>

          {/* Social Links Row */}
          {socialLinks.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                Connect on Social
              </div>
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
                  >
                    <s.icon className="h-3.5 w-3.5 text-primary" />
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quality Assurance Footer */}
          <div className="mt-6 rounded-xl bg-muted/40 p-3 text-center border border-border/40">
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>Certified Polymer Compounding Plant • Surat, India</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
