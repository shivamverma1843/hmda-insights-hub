import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ArrowLeft, Maximize2, MoreHorizontal, Pencil } from "lucide-react";
import StateChoropleth from "@/components/dashboard/StateChoropleth";
import {
  YoYChangeChart,
  TopMSAsCAGRChart,
  AvgLoanByStateChart,
  SiteBuiltVsManufacturedLine,
  DenialVsGrowthChart,
  MedianValueTrendChart,
  VolumeVsGrowthScatter,
  ManufacturedValueChart,
  Top5MarketsGrowthChart,
  NationalForecastLine,
  MSAForecastChart,
  FastestGrowingMarketsChart,
  OriginationsByYearChart,
  DenialTrendTop5Chart,
} from "@/components/dashboard/CompleteDashboardCharts";
import { buildMergedData } from "@/lib/hmdaStore";
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues, fmtUSD } from "@/data/hmdaMarket";

const FILTER_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function CompleteDashboard() {
  const [year, setYear] = useState(2025);
  const [merged, setMerged] = useState(() => buildMergedData());
  const [selectedMsa, setSelectedMsa] = useState(MSAS[0]?.name ?? "");

  useEffect(() => {
    const onFocus = () => setMerged(buildMergedData());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const stateValueByYear = useMemo(() => {
    const map = {};
    STATES.forEach((s) => {
      map[s.name] = s.values[year];
    });
    return map;
  }, [year]);

  const msaForecast = useMemo(() => {
    const m = MSAS.find((x) => x.name === selectedMsa) ?? MSAS[0];
    if (!m) return [];
    const vals = {};
    [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].forEach((y) => (vals[y] = m.values[y]));
    return forecastValues(vals);
  }, [selectedMsa]);

  const nationalForecast = useMemo(() => forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty]))), []);
  const activeMsa = MSAS.find((m) => m.name === selectedMsa) ?? MSAS[0];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-display text-base font-semibold text-foreground sm:text-lg">HMDA Complete Dashboard</h1>
                <p className="text-xs text-muted-foreground">All charts · 2018–2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6 lg:px-8">
        {/* Row 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <YoYChangeChart data={nationalAnnual} />
          <TopMSAsCAGRChart msas={MSAS} />
          <FilterPanel year={year} setYear={setYear} />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AvgLoanByStateChart states={STATES} year={year} />
          <SiteBuiltVsManufacturedLine siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
          <MedianValueTrendChart data={nationalAnnual} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DenialVsGrowthChart states={STATES} year={year} />
          <VolumeVsGrowthScatter states={STATES} year={year} />
          <ManufacturedValueChart data={manufacturedAnnual} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Top5MarketsGrowthChart msas={MSAS} />
          <NationalForecastLine actual={nationalAnnual} forecast={nationalForecast} />
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

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FastestGrowingMarketsChart states={STATES} />
          <OriginationsByYearChart data={nationalAnnual} />
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Choropleth: Median Property Value</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{`State median values · ${year}`}</p>
            </div>
            <StateChoropleth valueByState={stateValueByYear} metricLabel="Median property value" format={fmtUSD} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DenialTrendTop5Chart states={STATES} />
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-2 font-display text-sm font-semibold text-foreground">Summary · {year}</h3>
            <dl className="space-y-2">
              <SummaryRow label="National median value" value={fmtUSD(nationalAnnual.find((n) => n.year === year)?.medianProperty)} />
              <SummaryRow label="National originations" value={nationalAnnual.find((n) => n.year === year)?.originations?.toLocaleString()} />
              <SummaryRow label="Manufactured median" value={fmtUSD(manufacturedAnnual.find((m) => m.year === year)?.medianProperty)} />
              <SummaryRow label="Top state CAGR" value={`${STATES[0]?.cagr}% (${STATES[0]?.name})`} />
              <SummaryRow label="Top MSA CAGR" value={`${MSAS[0]?.cagr}% (${MSAS[0]?.name})`} />
            </dl>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-2 font-display text-sm font-semibold text-foreground">Year Selector</h3>
            <p className="mb-3 text-xs text-muted-foreground">Choose a year to update the choropleth, state, and scatter charts.</p>
            <div className="grid grid-cols-4 gap-2">
              {FILTER_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
                    y === year ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="pt-1 pb-6 text-center text-xs text-muted-foreground">
          Complete dashboard · HMDA market analysis 2018–2025. Upload the FFIEC LAR CSV for real figures.
        </footer>
      </main>
    </div>
  );
}

function FilterPanel({ year, setYear }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Filter</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Select a year to filter dashboard</p>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Pencil className="h-3.5 w-3.5" />
          <Maximize2 className="h-3.5 w-3.5" />
          <MoreHorizontal className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setYear(2018)}
          className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
            year === 2018 ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/70"
          }`}
        >
          (All)
        </button>
        {FILTER_YEARS.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
              y === year ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-1.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-xs font-semibold text-foreground">{value ?? "—"}</dd>
    </div>
  );
}