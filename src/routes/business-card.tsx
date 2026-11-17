import { createFileRoute } from "@tanstack/react-router";
import { useQrAppConfig } from "@/lib/qr-config";
import { DigitalBusinessCard } from "@/components/qr/DigitalBusinessCard";
import { ShieldCheck, Award } from "lucide-react";

export const Route = createFileRoute("/business-card")({
  head: () => ({
    meta: [
      { title: "Digital Business Card — Qlumix" },
      {
        name: "description",
        content:
          "Official Qlumix digital contact card for Mohsin Memon. Save contact coordinates directly to your smartphone.",
      },
      { property: "og:title", content: "Digital Business Card — Qlumix" },
      {
        property: "og:description",
        content:
          "Official Qlumix digital contact card. Download verified vCard or connect via WhatsApp and direct call.",
      },
    ],
  }),
  component: BusinessCardOnlyPage,
});

function BusinessCardOnlyPage() {
  const { profile } = useQrAppConfig();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-card/30 to-background pb-20 pt-8">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-40 right-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              {profile.companyName} Digital Card
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Verified Card
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-500" />
              Direct Connect
            </span>
          </div>
        </div>

        <DigitalBusinessCard profile={profile} isExpanded={true} />
      </div>
    </div>
  );
}
