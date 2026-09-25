"use client";

import React, { useState } from "react";
import {
  Sprout,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { HoverCard } from "./ui/hover-card";

interface PotatoDiseaseRow {
  id: string;
  name: string;
  scientificName: string;
  type: "Tuber" | "Foliar" | "Vascular" | "Pristine";
  affectedAcreage: number;
  severity: "Critical" | "High" | "Moderate" | "Low" | "Pristine";
  riskIndex: number;
  interventionWindow: string;
  recommendedFungicide: string;
  resistanceRisk: "Low" | "Medium" | "High";
}

const potatoData: PotatoDiseaseRow[] = [
  {
    id: "pot-1",
    name: "Black Scurf",
    scientificName: "Rhizoctonia solani",
    type: "Tuber",
    affectedAcreage: 210,
    severity: "High",
    riskIndex: 74,
    interventionWindow: "Within 48 Hours",
    recommendedFungicide: "Azoxystrobin 22.9% SC @ 0.8 fl oz/1000 ft",
    resistanceRisk: "Medium",
  },
  {
    id: "pot-2",
    name: "Common Scab",
    scientificName: "Streptomyces scabies",
    type: "Tuber",
    affectedAcreage: 145,
    severity: "Moderate",
    riskIndex: 48,
    interventionWindow: "5-7 Days (Soil pH adjustment)",
    recommendedFungicide: "Sulfur soil acidifier to lower pH < 5.2",
    resistanceRisk: "Low",
  },
  {
    id: "pot-3",
    name: "Potato Late Blight",
    scientificName: "Phytophthora infestans (US-23)",
    type: "Foliar",
    affectedAcreage: 310,
    severity: "Critical",
    riskIndex: 89,
    interventionWindow: "IMMEDIATE (24 Hours)",
    recommendedFungicide: "Fluazinam (Omega 500) + Mancozeb tank mix",
    resistanceRisk: "High",
  },
  {
    id: "pot-4",
    name: "Potato Early Blight",
    scientificName: "Alternaria solani",
    type: "Foliar",
    affectedAcreage: 95,
    severity: "Low",
    riskIndex: 28,
    interventionWindow: "Routine Schedule (7 Days)",
    recommendedFungicide: "Difenoconazole + Azoxystrobin",
    resistanceRisk: "Medium",
  },
  {
    id: "pot-5",
    name: "Potato Virus Y (PVY)",
    scientificName: "Potyvirus PVY-N",
    type: "Vascular",
    affectedAcreage: 60,
    severity: "Moderate",
    riskIndex: 42,
    interventionWindow: "Vector Control Active",
    recommendedFungicide: "Mineral oil foliage application + aphid purge",
    resistanceRisk: "High",
  },
  {
    id: "pot-6",
    name: "Pristine Tuber Canopy",
    scientificName: "Solanum tuberosum (healthy)",
    type: "Pristine",
    affectedAcreage: 680,
    severity: "Pristine",
    riskIndex: 2,
    interventionWindow: "Monitoring Only",
    recommendedFungicide: "Standard bio-stimulant fertigation",
    resistanceRisk: "Low",
  },
];

export function PotatoDiagnosisTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortField, setSortField] = useState<"riskIndex" | "affectedAcreage">("riskIndex");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredData = potatoData
    .filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.recommendedFungicide.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (severityFilter === "all") return true;
      if (severityFilter === "critical") return row.severity === "Critical" || row.severity === "High";
      if (severityFilter === "tuber") return row.type === "Tuber";
      if (severityFilter === "foliar") return row.type === "Foliar";
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: "riskIndex" | "affectedAcreage") => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="agri-glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-emerald-400/80">TOTAL POTATO ACREAGE</span>
            <div className="mt-2 font-syne text-3xl font-extrabold text-white">1,500 AC</div>
            <p className="mt-1 text-[11px] text-emerald-400/60">Solanum tuberosum Quad B & C</p>
          </CardContent>
        </Card>

        <Card className="agri-glass-card border-rose-500/30">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-rose-300/80">CRITICAL TUBER THREAT</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-rose-300">LATE BLIGHT</span>
              <Badge variant="destructive" className="text-[10px]">
                89% Risk
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-rose-400/60">310 Acres Affected in Sector C</p>
          </CardContent>
        </Card>

        <Card className="agri-glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-emerald-400/80">TUBER QUALITY RATING</span>
            <div className="mt-2 font-syne text-3xl font-extrabold text-white">GRADE A (91.4%)</div>
            <Progress value={91.4} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="agri-glass-card">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-emerald-400/80">FUNGICIDE RESISTANCE GAUGE</span>
            <div className="mt-2 flex items-center justify-between text-xs font-bold text-amber-300">
              <span>FRAC Group 11 (QoI)</span>
              <Badge variant="warning" className="text-[9px]">
                MODERATE RISK
              </Badge>
            </div>
            <p className="mt-2 text-[10px] text-emerald-400/60">Rotate with FRAC Group M03 multi-site</p>
          </CardContent>
        </Card>
      </div>

      <Card className="agri-glass-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/30 pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-400" />
              Potato Pathology Master Data Table
            </CardTitle>
            <CardDescription>
              Comprehensive diagnostic matrix for potato tuber & foliar anomalies.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-48 sm:w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-emerald-500/70" />
              <input
                type="text"
                placeholder="Filter by disease or fungicide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-emerald-900/40 bg-[#09100B] pl-9 pr-3 py-1.5 text-xs text-emerald-100 placeholder-emerald-600/70 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-900/40 bg-[#09100B] px-3 py-1.5 text-xs text-emerald-300">
              <Filter className="h-3.5 w-3.5 text-emerald-500" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-emerald-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#09100B]">
                  All Types & Risks
                </option>
                <option value="critical" className="bg-[#09100B]">
                  Critical / High Risk Only
                </option>
                <option value="tuber" className="bg-[#09100B]">
                  Tuber Pathogens Only
                </option>
                <option value="foliar" className="bg-[#09100B]">
                  Foliar Pathogens Only
                </option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pathogen & Taxon</TableHead>
                <TableHead>Type</TableHead>
                <TableHead onClick={() => toggleSort("riskIndex")} className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Risk Index <ArrowUpDown className="h-3 w-3 text-emerald-500" />
                  </div>
                </TableHead>
                <TableHead onClick={() => toggleSort("affectedAcreage")} className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Affected Area <ArrowUpDown className="h-3 w-3 text-emerald-500" />
                  </div>
                </TableHead>
                <TableHead>Intervention Window</TableHead>
                <TableHead>Recommended Agronomy Protocol</TableHead>
                <TableHead>Resistance Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div>
                      <span className="font-bold text-white text-xs">{row.name}</span>
                      <HoverCard
                        trigger={
                          <div className="text-[11px] italic text-emerald-400/80 cursor-help">
                            {row.scientificName}
                          </div>
                        }
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-emerald-300">{row.scientificName}</div>
                          <p className="text-[11px] opacity-90">
                            Pathogen category: {row.type}. Target early spraying or soil moisture adjustment.
                          </p>
                        </div>
                      </HoverCard>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {row.type}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span
                          className={
                            row.riskIndex >= 60
                              ? "text-rose-400"
                              : row.riskIndex >= 30
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }
                        >
                          {row.riskIndex}%
                        </span>
                      </div>
                      <Progress
                        value={row.riskIndex}
                        indicatorClassName={
                          row.riskIndex >= 60
                            ? "from-rose-600 to-amber-500"
                            : row.riskIndex >= 30
                            ? "from-amber-600 to-yellow-400"
                            : "from-emerald-600 to-teal-400"
                        }
                      />
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs font-semibold text-emerald-200">
                    {row.affectedAcreage} Acres
                  </TableCell>

                  <TableCell>
                    <span
                      className={`text-xs font-semibold font-mono ${
                        row.severity === "Critical"
                          ? "text-rose-400 font-bold"
                          : row.severity === "High"
                          ? "text-amber-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {row.interventionWindow}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-xs text-xs text-emerald-200/90 font-mono">
                    {row.recommendedFungicide}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        row.resistanceRisk === "High"
                          ? "destructive"
                          : row.resistanceRisk === "Medium"
                          ? "warning"
                          : "success"
                      }
                      className="text-[10px]"
                    >
                      {row.resistanceRisk} Risk
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
