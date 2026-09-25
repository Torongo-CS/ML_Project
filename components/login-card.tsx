"use client";

import React, { useState } from "react";
import { ShieldCheck, RotateCcw } from "lucide-react";

interface LoginCardProps {
  onLoginSubmit: (email: string, role: string) => void;
  onReplayScan?: () => void;
}

export function LoginCard({ onLoginSubmit, onReplayScan }: LoginCardProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSubmit(email || "operator@agricure.ai", "Portal Operator");
    }, 800);
  };

  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-stone-900/40 backdrop-blur-3xl border border-white/25 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-stone-100 space-y-6 transition-all duration-700 animate-in fade-in zoom-in-95 font-sans animate-floaty-slow agri-glass-card text-left">
      {/* Prominent Visible Tab Header for Sign In / Sign Up */}
      <div className="flex border-b border-white/20 pb-1 gap-6">
        <button
          type="button"
          onClick={() => setAuthMode("signin")}
          className={`pb-2 text-lg sm:text-xl font-bold transition-all relative cursor-pointer ${
            authMode === "signin"
              ? "text-white after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-lime-400"
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
              ? "text-white after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-lime-400"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Sign Up
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

      {/* Login & Signup Form matching reference image strictly */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Full Name for Signup */}
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

        {/* E-mail Input Field */}
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

        {/* Password Input Field */}
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

        {/* Light Lime Action Button */}
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

      {/* Footer Controls */}
      <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs font-mono text-stone-300">
        <div className="flex items-center gap-2 text-lime-400 font-bold">
          <ShieldCheck className="h-4 w-4 stroke-[2]" />
          <span>OptiScan Node v4.2 Active</span>
        </div>

        {onReplayScan && (
          <button
            onClick={onReplayScan}
            className="flex items-center gap-1.5 text-stone-400 hover:text-lime-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Replay Video</span>
          </button>
        )}
      </div>
    </div>
  );
}


