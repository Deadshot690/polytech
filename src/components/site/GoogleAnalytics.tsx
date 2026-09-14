import { useEffect } from "react";
import { GOOGLE_ANALYTICS_ID } from "@/lib/site-config";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer.push(args);
      });

    if (!document.getElementById("google-analytics-script")) {
      const script = document.createElement("script");
      script.id = "google-analytics-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", GOOGLE_ANALYTICS_ID, { send_page_view: false });
    }

    const trackPageView = () => {
      window.gtag("event", "page_view", {
        page_path: `${window.location.pathname}${window.location.search}`,
        page_title: document.title,
      });
    };

    trackPageView();
    window.addEventListener("popstate", trackPageView);

    return () => window.removeEventListener("popstate", trackPageView);
  }, []);

  if (!GOOGLE_ANALYTICS_ID) return null;
  return null;
}
