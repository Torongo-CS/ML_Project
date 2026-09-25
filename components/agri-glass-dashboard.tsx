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
  Loader2,
} from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  accuracy: string;
  latency: string;
  strengths: string[];
}

const INITIAL_AI_MODELS: AIModel[] = [
  {
    id: "efficientnet-b1",
    name: "EfficientNet_B1_Complete (Recommended)",
    accuracy: "98.03%",
    latency: "14ms",
    strengths: ["Potato___Early_blight", "Potato___Late_blight", "Tomato_Septoria_leaf_spot"],
  }
];

export function AgriGlassDashboard() {
  const [aiModels, setAiModels] = useState<AIModel[]>(INITIAL_AI_MODELS);
  const [selectedModel, setSelectedModel] = useState<AIModel>(INITIAL_AI_MODELS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  // Real data state placeholders
  const [detectedPathogen, setDetectedPathogen] = useState<string>("-");
  const [severity] = useState<string>("-"); // Hardcoded to "-" for now
  const [actionDirective, setActionDirective] = useState<string>("Upload a crop image to generate an AI-driven action directive.");
  const [displayedDirective, setDisplayedDirective] = useState<string>("Upload a crop image to generate an AI-driven action directive.");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiPredictions, setApiPredictions] = useState<Record<string, any>>({});

  // Dynamically calculate the best comparison model (highest accuracy other than selected)
  const comparisonModel = React.useMemo(() => {
    const others = aiModels.filter((m) => m.id !== selectedModel.id);
    if (others.length === 0) return selectedModel;
    return others.sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy))[0];
  }, [selectedModel, aiModels]);

  // Fetch AI Models on mount
  React.useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("http://localhost:8000/models");
        if (res.ok) {
          const data = await res.json();
          if (data.models && data.models.length > 0) {
            setAiModels(data.models);
            setSelectedModel(data.models[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch models from backend", err);
      }
    }
    fetchModels();
  }, []);

  // Fake streaming effect for Action Directive
  React.useEffect(() => {
    if (actionDirective === "Upload a crop image to generate an AI-driven action directive." || 
        actionDirective === "..." || 
        actionDirective === "Unable to fetch recommendation.") {
      setDisplayedDirective(actionDirective);
      return;
    }

    setDisplayedDirective("");
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedDirective((prev) => actionDirective.slice(0, i + 1));
      i++;
      if (i >= actionDirective.length) {
        clearInterval(intervalId);
      }
    }, 15); // Adjust typing speed here (ms per character)

    return () => clearInterval(intervalId);
  }, [actionDirective]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(URL.createObjectURL(file));
      
      setIsGenerating(true);
      setDetectedPathogen("Analyzing Image...");
      setActionDirective("...");
      
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        // 1. Fetch Machine Learning predictions
        const mlRes = await fetch("http://localhost:8000/predict", {
          method: "POST",
          body: formData
        });
        
        if (mlRes.ok) {
          const mlData = await mlRes.json();
          const pathogenName = mlData.predictions[selectedModel.id]?.pathogen || "Healthy (No Pathogen)";
          
          // 2. Fetch Gemini Action Directive using the ML result
          const geminiRes = await fetch('/api/action-directive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pathogen: pathogenName })
          });
          
          let directive = "Unable to fetch recommendation.";
          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            directive = geminiData.actionDirective;
          }
          
          // 3. Update all UI state simultaneously
          setApiPredictions(mlData.predictions);
          setDetectedPathogen(pathogenName);
          setActionDirective(directive);
          
        } else {
          console.error("Backend API Error. Make sure FastAPI is running on port 8000.");
          setDetectedPathogen("-");
          setActionDirective("Upload a crop image to generate an AI-driven action directive.");
        }
      } catch (err) {
        console.error("Failed to connect to backend", err);
        setDetectedPathogen("-");
        setActionDirective("Upload a crop image to generate an AI-driven action directive.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Re-sync primary model prediction and fetch new directive if user changes the dropdown while a prediction exists
  React.useEffect(() => {
    if (apiPredictions[selectedModel.id] && detectedPathogen !== "-" && detectedPathogen !== "Analyzing Image...") {
      const newPathogen = apiPredictions[selectedModel.id].pathogen;
      if (newPathogen !== detectedPathogen) {
        setDetectedPathogen("Analyzing Image...");
        setActionDirective("...");
        setIsGenerating(true);
        
        fetch('/api/action-directive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pathogen: newPathogen })
        })
        .then(res => res.json())
        .then(data => {
          setDetectedPathogen(newPathogen);
          setActionDirective(data.actionDirective);
        })
        .finally(() => setIsGenerating(false));
      }
    }
  }, [selectedModel.id, apiPredictions]);

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
                    {aiModels.map((model) => (
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
              <label className="block rounded-2xl border-2 border-dashed border-white/60 bg-white/20 p-2 text-center hover:border-lime-300 hover:bg-white/30 transition-all cursor-pointer relative overflow-hidden group backdrop-blur-3xl shadow-md min-h-[140px] flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {uploadedFile ? (
                   <div className="relative w-full rounded-xl overflow-hidden border border-white/30 bg-black/20 flex items-center justify-center min-h-[140px]">
                     <img src={uploadedFile.startsWith('blob:') ? uploadedFile : `/${uploadedFile.replace('/', '')}`} alt="Uploaded foliage" className="w-full h-auto max-h-64 object-contain" />
                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="h-6 w-6 text-white mb-2" />
                        <span className="text-white font-bold text-sm">Change Image</span>
                     </div>
                   </div>
                ) : (
                <div className="flex flex-col items-center justify-center space-y-3 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/30 text-lime-300 border-2 border-lime-400/60 shadow-lg group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] group-hover:text-lime-300 transition-colors">
                      Click to upload foliage image or drag and drop sample
                    </p>
                    <p className="text-xs text-white/95 mt-1 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      Supports high-resolution JPG, PNG, and WebP crop foliage scans
                    </p>
                  </div>
                </div>
                )}
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
                  Detailed Results
                </span>
                <span className="rounded-full bg-lime-400 text-stone-950 px-3.5 py-1 text-xs font-mono font-black shadow-md">
                  Confidence: {apiPredictions[selectedModel.id] ? `${(apiPredictions[selectedModel.id].confidence * 100).toFixed(1)}%` : selectedModel.accuracy}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Detected Pathogen</span>
                  <span className="text-white font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] flex items-center gap-2">
                    {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-lime-300" />}
                    {detectedPathogen}
                  </span>
                </div>
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Target Crop</span>
                  <span className="text-white font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    {detectedPathogen === "-" ? "-" : detectedPathogen.includes("Tomato") ? "Tomato" : detectedPathogen.includes("Potato") ? "Potato" : "General Plant"}
                  </span>
                </div>
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Severity Level</span>
                  <span className="text-lime-300 font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    {isGenerating ? "Analyzing..." : severity}
                  </span>
                </div>
                <div>
                  <span className="text-lime-300 font-extrabold text-[11px] uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Active AI Model</span>
                  <span className="text-white font-extrabold text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{selectedModel.name}</span>
                </div>
              </div>

              <div className="rounded-xl bg-lime-400/25 border-2 border-lime-400/60 p-4 flex items-start gap-3 text-xs text-white shadow-md min-h-[140px] transition-all duration-500 ease-in-out">
                {isGenerating ? (
                  <Sparkles className="h-5 w-5 text-lime-300 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-lime-300 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <strong className="text-white block font-black text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Action Directive:
                  </strong>
                  <p className="font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {displayedDirective}
                  </p>
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
                    <span className="font-mono text-white font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {apiPredictions[selectedModel.id] ? `${(apiPredictions[selectedModel.id].confidence * 100).toFixed(1)}%` : selectedModel.accuracy}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {selectedModel.name}
                  </p>
                  <p className="text-[11px] text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Inference Speed: {apiPredictions[selectedModel.id] ? `${apiPredictions[selectedModel.id].latency_ms}ms` : selectedModel.latency}
                  </p>
                </div>

                {/* Model B */}
                <div className="rounded-2xl bg-white/20 border-2 border-white/50 p-4 space-y-2 shadow-md backdrop-blur-3xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">MODEL B (Benchmark)</span>
                    <span className="font-mono text-white font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      {apiPredictions[comparisonModel.id] ? `${(apiPredictions[comparisonModel.id].confidence * 100).toFixed(1)}%` : comparisonModel.accuracy}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {comparisonModel.name}
                  </p>
                  <p className="text-[11px] text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    Inference Speed: {apiPredictions[comparisonModel.id] ? `${apiPredictions[comparisonModel.id].latency_ms}ms` : comparisonModel.latency}
                  </p>
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
