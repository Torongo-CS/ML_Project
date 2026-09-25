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
    <div className="relative z-10 flex min-h-screen flex-col justify-between p-6 sm:p-12 max-w-[1440px] mx-auto w-full select-none overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] animate-in fade-in font-sans">
      {/* Top spacing */}
      <div className="w-full h-4" />

      {/* MIDDLE SECTION: Left Column Empty (Preserves Farmer Face) | Right Column Vertically Aligned Stack */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 w-full">
        {/* LEFT COLUMN (6 COLS): Kept empty to ensure the farmer's face is 100% unobstructed */}
        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />

        {/* RIGHT COLUMN (6 COLS): Pushed right */}
        <div className="lg:col-span-6 lg:pl-10 transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {!showLoginForm ? (
            <div className="flex flex-col items-start space-y-4 sm:space-y-5 lg:space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000 text-left">
              {/* 1. AGRICURE HEADER (COMPACT PROPORTIONAL FONT SIZE) */}
              <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] animate-floaty-slow">
                AgriCure
              </h1>

              {/* 2. AI POWERED PLANT PATHOLOGY ENGINE & SUBTITLE */}
              <div className="space-y-2 max-w-md animate-floaty-medium font-sans">
                <h2 className="font-syne text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-stone-100/95 leading-snug drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                  AI-Powered Plant Pathology Engine
                </h2>
                <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  Precision Solanum lycopersicum & Solanum tuberosum foliage diagnostic platform engineered with 150-frame neural video vision.
                </p>
              </div>

              {/* 3. SMALL FEATURE TAG BADGES */}
              <div className="flex flex-wrap items-center gap-2 pt-1 animate-floaty-fast font-sans">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/20 px-3.5 py-1.5 text-xs text-stone-100 backdrop-blur-md shadow-lg font-semibold transition-transform hover:scale-105">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>AI Arena</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/20 px-3.5 py-1.5 text-xs text-stone-100 backdrop-blur-md shadow-lg font-semibold transition-transform hover:scale-105">
                  <Leaf className="h-3.5 w-3.5 text-lime-400" />
                  <span>Disease Detector</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/20 px-3.5 py-1.5 text-xs text-stone-100 backdrop-blur-md shadow-lg font-semibold transition-transform hover:scale-105">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
                  <span>High Precision</span>
                </div>
              </div>

              {/* 4. ENTER AGRICURE PORTAL BUTTON */}
              <div className="pt-2 sm:pt-3 animate-floaty-medium">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="group inline-flex items-center gap-3 rounded-full bg-lime-400 hover:bg-lime-300 transition-all duration-300 p-2.5 sm:p-3 pr-6 sm:pr-8 text-stone-950 font-bold text-sm sm:text-base shadow-xl shadow-lime-400/25 cursor-pointer active:scale-95 border border-lime-200/60"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-950 text-lime-400 transition-transform duration-300 group-hover:translate-x-1 shadow-md">
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <span className="font-sans font-bold text-stone-950">Enter AgriCure Portal</span>
                </button>
              </div>
            </div>
          ) : (
            /* FORMAL GLASSMORPHISM LOGIN & SIGNUP PORTAL MATCHING REFERENCE IMAGE STRICTLY */
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-6 rounded-2xl bg-stone-900/40 border border-white/25 backdrop-blur-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right-8 duration-700 max-w-lg w-full flex flex-col animate-floaty-slow font-sans text-left"
            >
              {/* Top Header with Tab Switcher & Close Button */}
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={`pb-2 text-lg sm:text-xl font-bold transition-all relative cursor-pointer ${
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
                    className={`pb-2 text-lg sm:text-xl font-bold transition-all relative cursor-pointer ${
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
                  className="text-stone-300 hover:text-white cursor-pointer rounded-full bg-black/40 p-2 border border-white/15"
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
                  <label className="font-bold text-sm sm:text-base text-white block tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-none border-0 border-b border-b-white/40 focus:border-b-lime-400 bg-transparent py-2 text-sm sm:text-base text-white font-sans placeholder-stone-400/80 focus:outline-none transition-all"
                  />
                </div>
              )}

              {/* E-mail Input Field (Underlined Input, Formal Font) */}
              <div className="space-y-2 animate-floaty-medium">
                <label className="font-bold text-sm sm:text-base text-white block tracking-wide">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your e-mail"
                  className="w-full rounded-none border-0 border-b border-b-white/40 focus:border-b-lime-400 bg-transparent py-2 text-sm sm:text-base text-white font-sans placeholder-stone-400/80 focus:outline-none transition-all"
                />
              </div>

              {/* Password Input Field (Underlined Input, Hidden Password Dots) */}
              <div className="space-y-2 animate-floaty-medium">
                <label className="font-bold text-sm sm:text-base text-white block tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-none border-0 border-b border-b-white/40 focus:border-b-lime-400 bg-transparent py-2 text-sm sm:text-base text-white font-sans placeholder-stone-400/80 focus:outline-none transition-all"
                />

                {/* Sub-controls: Remember me & Forgot your password */}
                <div className="flex items-center justify-between pt-2 text-xs sm:text-sm">
                  <label className="flex items-center gap-2 text-stone-300 font-sans cursor-pointer hover:text-white">
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
              <div className="pt-2 animate-floaty-medium">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-lime-400 hover:bg-lime-300 py-3.5 px-6 text-stone-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center cursor-pointer shadow-xl shadow-lime-400/25 active:scale-[0.98] border border-lime-200/60 font-sans tracking-wide"
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
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300 font-medium">Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className="bg-lime-400/20 text-lime-300 hover:bg-lime-400 hover:text-stone-950 font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer text-xs"
                    >
                      Sign Up Now
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                    <span className="text-stone-300 font-medium">Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className="bg-lime-400/20 text-lime-300 hover:bg-lime-400 hover:text-stone-950 font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer text-xs"
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

      {/* Bottom Spacing */}
      <div className="w-full h-4" />
    </div>
  );
}
