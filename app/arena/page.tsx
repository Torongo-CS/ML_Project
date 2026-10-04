"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  XCircle,
  BarChart2,
  Split,
  Plus,
  Play,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";

interface ArenaRow {
  id: string;
  imageSrc: string;
  file?: File;
  realLabel: string;
  predictions: Record<
    string,
    { pathogen: string; confidence: number; latency_ms: number }
  >;
  isPredicting?: boolean;
}

const AVAILABLE_DISEASES = [
  "Potato___Early_blight",
  "Potato___Late_blight",
  "Potato___healthy",
  "Tomato_Early_blight",
  "Tomato_Late_blight",
  "Tomato_Leaf_Mold",
  "Tomato_Septoria_leaf_spot",
  "Tomato_healthy",
];

// Initial rows loaded directly from Test_Images_For_gradcam
const INITIAL_ROWS: ArenaRow[] = [
  {
    id: "row-1",
    imageSrc: "/Test_Images_For_gradcam/Potato_Early_Blight.JPG",
    realLabel: "Potato___Early_blight",
    predictions: {},
  },
  {
    id: "row-2",
    imageSrc: "/Test_Images_For_gradcam/Potato_Late_Blight.JPG",
    realLabel: "Potato___Late_blight",
    predictions: {},
  },
  {
    id: "row-3",
    imageSrc: "/Test_Images_For_gradcam/Potato_healthy.JPG",
    realLabel: "Potato___healthy",
    predictions: {},
  },
  {
    id: "row-4",
    imageSrc: "/Test_Images_For_gradcam/Tomato_Early_Blight.JPG",
    realLabel: "Tomato_Early_blight",
    predictions: {},
  },
  {
    id: "row-5",
    imageSrc: "/Test_Images_For_gradcam/Tomato_Healthy.JPG",
    realLabel: "Tomato_healthy",
    predictions: {},
  },
  {
    id: "row-6",
    imageSrc: "/Test_Images_For_gradcam/Tomato_Late_Blight.JPG",
    realLabel: "Tomato_Late_blight",
    predictions: {},
  },
  {
    id: "row-7",
    imageSrc: "/Test_Images_For_gradcam/Tomato_Mold.JPG",
    realLabel: "Tomato_Leaf_Mold",
    predictions: {},
  },
  {
    id: "row-8",
    imageSrc: "/Test_Images_For_gradcam/Tomato_septoria.JPG",
    realLabel: "Tomato_Septoria_leaf_spot",
    predictions: {},
  },
];

const MODEL_COLUMNS = [
  { key: "ensemble", label: "Ensemble (Soft Vote)" },
  { key: "yolov11n", label: "YOLOv11n" },
  { key: "yolov8n", label: "YOLOv8n" },
  { key: "google-cropnet", label: "Google_CropNet" },
  { key: "efficientnet-b2", label: "EfficientNet_B2" },
  { key: "swin-v2-t", label: "Swin_V2_T" },
  { key: "shufflenet-v2", label: "ShuffleNet_V2" },
];

function normalize(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/___/g, "_").replace(/[-\s]/g, "_").trim();
}

function formatLabel(str: string): string {
  if (!str) return "-";
  return str.replace(/___/g, " - ").replace(/_/g, " ");
}

