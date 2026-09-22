import { useState, useEffect } from "react";

const envSiteUrl =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SITE_URL : undefined;
const configuredSiteUrl = envSiteUrl ?? "https://kohinoorpolytech.com";

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");
export const GOOGLE_ANALYTICS_ID =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_GA_MEASUREMENT_ID
    : undefined;

export interface SiteInfo {
  name: string;
  domain: string;
}

export const DOMAIN_TO_BRAND: Record<string, string> = {
  // CPR Polytech LLP
  "cprpolytechllp.com": "CPR Polytech LLP",
  "cprpolytechllp.in": "CPR Polytech LLP",

  // Kohinoor Polytech
  "kohinoorpolytech.com": "Kohinoor Polytech",
  "kohinoorpolytech.in": "Kohinoor Polytech",

  // Qlumix
  "qlumix.com": "Qlumix",
  "qlumix.in": "Qlumix",
};

export const DEFAULT_SITE_NAME = "Kohinoor Polytech";
export const DEFAULT_DOMAIN = "kohinoorpolytech.com";

/**
 * Normalizes a hostname by converting to lowercase, stripping port, and removing 'www.' prefix.
 */
export function normalizeHostname(hostname: string): string {
  if (!hostname) return "";
  return hostname
    .toLowerCase()
    .trim()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

/**
 * Safely retrieves the browser hostname or empty string if running in non-browser context.
 */
export function getHostname(): string {
  if (typeof window !== "undefined" && window.location) {
    return window.location.hostname;
  }
  return "";
}

/**
 * Resolves the site name based on hostname, falling back to default site name.
 */
export function getCurrentSiteName(hostname?: string): string {
  const host = hostname ?? getHostname();
  const normalized = normalizeHostname(host);
  return DOMAIN_TO_BRAND[normalized] ?? DEFAULT_SITE_NAME;
}

/**
 * Resolves the site info (name and domain) based on hostname.
 */
export function getCurrentSite(hostname?: string): SiteInfo {
  const host = hostname ?? getHostname();
  const normalized = normalizeHostname(host);
  const name = DOMAIN_TO_BRAND[normalized] ?? DEFAULT_SITE_NAME;
  const domain = DOMAIN_TO_BRAND[normalized] ? normalized : DEFAULT_DOMAIN;
  return { name, domain };
}

/**
 * React hook to access the current dynamic site name.
 */
export function useCurrentSiteName(): string {
  const [siteName, setSiteName] = useState<string>(() => getCurrentSiteName());

  useEffect(() => {
    setSiteName(getCurrentSiteName());
  }, []);

  return siteName;
}

/**
 * React hook to access current dynamic site info (name and domain).
 */
export function useCurrentSite(): SiteInfo {
  const [site, setSite] = useState<SiteInfo>(() => getCurrentSite());

  useEffect(() => {
    setSite(getCurrentSite());
  }, []);

  return site;
}
