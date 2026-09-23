"use client";

import { useState } from "react";
import type { PaymentMode, PaymentStatus } from "@/types";
import { X, CheckCircle2, Banknote, Landmark, Smartphone, IndianRupee } from "lucide-react";

interface RecordPaymentModalProps {
  tenantId: string;
  tenantName: string;
  amountDue: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RecordPaymentModal({
  tenantId,
  tenantName,
  amountDue,
  isOpen,
  onClose,
  onSuccess,
}: RecordPaymentModalProps) {
  const [amount, setAmount] = useState<number>(amountDue);
  const [mode, setMode] = useState<PaymentMode>("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to record payment and update bed status
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-200"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md
                   bg-surface-elevated border border-border rounded-2xl shadow-xl
                   animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h2 className="text-lg font-semibold tracking-tight">Record Payment</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-default"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Tenant</p>
            <p className="text-sm text-muted-foreground">{tenantName}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-foreground">
              Amount Paid
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full h-10 pl-9 pr-4 text-sm bg-surface border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-border-focus
                           transition-default"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Payment Mode</label>
            <div className="grid grid-cols-3 gap-3">
              <ModeButton
                label="UPI"
                icon={Smartphone}
                selected={mode === "UPI"}
                onClick={() => setMode("UPI")}
              />
              <ModeButton
                label="Cash"
                icon={Banknote}
                selected={mode === "CASH"}
                onClick={() => setMode("CASH")}
              />
              <ModeButton
                label="Bank"
                icon={Landmark}
                selected={mode === "BANK_TRANSFER"}
                onClick={() => setMode("BANK_TRANSFER")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 bg-accent text-accent-foreground text-sm font-medium rounded-lg
                       hover:bg-accent-hover active:scale-[0.98] transition-default
                       flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Payment
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

function ModeButton({
  label,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2 py-3 rounded-xl border
        transition-all duration-150 ease-in-out
        ${
          selected
            ? "border-accent bg-accent/5 text-accent"
            : "border-border-light bg-surface hover:border-border-focus text-muted-foreground hover:text-foreground"
        }
      `}
    >
      <Icon className={`w-5 h-5 ${selected ? "text-accent" : ""}`} />
      <span className="text-[11px] font-semibold tracking-wide uppercase">{label}</span>
    </button>
  );
}
