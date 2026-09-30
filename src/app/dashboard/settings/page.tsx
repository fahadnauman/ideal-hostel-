"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Settings,
  Building2,
  Smartphone,
  Upload,
  CheckCircle2,
  X,
  ExternalLink,
  Save,
  QrCode,
  ShieldCheck,
  UtensilsCrossed,
  Info,
  Clock,
  User,
  Phone,
  FileText,
} from "lucide-react";
import type { OwnerSettings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<OwnerSettings>({
    propertyName: "Ideal Hostel",
    ownerName: "Fahad Nauman",
    ownerPhone: "+91 98765 00000",
    ownerEmail: "owner@idealhostel.com",
    upiId: "idealhostel@okhdfcbank",
    merchantName: "Ideal Enterprises",
    qrImageUrl: null,
    paymentInstructions:
      "Please mention your Room Number & Month in UPI remarks. Upload screenshot or enter your 12-digit UTR number below for immediate receipt clearance.",
    breakfastWindow: "07:30 AM - 09:30 AM",
    lunchWindow: "01:00 PM - 03:00 PM",
    dinnerWindow: "08:00 PM - 10:00 PM",
    updatedAt: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewTab, setPreviewTab] = useState<"qr" | "custom">("qr");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
            if (data.settings.qrImageUrl) {
              setPreviewTab("custom");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image is larger than 4MB. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({
        ...prev,
        qrImageUrl: reader.result as string,
      }));
      setPreviewTab("custom");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomQr = () => {
    setSettings((prev) => ({
      ...prev,
      qrImageUrl: null,
    }));
    setPreviewTab("qr");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert("Failed to save settings. Please try again.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Network error while saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate UPI URI for standard dynamic QR
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(
    settings.upiId || "idealhostel@okhdfcbank"
  )}&pn=${encodeURIComponent(
    settings.merchantName || settings.propertyName
  )}&cu=INR`;

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5 text-slate-700" />
            <span>Property &amp; Payment Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Owner &amp; UPI / GPay Setup
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Configure your custom GPay / UPI ID and payment QR code. Changes link dynamically to all room QR placards and tenant landing pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/tenant-portal?room=101"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-default min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>Test Tenant Portal</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-default shadow-xs cursor-pointer min-h-[44px]"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 text-sm font-bold animate-slide-up shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p>Settings saved successfully!</p>
            <p className="text-xs font-medium text-emerald-700 mt-0.5">
              Your updated GPay UPI ID and QR code are now live across all Room QR door placards.
            </p>
          </div>
        </div>
      )}

      {/* ── Main Settings Grid ─────────────────────────── */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: UPI & GPay Payment Configuration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  GPay &amp; UPI Payment Integration
                </h2>
                <p className="text-xs text-slate-500">
                  Direct VPA address used for tenant 1-touch transfers and dynamic QR creation
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* UPI ID (VPA) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                  <span>Owner GPay / UPI ID (VPA) *</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    e.g. yourname@okhdfcbank
                  </span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={settings.upiId}
                    onChange={(e) =>
                      setSettings({ ...settings, upiId: e.target.value.trim() })
                    }
                    placeholder="idealhostel@okhdfcbank, mobile@upi, etc."
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-extrabold text-slate-900 font-mono focus-ring transition-default"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Compatible with Google Pay, PhonePe, Paytm, BHIM, and all Indian banking UPI apps.
                </p>
              </div>

              {/* Merchant / Payee Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Payee Display Name (Shown in Bank Apps) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.merchantName}
                  onChange={(e) =>
                    setSettings({ ...settings, merchantName: e.target.value })
                  }
                  placeholder="Ideal Enterprises"
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus-ring transition-default"
                />
              </div>

              {/* Custom QR Code Image Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                  <span>Custom Standee QR Image (Optional)</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    PNG / JPG (max 4MB)
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleQrUpload}
                  className="hidden"
                  id="custom-qr-upload"
                />

                {settings.qrImageUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.qrImageUrl}
                        alt="Custom QR Preview"
                        className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-1"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">
                          Custom Standee QR Image Uploaded
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          Active &amp; displayed to tenants
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCustomQr}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-default cursor-pointer text-xs font-bold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="custom-qr-upload"
                    className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-default cursor-pointer text-slate-600 text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Upload official Google Pay / PhonePe merchant QR standee
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Leave empty to automatically use the high-contrast dynamic UPI QR generator.
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Payment Instructions for Tenants */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Tenant Payment Instructions (Shown on Landing Page)
                </label>
                <textarea
                  rows={2}
                  value={settings.paymentInstructions}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentInstructions: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-900 focus-ring transition-default resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Property & Owner Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Hostel Property &amp; Contact Info
                </h2>
                <p className="text-xs text-slate-500">
                  Branding and emergency contact shown on room QR placards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Property Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={settings.propertyName}
                    onChange={(e) =>
                      setSettings({ ...settings, propertyName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Owner / Manager Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={settings.ownerName}
                    onChange={(e) =>
                      setSettings({ ...settings, ownerName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Support / Front Desk Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={settings.ownerPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, ownerPhone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Official Email
                </label>
                <input
                  type="email"
                  value={settings.ownerEmail || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, ownerEmail: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Kitchen & Mess Meal Serving Hours */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Kitchen Mess Schedule
                </h2>
                <p className="text-xs text-slate-500">
                  Timings shown to tenants when opting in or skipping meals
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Breakfast Hours
                </label>
                <input
                  type="text"
                  value={settings.breakfastWindow}
                  onChange={(e) =>
                    setSettings({ ...settings, breakfastWindow: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Lunch Hours
                </label>
                <input
                  type="text"
                  value={settings.lunchWindow}
                  onChange={(e) =>
                    setSettings({ ...settings, lunchWindow: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Dinner Hours
                </label>
                <input
                  type="text"
                  value={settings.dinnerWindow}
                  onChange={(e) =>
                    setSettings({ ...settings, dinnerWindow: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                    GP
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Live QR Preview
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      As seen by tenants when scanning
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* QR Code Container Box */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center space-y-3">
                <div className="inline-block p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  {settings.qrImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={settings.qrImageUrl}
                      alt="Custom Standee QR"
                      className="w-44 h-44 object-contain mx-auto rounded-lg"
                    />
                  ) : (
                    <QRCodeSVG
                      value={upiPayUrl}
                      size={176}
                      level="H"
                      marginSize={1}
                      className="rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-slate-900">
                    {settings.merchantName || settings.propertyName}
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 inline-block select-all">
                    {settings.upiId}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500 font-medium">
                  {settings.qrImageUrl
                    ? "Custom uploaded standee QR will be rendered."
                    : "Instant UPI dynamic QR generated from your VPA."}
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Door Placard Link Integration</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Every room QR door card printed from the Floor &amp; Bed Grid automatically embeds this payment destination. Tenants can pay in 1 touch without asking for UPI numbers.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl transition-default shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save &amp; Update Live Hub"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
