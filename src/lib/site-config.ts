const configuredSiteUrl = import.meta.env.VITE_SITE_URL ?? "https://kohinoorpolytech.com";

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");
export const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
