"use client";

import React, { useState } from "react";
import {
  Leaf,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Info,
  Activity,
  Filter,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog } from "./ui/dialog";
import { HoverCard } from "./ui/hover-card";

interface DiseaseItem {
  id: string;
  name: string;
  scientificName: string;
  category: "fungal" | "viral" | "bacterial" | "healthy";
  riskScore: number;
  severity: "Critical" | "High" | "Moderate" | "Low" | "Pristine";
  affectedArea: string;
  yieldImpact: string;
  symptoms: string[];
  organicTreatment: string;
  chemicalTreatment: string;
  preventativeSteps: string[];
  confidence: number;
}

const tomatoDiseases: DiseaseItem[] = [
  {
    id: "early-blight",
    name: "Early Blight",
    scientificName: "Alternaria solani",
    category: "fungal",
    riskScore: 68,
    severity: "Critical",
    affectedArea: "340 Acres (Sector 4B)",
    yieldImpact: "-22% Projected Loss",
    confidence: 98.4,
    symptoms: [
      "Concentric ring dark brown leaf spots ('bullseye' pattern)",
      "Yellow halos surrounding necrotic leaf tissue",
      "Lower canopy foliar defoliation progressing upward",
    ],
    organicTreatment: "Bacillus subtilis strain QST 713 bio-fungicide broadcast spray every 7 days.",
    chemicalTreatment: "Copper Hydroxide 77% WP or Chlorothalonil @ 2.0 lb/acre.",
    preventativeSteps: [
      "Increase row spacing to improve canopy airflow and accelerate leaf drying.",
      "Apply drip irrigation to prevent foliar splashing of soil-borne spores.",
    ],
  },
  {
    id: "late-blight",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    category: "fungal",
    riskScore: 84,
    severity: "Critical",
    affectedArea: "180 Acres (Quad 2A)",
    yieldImpact: "-45% Projected Loss",
    confidence: 96.7,
    symptoms: [
      "Water-soaked dark lesions expanding rapidly across leaves and stems",
      "White fuzzy sporangia mildew bloom under high humidity (RH > 80%)",
      "Vine collapse and brown firm rot on developing fruit",
    ],
    organicTreatment: "Fixed copper oxide + copper sulfate liquid suspension.",
    chemicalTreatment: "Mefenoxam + Chlorothalonil or Cymoxanil preventative tank-mix.",
    preventativeSteps: [
      "Quarantine infected row boundaries immediately.",
      "Maintain canopy humidity below 75% via controlled drip cycles.",
    ],
  },
  {
    id: "septoria-spot",
    name: "Septoria Leaf Spot",
    scientificName: "Septoria lycopersici",
    category: "fungal",
    riskScore: 42,
    severity: "Moderate",
    affectedArea: "95 Acres (Greenhouse 1)",
    yieldImpact: "-8% Projected Loss",
    confidence: 94.2,
    symptoms: [
      "Small circular spots with dark brown margins and gray centers",
      "Tiny black pycnidia fruiting bodies visible inside lesion centers",
    ],
    organicTreatment: "Neem oil 70% extract foliage rinse.",
    chemicalTreatment: "Mancozeb 75% DF at 1.5 kg/ha.",
    preventativeSteps: [
      "Mulch soil base to eliminate rain splashback from plant debris.",
    ],
  },
  {
    id: "yellow-leaf-curl",
    name: "Yellow Leaf Curl Virus",
    scientificName: "TYLCV (Geminiviridae)",
    category: "viral",
    riskScore: 28,
    severity: "Low",
    affectedArea: "45 Acres (Quad 1C)",
    yieldImpact: "-5% Projected Loss",
    confidence: 97.1,
    symptoms: [
      "Upward cupping and yellowing of young leaves",
      "Severe plant stunting and flower abortion",
    ],
    organicTreatment: "Insecticidal potassium salts + yellow sticky vector traps.",
    chemicalTreatment: "Imidacloprid vector control for Bemisia tabaci whiteflies.",
    preventativeSteps: [
      "Deploy fine mesh anti-insect screening over greenhouse vents.",
    ],
  },
  {
    id: "leaf-mold",
    name: "Leaf Mold",
    scientificName: "Passalora fulva",
    category: "fungal",
    riskScore: 15,
    severity: "Low",
    affectedArea: "20 Acres (Sector 3)",
    yieldImpact: "< 2% Projected Loss",
    confidence: 92.5,
    symptoms: [
      "Pale green/yellow spots on upper leaf surfaces",
      "Olive-green to velvety brown mold growth under leaves",
    ],
    organicTreatment: "Potassium bicarbonate foliar spray.",
    chemicalTreatment: "Difenoconazole foliage application.",
    preventativeSteps: ["Ventilate canopy structures to maintain RH < 85%."],
  },
  {
    id: "healthy-tomato",
    name: "Healthy Foliage",
    scientificName: "Solanum lycopersicum (Pristine)",
    category: "healthy",
    riskScore: 0,
    severity: "Pristine",
    affectedArea: "560 Acres (Main Quad A)",
    yieldImpact: "0% (Optimal Yield)",
    confidence: 99.8,
    symptoms: [
      "Vivid deep green leaves with crisp margins and active photosynthesis",
      "Thick stem diameter and balanced flower truss set",
    ],
    organicTreatment: "Maintain routine organic kelp bio-stimulant fertigation.",
    chemicalTreatment: "No intervention necessary.",
    preventativeSteps: ["Continue standard precision soil moisture monitoring."],
  },
];

