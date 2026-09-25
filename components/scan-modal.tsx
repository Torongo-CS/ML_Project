"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Scan, CheckCircle2 } from "lucide-react";

export function ScanModal({
  isOpen,
  onClose,
  onScanComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: () => void;
}) {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState<
    "initiating" | "capturing" | "analyzing" | "complete"
  >("initiating");

  useEffect(() => {
    if (!isOpen) {
      setScanProgress(0);
      setScanStep("initiating");
      return;
    }

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStep("complete");
          return 100;
        }
        if (prev > 60) setScanStep("analyzing");
        else if (prev > 20) setScanStep("capturing");
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="OptiScan Drone Sweep Simulation"
      description="Real-time autonomous aerial leaf scanning & neural pathogen inference."
    >
      <div className="space-y-6 pt-2 text-emerald-100">
        <div className="relative flex h-48 w-full items-center justify-center rounded-2xl bg-black border border-emerald-500/30 overflow-hidden agri-grid-bg">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/10 animate-pulse" />

          {scanStep !== "complete" && (
            <div className="absolute top-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10B981] animate-scan-line" />
          )}

          <div className="z-10 text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
              {scanStep === "complete" ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-bounce" />
              ) : (
                <Scan className="h-8 w-8 text-emerald-400 animate-spin" />
              )}
            </div>

            <div className="font-mono text-sm font-bold text-white uppercase tracking-wider smooth-text-transition">
              {scanStep === "initiating" && "Calibrating HD Vision Sensors..."}
              {scanStep === "capturing" && "Capturing 150 Foliage Frames..."}
              {scanStep === "analyzing" && "Running Neural Pathology Inference..."}
              {scanStep === "complete" && "Scan Completed • Diagnostics Updated"}
            </div>

            <p className="text-xs text-emerald-400/70 font-mono">
              Sector 4 - North Quad • Altitude 12.4m • OptiScan LiDAR Active
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-emerald-400/80">Scan Cycle Completion</span>
            <span className="font-bold text-emerald-300">{scanProgress}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onScanComplete();
              onClose();
            }}
            disabled={scanStep !== "complete"}
            variant="emerald"
            className="font-bold"
          >
            Apply Diagnostics
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
