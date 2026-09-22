import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileBarChart, DollarSign, CheckCircle2, XCircle, Percent, Landmark } from "lucide-react";
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
import { annualMetrics, YEARS, fmtUSD, fmtNum, fmtPct } from "@/data/hmdaData";

export default function Home() {
  const [year, setYear] = useState(2025);

  const current = useMemo(() => annualMetrics.find((m) => m.year === year) ?? annualMetrics[annualMetrics.length - 1], [year]);
  const prev = useMemo(() => {
    const idx = annualMetrics.findIndex((m) => m.year === year);
    return idx > 0 ? annualMetrics[idx - 1] : null;
  }, [year]);

  const delta = (key) => {
    if (!prev) return null;
    return ((current[key] - prev[key]) / prev[key]) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FileBarChart className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-semibold text-foreground sm:text-xl">HMDA Market Analysis</h1>
                  <p className="text-xs text-muted-foreground">US Home Mortgage Disclosure Act data · 2019–2025</p>
                </div>
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
            <TrendChart />
          </div>
          <RateTrendChart />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LoanAmountChart />
          <LoanPurposeChart />
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActionTakenChart />
          <LoanTypePie />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RaceEthnicityChart />
          <DenialByRaceChart />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TopLendersChart />
          <SummaryPanel year={year} current={current} />
        </div>

        <footer className="pt-2 pb-8 text-center text-xs text-muted-foreground">
          Illustrative aggregated HMDA figures reflecting public reporting trends. Not official CFPB data.
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