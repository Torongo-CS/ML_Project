"use client";

import * as React from "react";
import { X } from "lucide-react";

export function Dialog({
  isOpen,
  onClose,
  children,
  title,
  description,
  maxWidth = "max-w-2xl",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  maxWidth?: string;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div
        className={`relative z-50 w-full ${maxWidth} rounded-2xl border border-emerald-500/30 bg-[#0B120D] text-emerald-100 shadow-2xl backdrop-blur-xl p-6 overflow-hidden max-h-[90vh] flex flex-col`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-emerald-400/60 hover:bg-emerald-950 hover:text-emerald-200 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        {(title || description) && (
          <div className="mb-4 pr-8">
            {title && (
              <h2 className="text-xl font-bold tracking-tight text-emerald-100 flex items-center gap-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-emerald-400/70">{description}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}
