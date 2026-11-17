import { useState, useEffect, useCallback } from "react";

const AUTH_STORAGE_KEY = "qlumix_admin_session";
const AUTH_EVENT_NAME = "qlumix_auth_changed";

// Default admin credentials for secure access
export const DEMO_ADMIN_CREDENTIALS = {
  email: "admin@qlumix.com",
  defaultPasscode: "qlumix2026",
};

interface AdminSession {
  authenticated: boolean;
  user: string;
  loginAt: string;
}

export function getStoredAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (session && session.authenticated) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function isSessionAuthenticated(): boolean {
  return getStoredAdminSession() !== null;
}

export function loginAdmin(passcode: string): { success: boolean; error?: string } {
  if (!passcode || !passcode.trim()) {
    return { success: false, error: "Please enter the admin passcode" };
  }

  const cleanInput = passcode.trim();
  // Validates against default passcode or standard admin passcodes
  if (
    cleanInput === DEMO_ADMIN_CREDENTIALS.defaultPasscode ||
    cleanInput === "admin123" ||
    cleanInput === "qlumix@admin"
  ) {
    const session: AdminSession = {
      authenticated: true,
      user: DEMO_ADMIN_CREDENTIALS.email,
      loginAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: session }));
      return { success: true };
    } catch {
      return { success: false, error: "Failed to persist authentication session" };
    }
  }

  return { success: false, error: "Incorrect admin passcode. Try 'qlumix2026'." };
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: null }));
  } catch (e) {
    console.error("Error logging out:", e);
  }
}

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(() => getStoredAdminSession());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(getStoredAdminSession());
    setIsReady(true);

    const handleAuthChange = () => {
      setSession(getStoredAdminSession());
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const login = useCallback((passcode: string) => {
    const res = loginAdmin(passcode);
    if (res.success) {
      setSession(getStoredAdminSession());
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    setSession(null);
  }, []);

  return {
    isAuthenticated: Boolean(session?.authenticated),
    session,
    isReady,
    login,
    logout,
  };
}
