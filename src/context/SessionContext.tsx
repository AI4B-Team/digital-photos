// ============================================================
// PHASE 1 — NEW FILE
// Save as: src/context/SessionContext.tsx
// ============================================================

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────── */
export interface SessionState {
  // Builder inputs
  cat:          string;          // "pets" | "babies" | "people" | "memorial" | "gifts"
  photo:        string | null;   // base64 data URL from homepage upload
  photoFile:    File   | null;   // raw File for Supabase upload (Phase 3)
  styles:       string[];        // ["royal","renaissance",...]

  // Checkout inputs
  selectedPlan: string;          // "digital" | "bundle" | "canvas"
  addedBumps:   string[];        // order bump IDs
  upsellAdded:  boolean;         // fantasy pack upsell

  // Post-purchase
  orderId:      string | null;
  orderProduct: string | null;   // what they actually bought

  // Generated portrait URLs (Phase 4 — AI integration)
  generatedPortraits: { style: string; url: string }[];
}

interface SessionContextType {
  session:      SessionState;
  setSession:   (updates: Partial<SessionState>) => void;
  clearSession: () => void;
}

/* ── Defaults ───────────────────────────────────────────────── */
const DEFAULT: SessionState = {
  cat:                "",
  photo:              null,
  photoFile:          null,
  styles:             [],
  selectedPlan:       "bundle",
  addedBumps:         [],
  upsellAdded:        false,
  orderId:            null,
  orderProduct:       null,
  generatedPortraits: [],
};

/* ── Context ────────────────────────────────────────────────── */
const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionState>(DEFAULT);

  const setSession = useCallback((updates: Partial<SessionState>) => {
    setSessionState(prev => ({ ...prev, ...updates }));
  }, []);

  const clearSession = useCallback(() => setSessionState(DEFAULT), []);

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within <SessionProvider>");
  return ctx;
}
