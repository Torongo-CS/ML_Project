"use client";

import React, { useState } from "react";
import {
  Activity,
  Sprout,
  Scan,
  ShieldAlert,
  Droplets,
  Thermometer,
  Wind,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Leaf,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { FrameViewer } from "./frame-viewer";
import { HoverCard } from "./ui/hover-card";

import { AgriGlassDashboard } from "./agri-glass-dashboard";

interface OverviewTabProps {
  onNavigateToTab: (tab: string) => void;
  onOpenNewScanModal: () => void;
}

export function OverviewTab({ onNavigateToTab, onOpenNewScanModal }: OverviewTabProps) {
  const [activeFrame, setActiveFrame] = useState(1);

  const recentScans = [
    {
      id: "SCAN-8942",
      field: "Tomato Row B - Quad 4",
      time: "12 mins ago",
      crop: "Tomato (Solanum lycopersicum)",
      status: "Threat Detected",
      statusVariant: "destructive" as const,
      anomaly: "Early Blight (Alternaria solani)",
      confidence: "98.4%",
      severity: "Moderate (Level 2)",
    },
    {
      id: "SCAN-8941",
      field: "Potato Quad C - South Field",
      time: "45 mins ago",
      crop: "Potato (Solanum tuberosum)",
      status: "Warning",
      statusVariant: "warning" as const,
      anomaly: "Black Scurf (Rhizoctonia solani)",
      confidence: "94.1%",
      severity: "Low (Level 1)",
    },
    {
      id: "SCAN-8940",
      field: "Tomato Row A - Greenhouse 2",
      time: "2 hours ago",
      crop: "Tomato (Cherry Var)",
      status: "Healthy",
      statusVariant: "success" as const,
      anomaly: "No Pathogens Found",
      confidence: "99.8%",
      severity: "Pristine",
    },
    {
      id: "SCAN-8939",
      field: "Potato Main Quad A",
      time: "4 hours ago",
      crop: "Potato (Russet Burbank)",
      status: "Healthy",
      statusVariant: "success" as const,
      anomaly: "Optimal Foliage Health",
      confidence: "99.2%",
      severity: "Pristine",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Health Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="agri-glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400/80">OVERALL FIELD HEALTH</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sprout className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-white">94.2%</span>
              <span className="flex items-center text-xs font-bold text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +1.8%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-400/60">1,240 Total Acreage Monitored</p>
            <Progress value={94.2} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="agri-glass-card border-amber-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300/80">PATHOGEN THREAT LEVEL</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-amber-200">MODERATE</span>
              <Badge variant="warning" className="text-[10px]">
                2 Anomalies
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-amber-400/60">Tomato Early Blight in Quad 4B</p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-300 font-mono">
              <AlertTriangle className="h-3 w-3 text-amber-400" /> Action directive generated 12m ago
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="agri-glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400/80">AI SCAN CONFIDENCE</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-white">99.4%</span>
              <span className="text-xs font-semibold text-teal-300 font-mono">OPTISCAN-PRO</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-400/60">342 Video Scans Processed Today</p>
            <Progress value={99.4} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="agri-glass-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400/80">CANOPY MICROCLIMATE</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Droplets className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-white">84%</span>
              <span className="text-xs font-semibold text-amber-400">Fungus Risk</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-300/80 font-mono">
              <span className="flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-rose-400" /> 22.4°C
              </span>
              <span className="flex items-center gap-1">
                <Wind className="h-3 w-3 text-teal-400" /> 8 km/h NW
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleek Frosted Glassmorphism AI Platform Dashboard Container */}
      <AgriGlassDashboard />

      {/* Main 150-Frame Video Viewer Viewport */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Scan className="h-5 w-5 text-emerald-400" />
              150-Frame Motion Video Canvas (Aerial Sunset Drone Capture)
            </h2>
            <p className="text-xs text-emerald-400/70">
              Plays continuous aerial field video with AR path tracking. Drag timeline slider or scroll page to scrub frames.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onOpenNewScanModal}
              size="sm"
              variant="outline"
              className="text-xs border-emerald-800/60 text-emerald-300"
            >
              <Scan className="h-3.5 w-3.5 mr-1" /> Trigger Real-Time Drone Sweep
            </Button>
          </div>
        </div>

        {/* Video Canvas Component with AutoPlay enabled */}
        <div className="relative h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 bg-stone-950 shadow-2xl agri-glass-card p-1">
          <FrameViewer
            totalFrames={150}
            autoPlay={true}
            loop={true}
            className="absolute inset-0 h-full w-full overflow-hidden rounded-xl"
            onFrameChange={(frame) => setActiveFrame(frame)}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Scans & Pathology Engines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Scans Feed (2 Cols) */}
        <Card className="lg:col-span-2 agri-glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                Live Video Telemetry Stream
              </CardTitle>
              <CardDescription>
                Real-time plant pathology diagnosis logs from aerial video sweep.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px]">
              UPDATED LIVE
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-emerald-900/20">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 hover:bg-emerald-950/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        scan.statusVariant === "destructive"
                          ? "bg-rose-950/50 border-rose-500/40 text-rose-400"
                          : scan.statusVariant === "warning"
                          ? "bg-amber-950/50 border-amber-500/40 text-amber-400"
                          : "bg-emerald-950/50 border-emerald-500/40 text-emerald-400"
                      }`}
                    >
                      {scan.statusVariant === "destructive" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : scan.statusVariant === "warning" ? (
                        <ShieldAlert className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{scan.anomaly}</span>
                        <Badge variant={scan.statusVariant} className="text-[9px] px-1.5 py-0 font-mono">
                          {scan.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-emerald-400/70 font-medium">
                        {scan.field} • <span className="font-mono">{scan.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-200 font-mono">
                      Conf: {scan.confidence}
                    </div>
                    <div className="text-[10px] text-emerald-400/60">{scan.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pathology Engine Shortcuts (1 Col) */}
        <Card className="agri-glass-card space-y-4">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              Pathology Engines
            </CardTitle>
            <CardDescription>
              Deep dive into crop-specific diagnosis engines.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-5 pt-0">
            <div
              onClick={() => onNavigateToTab("tomato")}
              className="group cursor-pointer rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 transition-all hover:bg-emerald-900/40 hover:border-emerald-400/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Tomato Pathology Engine
                    </h4>
                    <p className="text-[10px] text-emerald-400/70">Solanum lycopersicum</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <div
              onClick={() => onNavigateToTab("potato")}
              className="group cursor-pointer rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 transition-all hover:bg-emerald-900/40 hover:border-emerald-400/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Potato Pathology Engine
                    </h4>
                    <p className="text-[10px] text-emerald-400/70">Solanum tuberosum</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <Button
              onClick={() => onNavigateToTab("insights")}
              variant="emerald"
              className="w-full text-xs font-bold gap-2 py-2"
            >
              <ShieldAlert className="h-4 w-4" />
              Open AI Action Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
