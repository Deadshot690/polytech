import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { GOOGLE_ANALYTICS_ID } from "@/lib/site-config";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const location = useRouterState({
    select: (state) => state.location,
  });

  useEffect(() => {
    if (!GOOGLE_ANALYTICS_ID || typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  if (!GOOGLE_ANALYTICS_ID) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', '${GOOGLE_ANALYTICS_ID}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}
