"use strict";
"use client";

import React, { useState } from "react";
import { Upload, FileJson, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkImportModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkImportModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const parsedData = JSON.parse(jsonInput);
      const tenantsArray = Array.isArray(parsedData) ? parsedData : parsedData.tenants;

      if (!tenantsArray || !Array.isArray(tenantsArray)) {
        throw new Error("Invalid JSON format. Expected an array of tenants.");
      }

      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_import", tenants: tenantsArray }),
      });

      if (!res.ok) {
        throw new Error("Failed to process bulk import on server.");
      }

      const result = await res.json();
      if (result.success) {
        onSuccess();
        onClose();
        setJsonInput("");
      } else {
        throw new Error(result.error || "Unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to import data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bulk Import Tenants</h2>
              <p className="text-xs text-slate-500">Paste JSON array of tenant records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-sm font-semibold rounded-lg flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              JSON Payload
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[\n  {\n    "name": "John Doe",\n    "phone": "9876543210",\n    "roomNumber": "101"\n  }\n]`}
              className="w-full h-64 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
            />
            <p className="text-xs text-slate-500">
              Paste the extracted tenant records array here. The system will map users automatically to available beds.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading || !jsonInput.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Run Import</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
