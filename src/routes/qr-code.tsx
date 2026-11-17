import { createFileRoute } from "@tanstack/react-router";
import { useQrAppConfig } from "@/lib/qr-config";
import { DigitalBusinessCard } from "@/components/qr/DigitalBusinessCard";
import { ExhibitionRegistrationForm } from "@/components/qr/ExhibitionRegistrationForm";
import { ShieldCheck, Award, QrCode } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/qr-code")({
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Digital Business Card & Exhibition Registration — Qlumix" },
      {
        name: "description",
        content:
          "Official Qlumix digital business card and exhibition visitor registration. Download vCard or connect directly with our technical polymer team.",
      },
      {
        property: "og:title",
        content: "Digital Business Card & Exhibition Registration — Qlumix",
      },
      {
        property: "og:description",
        content:
          "Connect with Qlumix at the exhibition. Save verified contact coordinates or register for technical datasheets and polymer samples.",
      },
    ],
  }),
  component: QRCodePage,
});

function QRCodePage() {
  const search = Route.useSearch();
  const { profile, formSettings, placements, addLead } = useQrAppConfig();

  const matchedPlacement = search.code
    ? placements.find((p) => p.code.toLowerCase() === search.code?.toLowerCase())
    : undefined;

  const isFormActive = formSettings.formEnabled;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-card/30 to-background pb-20 pt-6 md:pt-10">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subtle Top Trust Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {profile.companyName} • {matchedPlacement ? matchedPlacement.name : "Digital Portal"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Verified Digital Card
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-500" />
              ISO 9001:2015 & RoHS Compliant
            </span>
          </div>
        </div>

        {/* Dynamic Responsive Layout */}
        {isFormActive ? (
          /* Desktop / Tablet: Balanced Two-Column Layout */
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 xl:gap-12">
            {/* Left Column: Digital Business Card (Sticky on desktop) */}
            <div className="w-full lg:sticky lg:top-24 lg:col-span-5 xl:col-span-5">
              <DigitalBusinessCard
                profile={profile}
                isExpanded={false}
                qrPlacementId={matchedPlacement?.id}
              />
            </div>

            {/* Right Column: Exhibition Registration Form */}
            <div className="w-full lg:col-span-7 xl:col-span-7">
              <ExhibitionRegistrationForm
                settings={formSettings}
                onSubmitSuccess={addLead}
                qrPlacementId={matchedPlacement?.id}
              />
            </div>
          </div>
        ) : (
          /* Inactive Form: Registration form hidden completely, Business Card expanded and centered */
          <div className="mx-auto flex flex-col items-center justify-center pt-2">
            <div className="mb-6 text-center max-w-md">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Digital Business Card
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Official contact profile for {profile.contactPerson} at {profile.companyName}
              </p>
            </div>

            <DigitalBusinessCard
              profile={profile}
              isExpanded={true}
              qrPlacementId={matchedPlacement?.id}
            />
          </div>
        )}

        {/* Bottom subtle discreet link for company staff */}
        <div className="mt-16 text-center text-xs text-muted-foreground/60">
          <Link
            to="/admin/qr-code"
            className="inline-flex items-center gap-1 hover:text-muted-foreground transition-colors"
          >
            <QrCode className="h-3 w-3" />
            <span>Staff / Booth Admin Access</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
