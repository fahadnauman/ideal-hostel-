import type { BedStatus } from "@/types";

export interface StatusConfigItem {
  label: string;
  dotClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
}

const statusConfig: Record<BedStatus, StatusConfigItem> = {
  AVAILABLE: {
    label: "Available",
    dotClass: "bg-emerald-600",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-300",
    textClass: "text-emerald-950",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
  OCCUPIED: {
    label: "Occupied",
    dotClass: "bg-slate-600",
    bgClass: "bg-slate-100",
    borderClass: "border-slate-300",
    textClass: "text-slate-900",
    badgeClass: "bg-slate-200 text-slate-800",
  },
  DUE: {
    label: "Rent Due",
    dotClass: "bg-rose-600",
    bgClass: "bg-rose-50",
    borderClass: "border-rose-300",
    textClass: "text-rose-950",
    badgeClass: "bg-rose-100 text-rose-800",
  },
  ENDING_SOON: {
    label: "Ending Soon",
    dotClass: "bg-amber-500",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-300",
    textClass: "text-amber-950",
    badgeClass: "bg-amber-100 text-amber-800",
  },
};

export function getStatusConfig(status: BedStatus): StatusConfigItem {
  return statusConfig[status];
}

export default function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 p-2 sm:p-2.5 bg-white border border-slate-200 rounded-xl card-shadow">
      {(Object.keys(statusConfig) as BedStatus[]).map((status) => {
        const config = statusConfig[status];
        return (
          <div key={status} className="flex items-center gap-2 px-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`}
            />
            <span className="text-xs font-semibold text-slate-800">
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

