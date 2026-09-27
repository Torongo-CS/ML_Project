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

// Initial rows with ZERO mock predictions - images will be fed to live backend for real results
const INITIAL_ROWS: ArenaRow[] = [
  {
    id: "row-1",
    imageSrc: "/bg-lush-tapestry.jpeg",
    realLabel: "Potato___Early_blight",
    predictions: {},
  },
  {
    id: "row-2",
    imageSrc: "/bg-sunset.jpeg",
    realLabel: "Potato___Late_blight",
    predictions: {},
  },
  {
    id: "row-3",
    imageSrc: "/bg-tropical.jpeg",
    realLabel: "Potato___healthy",
    predictions: {},
  },
  {
    id: "row-4",
    imageSrc: "/green.jpeg",
    realLabel: "Tomato_Early_blight",
    predictions: {},
  },
  {
    id: "row-5",
    imageSrc: "/hero-subject.png",
    realLabel: "Tomato_Late_blight",
    predictions: {},
  },
  {
    id: "row-6",
    imageSrc: "/bg-lush-tapestry.jpeg",
    realLabel: "Tomato_Leaf_Mold",
    predictions: {},
  },
  {
    id: "row-7",
    imageSrc: "/bg-tropical.jpeg",
    realLabel: "Tomato_Septoria_leaf_spot",
    predictions: {},
  },
  {
    id: "row-8",
    imageSrc: "/green.jpeg",
    realLabel: "Tomato_healthy",
    predictions: {},
  },
];

const MODEL_COLUMNS = [
  { key: "efficientnet-b1", label: "EfficientNet_B1" },
  { key: "efficientnet-b2", label: "EfficientNet_B2" },
  { key: "google-cropnet", label: "Google_CropNet" },
  { key: "shufflenet-v2", label: "ShuffleNet_V2" },
  { key: "swin-v2-t", label: "Swin_V2_T" },
  { key: "yolov8n", label: "YOLOv8n" },
  { key: "yolov11n", label: "YOLOv11n" },
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
        const fetchSrc = imageSrc || "/green.jpeg";
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

  // Update ground truth Real Label for a row
  const handleLabelChange = (rowId: string, newLabel: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, realLabel: newLabel } : r))
    );
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

  return (
    <div className="relative min-h-screen flex flex-col bg-stone-950 text-white font-sans selection:bg-lime-500/30 selection:text-white overflow-x-hidden p-4 sm:p-8 select-none">
      {/* PERSISTENT BACKGROUND IMAGE - MATCHING DASHBOARD EXACTLY */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none filter blur-[10px] brightness-[102%] saturate-[110%] scale-110 opacity-100 transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <Image
          src="/bg-lush-tapestry.jpeg"
          alt="Lush Greenery Tapestry Background"
          fill
          priority
          className="object-cover transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-36 zoom-in-95 duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Top Navigation & Title Bar */}
        <div className="rounded-3xl bg-white/20 backdrop-blur-2xl border-2 border-white/60 p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-white/20 border border-white/50 backdrop-blur-md px-5 py-2 text-xs font-mono font-bold text-white hover:bg-lime-400 hover:text-stone-950 transition-all cursor-pointer shadow-xl inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3 drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">
              <Split className="h-8 w-8 text-lime-300" />
              Multi-Model AI Diagnostic Arena
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Live Neural Net Classification Feed - Images Are Streamed Real-Time to Port 8000
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="rounded-2xl bg-lime-400 text-stone-950 px-5 py-3 text-xs font-black hover:bg-lime-300 transition-all cursor-pointer shadow-lg flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Foliage Scans</span>
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
              className="rounded-2xl bg-white/25 border-2 border-white/50 text-white px-5 py-3 text-xs font-black hover:bg-white/35 transition-all cursor-pointer shadow-lg flex items-center gap-2 backdrop-blur-3xl disabled:opacity-50"
            >
              {isProcessingAll ? (
                <Loader2 className="h-4 w-4 animate-spin text-lime-300" />
              ) : (
                <Play className="h-4 w-4 text-lime-300" />
              )}
              <span>Run Live Benchmark All</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Leaderboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Total Test Scans
            </span>
            <span className="text-2xl font-black text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {rows.length}
            </span>
          </div>

          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Active Models Tested
            </span>
            <span className="text-2xl font-black text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              7 Models
            </span>
          </div>

          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Inference Endpoint
            </span>
            <span className="text-sm font-black text-lime-300 font-mono truncate block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              http://localhost:8000
            </span>
          </div>

          <div className="rounded-2xl bg-white/20 border-2 border-white/60 p-5 backdrop-blur-2xl shadow-lg space-y-1">
            <span className="text-[11px] font-black text-lime-300 uppercase block drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Model Status
            </span>
            <span className="text-sm font-black text-emerald-300 flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <CheckCircle2 className="h-4 w-4" /> Live Connection
            </span>
          </div>
        </div>

        {/* MAIN COMPARISON TABLE CONTAINER */}
        <div className="rounded-3xl bg-white/20 backdrop-blur-2xl border-2 border-white/60 p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] space-y-4 overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-white/30 pb-4">
            <div className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <BarChart2 className="h-5 w-5 text-lime-300" />
              <span>Multi-Model Live Inference Grid</span>
            </div>
            <span className="text-xs text-lime-300 font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Green = Match Real Label | Red = Misclassification
            </span>
          </div>

          {/* SCROLLABLE TABLE */}
          <div className="overflow-x-auto rounded-2xl border-2 border-white/40 bg-black/20">
            <table className="w-full text-left text-xs border-collapse min-w-[1240px]">
              <thead>
                <tr className="bg-white/20 text-lime-300 font-black uppercase tracking-wider border-b-2 border-white/40">
                  <th className="p-3.5 w-20 text-center">Image</th>
                  <th className="p-3.5 w-44">Real Label</th>
                  {MODEL_COLUMNS.map((col) => (
                    <th key={col.key} className="p-3.5 text-center min-w-[130px]">
                      <div>{col.label}</div>
                      <div className="text-[10px] text-white/80 font-mono mt-0.5">
                        Match: {calculateModelAccuracy(col.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 font-bold text-white">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/10 transition-colors">
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
                    <td className="p-3">
                      <select
                        value={row.realLabel}
                        onChange={(e) => handleLabelChange(row.id, e.target.value)}
                        className="w-full rounded-xl bg-white/20 border-2 border-white/60 px-2.5 py-1.5 text-xs font-extrabold text-white cursor-pointer hover:bg-white/30 transition-all outline-none shadow-sm"
                      >
                        {AVAILABLE_DISEASES.map((d) => (
                          <option key={d} value={d} className="bg-stone-900 text-white">
                            {formatLabel(d)}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 3. Live Model Predictions (7 Columns) */}
                    {MODEL_COLUMNS.map((col) => {
                      const predObj = row.predictions[col.key];
                      const pathogen = predObj?.pathogen;
                      const isPredicting = row.isPredicting;

                      if (isPredicting) {
                        return (
                          <td key={col.key} className="p-2 text-center">
                            <div className="rounded-xl bg-white/15 border border-white/40 p-2 flex items-center justify-center gap-1 text-[11px] text-lime-300">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Inferring...</span>
                            </div>
                          </td>
                        );
                      }

                      if (!pathogen) {
                        return (
                          <td key={col.key} className="p-2 text-center">
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
                        <td key={col.key} className="p-2 text-center">
                          <div
                            className={`rounded-xl p-2 border-2 transition-all shadow-md space-y-0.5 ${
                              isMatch
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
