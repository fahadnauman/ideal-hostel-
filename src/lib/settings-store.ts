import type { OwnerSettings } from "@/types";

/* ─── Default Owner & Property Settings ──────────────────────── */

const defaultSettings: OwnerSettings = {
  propertyName: "Ideal Hostel",
  ownerName: "Fahad Nauman",
  ownerPhone: "+91 98765 00000",
  ownerEmail: "owner@idealhostel.com",
  upiId: "idealhostel@okhdfcbank",
  merchantName: "Ideal Enterprises",
  qrImageUrl: null,
  paymentInstructions: "Please mention your Room Number & Month in UPI remarks. Upload screenshot or enter your 12-digit UTR number below for immediate receipt clearance.",
  breakfastWindow: "07:30 AM - 09:30 AM",
  lunchWindow: "01:00 PM - 03:00 PM",
  dinnerWindow: "08:00 PM - 10:00 PM",
  updatedAt: new Date().toISOString(),
};

/* ─── Global State for Development / Serverless Persistence ── */

declare global {
  var __pghq_owner_settings: OwnerSettings | undefined;
}

if (!globalThis.__pghq_owner_settings) {
  globalThis.__pghq_owner_settings = { ...defaultSettings };
}

export function getOwnerSettings(): OwnerSettings {
  if (!globalThis.__pghq_owner_settings) {
    globalThis.__pghq_owner_settings = { ...defaultSettings };
  }
  return { ...globalThis.__pghq_owner_settings };
}

export function updateOwnerSettings(partial: Partial<OwnerSettings>): OwnerSettings {
  if (!globalThis.__pghq_owner_settings) {
    globalThis.__pghq_owner_settings = { ...defaultSettings };
  }
  const updated: OwnerSettings = {
    ...globalThis.__pghq_owner_settings,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  globalThis.__pghq_owner_settings = updated;
  return { ...updated };
}

export function resetOwnerSettings(): OwnerSettings {
  globalThis.__pghq_owner_settings = { ...defaultSettings };
  return { ...defaultSettings };
}
