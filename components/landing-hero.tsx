"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  X,
  Sparkles,
  Leaf,
  ShieldCheck,
} from "lucide-react";

interface DominicStyleLayoutProps {
  onLoginSuccess: (role: string) => void;
  currentFrame: number;
  totalFrames: number;
}

export function LandingHero({
  onLoginSuccess,
  currentFrame,
  totalFrames,
}: DominicStyleLayoutProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("agronomist@agricure.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess("Portal Operator");
    }, 800);
  };

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-center p-4 sm:p-8 lg:p-12 select-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] animate-in fade-in font-sans">
      {/* MIDDLE SECTION: Left Column Empty (Preserves Farmer Face) | Right Column Vertically Aligned Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center py-6 sm:py-8 w-full auto-rows-max max-w-[1440px] mx-auto">
        {/* LEFT COLUMN (6 COLS): Kept empty to ensure the farmer's face is 100% unobstructed */}
        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />

        {/* RIGHT COLUMN (6 COLS): Pushed right */}
        <div className="col-span-1 lg:col-span-6 lg:pl-10 transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {!showLoginForm ? (
            <div className="flex flex-col items-start space-y-3 sm:space-y-4 lg:space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000 text-left">
              {/* 1. AGRICURE HEADER (COMPACT PROPORTIONAL FONT SIZE) */}
              <h1 className="font-syne text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] animate-floaty-slow">
                AgriCure
              </h1>

              {/* 2. AI POWERED PLANT PATHOLOGY ENGINE & SUBTITLE */}
              <div className="space-y-2 max-w-md animate-floaty-medium font-sans">
                <h2 className="font-syne text-base sm:text-lg lg:text-2xl font-extrabold tracking-tight text-stone-100/95 leading-snug drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                  AI-Powered Plant Pathology Engine
                </h2>
                <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  Precision Solanum lycopersicum & Solanum tuberosum foliage diagnostic platform engineered with 150-frame neural video vision.
                </p>
              </div>

              {/* 3. SMALL FEATURE TAG BADGES */}
              <div className="flex flex-wrap items-center gap-2 pt-1 animate-floaty-fast font-sans">
                <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/50 border border-white/20 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs text-stone-100 backdrop-blur-md shadow-lg font-semibold transition-transform hover:scale-105 min-h-8">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-emerald-400" />
                  <span className="hidden sm:inline">AI Arena</span>
                  <span className="sm:hidden text-xs">Arena</span>
                </div>
                <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/50 border border-white/20 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs text-stone-100 backdrop-blur-md shadow-lg font-semibold transition-transform hover:scale-105 min-h-8">
                  <Leaf className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-lime-400" />
                  <span className="hidden sm:inline">Disease Detector</span>
                  <span className="sm:hidden text-xs">Detector</span>
                </div>
                <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/50 border border-white/20 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs text-stone-100 backdrop-blur-md shadow-lg font-semibold transition-transform hover:scale-105 min-h-8">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-teal-300" />
                  <span className="hidden sm:inline">High Precision</span>
                  <span className="sm:hidden text-xs">Precise</span>
                </div>
              </div>

              {/* 4. ENTER AGRICURE PORTAL BUTTON */}
              <div className="pt-3 sm:pt-4 lg:pt-5 animate-floaty-medium w-full sm:w-auto">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="group flex items-center gap-2 sm:gap-3 rounded-full bg-lime-400 hover:bg-lime-300 transition-all duration-300 p-2.5 sm:p-3 lg:p-4 pr-4 sm:pr-6 lg:pr-8 text-stone-950 font-bold text-sm sm:text-base shadow-xl shadow-lime-400/25 cursor-pointer active:scale-95 border border-lime-200/60 min-h-11 w-full sm:w-auto justify-center sm:justify-start relative z-20"
                >
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-stone-950 text-lime-400 transition-transform duration-300 group-hover:translate-x-1 shadow-md shrink-0">
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <span className="font-sans font-bold text-stone-950 text-sm sm:text-base">Enter AgriCure Portal</span>
                </button>
              </div>
            </div>
          ) : (
            /* FORMAL GLASSMORPHISM LOGIN & SIGNUP PORTAL MATCHING REFERENCE IMAGE STRICTLY */
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-5 sm:space-y-6 rounded-2xl bg-stone-900/40 border border-white/25 backdrop-blur-3xl p-5 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right-8 duration-700 max-w-lg w-full flex flex-col animate-floaty-slow font-sans text-left"
            >
              {/* Top Header with Tab Switcher & Close Button */}
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <div className="flex gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={`pb-2 text-base sm:text-lg lg:text-xl font-bold transition-all relative cursor-pointer min-h-10 ${
                      authMode === "signin"
                        ? "text-white after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-lime-400"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={`pb-2 text-base sm:text-lg lg:text-xl font-bold transition-all relative cursor-pointer min-h-10 ${
                      authMode === "signup"
                        ? "text-white after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-lime-400"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="text-stone-300 hover:text-white cursor-pointer rounded-full bg-black/40 p-2 border border-white/15 min-h-10 min-w-10 flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Subtitle */}
              <div>
                <p className="text-xs sm:text-sm text-stone-300/80 font-normal">
                  {authMode === "signin"
                    ? "Enter your credentials to access the AgriCure portal."
                    : "Create a new account to access high-precision pathology analysis."}
                </p>
              </div>

              {/* Full Name Input for Signup */}
              {authMode === "signup" && (
                <div className="space-y-2 animate-floaty-fast">
                  <label className="font-bold text-sm text-white block tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-none border-0 border-b border-b-white/40 focus:border-b-lime-400 bg-transparent py-2.5 text-sm text-white font-sans placeholder-stone-400/80 focus:outline-none transition-all min-h-11"
                  />
                </div>
              )}

              {/* E-mail Input Field (Underlined Input, Formal Font) */}
              <div className="space-y-2 animate-floaty-medium">
                <label className="font-bold text-sm text-white block tracking-wide">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your e-mail"
                  className="w-full rounded-none border-0 border-b border-b-white/40 focus:border-b-lime-400 bg-transparent py-2.5 text-sm text-white font-sans placeholder-stone-400/80 focus:outline-none transition-all min-h-11"
                />
              </div>

              {/* Password Input Field (Underlined Input, Hidden Password Dots) */}
              <div className="space-y-2 animate-floaty-medium">
                <label className="font-bold text-sm text-white block tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-none border-0 border-b border-b-white/40 focus:border-b-lime-400 bg-transparent py-2.5 text-sm text-white font-sans placeholder-stone-400/80 focus:outline-none transition-all min-h-11"
                />

                {/* Sub-controls: Remember me & Forgot your password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 pt-3 text-xs sm:text-sm">
                  <label className="flex items-center gap-2 text-stone-300 font-sans cursor-pointer hover:text-white min-h-9">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/40 bg-transparent text-lime-400 focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-lime-400 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-stone-300 hover:text-lime-400 transition-colors font-sans cursor-pointer font-medium"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Light Lime Formal Action Submit Button */}
              <div className="pt-1.5 sm:pt-2 animate-floaty-medium">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-lime-400 hover:bg-lime-300 py-3 sm:py-3.5 px-5 sm:px-6 text-stone-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center cursor-pointer shadow-xl shadow-lime-400/25 active:scale-[0.98] border border-lime-200/60 font-sans tracking-wide min-h-12"
                >
                  <span>
                    {isLoading
                      ? "Authenticating..."
                      : authMode === "signin"
                      ? "Sign in"
                      : "Sign up"}
                  </span>
                </button>
              </div>

              {/* Prominent Visible Sign Up Switch Banner */}
              <div className="pt-2 text-center text-xs sm:text-sm text-stone-300 font-sans">
                {authMode === "signin" ? (
                  <div className="bg-white/5 rounded-lg p-3 sm:p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                    <span className="text-stone-300 font-medium text-sm">Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className="bg-lime-400/20 text-lime-300 hover:bg-lime-400 hover:text-stone-950 font-bold px-3 py-2 sm:py-1.5 rounded-md transition-all cursor-pointer text-xs min-h-10 w-full sm:w-auto"
                    >
                      Sign Up Now
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-lg p-3 sm:p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                    <span className="text-stone-300 font-medium text-sm">Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className="bg-lime-400/20 text-lime-300 hover:bg-lime-400 hover:text-stone-950 font-bold px-3 py-2 sm:py-1.5 rounded-md transition-all cursor-pointer text-xs min-h-10 w-full sm:w-auto"
                    >
                      Sign In Here
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
