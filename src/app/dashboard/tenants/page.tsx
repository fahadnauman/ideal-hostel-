"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  MessageCircle,
  IndianRupee,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ExternalLink,
  ChevronRight,
  X,
  Edit,
  UserPlus,
  Save,
  Wallet,
  Building2,
  Layers,
  HeartHandshake,
  Check,
  CreditCard,
} from "lucide-react";
import type { Tenant, PaymentRecord, PaymentStatus, PaymentMode } from "@/types";
import RecordPaymentModal from "@/components/finance/record-payment-modal";

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; icon: React.ElementType; class: string; bg: string; border: string }
> = {
  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    class: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  UNPAID: {
    label: "Unpaid",
    icon: XCircle,
    class: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  PARTIAL: {
    label: "Partial",
    icon: MinusCircle,
    class: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  OVERDUE: {
    label: "Overdue",
    icon: AlertCircle,
    class: "text-rose-700 font-bold",
    bg: "bg-rose-50",
    border: "border-rose-300",
  },
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "DUES">("ALL");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantLedger, setTenantLedger] = useState<PaymentRecord[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Tenant>>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load tenants from API
  const fetchTenants = async () => {
    try {
      const res = await fetch("/api/tenants");
      if (res.ok) {
        const data = await res.json();
        if (data.tenants) {
          setTenants(data.tenants);
        }
      }
    } catch (err) {
      console.error("Error loading tenants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Fetch individual tenant details and ledger
  const openTenantDrawer = async (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditing(false);
    setIsDrawerOpen(true);
    setEditFormData({ ...tenant });

    try {
      const res = await fetch(`/api/tenants?id=${encodeURIComponent(tenant.id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.paymentHistory) {
          setTenantLedger(data.paymentHistory);
        }
        if (data.tenant) {
          setSelectedTenant(data.tenant);
          setEditFormData({ ...data.tenant });
        }
      }
    } catch (err) {
      console.error("Error fetching tenant ledger:", err);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  // Handle Tenant Edit Submission
  const handleSaveTenantUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    setIsSavingEdit(true);
    try {
      const res = await fetch("/api/tenants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTenant.id,
          ...editFormData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = data.tenant;
        setSelectedTenant(updated);
        setTenants((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        setIsEditing(false);
        showToast("Tenant details updated successfully!");
      } else {
        alert("Failed to update tenant details.");
      }
    } catch (err) {
      console.error("Failed to save tenant edits:", err);
      alert("Error saving tenant changes.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Recording Payment in Drawer
  const handlePaymentSuccess = () => {
    showToast("Payment recorded successfully!");
    fetchTenants();
    if (selectedTenant) {
      // Re-fetch ledger for this tenant
      openTenantDrawer(selectedTenant);
    }
  };

  // Metrics
  const totalTenants = tenants.length;
  const paidTenants = tenants.filter((t) => t.paymentStatus === "PAID").length;
  const duesTenants = tenants.filter(
    (t) =>
      t.paymentStatus === "UNPAID" ||
      t.paymentStatus === "OVERDUE" ||
      t.paymentStatus === "PARTIAL"
  ).length;
  const totalRentRoll = tenants.reduce((sum, t) => sum + (t.monthlyRent || 0), 0);

  // Filtered List
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      // Status filter
      if (statusFilter === "PAID" && t.paymentStatus !== "PAID") return false;
      if (
        statusFilter === "DUES" &&
        t.paymentStatus !== "UNPAID" &&
        t.paymentStatus !== "OVERDUE" &&
        t.paymentStatus !== "PARTIAL"
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchPhone = t.phone.toLowerCase().includes(q);
        const matchRoom = t.roomNumber?.toLowerCase().includes(q);
        const matchEmergency =
          t.emergencyContactName &&
          t.emergencyContactName.toLowerCase().includes(q);
        return matchName || matchPhone || matchRoom || matchEmergency;
      }

      return true;
    });
  }, [tenants, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 card-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-slate-700" />
            <span>Hostel Resident Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Tenant Directory &amp; Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Active resident profiles, room/bed allocations, emergency contacts, and complete payment ledger records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/dashboard/rooms"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm transition-default min-h-[44px]"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Bed Grid View</span>
          </a>
        </div>
      </div>

      {/* ── Top Metric KPI Cards ───────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 card-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Residents</span>
            <Users className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalTenants}
          </p>
          <p className="text-xs font-semibold text-slate-500">All registered beds</p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 card-shadow space-y-2 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Fully Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tabular-nums">
            {paidTenants}
          </p>
          <p className="text-xs font-semibold text-emerald-700">
            {totalTenants > 0 ? Math.round((paidTenants / totalTenants) * 100) : 0}% of active tenants
          </p>
        </div>

        <div className="bg-white border border-rose-200 rounded-2xl p-4 sm:p-5 card-shadow space-y-2 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Dues</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-950 tabular-nums">
            {duesTenants}
          </p>
          <p className="text-xs font-semibold text-rose-700">Overdue or partial</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 card-shadow space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Rent Roll</span>
            <IndianRupee className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            ₹{totalRentRoll.toLocaleString("en-IN")}
          </p>
          <p className="text-xs font-semibold text-slate-500">Expected monthly sum</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ───────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 card-shadow flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tenant name, phone, room number (e.g. G01, 101), emergency contact..."
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus-ring transition-default"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-default cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({totalTenants})
          </button>
          <button
            onClick={() => setStatusFilter("PAID")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-default cursor-pointer ${
              statusFilter === "PAID"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Paid ({paidTenants})</span>
          </button>
          <button
            onClick={() => setStatusFilter("DUES")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-default cursor-pointer ${
              statusFilter === "DUES"
                ? "bg-white text-rose-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Dues ({duesTenants})</span>
          </button>
        </div>
      </div>

      {/* ── Tenant Directory Table & Cards ─────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider">
                <th className="px-5 py-3.5">Tenant Name &amp; Contact</th>
                <th className="px-4 py-3.5">Room &amp; Bed</th>
                <th className="px-4 py-3.5">Lease Expiry</th>
                <th className="px-4 py-3.5">Monthly Rent</th>
                <th className="px-4 py-3.5">Emergency Contact</th>
                <th className="px-4 py-3.5">Payment Status</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-bold text-slate-800">No tenants matched</p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your search query or payment filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const psc = paymentStatusConfig[tenant.paymentStatus] || paymentStatusConfig.UNPAID;
                  const StatusIcon = psc.icon;

                  return (
                    <tr
                      key={tenant.id}
                      onClick={() => openTenantDrawer(tenant)}
                      className="hover:bg-slate-50/80 transition-default cursor-pointer group"
                    >
                      {/* Name & Phone */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {tenant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {tenant.name}
                            </p>
                            <p className="text-xs font-medium text-slate-500 font-mono mt-0.5">
                              {tenant.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Room & Bed */}
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-900">
                          <Building2 className="w-3.5 h-3.5 text-slate-600" />
                          <span>Room {tenant.roomNumber}</span>
                          <span className="text-slate-300">|</span>
                          <span>B{tenant.bedNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          {tenant.floorName || "Ground Floor"}
                        </p>
                      </td>

                      {/* Lease Expiry */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatShortDate(tenant.leaseEndDate)}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Since {formatShortDate(tenant.checkInDate)}
                        </p>
                      </td>

                      {/* Monthly Rent */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                          ₹{tenant.monthlyRent.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Due on {ordinal(tenant.rentDueDate)}
                        </p>
                      </td>

                      {/* Emergency Contact */}
                      <td className="px-4 py-4">
                        {tenant.emergencyContactName ? (
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {tenant.emergencyContactName}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {tenant.emergencyContactRelation || "Contact"} ·{" "}
                              <span className="font-mono">{tenant.emergencyContactPhone}</span>
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not specified</span>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${psc.bg} ${psc.border} ${psc.class}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {psc.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="p-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-default cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${tenant.phone.replace(/[^0-9+]/g, "")}`}
                            title="Call Tenant"
                            className="p-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-default cursor-pointer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => openTenantDrawer(tenant)}
                            className="p-2 rounded-lg text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-default cursor-pointer"
                            title="View Full Profile"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Over Profile Drawer ──────────────────── */}
      {isDrawerOpen && selectedTenant && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
            onClick={closeDrawer}
          />

          {/* Drawer Panel */}
          <div
            className="fixed top-0 right-0 z-50 h-full w-full sm:max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-up sm:animate-none overflow-hidden"
            style={{
              boxShadow: "-10px 0 30px -5px rgba(15, 23, 42, 0.15)",
            }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {selectedTenant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {selectedTenant.name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Room {selectedTenant.roomNumber} · Bed {selectedTenant.bedNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-default cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-600" />
                    <span>Edit Profile</span>
                  </button>
                )}

                <button
                  onClick={closeDrawer}
                  aria-label="Close tenant profile"
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-default cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Communication & Payment Action Bar */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-default shadow-xs cursor-pointer min-h-[56px]"
                >
                  <IndianRupee className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>

                <a
                  href={`tel:${selectedTenant.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs transition-default shadow-xs cursor-pointer min-h-[56px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Tenant</span>
                </a>

                <a
                  href={`https://wa.me/${selectedTenant.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                    selectedTenant.name
                  )},%20this%20is%20from%20PGHQ%20regarding%20your%20room%20rent.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-900 font-bold text-xs border border-slate-200 transition-default cursor-pointer min-h-[56px]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Edit Mode Form */}
              {isEditing ? (
                <form onSubmit={handleSaveTenantUpdates} className="space-y-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border-2 border-slate-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Update Resident Information
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Name *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.name || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, name: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={editFormData.phone || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, phone: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Email</label>
                      <input
                        type="email"
                        value={editFormData.email || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, email: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Monthly Rent (₹)</label>
                      <input
                        type="number"
                        value={editFormData.monthlyRent || 0}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, monthlyRent: Number(e.target.value) })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Security Deposit (₹)</label>
                      <input
                        type="number"
                        value={editFormData.advanceDeposit || 0}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, advanceDeposit: Number(e.target.value) })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Lease Start Date</label>
                      <input
                        type="date"
                        value={editFormData.checkInDate || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, checkInDate: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Lease End Date</label>
                      <input
                        type="date"
                        value={editFormData.leaseEndDate || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, leaseEndDate: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-200">
                      <label className="text-xs font-bold text-slate-800 block">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={editFormData.emergencyContactName || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, emergencyContactName: e.target.value })
                        }
                        placeholder="e.g. Suresh Kumar"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 block">Relation</label>
                      <input
                        type="text"
                        value={editFormData.emergencyContactRelation || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, emergencyContactRelation: e.target.value })
                        }
                        placeholder="Father, Mother, Guardian"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 block">Emergency Phone</label>
                      <input
                        type="tel"
                        value={editFormData.emergencyContactPhone || ""}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, emergencyContactPhone: e.target.value })
                        }
                        placeholder="+91 98111 22334"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-200">
                      <label className="text-xs font-bold text-slate-800 block">Payment Status</label>
                      <select
                        value={editFormData.paymentStatus || "UNPAID"}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            paymentStatus: e.target.value as PaymentStatus,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus-ring"
                      >
                        <option value="PAID">Paid</option>
                        <option value="UNPAID">Unpaid</option>
                        <option value="PARTIAL">Partial</option>
                        <option value="OVERDUE">Overdue</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-default cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-default cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      {isSavingEdit ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Room & Assignment Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Room &amp; Bed Allocation
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {selectedTenant.floorName || "Ground Floor"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Room</span>
                    <span className="text-base font-extrabold text-slate-900">
                      Room {selectedTenant.roomNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">Bed Number</span>
                    <span className="text-base font-extrabold text-slate-900">
                      Bed {selectedTenant.bedNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lease & Financial Terms */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block pb-2 border-b border-slate-200/80">
                  Lease &amp; Financial Terms
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Monthly Rent
                    </span>
                    <p className="text-lg font-black text-slate-950 tabular-nums">
                      ₹{selectedTenant.monthlyRent.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Due on {ordinal(selectedTenant.rentDueDate)} of month
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Security Deposit
                    </span>
                    <p className="text-lg font-black text-slate-950 tabular-nums">
                      ₹{selectedTenant.advanceDeposit.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Refundable on exit
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Check-in Date
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {formatFullDate(selectedTenant.checkInDate)}
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Lease Expiration
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {selectedTenant.leaseEndDate
                        ? formatFullDate(selectedTenant.leaseEndDate)
                        : "Open Agreement"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Emergency Contact
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Primary Guardian
                  </span>
                </div>

                {selectedTenant.emergencyContactName ? (
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {selectedTenant.emergencyContactName}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {selectedTenant.emergencyContactRelation || "Contact"} ·{" "}
                        <span className="font-mono text-slate-800 font-bold">
                          {selectedTenant.emergencyContactPhone}
                        </span>
                      </p>
                    </div>

                    {selectedTenant.emergencyContactPhone && (
                      <a
                        href={`tel:${selectedTenant.emergencyContactPhone.replace(/[^0-9+]/g, "")}`}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-default flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-white border border-dashed border-slate-200 rounded-xl text-center">
                    <p className="text-xs text-slate-400">No emergency contact saved yet.</p>
                  </div>
                )}
              </div>

              {/* Payment Ledger History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Payment Ledger History
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    + Add Payment
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden card-shadow">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                        <th className="px-4 py-2.5">Month</th>
                        <th className="px-4 py-2.5">Amount</th>
                        <th className="px-4 py-2.5">Mode</th>
                        <th className="px-4 py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tenantLedger.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">
                            No ledger records for this tenant.
                          </td>
                        </tr>
                      ) : (
                        tenantLedger.map((rec) => {
                          const psc = paymentStatusConfig[rec.status] || paymentStatusConfig.UNPAID;
                          const StatusIcon = psc.icon;

                          return (
                            <tr key={rec.id} className="hover:bg-slate-50/60">
                              <td className="px-4 py-3 font-bold text-slate-900">
                                {rec.month}
                                {rec.paidOn && (
                                  <span className="block text-[10px] text-slate-400 font-normal">
                                    Paid on {formatShortDate(rec.paidOn)}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 font-extrabold text-slate-900 tabular-nums">
                                ₹{rec.amount.toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-600">
                                {rec.paymentMode || "—"}
                                {rec.transactionRef && (
                                  <span className="block text-[9px] font-mono text-slate-400 truncate max-w-[100px]">
                                    {rec.transactionRef}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${psc.bg} ${psc.border} ${psc.class}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {psc.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Record Payment Modal */}
      {selectedTenant && (
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          tenantId={selectedTenant.id}
          tenantName={selectedTenant.name}
          amountDue={selectedTenant.monthlyRent}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */

function formatShortDate(dateStr?: string | null): string {
  if (!dateStr) return "Open";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatFullDate(dateStr?: string | null): string {
  if (!dateStr) return "Open";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
