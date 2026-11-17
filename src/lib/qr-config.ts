import { useState, useEffect, useCallback } from "react";
import { generateQRMatrix } from "@/lib/qr-generator";

export type QRPlacementType =
  "Tabletop" | "Stall Backdrop" | "Sample Bag" | "Brochure" | "Executive Lanyard" | "General";

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
  googleSheetsWebhookUrl?: string;
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
  destinationQrUrl: "https://qlumix.com/business-profile",
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
    destinationUrl: "https://qlumix.com/business-profile",
    active: true,
    createdAt: "2026-01-14T08:00:00.000Z",
  },
  {
    id: "qr-pv-backdrop",
    code: "pv26-wall",
    name: "Main Booth LED Wall & Backdrop",
    description: "Large format high-res scan banner on primary booth wall",
    type: "Stall Backdrop",
    destinationUrl: "https://qlumix.com/business-profile",
    active: true,
    createdAt: "2026-01-14T08:30:00.000Z",
  },
  {
    id: "qr-pv-bags",
    code: "pv26-bag",
    name: "Polymer Sample Bag Tag",
    description: "Printed QR label attached to 500g trial granule pouches",
    type: "Sample Bag",
    destinationUrl: "https://qlumix.com/business-profile",
    active: true,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "qr-pv-brochure",
    code: "pv26-brochure",
    name: "Technical Catalog Backcover",
    description: "Offset printed on Technical Datasheet 2026 booklet",
    type: "Brochure",
    destinationUrl: "https://qlumix.com/business-profile",
    active: true,
    createdAt: "2026-01-15T09:30:00.000Z",
  },
  {
    id: "qr-exec-lanyard",
    code: "exec-card",
    name: "Executive Badge Lanyard",
    description: "Compact QR on Founder & CEO lanyard badge",
    type: "Executive Lanyard",
    destinationUrl: "https://qlumix.com/business-profile",
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
    (
      leadData: Omit<ExhibitionLead, "id" | "createdAt">,
    ): { success: boolean; lead: ExhibitionLead } => {
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

/**
 * Generates and triggers high-definition printable PDF Business Card document.
 */
export function downloadBusinessCardPDF(profile: BusinessProfile = DEFAULT_PROFILE) {
  if (typeof window === "undefined") return;

  const origin = window.location.origin || "https://qlumix.com";
  const qrTarget = profile.destinationQrUrl || `${origin}/business-profile`;

  let qrSvgString = "";
  try {
    const matrix = generateQRMatrix(qrTarget);
    const margin = 3;
    const totalModules = matrix.length + margin * 2;
    qrSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalModules} ${totalModules}" width="150" height="150" shape-rendering="crispEdges">
      <rect width="${totalModules}" height="${totalModules}" fill="#ffffff" />
      ${matrix
        .map((row, r) =>
          row
            .map((cell, c) =>
              cell
                ? `<rect x="${c + margin}" y="${r + margin}" width="1" height="1" fill="#0c1524" />`
                : "",
            )
            .join(""),
        )
        .join("")}
    </svg>`;
  } catch {
    qrSvgString = "";
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups in your browser to view and save the PDF business card.");
    return;
  }

  const avatarSrc = profile.avatar?.startsWith("http")
    ? profile.avatar
    : `${origin}${profile.avatar || "/Assets/leaders/mohsin-memon.png"}`;

  const logoSrc = profile.logo?.startsWith("http")
    ? profile.logo
    : `${origin}${profile.logo || "/Assets/logo_transparent_blue.png"}`;

  const fullAddress = [
    profile.address,
    profile.city,
    profile.state,
    profile.postalCode,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${profile.contactPerson} - ${profile.companyName} Business Card</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;
      min-height: 100vh;
    }
    .toolbar {
      width: 100%;
      max-width: 820px;
      background: #0f172a;
      color: #fff;
      padding: 14px 20px;
      border-radius: 14px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .toolbar-info {
      font-size: 13px;
      line-height: 1.4;
    }
    .toolbar-info strong {
      color: #38bdf8;
      display: block;
      font-size: 14px;
    }
    .btn-pdf {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
      white-space: nowrap;
    }
    .btn-pdf:hover { background: #0369a1; }
    
    .card-sheet {
      width: 100%;
      max-width: 820px;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-header-bar {
      background: linear-gradient(135deg, #091322 0%, #0f2444 100%);
      color: #ffffff;
      padding: 24px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #0284c7;
    }
    .brand-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      height: 48px;
      width: auto;
      object-fit: contain;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-tagline {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .badge-iso {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-body {
      padding: 30px;
      display: grid;
      grid-template-columns: 1fr 200px;
      gap: 30px;
      align-items: center;
    }

    .executive-info {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 20px;
      padding-bottom: 18px;
      border-bottom: 1px solid #e2e8f0;
    }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      object-fit: cover;
      object-position: top;
      border: 2px solid #0284c7;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .name-title h2 {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }
    .name-title p {
      font-size: 13px;
      font-weight: 600;
      color: #0284c7;
      margin-top: 2px;
    }

    .coords-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 20px;
      font-size: 12px;
    }
    .coord-item {
      display: flex;
      flex-direction: column;
    }
    .coord-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .coord-val {
      color: #0f172a;
      font-weight: 600;
      word-break: break-all;
    }

    .address-box {
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
    }
    .address-box strong {
      display: block;
      color: #0f172a;
      font-size: 11px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .qr-column {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .qr-column svg {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .qr-tip {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 10px;
    }
    .qr-sub {
      font-size: 9px;
      color: #64748b;
      margin-top: 2px;
    }

    .card-footer-strip {
      background: #f8fafc;
      padding: 12px 30px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
        margin: 0;
      }
      .toolbar { display: none !important; }
      .card-sheet {
        box-shadow: none;
        border: 1px solid #94a3b8;
        max-width: 100%;
        page-break-inside: avoid;
      }
      @page {
        size: A5 landscape;
        margin: 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-info">
      <strong>Qlumix Official Digital Business Card</strong>
      To save as PDF: Click "Save as PDF / Print", then choose <em>Destination: "Save as PDF"</em>.
    </div>
    <button class="btn-pdf" onclick="window.print()">
      📄 Save as PDF / Print
    </button>
  </div>

  <div class="card-sheet">
    <div class="card-header-bar">
      <div class="brand-left">
        <img class="brand-logo" src="${logoSrc}" alt="${profile.companyName}" />
        <div>
          <div class="brand-title">${profile.companyName}</div>
          <div class="brand-tagline">${profile.tagline}</div>
        </div>
      </div>
      <div class="badge-iso">ISO 9001:2015 & RoHS</div>
    </div>

    <div class="card-body">
      <div class="main-details">
        <div class="executive-info">
          <img class="avatar" src="${avatarSrc}" alt="${profile.contactPerson}" />
          <div class="name-title">
            <h2>${profile.contactPerson}</h2>
            <p>${profile.designation}</p>
          </div>
        </div>

        <div class="coords-grid">
          <div class="coord-item">
            <span class="coord-label">Direct Phone</span>
            <span class="coord-val">${profile.phone}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">WhatsApp</span>
            <span class="coord-val">${profile.whatsapp}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">Official Email</span>
            <span class="coord-val">${profile.email}</span>
          </div>
          <div class="coord-item">
            <span class="coord-label">Website</span>
            <span class="coord-val">${profile.website}</span>
          </div>
        </div>

        <div class="address-box">
          <strong>Plant & Corporate Headquarters</strong>
          ${fullAddress}
        </div>
      </div>

      <div class="qr-column">
        ${qrSvgString}
        <div class="qr-tip">Scan to Open Profile</div>
        <div class="qr-sub">Direct connection & technical TDS</div>
      </div>
    </div>

    <div class="card-footer-strip">
      <span>Official Verified Corporate Profile</span>
      <span>${qrTarget}</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
