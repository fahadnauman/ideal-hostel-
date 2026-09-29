"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  ShieldCheck,
  Lock,
  Wrench,
  IndianRupee,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { MaintenanceTask } from "@/types";

/* ─── Web Audio API chime helper ────────────────────────────── */
function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Three-note ascending chime: C5 → E5 → G5
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch {
    // Audio not supported — silently ignore
  }
}

/* ─── Notification Types ────────────────────────────────────── */

interface Notification {
  id: string;
  type: "maintenance" | "payment" | "info";
  title: string;
  body: string;
  href: string;
  time: string;
  read: boolean;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const MAINTENANCE_CAT_LABELS: Record<string, string> = {
  PLUMBING: "Plumbing",
  ELECTRICAL: "Electrical",
  AC_VENTILATION: "AC & Fan",
  CARPENTRY: "Lock & Wood",
  CLEANING: "Cleaning",
  OTHER: "Other",
};

/* ─── Header Component ──────────────────────────────────────── */

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState("Sunrise PG - Branch 1");
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chimePlayed, setChimePlayed] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const properties = [
    "Sunrise PG - Branch 1",
    "Greenwood Hostel - Branch 2",
    "Elite Residences - Branch 3",
  ];

  /* Fetch active maintenance tickets and build notification list */
  const buildNotifications = useCallback(async () => {
    const notifs: Notification[] = [];
    try {
      const res = await fetch("/api/maintenance");
      if (res.ok) {
        const data = await res.json();
        const pendingTasks: MaintenanceTask[] = (data.tasks || []).filter(
          (t: MaintenanceTask) => t.status === "PENDING" || t.status === "IN_PROGRESS"
        );
        pendingTasks.slice(0, 4).forEach((t: MaintenanceTask) => {
          notifs.push({
            id: `maint-${t.id}`,
            type: "maintenance",
            title: `${MAINTENANCE_CAT_LABELS[t.category] || t.category} — Room ${t.roomNumber}`,
            body: t.description.slice(0, 80) + (t.description.length > 80 ? "…" : ""),
            href: "/dashboard/maintenance",
            time: t.createdAt,
            read: false,
          });
        });
      }
    } catch {
      // silent
    }

    // Static reminders for dues & quick actions
    notifs.push({
      id: "dues-alert",
      type: "payment",
      title: "12 tenants have pending dues",
      body: "₹47,200 outstanding. Visit Finance & Ledger to follow up.",
      href: "/dashboard/finance",
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false,
    });

    setNotifications(notifs);
  }, []);

  /* Load notifications on mount, play chime once */
  useEffect(() => {
    buildNotifications();
  }, [buildNotifications]);

  /* Play chime the first time the notification bell has unread items */
  useEffect(() => {
    if (!chimePlayed && notifications.some((n) => !n.read)) {
      const timer = setTimeout(() => {
        playChime();
        setChimePlayed(true);
      }, 1200); // slight delay so page is settled
      return () => clearTimeout(timer);
    }
  }, [notifications, chimePlayed]);

  /* Close bell dropdown on outside click */
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLock = () => {
    if (typeof document !== "undefined") {
      document.cookie = "pghq_owner_session=; path=/; max-age=0;";
      localStorage.removeItem("pghq_owner_authenticated");
    }
    router.push("/login");
  };

  return (
    <header className="h-16 bg-[#121212] border-b border-zinc-800/60 sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-3 sm:px-6">
        {/* ── Left: Menu & Property Switcher ──────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            aria-label="Open Navigation Menu"
            className="lg:hidden min-w-[44px] min-h-[44px] -ml-1 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-default cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Property Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-default group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 max-w-[140px] sm:max-w-[200px] truncate block">
                {activeProperty}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 group-hover:text-slate-900 transition-transform shrink-0 ml-0.5 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Your Portfolio
                  </div>
                  {properties.map((prop) => (
                    <button
                      key={prop}
                      onClick={() => {
                        setActiveProperty(prop);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer
                        ${
                          activeProperty === prop
                            ? "bg-slate-50 text-slate-900"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <Building2
                        className={`w-4 h-4 ${
                          activeProperty === prop
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{prop}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer">
                      + Add New Property
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Owner Mode Status Tag */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Owner Mode</span>
          </div>
        </div>

        {/* ── Right: Bell + Lock + Profile ────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Lock */}
          <button
            onClick={handleLock}
            title="Lock Dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-default cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lock</span>
          </button>

          {/* ── Notification Bell ─────────────────────────── */}
          <div className="relative" ref={bellRef}>
            <button
              aria-label="Notifications"
              onClick={() => {
                setBellOpen((o) => !o);
                if (!bellOpen) buildNotifications();
              }}
              className="relative min-w-[44px] min-h-[44px] rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-default cursor-pointer"
            >
              <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-slate-900" : ""}`} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {bellOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setBellOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-900" />
                      <span className="text-sm font-extrabold text-slate-900">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setBellOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-1">No pending alerts.</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.href}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((x) =>
                                x.id === n.id ? { ...x, read: true } : x
                              )
                            );
                            setBellOpen(false);
                          }}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                            !n.read ? "bg-blue-50/40" : ""
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              n.type === "maintenance"
                                ? "bg-amber-100 text-amber-700"
                                : n.type === "payment"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {n.type === "maintenance" ? (
                              <Wrench className="w-4 h-4" />
                            ) : (
                              <IndianRupee className="w-4 h-4" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <p
                                className={`text-xs font-bold leading-snug ${
                                  !n.read ? "text-slate-900" : "text-slate-700"
                                }`}
                              >
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {n.body}
                            </p>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                              {timeAgo(n.time)}
                            </span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80">
                    <Link
                      href="/dashboard/maintenance"
                      onClick={() => setBellOpen(false)}
                      className="flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <span>View all maintenance tickets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-default">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              PG
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-900 leading-none">Property Owner</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Admin Access</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
