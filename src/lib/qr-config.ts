import { useState, useEffect, useCallback } from "react";

export type QRPlacementType =
  | "Tabletop"
  | "Stall Backdrop"
  | "Sample Bag"
  | "Brochure"
  | "Executive Lanyard"
  | "General";

export interface QRPlacement {
  id: string;
  code: string;
  name: string;
  description: string;
  type: QRPlacementType;
  destinationUrl: string; // The URL the QR code resolves to
  active: boolean;
  createdAt: string;
}

export interface BusinessProfile {
  companyName: string;
  tagline: string;
  description: string;
  contactPerson: string;
  designation: string;
  phone: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  website: string;
  destinationQrUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  avatar: string;
  logo: string;
}

export type FieldRequirement = "required" | "optional" | "disabled";

export interface FormFieldsConfig {
  fullName: FieldRequirement;
  companyName: FieldRequirement;
  mobileNumber: FieldRequirement;
  emailAddress: FieldRequirement;
  country: FieldRequirement;
  interestedProducts: FieldRequirement;
  message: FieldRequirement;
}

export interface ProductOption {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ExhibitionFormSettings {
  formEnabled: boolean;
  formHeading: string;
  formDescription: string;
  submitButtonLabel: string;
  successMessage: string;
  fieldsConfig: FormFieldsConfig;
  allowedProducts: ProductOption[];
}

export interface ExhibitionLead {
  id: string;
  fullName: string;
  companyName: string;
  mobileNumber: string;
  emailAddress: string;
  country: string;
  interestedProducts: string[];
  message: string;
  qrPlacementId?: string;
  createdAt: string;
}

export const DEFAULT_PROFILE: BusinessProfile = {
  companyName: "Qlumix",
  tagline: "Sustainable Polymer Engineering & Customized PP Compounds",
  description:
    "Engineered sustainable polymer granules & customized polypropylene compounds for global industrial, automotive, and rigid packaging manufacturing.",
  contactPerson: "Mohsin Memon",
  designation: "Founder & CEO",
  phone: "+91 9033118051",
  phoneSecondary: "+91 8675278692",
  whatsapp: "+91 9033118051",
  email: "info@qlumix.com",
  website: "https://qlumix.com/",
  destinationQrUrl: "https://qlumix.com/business-card",
  address: "Plot No. 111-114, Tasnim Nagar, Unn Industrial Estate, Sachin Naka",
  city: "Surat",
  state: "Gujarat",
  country: "India",
  postalCode: "394210",
  linkedin: "https://www.linkedin.com/company/pcrpolymersllp/",
  instagram: "https://www.instagram.com/qlumix_polymers",
  facebook: "https://www.facebook.com/qlumixpolymers",
  avatar: "/Assets/leaders/mohsin-memon.png",
  logo: "/Assets/logo_transparent_blue.png",
};

export const DEFAULT_FORM_SETTINGS: ExhibitionFormSettings = {
  formEnabled: true,
  formHeading: "Let's Connect at the Exhibition",
  formDescription: "Share your details and our team will get in touch with you.",
  submitButtonLabel: "Submit Registration",
  successMessage: "Thank you! Your details have been submitted successfully.",
  fieldsConfig: {
    fullName: "required",
    companyName: "required",
    mobileNumber: "required",
    emailAddress: "required",
    country: "required",
    interestedProducts: "required",
    message: "optional",
  },
  allowedProducts: [
    { id: "prod-1", name: "PCR PPHP (Homopolymer)", enabled: true },
    { id: "prod-2", name: "PCR PPCP (Copolymer)", enabled: true },
    { id: "prod-3", name: "Customized Compounds", enabled: true },
    { id: "prod-4", name: "PCR HDPE Granules", enabled: true },
    { id: "prod-5", name: "Masterbatch & Color Solutions", enabled: true },
  ],
};

export const INITIAL_QR_PLACEMENTS: QRPlacement[] = [
  {
    id: "qr-pv-tabletop",
    code: "pv26-table",
    name: "Main Reception Tabletop Stand",
    description: "Front reception desk acrylic standee in Hall 3, Booth A-42",
    type: "Tabletop",
    destinationUrl: "https://qlumix.com/business-card",
    active: true,
    createdAt: "2026-01-14T08:00:00.000Z",
  },
  {
    id: "qr-pv-backdrop",
    code: "pv26-wall",
    name: "Main Booth LED Wall & Backdrop",
    description: "Large format high-res scan banner on primary booth wall",
    type: "Stall Backdrop",
    destinationUrl: "https://qlumix.com/qr-code",
    active: true,
    createdAt: "2026-01-14T08:30:00.000Z",
  },
  {
    id: "qr-pv-bags",
    code: "pv26-bag",
    name: "Polymer Sample Bag Tag",
    description: "Printed QR label attached to 500g trial granule pouches",
    type: "Sample Bag",
    destinationUrl: "https://qlumix.com/business-card",
    active: true,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "qr-pv-brochure",
    code: "pv26-brochure",
    name: "Technical Catalog Backcover",
    description: "Offset printed on Technical Datasheet 2026 booklet",
    type: "Brochure",
    destinationUrl: "https://qlumix.com/qr-code",
    active: true,
    createdAt: "2026-01-15T09:30:00.000Z",
  },
  {
    id: "qr-exec-lanyard",
    code: "exec-card",
    name: "Executive Badge Lanyard",
    description: "Compact QR on Founder & CEO lanyard badge",
    type: "Executive Lanyard",
    destinationUrl: "https://qlumix.com/business-card",
    active: true,
    createdAt: "2026-01-16T10:00:00.000Z",
  },
];

const STORAGE_KEYS = {
  PROFILE: "qlumix_qr_profile",
  FORM_SETTINGS: "qlumix_qr_form_settings",
  PLACEMENTS: "qlumix_qr_placements",
  LEADS: "qlumix_qr_leads",
};

export const SYNC_EVENT = "qlumix_qr_sync";

function safeGetStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }));
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }
}