export function TomatoDiagnosisTab() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedDisease, setSelectedDisease] = useState<DiseaseItem | null>(null);

  const filteredDiseases = tomatoDiseases.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "critical") return item.riskScore >= 50;
    if (selectedFilter === "fungal") return item.category === "fungal";
    if (selectedFilter === "viral") return item.category === "viral";
    if (selectedFilter === "healthy") return item.category === "healthy";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0C150F] via-[#0E1B13] to-[#0A130D] p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-lg">
            <Leaf className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Tomato Pathology Diagnostic Engine
            </h2>
            <p className="text-xs text-emerald-400/70">
              AI diagnostic breakdown for <span className="italic">Solanum lycopersicum</span>. Foliar lesion mapping & treatment protocols.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400/70 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: "All Pathology (6)" },
            { id: "critical", label: "High Risk (2)" },
            { id: "fungal", label: "Fungal (4)" },
            { id: "viral", label: "Viral (1)" },
            { id: "healthy", label: "Healthy (1)" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 shadow-sm"
                  : "bg-emerald-950/40 text-emerald-400/70 hover:text-emerald-200 border border-emerald-900/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDiseases.map((disease) => {
          const isCritical = disease.riskScore >= 60;
          const isWarning = disease.riskScore >= 30 && disease.riskScore < 60;

          return (
            <Card
              key={disease.id}
              className={`agri-glass-card flex flex-col justify-between ${
                isCritical
                  ? "border-rose-500/40 shadow-rose-950/30"
                  : isWarning
                  ? "border-amber-500/40 shadow-amber-950/30"
                  : "border-emerald-500/30"
              }`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      {disease.name}
                    </CardTitle>

                    <HoverCard
                      trigger={
                        <span className="text-xs italic text-emerald-400/80 hover:text-emerald-300 underline cursor-help">
                          {disease.scientificName}
                        </span>
                      }
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-300">{disease.scientificName}</div>
                        <p className="text-[11px] opacity-90 leading-tight">
                          Pathogen Taxon: {disease.category.toUpperCase()} • Spore transmission via wind/rain splash.
                        </p>
                      </div>
                    </HoverCard>
                  </div>

                  <Badge
                    variant={isCritical ? "destructive" : isWarning ? "warning" : "success"}
                    className="text-[10px] uppercase font-mono"
                  >
                    {disease.severity}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4 flex-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-300/80">Pathogen Risk Index</span>
                    <span
                      className={`font-mono font-bold ${
                        isCritical ? "text-rose-400" : isWarning ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {disease.riskScore}%
                    </span>
                  </div>
                  <Progress
                    value={disease.riskScore}
                    indicatorClassName={
                      isCritical
                        ? "from-rose-600 to-amber-500"
                        : isWarning
                        ? "from-amber-600 to-yellow-400"
                        : "from-emerald-600 to-teal-400"
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="rounded-lg bg-emerald-950/40 p-2 border border-emerald-900/30">
                    <span className="block text-[10px] text-emerald-400/60 uppercase">Affected Area</span>
                    <span className="font-semibold text-emerald-200">{disease.affectedArea}</span>
                  </div>
                  <div className="rounded-lg bg-emerald-950/40 p-2 border border-emerald-900/30">
                    <span className="block text-[10px] text-emerald-400/60 uppercase">Yield Loss Impact</span>
                    <span
                      className={`font-semibold ${
                        isCritical ? "text-rose-300" : isWarning ? "text-amber-300" : "text-emerald-300"
                      }`}
                    >
                      {disease.yieldImpact}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400/80">Foliar Symptoms:</span>
                  <ul className="space-y-1 text-xs text-emerald-200/90">
                    {disease.symptoms.slice(0, 2).map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Button
                  onClick={() => setSelectedDisease(disease)}
                  variant={isCritical ? "destructive" : "outline"}
                  className="w-full text-xs font-bold gap-2"
                >
                  <Activity className="h-3.5 w-3.5" />
                  View Treatment Protocol &rarr;
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedDisease && (
        <Dialog
          isOpen={Boolean(selectedDisease)}
          onClose={() => setSelectedDisease(null)}
          title={`Pathology Treatment Protocol: ${selectedDisease.name}`}
          description={`Taxon: ${selectedDisease.scientificName} • Diagnostic Confidence: ${selectedDisease.confidence}%`}
        >
          <div className="space-y-5 pt-2">
            <div
              className={`rounded-xl p-4 border flex items-center justify-between ${
                selectedDisease.riskScore >= 60
                  ? "bg-rose-950/50 border-rose-500/40 text-rose-200"
                  : selectedDisease.riskScore >= 30
                  ? "bg-amber-950/50 border-amber-500/40 text-amber-200"
                  : "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
              }`}
            >
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-wider">
                  Threat Level: {selectedDisease.severity} ({selectedDisease.riskScore}% Risk)
                </span>
                <p className="text-xs mt-0.5 opacity-90">
                  Target Field: {selectedDisease.affectedArea} • Yield Impact: {selectedDisease.yieldImpact}
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Conf: {selectedDisease.confidence}%
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Confirmed Visual Symptoms
              </h4>
              <div className="rounded-xl bg-[#09100B] p-4 border border-emerald-900/30 text-xs text-emerald-200 space-y-2">
                {selectedDisease.symptoms.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#0F1812] p-4 border border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                  <Zap className="h-4 w-4 text-rose-400" /> Chemical Fungicide Protocol
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed font-mono bg-black/40 p-2.5 rounded-lg border border-emerald-900/30">
                  {selectedDisease.chemicalTreatment}
                </p>
              </div>

              <div className="rounded-xl bg-[#0F1812] p-4 border border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Leaf className="h-4 w-4 text-emerald-400" /> Organic & Bio-Control Protocol
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed font-mono bg-black/40 p-2.5 rounded-lg border border-emerald-900/30">
                  {selectedDisease.organicTreatment}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedDisease(null)} variant="emerald" className="font-bold">
                Close Protocol
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
