"use client";

import type { Bed } from "@/types";
import { getStatusConfig } from "./status-legend";
import { User, AlertCircle } from "lucide-react";

interface BedIndicatorProps {
  bed: Bed;
  onClick: (bed: Bed) => void;
}

export default function BedIndicator({ bed, onClick }: BedIndicatorProps) {
  const config = getStatusConfig(bed.status);
  const hasInteraction = true; // allow clicking any bed (to view details or assign tenant)

  return (
    <button
      onClick={() => onClick(bed)}
      type="button"
      title={
        bed.tenant
          ? `Bed ${bed.bedNumber} — ${bed.tenant.name} (${config.label})`
          : `Bed ${bed.bedNumber} — ${config.label} (Tap to assign)`
      }
      className={`
        relative flex flex-col items-center justify-center p-2
        w-full min-h-[66px] sm:min-h-[70px]
        rounded-xl border-2 transition-all duration-150 ease-in-out cursor-pointer
        active:scale-[0.97] hover:shadow-md
        ${config.bgClass} ${config.borderClass}
        group
      `}
    >
      {/* Top row: Bed number & status dot */}
      <div className="flex items-center justify-between w-full px-0.5 mb-1">
        <span className="text-xs sm:text-sm font-extrabold tabular-nums text-slate-900">
          B{bed.bedNumber}
        </span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${config.dotClass} ring-2 ring-white shrink-0`}
        />
      </div>

      {/* Tenant name or status subtitle */}
      {bed.tenant ? (
        <div className="w-full flex items-center gap-1 mt-0.5">
          <User className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-xs font-bold text-slate-800 truncate block leading-tight">
            {bed.tenant.name.split(" ")[0]}
          </span>
        </div>
      ) : (
        <span className="text-[11px] font-bold text-emerald-800 tracking-tight leading-tight self-start">
          Vacant
        </span>
      )}

      {/* Due / Ending Soon Alert Badge */}
      {bed.status === "DUE" && (
        <div className="absolute bottom-1 right-1">
          <AlertCircle className="w-3 h-3 text-rose-600" />
        </div>
      )}
    </button>
  );
}