/**
 * Unified reactive state hook for the 3 main SaaS modules:
 * 1. Business Profile
 * 2. QR Placements
 * 3. Exhibition Form Settings
 */
export function useQrAppConfig() {
  const [profile, setProfileState] = useState<BusinessProfile>(() =>
    safeGetStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
  );
  const [formSettings, setFormSettingsState] = useState<ExhibitionFormSettings>(() =>
    safeGetStorage(STORAGE_KEYS.FORM_SETTINGS, DEFAULT_FORM_SETTINGS),
  );
  const [placements, setPlacementsState] = useState<QRPlacement[]>(() =>
    safeGetStorage(STORAGE_KEYS.PLACEMENTS, INITIAL_QR_PLACEMENTS),
  );
  const [leads, setLeadsState] = useState<ExhibitionLead[]>(() =>
    safeGetStorage(STORAGE_KEYS.LEADS, []),
  );

  const reload = useCallback(() => {
    setProfileState(safeGetStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
    setFormSettingsState(safeGetStorage(STORAGE_KEYS.FORM_SETTINGS, DEFAULT_FORM_SETTINGS));
    setPlacementsState(safeGetStorage(STORAGE_KEYS.PLACEMENTS, INITIAL_QR_PLACEMENTS));
    setLeadsState(safeGetStorage(STORAGE_KEYS.LEADS, []));
  }, []);

  useEffect(() => {
    reload();

    const handleSync = () => reload();
    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [reload]);

  const updateProfile = useCallback((patch: Partial<BusinessProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      safeSetStorage(STORAGE_KEYS.PROFILE, next);
      return next;
    });
  }, []);

  const updateFormSettings = useCallback((patch: Partial<ExhibitionFormSettings>) => {
    setFormSettingsState((prev) => {
      const next = { ...prev, ...patch };
      safeSetStorage(STORAGE_KEYS.FORM_SETTINGS, next);
      return next;
    });
  }, []);

  const savePlacement = useCallback((placement: QRPlacement) => {
    setPlacementsState((prev) => {
      const idx = prev.findIndex((p) => p.id === placement.id);
      let next: QRPlacement[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = placement;
      } else {
        next = [placement, ...prev];
      }
      safeSetStorage(STORAGE_KEYS.PLACEMENTS, next);
      return next;
    });
  }, []);

  const updatePlacement = useCallback((id: string, patch: Partial<QRPlacement>) => {
    setPlacementsState((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      safeSetStorage(STORAGE_KEYS.PLACEMENTS, next);
      return next;
    });
  }, []);

  const togglePlacementActive = useCallback((placementId: string) => {
    setPlacementsState((prev) => {
      const next = prev.map((p) => (p.id === placementId ? { ...p, active: !p.active } : p));
      safeSetStorage(STORAGE_KEYS.PLACEMENTS, next);
      return next;
    });
  }, []);

  const deletePlacement = useCallback((placementId: string) => {
    setPlacementsState((prev) => {
      const next = prev.filter((p) => p.id !== placementId);
      safeSetStorage(STORAGE_KEYS.PLACEMENTS, next);
      return next;
    });
  }, []);

  const addLead = useCallback(
    (leadData: Omit<ExhibitionLead, "id" | "createdAt">): { success: boolean; lead: ExhibitionLead } => {
      const newLead: ExhibitionLead = {
        ...leadData,
        id: `LEAD-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      setLeadsState((prev) => {
        const next = [newLead, ...prev];
        safeSetStorage(STORAGE_KEYS.LEADS, next);
        return next;
      });
      return { success: true, lead: newLead };
    },
    [],
  );

  const resetAllToDefaults = useCallback(() => {
    safeSetStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    safeSetStorage(STORAGE_KEYS.FORM_SETTINGS, DEFAULT_FORM_SETTINGS);
    safeSetStorage(STORAGE_KEYS.PLACEMENTS, INITIAL_QR_PLACEMENTS);
    safeSetStorage(STORAGE_KEYS.LEADS, []);
    reload();
  }, [reload]);

  return {
    profile,
    formSettings,
    placements,
    leads,
    updateProfile,
    updateFormSettings,
    savePlacement,
    updatePlacement,
    togglePlacementActive,
    deletePlacement,
    addLead,
    resetAllToDefaults,
  };
}

/**
 * Generates and downloads RFC 6350 / 2426 compliant .vcf vCard file.
 */
export function downloadVCard(profile: BusinessProfile = DEFAULT_PROFILE) {
  const cleanPhone = profile.phone.replace(/[^\d+]/g, "");
  const cleanPhoneSec = profile.phoneSecondary ? profile.phoneSecondary.replace(/[^\d+]/g, "") : "";

  const fullStreet = profile.address.replace(/,/g, "\\,");
  const city = (profile.city || "").replace(/,/g, "\\,");
  const state = (profile.state || "").replace(/,/g, "\\,");
  const postalCode = (profile.postalCode || "").replace(/,/g, "\\,");
  const country = (profile.country || "").replace(/,/g, "\\,");

  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.contactPerson}`,
    `N:Memon;Mohsin;;;`,
    `ORG:${profile.companyName}`,
    `TITLE:${profile.designation}`,
    `TEL;TYPE=WORK,VOICE:${cleanPhone}`,
    cleanPhoneSec ? `TEL;TYPE=CELL,VOICE:${cleanPhoneSec}` : "",
    `EMAIL;TYPE=WORK:${profile.email}`,
    `URL:${profile.website}`,
    `ADR;TYPE=WORK:;;${fullStreet};${city};${state};${postalCode};${country}`,
    `NOTE:${profile.tagline}`,
    profile.linkedin ? `X-SOCIALPROFILE;type=linkedin:${profile.linkedin}` : "",
    profile.instagram ? `X-SOCIALPROFILE;type=instagram:${profile.instagram}` : "",
    profile.facebook ? `X-SOCIALPROFILE;type=facebook:${profile.facebook}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([vcardLines], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute(
    "download",
    `${profile.contactPerson.replace(/\s+/g, "_")}_${profile.companyName}.vcf`,
  );
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
