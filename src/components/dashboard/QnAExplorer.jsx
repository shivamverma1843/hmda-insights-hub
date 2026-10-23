import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@/components/dashboard/CompleteDashboardCharts";
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues } from "@/data/hmdaMarket";

const QUESTIONS = [
  {
    id: "q1",
    label: "Q1 · Market Size",
    icon: TrendingUp,
    insight:
      "Purchase originations peaked in 2021 (~9.9M) during the low-rate boom, then fell sharply through 2023 as rates climbed. Volumes are recovering into 2025 but remain below the 2021 high. Median property values have risen steadily across the period.",
  },
  {
    id: "q2",
    label: "Q2 · Geography",
    icon: MapPin,
    insight:
      "Western and Sun Belt markets lead value growth. Boise, Austin, and Phoenix top the MSA CAGR rankings, while Idaho, Utah, and Arizona lead among states. Coastal states hold the highest absolute values but grow more slowly.",
  },
  {
    id: "q3",
    label: "Q3 · Site-Built Premium",
    icon: Home,
    insight:
      "Site-built median values are roughly 3–4× manufactured home values, and the premium has widened as site-built appreciation outpaced manufactured homes through the period.",
  },
  {
    id: "q4",
    label: "Q4 · Credit Access",
    icon: ShieldCheck,
    insight:
      "Denial rates dipped to their lowest around 2021, then rose through 2023 as credit tightened. Denial rates vary meaningfully by state, with faster-growing markets often seeing tighter credit access.",
  },
  {
    id: "q5",
    label: "Q5 · Forecast",
    icon: LineChartIcon,
    insight:
      "Linear-trend projections through 2028 suggest continued median value growth, with the fastest-growing markets (Idaho, Utah, Arizona) expected to keep outpacing national averages.",
  },
];

const nationalForecast = forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty])));

export default function QnAExplorer({ year }) {
  const [active, setActive] = useState("q1");
  const current = QUESTIONS.find((q) => q.id === active);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">Interactive Q&A Explorer</h2>
          <p className="text-xs text-muted-foreground">Select a business question to explore its charts and key insight</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {QUESTIONS.map((q) => {
          const Icon = q.icon;
          const isActive = q.id === active;
          return (
            <button
              key={q.id}
              onClick={() => setActive(q.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {q.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-foreground">{current.insight}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {active === "q1" && (
              <>
                <YoYChangeChart data={nationalAnnual} />
                <OriginationsByYearChart data={nationalAnnual} />
              </>
            )}
            {active === "q2" && (
              <>
                <TopMSAsCAGRChart msas={MSAS} />
                <AvgLoanByStateChart states={STATES} year={year} />
              </>
            )}
            {active === "q3" && (
              <>
                <SiteBuiltVsManufacturedLine siteBuilt={nationalAnnual} manufactured={manufacturedAnnual} />
                <ManufacturedValueChart data={manufacturedAnnual} />
              </>
            )}
            {active === "q4" && (
              <>
                <DenialVsGrowthChart states={STATES} year={year} />
                <DenialTrendTop5Chart states={STATES} />
              </>
            )}
            {active === "q5" && (
              <>
                <NationalForecastLine actual={nationalAnnual} forecast={nationalForecast} />
                <FastestGrowingMarketsChart states={STATES} />
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}