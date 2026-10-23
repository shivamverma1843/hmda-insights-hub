import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Maximize2, MoreHorizontal, RotateCcw, Calendar } from "lucide-react";
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
import StateChoropleth from "@/components/dashboard/StateChoropleth";
import UnifiedDashboard from "@/components/dashboard/UnifiedDashboard";
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues, fmtUSD } from "@/data/hmdaMarket";

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

function SectionHeader({ n, title }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2C3E50] text-xs font-bold text-white">{n}</span>
      <h2 className="font-sans text-sm font-bold text-[#333]">{title}</h2>
    </div>
  );
}

function YearKpiStrip({ year }) {
  const cur = nationalAnnual.find((n) => n.year === year) ?? nationalAnnual[nationalAnnual.length - 1];
  const mfg = manufacturedAnnual.find((m) => m.year === year);
  const topState = STATES[0];
  const topMsa = MSAS[0];
  const items = [
    { label: "Median Property Value", value: fmtUSD(cur.medianProperty) },
    { label: "Originations", value: cur.originations?.toLocaleString() },
    { label: "Denial Rate", value: `${cur.denialRate}%` },
    { label: "Median Rate", value: `${cur.medianRate}%` },
    { label: "Manufactured Median", value: fmtUSD(mfg?.medianProperty) },
    { label: "Top State CAGR", value: `${topState?.cagr}%`, sub: topState?.name },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-black/5 bg-white p-2.5 shadow-sm">
          <div className="text-[10px] uppercase tracking-wide text-[#999]">{it.label}</div>
          <div className="mt-0.5 text-sm font-bold text-[#333]">{it.value}</div>
          {it.sub && <div className="text-[10px] text-[#999]">{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}

export default function InteractiveDashboard() {
  const [year, setYear] = useState(2025);
  const [selectedMsa, setSelectedMsa] = useState(MSAS[0]?.name ?? "");

  const stateValueByYear = useMemo(() => {
    const map = {};
    STATES.forEach((s) => {
      map[s.name] = s.values[year];
    });
    return map;
  }, [year]);

  const nationalForecast = useMemo(
    () => forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty]))),
    []
  );

  const activeMsa = MSAS.find((m) => m.name === selectedMsa) ?? MSAS[0];
  const msaForecast = useMemo(() => {
    if (!activeMsa) return [];
    const vals = {};
    YEARS.forEach((y) => (vals[y] = activeMsa.values[y]));
    return forecastValues(vals);
  }, [activeMsa]);

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-[#333] transition hover:bg-black/5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
            <h1 className="font-sans text-sm font-bold text-[#333]">HMDA Interactive Dashboard</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#2C3E50]" />
            <span className="rounded-md bg-[#2C3E50] px-2 py-0.5 text-xs font-semibold text-white">{year}</span>
            <span className="hidden text-xs text-[#999] sm:inline">All 5 business questions · 2018–2025</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main grid */}
        <main className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
          {/* Year selector bar — always visible */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white p-3 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#999]">Select Year</span>
            <div className="flex flex-wrap gap-1.5">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                    y === year
                      ? "border-[#2C3E50] bg-[#2C3E50] text-white shadow-sm"
                      : "border-black/10 bg-white text-[#666] hover:border-[#2C3E50]/40 hover:bg-[#2C3E50]/5 hover:text-[#2C3E50]"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
            <span className="ml-auto rounded-md bg-[#2C3E50]/10 px-2 py-1 text-xs font-semibold text-[#2C3E50]">
              Showing results for {year}
            </span>
          </div>

          {/* Selected-year KPI strip */}
          <YearKpiStrip year={year} />

          {/* Q1 — Market Size */}
          <SectionHeader n={1} title="Business Question 1 · Market Size" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <YoYChangeChart data={nationalAnnual} />
            <MedianValueTrendChart data={nationalAnnual} />
            <OriginationsByYearChart data={nationalAnnual} />
          </div>

          {/* Q2 — Geography */}
          <SectionHeader n={2} title="Business Question 2 · Geography" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <TopMSAsCAGRChart msas={MSAS} />
            <AvgLoanByStateChart states={STATES} year={year} />
            <VolumeVsGrowthScatter states={STATES} year={year} />
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <h3 className="font-sans text-sm font-bold text-[#333]">Choropleth: Median Property Value</h3>
            <p className="mb-2 text-xs text-[#999]">{`State median values · ${year}`}</p>
            <StateChoropleth valueByState={stateValueByYear} metricLabel="Median property value" format={fmtUSD} />
          </div>

          {/* Q3 — Site-Built vs Manufactured */}
          <SectionHeader n={3} title="Business Question 3 · Site-Built vs Manufactured" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SiteBuiltVsManufacturedLine siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
            <ManufacturedValueChart data={manufacturedAnnual} />
          </div>

          {/* Q4 — Credit Access */}
          <SectionHeader n={4} title="Business Question 4 · Credit Access" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <DenialVsGrowthChart states={STATES} year={year} />
            <DenialTrendTop5Chart states={STATES} />
          </div>

          {/* Q5 — Forecast */}
          <SectionHeader n={5} title="Business Question 5 · Forecast" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <NationalForecastLine actual={nationalAnnual} forecast={nationalForecast} />
            <FastestGrowingMarketsChart states={STATES} />
            <Top5MarketsGrowthChart msas={MSAS} />
          </div>
          <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-sans text-sm font-bold text-[#333]">MSA Forecast</h3>
                <p className="text-xs text-[#999]">{activeMsa?.name} — actual & projected</p>
              </div>
              <select
                value={selectedMsa}
                onChange={(e) => setSelectedMsa(e.target.value)}
                className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-[#333]"
              >
                {MSAS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <MSAForecastChart msa={activeMsa} forecast={msaForecast} />
          </div>

          {/* Unified Dashboard */}
          <SectionHeader n={6} title="Unified Dashboard · All Questions" />
          <UnifiedDashboard year={year} />
        </main>

        {/* Right Filters sidebar */}
        <aside className="sticky top-[49px] hidden h-[calc(100vh-49px)] w-44 shrink-0 flex-col border-l border-black/5 bg-white p-3 lg:flex">
          <h2 className="mb-3 font-sans text-sm font-bold text-[#333]">Filters</h2>
          <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[#999]">activity_year</div>
          <div className="grid grid-cols-2 gap-1.5">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                  y === year
                    ? "border-[#2C3E50] bg-[#2C3E50] text-white shadow-sm"
                    : "border-black/10 bg-white text-[#666] hover:border-[#2C3E50]/40 hover:bg-[#2C3E50]/5 hover:text-[#2C3E50]"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <button
            onClick={() => setYear(2025)}
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-black/10 bg-white px-2 py-1.5 text-xs font-medium text-[#666] transition hover:bg-black/5"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to latest
          </button>
          <div className="mt-auto flex items-center gap-2 pt-3 text-[#999]">
            <Maximize2 className="h-4 w-4 cursor-pointer hover:text-[#666]" />
            <MoreHorizontal className="h-4 w-4 cursor-pointer hover:text-[#666]" />
          </div>
        </aside>
      </div>
    </div>
  );
}