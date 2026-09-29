"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Layers,
  Users,
  Settings,
  ShieldCheck,
  DoorOpen,
  IndianRupee,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { OwnerSettings } from "@/types";

export default function PropertiesPage() {
  const [settings, setSettings] = useState<OwnerSettings>({
    propertyName: "Sunrise PG Hostel",
    ownerName: "Fahad Nauman",
    ownerPhone: "+91 98765 00000",
    upiId: "sunrisepg@okhdfcbank",
    merchantName: "Sunrise PG Accommodations",
    qrImageUrl: null,
    breakfastWindow: "07:30 AM - 09:30 AM",
    lunchWindow: "01:00 PM - 03:00 PM",
    dinnerWindow: "08:00 PM - 10:00 PM",
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5 text-slate-700" />
            <span>Property Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Hostel Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage your buildings, floors, rooms, and localized QR hub configurations.
          </p>
        </div>

        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-default"
        >
          <Settings className="w-4 h-4 text-slate-600" />
          <span>Edit Property Info</span>
        </Link>
      </div>

      {/* ── Property Card ─────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 card-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {settings.propertyName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  Operational
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Sector 62, Electronic City, Bengaluru, Karnataka</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/rooms"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-default shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>View 2D Bed Grid</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Floors
            </span>
            <p className="text-2xl font-black text-slate-900">3 Floors</p>
            <span className="text-[11px] text-slate-400">Ground, 1st &amp; 2nd</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Capacity
            </span>
            <p className="text-2xl font-black text-slate-900">120 Beds</p>
            <span className="text-[11px] text-emerald-600 font-semibold">81.6% Occupancy</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Active Residents
            </span>
            <p className="text-2xl font-black text-slate-900">98 Tenants</p>
            <Link href="/dashboard/tenants" className="text-[11px] text-blue-600 font-bold hover:underline">
              View Directory &rarr;
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              UPI Destination
            </span>
            <p className="text-xs font-mono font-bold text-slate-900 truncate">
              {settings.upiId}
            </p>
            <Link href="/dashboard/settings" className="text-[11px] text-blue-600 font-bold hover:underline">
              Configure GPay &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