export default function AiArenaPage() {
  const [rows, setRows] = useState<ArenaRow[]>(INITIAL_ROWS);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Run live backend inference for a specific row by sending the actual image file/blob
  const runPredictionForRow = async (rowId: string, imageFile?: File, imageSrc?: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, isPredicting: true } : r))
    );

    try {
      let fileToUpload: Blob | File;
      if (imageFile) {
        fileToUpload = imageFile;
      } else {
        const fetchSrc = imageSrc || "/Test_Images_For_gradcam/Potato_Early_Blight.JPG";
        const res = await fetch(fetchSrc);
        fileToUpload = await res.blob();
      }

      const formData = new FormData();
      formData.append("file", fileToUpload, "crop_scan.jpg");

      const apiRes = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      }).catch(() => null);

      if (apiRes && apiRes.ok) {
        const data = await apiRes.json();
        if (data.predictions) {
          setRows((prev) =>
            prev.map((r) =>
              r.id === rowId
                ? {
                    ...r,
                    predictions: data.predictions,
                    isPredicting: false,
                  }
                : r
            )
          );
          return;
        }
      }
    } catch (err) {
      console.error("Live inference failed for row:", rowId, err);
    } finally {
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, isPredicting: false } : r))
      );
    }
  };

  // Run live inference for all rows in parallel
  const handleRunAllPredictions = async () => {
    setIsProcessingAll(true);
    await Promise.all(
      rows.map((row) => runPredictionForRow(row.id, row.file, row.imageSrc))
    );
    setIsProcessingAll(false);
  };

  // On initial mount, automatically feed initial sample images into live backend
  useEffect(() => {
    handleRunAllPredictions();
  }, []);

  // Add multiple uploaded files as new rows and trigger live backend inference in parallel
  const handleMultipleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newRows: ArenaRow[] = filesArray.map((file, idx) => ({
        id: `upload-${Date.now()}-${idx}`,
        imageSrc: URL.createObjectURL(file),
        file: file,
        realLabel: "Potato___Early_blight",
        predictions: {},
        isPredicting: true,
      }));

      setRows((prev) => [...prev, ...newRows]);

      await Promise.all(
        newRows.map((newRow) =>
          runPredictionForRow(newRow.id, newRow.file, newRow.imageSrc)
        )
      );
    }
  };

  // Clipboard paste event listener (Ctrl+V / Cmd+V anywhere in AI Arena)
  useEffect(() => {
    const handlePasteInArena = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      const pastedFiles: File[] = [];

      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            const blob = item.getAsFile();
            if (blob) {
              e.preventDefault();
              pastedFiles.push(new File([blob], `pasted_crop_${Date.now()}_${i}.png`, { type: blob.type }));
            }
          }
        }
      }

      if (pastedFiles.length === 0) {
        const files = e.clipboardData?.files;
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith("image/")) {
              e.preventDefault();
              pastedFiles.push(files[i]);
            }
          }
        }
      }

      if (pastedFiles.length === 0) {
        const html = e.clipboardData?.getData("text/html");
        if (html) {
          const match = html.match(/src=["'](https?:\/\/[^"']+|data:image\/[^"']+)["']/i);
          if (match && match[1]) {
            e.preventDefault();
            try {
              const res = await fetch(match[1]);
              const blob = await res.blob();
              pastedFiles.push(new File([blob], `pasted_browser_image_${Date.now()}.png`, { type: blob.type || "image/png" }));
            } catch (err) {
              console.warn("Failed to fetch image from pasted HTML src", err);
            }
          }
        }
      }

      if (pastedFiles.length > 0) {
        const newRows: ArenaRow[] = pastedFiles.map((file, idx) => ({
          id: `upload-${Date.now()}-${idx}`,
          imageSrc: URL.createObjectURL(file),
          file: file,
          realLabel: "Potato___Early_blight",
          predictions: {},
          isPredicting: true,
        }));

        setRows((prev) => [...prev, ...newRows]);

        await Promise.all(
          newRows.map((newRow) =>
            runPredictionForRow(newRow.id, newRow.file, newRow.imageSrc)
          )
        );
      }
    };

    window.addEventListener("paste", handlePasteInArena);
    return () => window.removeEventListener("paste", handlePasteInArena);
  }, []);

  // Update ground truth Real Label for a row
  const handleLabelChange = (rowId: string, newLabel: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, realLabel: newLabel } : r))
    );
  };

  // Delete a specific row
  const handleDeleteRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  // Calculate Accuracy metrics per model across all rows with live predictions
  const calculateModelAccuracy = (colKey: string) => {
    let correct = 0;
    let total = 0;
    rows.forEach((row) => {
      const pred = row.predictions[colKey]?.pathogen;
      if (pred) {
        total++;
        if (normalize(pred) === normalize(row.realLabel)) {
          correct++;
        }
      }
    });
    if (total === 0) return "--";
    return `${((correct / total) * 100).toFixed(0)}% (${correct}/${total})`;
  };

  // Mobile Card Component for Arena
  const MobileArenaCard = ({ row, onDelete, onLabelChange, onRunPrediction }: any) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const ensemblePred = row.predictions.ensemble;
    const ensembleIsMatch = ensemblePred && normalize(ensemblePred.pathogen) === normalize(row.realLabel);

    return (
      <div className="rounded-2xl bg-white/20 border-2 border-white/50 p-4 space-y-3 shadow-lg backdrop-blur-3xl">
        {/* Header with Image & Delete */}
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3 min-w-0">
            {/* Image Thumbnail */}
            <div className="h-14 w-14 rounded-lg overflow-hidden border-2 border-white/50 shadow-md flex-shrink-0 bg-black/30">
              <img src={row.imageSrc} alt="Foliage scan" className="w-full h-full object-cover" />
            </div>

            {/* Real Label Selector */}
            <div className="min-w-0 flex-1">
              <label className="text-[10px] font-black text-lime-300 uppercase block mb-1 drop-shadow">
                Real Label
              </label>
              <select
                value={row.realLabel}
                onChange={(e) => onLabelChange(row.id, e.target.value)}
                className="w-full rounded-lg bg-white/20 border-2 border-white/50 px-2.5 py-1.5 text-xs font-black text-white cursor-pointer hover:bg-white/30 transition-all outline-none shadow-sm"
              >
                {AVAILABLE_DISEASES.map((d) => (
                  <option key={d} value={d} className="bg-stone-900 text-white font-extrabold">
                    {formatLabel(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/40 transition-all cursor-pointer shadow-sm flex-shrink-0 min-h-10 min-w-10 flex items-center justify-center"
            title="Delete this row"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Ensemble Prediction (Always Visible) */}
        <div className="rounded-lg bg-lime-400/15 border-2 border-lime-400/50 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-lime-300 uppercase flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Ensemble Vote
            </span>
            {row.isPredicting ? (
              <div className="flex items-center gap-1 text-[11px] text-lime-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Inferring...</span>
              </div>
            ) : ensemblePred ? (
              <span className={`text-xs font-black font-mono ${ensembleIsMatch ? 'text-emerald-300' : 'text-rose-300'}`}>
                {ensembleIsMatch ? '✓' : '✗'}
              </span>
            ) : null}
          </div>

          {row.isPredicting ? (
            <div className="text-xs text-lime-300 font-bold">Processing...</div>
          ) : ensemblePred ? (
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-white truncate" title={formatLabel(ensemblePred.pathogen)}>
                {formatLabel(ensemblePred.pathogen)}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-lime-300 font-bold">{(ensemblePred.confidence * 100).toFixed(1)}%</span>
                <span className="text-white/70">{ensemblePred.latency_ms}ms</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onRunPrediction(row.id, row.file, row.imageSrc)}
              className="w-full rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 px-2.5 py-1.5 text-xs text-lime-300 font-bold transition-all cursor-pointer min-h-9"
            >
              Run Inference
            </button>
          )}
        </div>

        {/* Expandable Other Models Section */}
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full rounded-lg border-2 border-white/40 bg-white/10 hover:bg-white/15 px-3 py-2.5 text-xs font-black text-white flex items-center justify-between transition-all cursor-pointer"
          >
            <span>View All Models (6 more)</span>
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              {MODEL_COLUMNS.filter(col => col.key !== 'ensemble').map((col) => {
                const predObj = row.predictions[col.key];
                const pathogen = predObj?.pathogen;
                const isMatch = pathogen && normalize(pathogen) === normalize(row.realLabel);

                return (
                  <div key={col.key} className="rounded-lg bg-white/10 border-2 border-white/30 p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black text-white truncate">{col.label}</span>
                      {row.isPredicting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-lime-300 flex-shrink-0" />
                      ) : pathogen ? (
                        <span className={`text-xs font-black ${isMatch ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {isMatch ? '✓' : '✗'}
                        </span>
                      ) : null}
                    </div>

                    {row.isPredicting ? (
                      <div className="text-xs text-lime-300 font-bold">Processing...</div>
                    ) : pathogen ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white truncate" title={formatLabel(pathogen)}>
                          {formatLabel(pathogen)}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-lime-300 font-bold">{(predObj.confidence * 100).toFixed(1)}%</span>
                          <span className="text-white/70">{predObj.latency_ms}ms</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRunPrediction(row.id, row.file, row.imageSrc)}
                        className="w-full rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 px-2 py-1 text-[11px] text-lime-300 font-bold transition-all cursor-pointer min-h-8"
                      >
                        Run
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-stone-950 text-white font-sans selection:bg-lime-500/30 selection:text-white overflow-x-hidden p-4 sm:p-8 select-none">
      {/* PERSISTENT BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none filter blur-[10px] brightness-[102%] saturate-[110%] scale-110 opacity-100 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <Image
          src="/bg-lush-tapestry.jpeg"
          alt="Lush Greenery Tapestry Background"
          fill
          priority
          className="object-cover transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] animate-continuous-leaf-float"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-36 zoom-in-95 duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">

        {/* Top Navigation & Title Bar */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-2xl border-2 border-white/60 p-4 sm:p-6 lg:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] flex flex-col gap-4 sm:gap-6">
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-white/20 border border-white/50 backdrop-blur-md px-4 sm:px-5 py-2 text-xs font-mono font-bold text-white hover:bg-lime-400 hover:text-stone-950 transition-all cursor-pointer shadow-xl inline-flex items-center gap-2 min-h-10"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 sm:gap-3 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
              <Split className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 text-lime-300" />
              <span>AI Diagnostic Arena</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Live Classification Feed — Real-Time Inference from Port 8000
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            <label className="rounded-2xl bg-lime-400 text-stone-950 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-black hover:bg-lime-300 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 min-h-11 flex-1 sm:flex-none">
              <Plus className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Add Foliage Scans</span>
              <span className="sm:hidden">Add Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleRunAllPredictions}
              disabled={isProcessingAll}
              className="rounded-2xl bg-white/25 border-2 border-white/50 text-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-black hover:bg-white/35 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 backdrop-blur-3xl disabled:opacity-50 min-h-11 flex-1 sm:flex-none"
            >
              {isProcessingAll ? (
                <Loader2 className="h-4 w-4 animate-spin text-lime-300 shrink-0" />
              ) : (
                <Play className="h-4 w-4 text-lime-300 shrink-0" />
              )}
              <span className="hidden sm:inline">Run Live Benchmark All</span>
              <span className="sm:hidden">Run Benchmark</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Leaderboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-3 sm:p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[10px] sm:text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <span className="hidden sm:inline">Total Test Scans</span>
              <span className="sm:hidden">Test Scans</span>
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {rows.length}
            </span>
          </div>

          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-3 sm:p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[10px] sm:text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <span className="hidden sm:inline">Models Evaluated</span>
              <span className="sm:hidden">Models</span>
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="hidden sm:inline">7 Models</span>
              <span className="sm:hidden">7</span>
            </span>
          </div>

          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-3 sm:p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[10px] sm:text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <span className="hidden sm:inline">Inference Engine</span>
              <span className="sm:hidden">Engine</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-lime-300 font-mono truncate block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="hidden sm:inline">Soft-Vote Ensemble</span>
              <span className="sm:hidden">Ensemble</span>
            </span>
          </div>

          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-3 sm:p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[10px] sm:text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <span className="hidden sm:inline">Model Status</span>
              <span className="sm:hidden">Status</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Live Connection</span>
              <span className="sm:hidden">Live</span>
            </span>
          </div>
        </div>

        {/* MAIN COMPARISON TABLE CONTAINER */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-2xl border-2 border-white/60 p-3 sm:p-4 lg:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 border-b-2 border-white/30 pb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-lime-300" />
              <span className="truncate">Multi-Model Live Inference</span>
            </div>
            <span className="text-[10px] sm:text-xs text-lime-300 font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] whitespace-nowrap">
              Green = Match | Red = Mismatch
            </span>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-3">
            {rows.map((row) => (
              <MobileArenaCard
                key={row.id}
                row={row}
                onDelete={handleDeleteRow}
                onLabelChange={handleLabelChange}
                onRunPrediction={runPredictionForRow}
              />
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border-2 border-white/40 bg-black/20">
            <table className="w-full text-left text-xs border-collapse min-w-[1440px]">
              <thead>
                <tr className="bg-white/20 text-lime-300 font-black uppercase tracking-wider border-b-2 border-white/40">
                  <th className="p-3.5 w-12 text-center">Action</th>
                  <th className="p-3.5 w-20 text-center">Image</th>
                  <th className="p-3.5 min-w-[210px] w-56">Real Label</th>
                  {MODEL_COLUMNS.map((col) => (
                    <th key={col.key} className={`p-3.5 text-center min-w-[140px] ${col.key === 'ensemble' ? 'bg-lime-400/20 text-lime-200 font-black border-x border-lime-400/50' : ''}`}>
                      <div className="flex items-center justify-center gap-1">
                        {col.key === 'ensemble' && <Sparkles className="h-3.5 w-3.5 text-lime-300" />}
                        <span>{col.label}</span>
                      </div>
                      <div className="text-[10px] text-white/90 font-mono mt-0.5">
                        Match: {calculateModelAccuracy(col.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 font-bold text-white">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/10 transition-colors">
                    {/* Delete Row Action */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/40 transition-all cursor-pointer shadow-sm hover:scale-110"
                        title="Delete this row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>

                    {/* 1. Image Thumbnail */}
                    <td className="p-3 text-center">
                      <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-white/50 mx-auto shadow-md relative bg-black/30">
                        <img
                          src={row.imageSrc}
                          alt="Foliage scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* 2. Real Label (Dropdown selector for Ground Truth) */}
                    <td className="p-3 min-w-[210px] w-56">
                      <select
                        value={row.realLabel}
                        onChange={(e) => handleLabelChange(row.id, e.target.value)}
                        className="w-full rounded-xl bg-white/20 border-2 border-white/60 px-3 py-2 text-xs font-black text-white cursor-pointer hover:bg-white/30 transition-all outline-none shadow-sm truncate"
                      >
                        {AVAILABLE_DISEASES.map((d) => (
                          <option key={d} value={d} className="bg-stone-900 text-white font-extrabold">
                            {formatLabel(d)}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 3. Live Model Predictions (7 Columns, Ensemble First) */}
                    {MODEL_COLUMNS.map((col) => {
                      const predObj = row.predictions[col.key];
                      const pathogen = predObj?.pathogen;
                      const isPredicting = row.isPredicting;

                      if (isPredicting) {
                        return (
                          <td key={col.key} className={`p-2 text-center ${col.key === 'ensemble' ? 'bg-lime-400/10 border-x border-lime-400/30' : ''}`}>
                            <div className="rounded-xl bg-white/15 border border-white/40 p-2 flex items-center justify-center gap-1 text-[11px] text-lime-300">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Inferring...</span>
                            </div>
                          </td>
                        );
                      }

                      if (!pathogen) {
                        return (
                          <td key={col.key} className={`p-2 text-center ${col.key === 'ensemble' ? 'bg-lime-400/10 border-x border-lime-400/30' : ''}`}>
                            <button
                              type="button"
                              onClick={() => runPredictionForRow(row.id, row.file, row.imageSrc)}
                              className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-1.5 text-[11px] text-lime-300 transition-all cursor-pointer"
                            >
                              Run Inference
                            </button>
                          </td>
                        );
                      }

                      const isMatch = normalize(pathogen) === normalize(row.realLabel);

                      return (
                        <td key={col.key} className={`p-2 text-center ${col.key === 'ensemble' ? 'bg-lime-400/10 border-x border-lime-400/30' : ''}`}>
                          <div
                            className={`rounded-xl p-2 border-2 transition-all shadow-md space-y-0.5 ${
                              col.key === 'ensemble' && isMatch
                                ? "bg-lime-400/30 border-lime-300 text-lime-100 shadow-[0_0_18px_rgba(163,230,53,0.4)]"
                                : isMatch
                                ? "bg-emerald-500/30 border-emerald-400/80 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                                : "bg-rose-500/30 border-rose-400/80 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1 text-[11px] font-black">
                              {isMatch ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-rose-300 shrink-0" />
                              )}
                              <span className="truncate max-w-[110px]" title={formatLabel(pathogen)}>
                                {formatLabel(pathogen)}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono font-extrabold opacity-90 flex justify-center gap-2">
                              <span>{(predObj.confidence * 100).toFixed(1)}%</span>
                              <span>{predObj.latency_ms}ms</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
