import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQrAppConfig } from "@/lib/qr-config";
import { trackEvent } from "@/lib/qr-tracker";
import { Loader2, QrCode } from "lucide-react";

export const Route = createFileRoute("/r/$code")({
  head: () => ({
    meta: [
      { title: "Redirecting — Qlumix Connect" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RedirectQRRoute,
});

function RedirectQRRoute() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const { placements } = useQrAppConfig();

  useEffect(() => {
    const matchedPlacement = placements.find(
      (p) => p.code.toLowerCase() === (code || "").toLowerCase(),
    );

    trackEvent("qr_scan", {
      qrCode: code,
      qrPlacementId: matchedPlacement?.id,
      metadata: {
        placementName: matchedPlacement?.name || "Unknown Placement",
        referrer: typeof document !== "undefined" ? document.referrer : "",
      },
    });

    const target = matchedPlacement?.destinationUrl || "/qr-code";

    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const isLocalDev =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.includes("192.168.");

        if (target.startsWith("http://") || target.startsWith("https://")) {
          try {
            const parsed = new URL(target);
            // In local development or if domain matches origin, navigate locally so un-deployed
            // production domain (qlumix.com) doesn't throw a 404
            if (isLocalDev || parsed.origin === window.location.origin) {
              const localPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
              navigate({ to: localPath || "/business-card" });
              return;
            } else {
              window.location.href = target;
              return;
            }
          } catch {
            navigate({ to: "/business-card" });
            return;
          }
        } else {
          navigate({ to: target });
        }
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [code, navigate, placements]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse">
        <QrCode className="h-8 w-8" />
      </div>
      <h2 className="mt-4 font-display text-lg font-bold text-foreground">
        Connecting with Qlumix...
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Verifying exhibition placement code <code className="font-mono text-primary">{code}</code>
      </p>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading destination...</span>
      </div>
    </div>
  );
}
