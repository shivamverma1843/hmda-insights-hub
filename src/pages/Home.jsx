import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileBarChart, DollarSign, CheckCircle2, XCircle, Percent, Landmark, Upload as UploadIcon, Database, LayoutDashboard } from "lucide-react";
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
import { YEARS, fmtUSD, fmtNum, fmtPct } from "@/data/hmdaData";
import { buildMergedData } from "@/lib/hmdaStore";

export default function Home() {
  const [year, setYear] = useState(2025);
  const [merged, setMerged] = useState(() => buildMergedData());

  // Refresh merged data when returning to the page after an upload.
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

  const delta = (key) => {
    if (!prev) return null;
    return ((current[key] - prev[key]) / prev[key]) * 100;
  };

  const isRealData = merged.uploadedYears.includes(year);
  const latestUploadYear = merged.uploadedYears.length ? merged.uploadedYears[merged.uploadedYears.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FileBarChart className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground sm:text-xl">HMDA Market Analysis</h1>
                <p className="text-xs text-muted-foreground">US Home Mortgage Disclosure Act data · 2019–2025</p>
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
                to="/reports"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
              >
                <FileBarChart className="h-3.5 w-3.5" />
                Reports
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
              >
                <UploadIcon className="h-3.5 w-3.5" />
                Upload
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                All Charts
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {isRealData ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            <Database className="h-3.5 w-3.5" />
            Showing real uploaded data for {year}. {latestUploadYear && latestUploadYear !== year ? `Latest upload: ${latestUploadYear}` : ""}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            <Database className="h-3.5 w-3.5" />
            {year} uses illustrative sample data. Upload the FFIEC LAR CSV for real figures.
          </div>
        )}

        {/* KPI row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <KpiCard label="Applications" value={fmtNum(current.applications)} delta={delta("applications")} icon={FileBarChart} accent="primary" />
          <KpiCard label="Originations" value={fmtNum(current.originations)} delta={delta("originations")} icon={CheckCircle2} accent="emerald" />
          <KpiCard label="Loan Amount" value={fmtUSD(current.loanAmount)} delta={delta("loanAmount")} icon={DollarSign} accent="violet" />
          <KpiCard label="Avg Loan Size" value={fmtUSD(current.avgLoan)} delta={delta("avgLoan")} icon={Landmark} accent="blue" />
          <KpiCard label="Approval Rate" value={fmtPct(current.approvalRate)} delta={delta("approvalRate")} icon={Percent} accent="emerald" />
          <KpiCard label="Denial Rate" value={fmtPct(current.denialRate)} delta={delta("denialRate")} icon={XCircle} accent="rose" />
        </motion.div>

        {/* Trend charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrendChart data={annualMetrics} />
          </div>
          <RateTrendChart data={annualMetrics} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LoanAmountChart data={annualMetrics} />
          <LoanPurposeChart data={merged.loanPurposeTrend} />
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActionTakenChart data={merged.actionTakenTrend} />
          <LoanTypePie data={merged.loanTypeMix} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RaceEthnicityChart data={merged.raceEthnicity} />
          <DenialByRaceChart data={merged.denialByRace} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TopLendersChart data={merged.topLenders} />
          <SummaryPanel year={year} current={current} />
        </div>

        <footer className="pt-2 pb-8 text-center text-xs text-muted-foreground">
          {merged.uploadedYears.length
            ? `Real data loaded for: ${merged.uploadedYears.join(", ")}. Other years use illustrative sample figures.`
            : "Illustrative aggregated HMDA figures reflecting public reporting trends. Upload the FFIEC LAR CSV for real data."}
        </footer>
      </main>
    </div>
  );
}

function SummaryPanel({ year, current }) {
  const rows = [
    ["Applications", fmtNum(current.applications)],
    ["Originations", fmtNum(current.originations)],
    ["Loan amount", fmtUSD(current.loanAmount)],
    ["Avg loan size", fmtUSD(current.avgLoan)],
    ["Approval rate", fmtPct(current.approvalRate)],
    ["Denial rate", fmtPct(current.denialRate)],
    ["Median rate", `${current.medianRate}%`],
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-display text-base font-semibold text-foreground">Year Snapshot · {year}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Headline metrics for the selected year</p>
      <dl className="mt-4 divide-y divide-border">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2.5">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd className="font-display text-sm font-semibold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}