import React, { useMemo, useState } from "react";
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
  Lightbulb,
  DollarSign,
  CheckCircle2,
  Percent,
  XCircle,
  Landmark,
} from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import StateChoropleth from "@/components/dashboard/StateChoropleth";
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
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues, fmtUSD, fmtNum } from "@/data/hmdaMarket";

const FILTER_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const QUESTIONS = [
  {
    id: "q1",
    label: "Q1 · Market Size",
    icon: TrendingUp,
    insight:
      "Originations peaked in 2021 (~9.9M) during the low-rate boom, fell sharply through 2023, and are recovering into 2025. Median values rose steadily.",
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

export default function InteractiveDashboard() {
  const [year, setYear] = useState(2025);
  const [selectedMsa, setSelectedMsa] = useState(MSAS[0]?.name ?? "");

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

  const nationalForecast = useMemo(
    () => forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty]))),
    []
  );

  const activeMsa = MSAS.find((m) => m.name === selectedMsa) ?? MSAS[0];
  const msaForecast = useMemo(() => {
    if (!activeMsa) return [];
    const vals = {};
    FILTER_YEARS.forEach((y) => (vals[y] = activeMsa.values[y]));
    return forecastValues(vals);
  }, [activeMsa]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-display text-base font-semibold text-foreground sm:text-lg">Interactive Dashboard</h1>
                <p className="text-xs text-muted-foreground">All 5 business questions · 2018–2025</p>
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

        {QUESTIONS.map((q, idx) => {
          const Icon = q.icon;
          return (
            <motion.section
              key={q.id}
              id={q.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
            >
              <div className="mb-3 flex items-center gap-2.5 border-b border-border pb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <h2 className="font-display text-sm font-semibold text-foreground">{q.label}</h2>
              </div>
              <div className="mb-3 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-xs leading-relaxed text-foreground">{q.insight}</p>
              </div>

              {q.id === "q1" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <YoYChangeChart data={nationalAnnual} />
                  <MedianValueTrendChart data={nationalAnnual} />
                  <OriginationsByYearChart data={nationalAnnual} />
                </div>
              )}

              {q.id === "q2" && (
                <>
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
                </>
              )}

              {q.id === "q3" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SiteBuiltVsManufacturedLine siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
                  <ManufacturedValueChart data={manufacturedAnnual} />
                </div>
              )}

              {q.id === "q4" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DenialVsGrowthChart states={STATES} year={year} />
                  <DenialTrendTop5Chart states={STATES} />
                </div>
              )}

              {q.id === "q5" && (
                <>
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
                </>
              )}
            </motion.section>
          );
        })}

        <footer className="pt-1 pb-6 text-center text-xs text-muted-foreground">
          Interactive Dashboard · HMDA market analysis 2018–2025. Upload the FFIEC LAR CSV for real figures.
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