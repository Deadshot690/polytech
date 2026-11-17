/**
 * Independent Event Tracking System for Qlumix Business QR & Exhibition Analytics.
 * Decoupled from UI components, using browser storage for the frontend demonstration
 * and ready for centralized backend ingestion.
 */

export type TrackingEventType =
  | "qr_scan"
  | "business_card_view"
  | "save_contact_click"
  | "whatsapp_click"
  | "phone_click"
  | "form_start"
  | "product_interest_selected"
  | "lead_submitted";

export interface TrackingEvent {
  id: string;
  type: TrackingEventType;
  timestamp: string;
  visitorId: string;
  exhibitionId?: string;
  qrPlacementId?: string;
  qrCode?: string;
  metadata?: Record<string, unknown>;
}

const EVENTS_STORAGE_KEY = "qlumix_analytics_events";
const VISITOR_ID_KEY = "qlumix_visitor_id";
export const TRACKER_EVENT_NAME = "qlumix_event_logged";

/**
 * Returns or creates a persistent anonymous visitor ID for unique visitor tracking.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server-visitor";
  try {
    let vid = window.localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = `vis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      window.localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return "anon-visitor";
  }
}

/**
 * Retrieves all stored tracking events from localStorage.
 */
export function getStoredEvents(): TrackingEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TrackingEvent[];
  } catch {
    return [];
  }
}

/**
 * Dispatches an event log into localStorage and fires a reactive browser event.
 */
export function trackEvent(
  type: TrackingEventType,
  payload: {
    exhibitionId?: string;
    qrPlacementId?: string;
    qrCode?: string;
    metadata?: Record<string, unknown>;
  } = {},
): TrackingEvent {
  const visitorId = getOrCreateVisitorId();
  const event: TrackingEvent = {
    id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    timestamp: new Date().toISOString(),
    visitorId,
    exhibitionId: payload.exhibitionId,
    qrPlacementId: payload.qrPlacementId,
    qrCode: payload.qrCode,
    metadata: payload.metadata,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getStoredEvents();
      // Keep last 500 events to stay cleanly within browser quota
      const updated = [event, ...existing].slice(0, 500);
      window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));

      // Dispatch event for reactive UI updates across components
      window.dispatchEvent(
        new CustomEvent(TRACKER_EVENT_NAME, {
          detail: event,
        }),
      );
    } catch (e) {
      console.warn("Could not save tracking event to localStorage:", e);
    }
  }

  return event;
}
