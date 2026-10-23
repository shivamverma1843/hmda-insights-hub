import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeft,
  TrendingUp,
  MapPin,
  Home,
  ShieldCheck,
  LineChart as LineChartIcon,
  DollarSign,
  CheckCircle2,
  Percent,
  XCircle,
  Landmark,
} from "lucide-react";
import StateChoropleth from "@/components/dashboard/StateChoropleth";
import KpiCard from "@/components/dashboard/KpiCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
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
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues, fmtUSD, fmtNum } from "@/data/hmdaMarket";

const FILTER_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const SECTIONS = [
  { id: "q1", label: "Q1 · Market Size", icon: TrendingUp },
  { id: "q2", label: "Q2 · Geography", icon: MapPin },
  { id: "q3", label: "Q3 · Site-Built Premium", icon: Home },
  { id: "q4", label: "Q4 · Credit Access", icon: ShieldCheck },
  { id: "q5", label: "Q5 · Forecast", icon: LineChartIcon },
];

export default function CompleteDashboard() {
  const [year, setYear] = useState(2025);
  const [merged, setMerged] = useState(() => buildMergedData());
  const [selectedMsa, setSelectedMsa] = useState(MSAS[0]?.name ?? "");
  const [activeSection, setActiveSection] = useState("q1");
  const sectionRefs = useRef({});

  useEffect(() => {
    const onFocus = () => setMerged(buildMergedData());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const current = useMemo(() => nationalAnnual.find((n) => n.year === year) ?? nationalAnnual[nationalAnnual.length - 1], [year]);
  const prev = useMemo(() => {
    const idx = nationalAnnual.findIndex((n) => n.year === year);
    return idx > 0 ? nationalAnnual[idx - 1] : null;
  }, [year]);
  const delta = (key) => (prev ? +(((current[key] - prev[key]) / prev[key]) * 100).toFixed(1) : null);

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

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
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
              <YearSelector year={year} setYear={setYear} />
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
        {/* Section navigator */}
        <div className="border-t border-border bg-card/60">
          <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        {/* KPI row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          <KpiCard label="Median Property Value" value={fmtUSD(current.medianProperty)} delta={delta("medianProperty")} icon={DollarSign} accent="violet" />
          <KpiCard label="Originations" value={fmtNum(current.originations)} delta={delta("originations")} icon={CheckCircle2} accent="emerald" />
          <KpiCard label="Denial Rate" value={`${current.denialRate}%`} delta={delta("denialRate")} icon={XCircle} accent="rose" />
          <KpiCard label="Median Rate" value={`${current.medianRate}%`} delta={delta("medianRate")} icon={Percent} accent="blue" />
          <KpiCard label="Top State CAGR" value={`${STATES[0]?.cagr}%`} icon={TrendingUp} accent="emerald" sublabel={STATES[0]?.name} />
          <KpiCard label="Top MSA CAGR" value={`${MSAS[0]?.cagr}%`} icon={Landmark} accent="primary" sublabel={MSAS[0]?.name} />
        </motion.div>

        {/* Q1 — Market Size */}
        <DashboardSection
          ref={(el) => (sectionRefs.current.q1 = el)}
          id="q1"
          icon={TrendingUp}
          title="Q1 · Market Size"
          description="Annual origination volumes, median property values, and year-over-year change."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <YoYChangeChart data={nationalAnnual} />
            <MedianValueTrendChart data={nationalAnnual} />
            <OriginationsByYearChart data={nationalAnnual} />
          </div>
        </DashboardSection>

        {/* Q2 — Geography */}
        <DashboardSection
          ref={(el) => (sectionRefs.current.q2 = el)}
          id="q2"
          icon={MapPin}
          title="Q2 · Geography"
          description="State and MSA-level property values, growth rates, and volume distribution."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TopMSAsCAGRChart msas={MSAS} />
            <AvgLoanByStateChart states={STATES} year={year} />
            <VolumeVsGrowthScatter states={STATES} year={year} />
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Choropleth: Median Property Value</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{`State median values · ${year}`}</p>
            </div>
            <StateChoropleth valueByState={stateValueByYear} metricLabel="Median property value" format={fmtUSD} />
          </div>
        </DashboardSection>

        {/* Q3 — Site-Built Premium */}
        <DashboardSection
          ref={(el) => (sectionRefs.current.q3 = el)}
          id="q3"
          icon={Home}
          title="Q3 · Site-Built vs Manufactured Premium"
          description="Comparing site-built and manufactured home median values over time."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SiteBuiltVsManufacturedLine siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
            <ManufacturedValueChart data={manufacturedAnnual} />
          </div>
        </DashboardSection>

        {/* Q4 — Credit Access */}
        <DashboardSection
          ref={(el) => (sectionRefs.current.q4 = el)}
          id="q4"
          icon={ShieldCheck}
          title="Q4 · Credit Access"
          description="Denial rates by state and denial rate trends for the fastest-growing markets."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DenialVsGrowthChart states={STATES} year={year} />
            <DenialTrendTop5Chart states={STATES} />
          </div>
        </DashboardSection>

        {/* Q5 — Forecast */}
        <DashboardSection
          ref={(el) => (sectionRefs.current.q5 = el)}
          id="q5"
          icon={LineChartIcon}
          title="Q5 · Forecast"
          description="Historical trends and projected median values through 2028."
        >
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
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-2 font-display text-sm font-semibold text-foreground">Summary · {year}</h3>
              <dl className="space-y-2">
                <SummaryRow label="National median value" value={fmtUSD(current.medianProperty)} />
                <SummaryRow label="National originations" value={current.originations?.toLocaleString()} />
                <SummaryRow label="Manufactured median" value={fmtUSD(manufacturedAnnual.find((m) => m.year === year)?.medianProperty)} />
                <SummaryRow label="Top state CAGR" value={`${STATES[0]?.cagr}% (${STATES[0]?.name})`} />
                <SummaryRow label="Top MSA CAGR" value={`${MSAS[0]?.cagr}% (${MSAS[0]?.name})`} />
              </dl>
            </div>
          </div>
        </DashboardSection>

        <footer className="pt-1 pb-6 text-center text-xs text-muted-foreground">
          Complete dashboard · HMDA market analysis 2018–2025. Upload the FFIEC LAR CSV for real figures.
        </footer>
      </main>
    </div>
  );
}

function YearSelector({ year, setYear }) {
  return (
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