"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers,
  Split,
  Leaf,
  BarChart2,
  FileImage,
  Sparkles,
} from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  accuracy: string;
  latency: string;
  strengths: string[];
}

const AI_MODELS: AIModel[] = [
  {
    id: "agrivision-v4",
    name: "AgriVision-v4 DeepNet (Recommended)",
    accuracy: "99.4%",
    latency: "12ms",
    strengths: ["Early Blight", "Foliar Necrosis", "Late Blight", "Chlorosis"],
  },
  {
    id: "solanum-transformer",
    name: "Solanum-Pathology Transformer v2.8",
    accuracy: "98.7%",
    latency: "24ms",
    strengths: ["Black Scurf", "Septoria Spot", "Powdery Mildew"],
  },
  {
    id: "optiscan-neural",
    name: "OptiScan Neural Vision v4.2",
    accuracy: "99.1%",
    latency: "16ms",
    strengths: ["Leaf Mold", "Bacterial Spot", "Spider Mites"],
  },
];

export function AgriGlassDashboard() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [comparisonModel] = useState<AIModel>(AI_MODELS[1]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  return (
    <div className="w-[80vw] max-w-[1280px] mx-auto font-sans select-none animate-in fade-in zoom-in-95 slide-in-from-bottom-28 duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* 100% LUMINOUS FROSTED LIGHT GLASS CARD OVER TROPICAL LEAF BACKGROUND */}
      <div className="rounded-3xl bg-white/20 backdrop-blur-2xl border-2 border-white/60 p-8 sm:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.35)] text-white space-y-8 text-left">
        
        {/* Header Title Bar */}
        <div className="border-b-2 border-white/40 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-lime-300 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Sparkles className="h-4 w-4 text-lime-300" />
              <span>AGRICULTURAL AI PLATFORM</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
              High-Precision Crop Pathology Dashboard
            </h2>
          </div>
          <span className="rounded-full bg-lime-400 text-stone-950 font-black px-4 py-1.5 text-xs font-mono shadow-md self-start sm:self-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            SYSTEM ONLINE • v4.2
          </span>
        </div>

        {/* 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: MODEL SELECTION & IMAGE INPUT */}
          <div className="space-y-6">
            
            {/* 1. MODEL SELECTION */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Layers className="h-4 w-4 text-lime-300" />
                Select AI Model
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full rounded-2xl bg-white/25 border-2 border-white/60 px-5 py-4 text-sm font-bold text-white flex items-center justify-between hover:bg-white/35 transition-all cursor-pointer shadow-lg backdrop-blur-3xl"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-lime-300" />
                    <span className="text-base font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{selectedModel.name}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-white transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white/30 border-2 border-white/70 p-2 shadow-2xl backdrop-blur-3xl space-y-1">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                          selectedModel.id === model.id
                            ? "bg-lime-400 text-stone-950 font-black shadow-md"
                            : "text-white hover:bg-white/30 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                        }`}
                      >
                        <span className="text-sm font-extrabold">{model.name}</span>
                        <span className="font-mono text-xs">{model.accuracy}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. INPUT SECTION (IMAGE UPLOAD) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <FileImage className="h-4 w-4 text-lime-300" />
                Input Image Section
              </label>
              <label className="block rounded-2xl border-2 border-dashed border-white/60 bg-white/20 p-8 text-center hover:border-lime-300 hover:bg-white/30 transition-all cursor-pointer relative overflow-hidden group backdrop-blur-3xl shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/30 text-lime-300 border-2 border-lime-400/60 shadow-lg group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] group-hover:text-lime-300 transition-colors">
                      {uploadedFile ? `Uploaded File: ${uploadedFile}` : "Click to upload foliage image or drag and drop sample"}
                    </p>
                    <p className="text-xs text-white/95 mt-1 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      Supports high-resolution JPG, PNG, and WebP crop foliage scans
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED AI OUTPUT & STATISTICS */}
          <div className="space-y-6">
            
            {/* 3. ANALYSIS & DETAILED AI OUTPUT AREA */}
            <div className="rounded-2xl bg-white/20 border-2 border-white/50 p-6 space-y-4 shadow-lg backdrop-blur-3xl">
              <div className="flex items-center justify-between border-b-2 border-white/30 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <ShieldCheck className="h-5 w-5 text-lime-300" />
                  Detailed AI Output
                </span>
                <span className="rounded-full bg-lime-400 text-stone-950 px-3.5 py-1 text-xs font-mono font-black shadow-md">
                  Confidence: {selectedModel.accuracy}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Detected Pathogen</span>
                  <span className="text-white font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">Early Blight (Alternaria solani)</span>
                </div>
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Target Crop</span>
                  <span className="text-white font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">Tomato (Solanum lycopersicum)</span>
                </div>
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Severity Level</span>
                  <span className="text-lime-300 font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">Moderate (Level 2)</span>
                </div>
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Active AI Model</span>
                  <span className="text-white font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{selectedModel.name}</span>
                </div>
              </div>

              <div className="rounded-xl bg-lime-400/25 border-2 border-lime-400/60 p-4 flex items-start gap-3 text-xs text-white shadow-md">
                <CheckCircle2 className="h-5 w-5 text-lime-300 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-white block font-black text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Action Directive:</strong>
                  <p className="font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Apply targeted organic Copper Hydroxide (2.4g/L) treatment to affected canopy rows within 48 hours to mitigate foliage spore spread.</p>
                </div>
              </div>
            </div>

            {/* 4. AI ARENA (MODEL COMPARISON SECTION) */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Split className="h-4 w-4 text-lime-300" />
                AI Arena (Model Comparison)
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Model A */}
                <div className="rounded-2xl bg-white/25 border-2 border-lime-400/60 p-4 space-y-2 shadow-md backdrop-blur-3xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-lime-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">MODEL A (Primary)</span>
                    <span className="font-mono text-white font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{selectedModel.accuracy}</span>
                  </div>
                  <p className="text-xs font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{selectedModel.name}</p>
                  <p className="text-[11px] text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Inference Speed: {selectedModel.latency}</p>
                </div>

                {/* Model B */}
                <div className="rounded-2xl bg-white/20 border-2 border-white/50 p-4 space-y-2 shadow-md backdrop-blur-3xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">MODEL B (Benchmark)</span>
                    <span className="font-mono text-white font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{comparisonModel.accuracy}</span>
                  </div>
                  <p className="text-xs font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{comparisonModel.name}</p>
                  <p className="text-[11px] text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Inference Speed: {comparisonModel.latency}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. MODEL STATISTICS & METRICS */}
        <div className="border-t-2 border-white/40 pt-6 space-y-4">
          <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <BarChart2 className="h-4 w-4 text-lime-300" />
            Model Statistics & Detection Strengths
          </label>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Accuracy Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white">
                <span className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Model Diagnostic Accuracy</span>
                <span className="text-lime-300 font-mono font-extrabold text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{selectedModel.accuracy}</span>
              </div>
              <div className="h-3 w-full bg-white/25 rounded-full overflow-hidden p-0.5 border-2 border-white/50 shadow-inner">
                <div
                  className="h-full bg-lime-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_#A3E635]"
                  style={{ width: selectedModel.accuracy }}
                />
              </div>
            </div>

            {/* Strengths Tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Detection Strengths</span>
              <div className="flex flex-wrap gap-2">
                {selectedModel.strengths.map((strength, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/25 border-2 border-white/50 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                  >
                    <Leaf className="h-3.5 w-3.5 text-lime-300" />
                    <span>{strength}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
