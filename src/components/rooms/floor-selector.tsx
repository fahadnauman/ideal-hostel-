"use client";

import type { Floor } from "@/types";

interface FloorSelectorProps {
  floors: Floor[];
  activeFloorId: string;
  onSelect: (floorId: string) => void;
}

export default function FloorSelector({
  floors,
  activeFloorId,
  onSelect,
}: FloorSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl card-shadow overflow-x-auto max-w-full no-scrollbar">
      {floors.map((floor) => {
        const isActive = floor.id === activeFloorId;
        return (
          <button
            key={floor.id}
            onClick={() => onSelect(floor.id)}
            type="button"
            className={`
              relative px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-bold
              transition-all duration-150 ease-in-out whitespace-nowrap cursor-pointer
              ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }
            `}
          >
            {floor.name || `Floor ${floor.floorNumber}`}
          </button>
        );
      })}
    </div>
  );
}

