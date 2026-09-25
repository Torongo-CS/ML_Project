"use client";

import React from "react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, Printer, Sprout } from "lucide-react";

export function ReportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Official Agronomy Pathology & Action Plan Report"
      description="AGRI-VISION AI Engine • Certified Diagnostics for Tomato & Potato Crops"
    >
      <div className="space-y-6 pt-2 text-emerald-100">
        <div className="rounded-xl border border-emerald-900/40 bg-[#09100C] p-6 space-y-4 shadow-inner text-xs font-sans">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AGRI-VISION PRECISION REPORT</h3>
                <p className="text-[11px] text-emerald-400/70 font-mono">
                  REF: AVR-2026-0923 • GENERATED AT: 2026-09-23 09:00 UTC
                </p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-emerald-300">
              OFFICIAL AGRONOMY CERTIFICATE
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="rounded-lg bg-emerald-950/40 p-2.5 border border-emerald-900/30">
              <span className="block text-[10px] text-emerald-400/60 uppercase">Field Index</span>
              <span className="font-bold text-sm text-emerald-200">94.2%</span>
            </div>
            <div className="rounded-lg bg-emerald-950/40 p-2.5 border border-emerald-900/30">
              <span className="block text-[10px] text-emerald-400/60 uppercase">Tomato Threat</span>
              <span className="font-bold text-sm text-rose-400">Early Blight</span>
            </div>
            <div className="rounded-lg bg-emerald-950/40 p-2.5 border border-emerald-900/30">
              <span className="block text-[10px] text-emerald-400/60 uppercase">Potato Threat</span>
              <span className="font-bold text-sm text-amber-300">Black Scurf</span>
            </div>
            <div className="rounded-lg bg-emerald-950/40 p-2.5 border border-emerald-900/30">
              <span className="block text-[10px] text-emerald-400/60 uppercase">Drone Frames</span>
              <span className="font-bold text-sm text-teal-300">150 Captures</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Priority Action Directives
            </h4>
            <div className="space-y-2 font-mono text-[11px] text-emerald-200/90">
              <div className="flex items-start gap-2 p-2 rounded bg-black/40 border border-emerald-900/30">
                <span className="text-rose-400 font-bold">[P1]</span>
                <span>Apply Copper Hydroxide (77% WP) to Sector 4B Tomato Quad within 12h.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-black/40 border border-emerald-900/30">
                <span className="text-amber-400 font-bold">[P2]</span>
                <span>Throttle canopy drip irrigation by -30% to drop humidity below 75% RH.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> Print Document
          </Button>
          <Button onClick={onClose} variant="emerald" className="gap-2 font-bold">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
