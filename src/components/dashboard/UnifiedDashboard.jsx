import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MapPin, Home, ShieldCheck, LineChart as LineChartIcon, Lightbulb } from "lucide-react";
import {
  YoYChangeChart,
  TopMSAsCAGRChart,
  AvgLoanByStateChart,
  SiteBuiltVsManufacturedLine,
  DenialVsGrowthChart,
  ManufacturedValueChart,
  DenialTrendTop5Chart,
  NationalForecastLine,
  FastestGrowingMarketsChart,
  OriginationsByYearChart,
  Top5MarketsGrowthChart,
  MSAForecastChart,
  VolumeVsGrowthScatter,
  MedianValueTrendChart,
} from "@/components/dashboard/CompleteDashboardCharts";
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues } from "@/data/hmdaMarket";

const FILTER_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const nationalForecast = forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty])));

const QA_BLOCKS = [
  {
    id: "q1",
    label: "Q1 · Market Size",
    icon: TrendingUp,
    insight: "Originations peaked in 2021 (~9.9M) during the low-rate boom, fell sharply through 2023, and are recovering into 2025. Median values rose steadily.",
  },
  {
    id: "q2",
    label: "Q2 · Geography",
    icon: MapPin,
    insight: "Western and Sun Belt markets lead growth — Boise, Austin, Phoenix top MSAs; Idaho, Utah, Arizona lead states.",
  },
  {
    id: "q3",
    label: "Q3 · Site-Built Premium",
    icon: Home,
    insight: "Site-built values are ~3–4× manufactured, and the premium has widened as site-built appreciation outpaced manufactured homes.",
  },
  {
    id: "q4",
    label: "Q4 · Credit Access",
    icon: ShieldCheck,
    insight: "Denial rates bottomed around 2021, rose through 2023 as credit tightened, and vary meaningfully by state.",
  },
  {
    id: "q5",
    label: "Q5 · Forecast",
    icon: LineChartIcon,
    insight: "Linear-trend projections through 2028 suggest continued value growth, with fastest-growing markets outpacing national averages.",
  },
];

export default function UnifiedDashboard({ year: initialYear }) {
  const [year, setYear] = useState(initialYear ?? 2025);
  const [selectedMsa, setSelectedMsa] = useState(MSAS[0]?.name ?? "");
  const activeMsa = MSAS.find((m) => m.name === selectedMsa) ?? MSAS[0];
  const msaForecast = (() => {
    if (!activeMsa) return [];
    const vals = {};
    FILTER_YEARS.forEach((y) => (vals[y] = activeMsa.values[y]));
    return forecastValues(vals);
  })();

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">Unified Interactive Dashboard</h2>
            <p className="text-xs text-muted-foreground">All 5 business questions in one view</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Year</span>
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {FILTER_YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                  y === year ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Q1 */}
      <QABlock block={QA_BLOCKS[0]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <YoYChangeChart data={nationalAnnual} />
          <MedianValueTrendChart data={nationalAnnual} />
          <OriginationsByYearChart data={nationalAnnual} />
        </div>
      </QABlock>

      {/* Q2 */}
      <QABlock block={QA_BLOCKS[1]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TopMSAsCAGRChart msas={MSAS} />
          <AvgLoanByStateChart states={STATES} year={year} />
          <VolumeVsGrowthScatter states={STATES} year={year} />
        </div>
      </QABlock>

      {/* Q3 */}
      <QABlock block={QA_BLOCKS[2]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SiteBuiltVsManufacturedLine siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
          <ManufacturedValueChart data={manufacturedAnnual} />
        </div>
      </QABlock>

      {/* Q4 */}
      <QABlock block={QA_BLOCKS[3]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DenialVsGrowthChart states={STATES} year={year} />
          <DenialTrendTop5Chart states={STATES} />
        </div>
      </QABlock>

      {/* Q5 */}
      <QABlock block={QA_BLOCKS[4]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NationalForecastLine actual={nationalAnnual} forecast={nationalForecast} />
          <FastestGrowingMarketsChart states={STATES} />
          <Top5MarketsGrowthChart msas={MSAS} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Select MSA for forecast</label>
              <select
                value={selectedMsa}
                onChange={(e) => setSelectedMsa(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground"
              >
                {MSAS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            {activeMsa && <MSAForecastChart msa={activeMsa} forecast={msaForecast} />}
          </div>
        </div>
      </QABlock>
    </div>
  );
}

function QABlock({ block, children }) {
  const Icon = block.icon;
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35 }}
      className="mb-6 last:mb-0"
    >
      <div className="mb-3 flex items-center gap-2.5 border-b border-border pb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h3 className="font-display text-sm font-semibold text-foreground">{block.label}</h3>
      </div>
      <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
        <p className="text-xs text-foreground">{block.insight}</p>
      </div>
      {children}
    </motion.section>
  );
}