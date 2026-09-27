"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FrameViewer } from "@/components/frame-viewer";
import { LandingHero } from "@/components/landing-hero";
import { AgriGlassDashboard } from "@/components/agri-glass-dashboard";

export default function Home() {
  const router = useRouter();
  const [viewState, setViewState] = useState<"video-hero" | "dashboard">("video-hero");
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [userRole, setUserRole] = useState<string>("Portal Operator");

  const handleVideoComplete = () => {
    setIsVideoCompleted(true);
  };

  const handleLoginSuccess = (role: string) => {
    setUserRole(role || "Portal Operator");
    router.push("/dashboard");
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hidden shortcut: Press Escape, Enter, or Space to instantly skip the video
      if (viewState === "video-hero" && !isVideoCompleted) {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          setIsVideoCompleted(true);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewState, isVideoCompleted]);

  return (
    <div className="relative min-h-screen flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-lime-500/30 selection:text-white overflow-x-hidden">
      {/* PERSISTENT BACKGROUND IMAGE - SMOOTHLY BLURS & ZOOMS SLOWLY ON SIGN IN */}
      <div
        className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          viewState === "dashboard"
            ? "filter blur-[10px] brightness-[102%] saturate-[110%] scale-110 opacity-100"
            : "filter blur-0 brightness-90 saturate-100 scale-100 opacity-50"
        }`}
      >
        <Image
          src="/bg-lush-tapestry.jpeg"
          alt="Lush Greenery Tapestry Background"
          fill
          priority
          className="object-cover transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>

      {/* STATE 1: LANDING PAGE WITH VIDEO HERO */}
      {viewState === "video-hero" && (
        <div className="relative z-10 min-h-screen w-full flex flex-col justify-between">
          <FrameViewer
            totalFrames={150}
            autoPlay={true}
            onFrameChange={(frame) => setCurrentFrame(frame)}
            onComplete={handleVideoComplete}
            isCompleted={isVideoCompleted}
          />

          {isVideoCompleted && (
            <div className="relative z-20 animate-in fade-in zoom-in-95 duration-700">
              <LandingHero
                onLoginSuccess={handleLoginSuccess}
                currentFrame={currentFrame}
                totalFrames={150}
              />
            </div>
          )}
        </div>
      )}

      {/* STATE 2: DASHBOARD UI - RISES UP SLOWLY AND SMOOTHLY WHILE BACKGROUND BLURS */}
      {viewState === "dashboard" && (
        <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
          {/* Top Left Sign Out / Back Action */}
          <div className="absolute top-6 left-6 z-30 animate-in fade-in duration-1000">
            <button
              onClick={() => {
                setViewState("video-hero");
                setIsVideoCompleted(true);
              }}
              className="rounded-full bg-white/20 border border-white/50 backdrop-blur-md px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-lime-400 hover:text-stone-950 transition-all cursor-pointer shadow-xl"
            >
              &larr; Exit Portal
            </button>
          </div>

          {/* 80% WIDTH CENTERED FROSTED GLASS DASHBOARD UI (RISES UP SLOWLY & ELEGANTLY FROM BOTTOM) */}
          <div className="relative z-20 w-full flex items-center justify-center py-6 animate-in fade-in slide-in-from-bottom-36 zoom-in-95 duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <AgriGlassDashboard />
          </div>
        </div>
      )}
    </div>
  );
}
