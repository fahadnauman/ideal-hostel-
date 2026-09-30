"use client";

import { useState, useEffect } from "react";
import { X, Settings2, Plus, Trash2 } from "lucide-react";
import type { Room } from "@/types";

interface EditRoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditRoomModal({ room, isOpen, onClose, onUpdate }: EditRoomModalProps) {
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_room",
          roomId: room.id,
          floorId: room.floorId,
          newRoomNumber: roomNumber,
        }),
      });
      if (res.ok) {
        onUpdate();
      } else {
        alert("Failed to update room name.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating room.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_room",
          roomId: room.id,
          floorId: room.floorId,
          actionType: "add_bed",
        }),
      });
      if (res.ok) {
        onUpdate();
      } else {
        alert("Failed to add bed.");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding bed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBed = async (bedId: string) => {
    const bed = room.beds.find(b => b.id === bedId);
    if (bed?.tenant) {
      alert("Cannot remove a bed that is currently occupied.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_room",
          roomId: room.id,
          floorId: room.floorId,
          actionType: "remove_bed",
          bedId,
        }),
      });
      if (res.ok) {
        onUpdate();
      } else {
        alert("Failed to remove bed. Is it occupied?");
      }
    } catch (error) {
      console.error(error);
      alert("Error removing bed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <Settings2 className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-none">
                Edit Room
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Room {room.roomNumber} ({room.roomType})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Rename Room */}
          <form onSubmit={handleUpdateName} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Room Details</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Room Number / Name</label>
                <input 
                  type="text" 
                  value={roomNumber} 
                  onChange={e => setRoomNumber(e.target.value)} 
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || roomNumber === room.roomNumber}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-default disabled:opacity-50 h-[38px]"
              >
                Save
              </button>
            </div>
          </form>

          {/* Manage Beds */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Manage Beds</h3>
              <button
                onClick={handleAddBed}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-default disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Bed
              </button>
            </div>
            
            <div className="space-y-2.5">
              {room.beds.map(bed => (
                <div key={bed.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shadow-xs text-slate-700">
                      B{bed.bedNumber}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Bed {bed.bedNumber}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        {bed.status === "AVAILABLE" ? "Vacant" : "Occupied"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveBed(bed.id)}
                    disabled={loading || !!bed.tenant}
                    title={bed.tenant ? "Cannot delete occupied bed" : "Remove Bed"}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {room.beds.length === 0 && (
                <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 font-medium">
                  No beds in this room.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
