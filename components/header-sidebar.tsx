"use client";

import React, { useState } from "react";
import {
  Sprout,
  Scan,
  ShieldAlert,
  Activity,
  Search,
  ChevronDown,
  Leaf,
  Radio,
  FileText,
  Video,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenNewScanModal: () => void;
  onOpenReportModal: () => void;
  isBgCanvasActive: boolean;
  onToggleBgCanvas: () => void;
}

export function HeaderSidebar({
  activeTab,
  onTabChange,
  onOpenNewScanModal,
  onOpenReportModal,
  isBgCanvasActive,
  onToggleBgCanvas,
}: HeaderSidebarProps) {
  const [selectedLocation, setSelectedLocation] = useState("Sector 4 - North Tomato & Potato Quad");

  const navItems = [
    {
      id: "overview",
      label: "Crop Overview & Video Stream",
      icon: Activity,
      badge: "LIVE VIDEO",
      badgeColor: "success" as const,
    },
    {
      id: "tomato",
      label: "Tomato Pathology Engine",
      icon: Leaf,
      badge: "2 Alerts",
      badgeColor: "destructive" as const,
    },
    {
      id: "potato",
      label: "Potato Pathology Engine",
      icon: Sprout,
      badge: "1 Warning",
      badgeColor: "warning" as const,
    },
    {
      id: "insights",
      label: "AI Action Plan & Directives",
      icon: ShieldAlert,
      badge: "4 Actions",
      badgeColor: "default" as const,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/25 bg-white/10 backdrop-blur-xl shadow-lg">
      {/* Top Notification Announcement Banner */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-1.5 text-[11px] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="font-semibold text-lime-300">SYSTEM AGRI-NODE ACTIVE:</span>
          <span>Sequential 150-frame aerial drone video loop active. Spore germination alert in Quad 4B.</span>
        </div>
        <button
          onClick={() => onTabChange("insights")}
          className="font-bold underline text-lime-300 hover:text-white cursor-pointer"
        >
          View Action Plan &rarr;
        </button>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Location Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-stone-950 shadow-lg font-bold border border-lime-200">
              <Sprout className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne text-lg font-bold tracking-tight text-white drop-shadow-sm">
                  AGRI-VISION <span className="text-lime-400 font-extrabold">AI</span>
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-mono border-white/30 text-lime-300 bg-white/10">
                  Precision v4.2
                </Badge>
              </div>
              <div className="text-[11px] text-white/80 font-medium">
                Solanum Pathology & Video Motion Engine
              </div>
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 text-xs text-white shadow-sm backdrop-blur-md">
            <Radio className="h-3.5 w-3.5 text-lime-400 animate-pulse" />
            <span className="font-semibold text-white">{selectedLocation}</span>
            <ChevronDown className="h-3.5 w-3.5 text-white/60" />
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Toggle Full Page Video Canvas Background */}
          <Button
            onClick={onToggleBgCanvas}
            variant={isBgCanvasActive ? "emerald" : "outline"}
            size="sm"
            className="gap-2 text-xs font-bold"
          >
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isBgCanvasActive ? "Video Background ON" : "Video Background OFF"}
            </span>
          </Button>

          {/* Quick Drone Scan Button */}
          <Button
            onClick={onOpenNewScanModal}
            variant="emerald"
            size="sm"
            className="gap-2 font-bold shadow-emerald-950"
          >
            <Scan className="h-4 w-4" />
            <span className="hidden sm:inline">New Drone Sweep</span>
          </Button>

          {/* Export Report Button */}
          <Button
            onClick={onOpenReportModal}
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-emerald-800/60"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span className="hidden md:inline">Export Report</span>
          </Button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className="flex space-x-2 border-t border-white/20 pt-2 pb-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-lime-400 text-stone-950 shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-stone-950" : "text-white"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant={item.badgeColor} className="ml-1 text-[9px] px-1.5 py-0 font-mono">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
