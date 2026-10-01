"use client";

import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Building2,
  Wrench,
} from "lucide-react";
import type { Room } from "@/types";

interface RoomQrModalProps {
  room: Room | null;
  propertyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomQrModal({
  room,
  propertyTitle = "Ideal Hostel",
  isOpen,
  onClose,
}: RoomQrModalProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !room) return null;

  // Build the unique dynamic 3-option tenant portal URL
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost:3000";
  // Add roomId and timestamp to bust cache and tie QR exactly to the room's current identifier
  const hubUrl = `${origin}/tenant-portal?room=${encodeURIComponent(room.roomNumber)}&roomId=${encodeURIComponent(room.id)}&t=${Date.now()}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(hubUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`qr-svg-${room.roomNumber}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `room-${room.roomNumber}-tenant-hub-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <>
      {/* ── Modal Overlay ──────────────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 print:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity print:hidden"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:max-w-none">
          {/* Header (Hidden when printing) */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 leading-none">
                  Room {room.roomNumber} QR Placard
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Dynamic 3-Option Resident Door Placard
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-default cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 print:p-0 print:overflow-visible">
            {/* ── Printable Placard Card ──────────────────── */}
            <div
              ref={cardRef}
              id="printable-qr-placard"
              className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 text-center space-y-4 shadow-sm print:border-4 print:p-8 print:rounded-3xl"
            >
              {/* Header Branding */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{propertyTitle}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-950 tracking-tight">
                  ROOM {room.roomNumber}
                </h3>
                <p className="text-xs font-bold text-slate-600">
                  Resident 3-Option Self-Service Hub
                </p>
              </div>

              {/* QR Code Container */}
              <div className="inline-flex p-4 sm:p-5 bg-white border-2 border-slate-200 rounded-2xl shadow-inner mx-auto items-center justify-center">
                <QRCodeSVG
                  id={`qr-svg-${room.roomNumber}`}
                  value={hubUrl}
                  size={190}
                  level="H"
                  marginSize={1}
                  className="rounded-lg"
                />
              </div>

              {/* 3 Step-by-step options */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                  <span>Scan with Smartphone Camera to:</span>
                </div>
                <div className="grid grid-cols-1 gap-1 text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0">1</span>
                    <span><strong>Pay Rent:</strong> Direct GPay / UPI QR &amp; Receipt Upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] shrink-0">2</span>
                    <span><strong>Mess Toggle:</strong> Breakfast, Lunch &amp; Dinner Headcount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0">3</span>
                    <span><strong>Repairs:</strong> 1-Touch Maintenance Ticket Dispatch</span>
                  </div>
                </div>
              </div>

              {/* URL fallback for manual entry */}
              <div className="text-[10px] text-slate-400 font-mono break-all pt-1 border-t border-slate-100">
                Direct link: {hubUrl}
              </div>
            </div>

            {/* ── Quick URL Copy Bar (Screen only) ───────── */}
            <div className="print:hidden flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={hubUrl}
                className="text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-default cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Actions (Screen only) */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-2.5 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-default shadow-xs cursor-pointer min-h-[44px]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Door Card</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm transition-default cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download QR</span>
            </button>

            <a
              href={hubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs sm:text-sm transition-default min-h-[44px]"
              title="Test dynamic 3-option resident hub"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Preview Hub</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Print Stylesheet Scoped ────────────────────── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-placard,
          #printable-qr-placard * {
            visibility: visible;
          }
          #printable-qr-placard {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            margin: 0;
            padding: 30px;
            border: 3px solid #000;
            background: #fff;
          }
        }
      `}</style>
    </>
  );
}
