"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AgriGlassDashboard } from "@/components/agri-glass-dashboard";
import { ArrowLeft, Split } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-lime-500/30 selection:text-white overflow-x-hidden p-4 sm:p-8 select-none">
      {/* PERSISTENT BACKGROUND IMAGE - MATCHING LANDING & ARENA */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none filter blur-[10px] brightness-[102%] saturate-[110%] scale-110 opacity-100 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <Image
          src="/bg-lush-tapestry.jpeg"
          alt="Lush Greenery Tapestry Background"
          fill
          priority
          className="object-cover transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>

      {/* TOP NAVIGATION BAR */}
      <div className="relative z-20 max-w-[1280px] mx-auto w-full flex items-center justify-between py-4 animate-in fade-in duration-1000">
        <Link
          href="/"
          className="rounded-full bg-white/20 border border-white/50 backdrop-blur-md px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-lime-400 hover:text-stone-950 transition-all cursor-pointer shadow-xl inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit to Home</span>
        </Link>

        <Link
          href="/arena"
          className="rounded-full bg-lime-400 border border-lime-200 backdrop-blur-md px-6 py-2.5 text-xs font-mono font-black text-stone-950 hover:bg-lime-300 transition-all cursor-pointer shadow-xl inline-flex items-center gap-2"
        >
          <Split className="h-4 w-4" />
          <span>Go to AI Arena</span>
        </Link>
      </div>

      {/* CENTERED FROSTED GLASS DASHBOARD UI */}
      <div className="relative z-10 w-full flex items-center justify-center py-6 animate-in fade-in slide-in-from-bottom-36 zoom-in-95 duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <AgriGlassDashboard />
      </div>
    </div>
  );
}
