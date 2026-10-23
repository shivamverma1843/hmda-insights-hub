import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import TrendChart, { RateTrendChart, LoanAmountChart } from "@/components/dashboard/TrendChart";
import {
  LoanPurposeChart,
  ActionTakenChart,
  RaceEthnicityChart,
  DenialByRaceChart,
  TopLendersChart,
  LoanTypePie,
} from "@/components/dashboard/BreakdownCharts";
import StateChoropleth from "@/components/dashboard/StateChoropleth";
import {
  NationalOriginationsChart,
  NationalMedianValueChart,
  SiteBuiltPremiumChart,
  TopStatesGrowthChart,
  NationalForecastChart,
  TopMSAsGrowthChart,
} from "@/components/dashboard/MarketCharts";
import { buildMergedData } from "@/lib/hmdaStore";
import {
  nationalAnnual,
  manufacturedAnnual,
  STATES,
  MSAS,
  forecastValues,
  fmtUSD,
} from "@/data/hmdaMarket";
import { YEARS, fmtNum, fmtPct } from "@/data/hmdaData";

const SECTION = "rounded-2xl border border-border bg-card p-4 shadow-sm";

function SectionTitle({ title, hint }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export default function CompleteDashboard() {
  const [year, setYear] = useState(2025);
  const [merged, setMerged] = useState(() => buildMergedData());

  useEffect(() => {
    const onFocus = () => setMerged(buildMergedData());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const annualMetrics = merged.annualMetrics;

  const current = useMemo(
    () => annualMetrics.find((m) => m.year === year) ?? annualMetrics[annualMetrics.length - 1],
    [annualMetrics, year]
  );
  const prev = useMemo(() => {
    const idx = annualMetrics.findIndex((m) => m.year === year);
    return idx > 0 ? annualMetrics[idx - 1] : null;
  }, [annualMetrics, year]);

  const delta = (key) => (prev ? ((current[key] - prev[key]) / prev[key]) * 100 : null);

  const stateValueByYear = useMemo(() => {
    const map = {};
    STATES.forEach((s) => {
      map[s.name] = s.values[year];
    });
    return map;
  }, [year]);

  const nationalForecast = useMemo(() => forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty]))), []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground sm:text-xl">Complete Dashboard</h1>
                <p className="text-xs text-muted-foreground">All HMDA charts in one view · 2018–2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Year</span>
              <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      y === year ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* KPI row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6"
        >
          <KpiCard label="Applications" value={fmtNum(current.applications)} delta={delta("applications")} icon={LayoutDashboard} accent="primary" />
          <KpiCard label="Originations" value={fmtNum(current.originations)} delta={delta("originations")} icon={LayoutDashboard} accent="emerald" />
          <KpiCard label="Loan Amount" value={fmtUSD(current.loanAmount)} delta={delta("loanAmount")} icon={LayoutDashboard} accent="violet" />
          <KpiCard label="Avg Loan Size" value={fmtUSD(current.avgLoan)} delta={delta("avgLoan")} icon={LayoutDashboard} accent="blue" />
          <KpiCard label="Approval Rate" value={fmtPct(current.approvalRate)} delta={delta("approvalRate")} icon={LayoutDashboard} accent="emerald" />
          <KpiCard label="Denial Rate" value={fmtPct(current.denialRate)} delta={delta("denialRate")} icon={LayoutDashboard} accent="rose" />
        </motion.div>

        {/* HMDA volume */}
        <section className={SECTION}>
          <SectionTitle title="HMDA Volume Trends" hint="Applications, originations, rates" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendChart data={annualMetrics} />
            </div>
            <RateTrendChart data={annualMetrics} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LoanAmountChart data={annualMetrics} />
            <NationalOriginationsChart data={nationalAnnual} />
          </div>
        </section>

        {/* Composition */}
        <section className={SECTION}>
          <SectionTitle title="Loan Composition" hint="Purpose, disposition, type" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LoanPurposeChart data={merged.loanPurposeTrend} />
            <ActionTakenChart data={merged.actionTakenTrend} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LoanTypePie data={merged.loanTypeMix} />
            <NationalMedianValueChart data={nationalAnnual} />
          </div>
        </section>

        {/* Demographics */}
        <section className={SECTION}>
          <SectionTitle title="Demographics & Lenders" hint="Race, denial, top lenders" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RaceEthnicityChart data={merged.raceEthnicity} />
            <DenialByRaceChart data={merged.denialByRace} />
          </div>
          <div className="mt-4">
            <TopLendersChart data={merged.topLenders} />
          </div>
        </section>

        {/* Market */}
        <section className={SECTION}>
          <SectionTitle title="Market Values" hint="National, site-built vs manufactured" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SiteBuiltPremiumChart siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
            <NationalForecastChart actual={nationalAnnual} forecast={nationalForecast} />
          </div>
        </section>

        {/* Geography */}
        <section className={SECTION}>
          <SectionTitle title="Geography" hint={`State median values · ${year}`} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <StateChoropleth valueByState={stateValueByYear} metricLabel="Median property value" format={fmtUSD} />
            <TopStatesGrowthChart states={STATES} />
          </div>
          <div className="mt-4">
            <TopMSAsGrowthChart msas={MSAS} />
          </div>
        </section>

        <footer className="pt-2 pb-8 text-center text-xs text-muted-foreground">
          All charts combined · HMDA market analysis 2018–2025. Upload the FFIEC LAR CSV for real figures.
        </footer>
      </main>
    </div>
  );
}