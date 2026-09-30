"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  Wrench,
  UtensilsCrossed,
  Settings,
  Lock,
  ShieldCheck,
  IndianRupee,
  X,
  PieChart,
  ClipboardList,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Floor & Bed Grid", href: "/dashboard/rooms", icon: Layers },
  { name: "Finance & Ledger", href: "/dashboard/finance", icon: IndianRupee },
  { name: "Expense & P&L", href: "/dashboard/expenses", icon: PieChart },
  { name: "Tenants", href: "/dashboard/tenants", icon: Users },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Task Board", href: "/dashboard/tasks", icon: ClipboardList },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLock = () => {
    if (typeof document !== "undefined") {
      document.cookie = "pghq_owner_session=; path=/; max-age=0;";
      localStorage.removeItem("pghq_owner_authenticated");
    }
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[260px]
          bg-zinc-950 text-white flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0 lg:flex-shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <svg viewBox="0 0 400 400" className="w-9 h-9 shrink-0 drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="200" fill="#F5C800" />
              <circle cx="200" cy="200" r="185" fill="none" stroke="#121212" strokeWidth="8" />
              <text x="200" y="200" fontFamily="'Opificio Round', 'Opificio', sans-serif" fontSize="115" fill="#121212" textAnchor="middle" fontWeight="600" letterSpacing="-1">ideal</text>
              <text x="200" y="270" fontFamily="'Opificio Round', 'Opificio', sans-serif" fontSize="52" fill="#121212" textAnchor="middle" fontWeight="600">enterprises</text>
            </svg>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none" style={{ fontFamily: "'Opificio Round', 'Opificio', sans-serif" }}>
                Ideal
              </span>
              <span className="text-[11px] text-[#F5C800] font-medium tracking-wide mt-0.5 uppercase" style={{ fontFamily: "'Opificio Round', 'Opificio', sans-serif" }}>
                Enterprises
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-default cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Owner Mode Callout ───────────────────────── */}
        <div className="mx-3 my-3 p-2.5 rounded-xl bg-zinc-900 border border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F5C800] shrink-0" />
            <span className="text-xs font-bold text-zinc-100">Owner Direct Pass Active</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Zero password friction handoff enabled.
          </p>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold
                  transition-default group min-h-[44px]
                  ${
                    isActive
                      ? "bg-zinc-800 text-[#F5C800] shadow-2xs"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }
                `}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-[#F5C800]"
                      : "text-zinc-500 group-hover:text-white"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer ───────────────────────────────────── */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <button
            onClick={handleLock}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold
                       text-zinc-400 hover:text-red-400 hover:bg-zinc-900
                       transition-default cursor-pointer min-h-[44px]"
          >
            <Lock className="w-4 h-4 shrink-0 text-zinc-500" />
            Lock / Exit Bypass
          </button>
          
          <div className="pt-2 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              PGHQ • Powered by Nauman Labs
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

