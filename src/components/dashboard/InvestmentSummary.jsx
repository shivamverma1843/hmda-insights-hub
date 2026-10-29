import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { STATES, MSAS, nationalAnnual, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, DollarSign, MapPin, Award, XCircle } from "lucide-react";

const TT = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 10,
  padding: "4px 8px",
};

function ReasonRow({ icon: Icon, color, title, detail }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded" style={{ background: `${color}15`, color }}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-[#333]">{title}</p>
        <p className="text-[9px] text-[#666]">{detail}</p>
      </div>
    </div>
  );
}

export default function InvestmentSummary() {
  const idaho = STATES.find((s) => s.code === "ID");
  const boise = MSAS.find((m) => m.name.startsWith("Boise"));

  // Best performers
  const topStates = useMemo(() => STATES.slice(0, 5).map((s) => ({ name: s.name, cagr: s.cagr })), []);
  const topMsas = useMemo(() => MSAS.slice(0, 5).map((m) => ({ name: m.name, cagr: m.cagr })), []);

  // Worst performers (slowest growth)
  const bottomStates = useMemo(
    () =>
      [...STATES]
        .sort((a, b) => a.cagr - b.cagr)
        .slice(0, 5)
        .map((s) => ({ name: s.name, cagr: s.cagr })),
    []
  );
  const bottomMsas = useMemo(
    () =>
      [...MSAS]
        .sort((a, b) => a.cagr - b.cagr)
        .slice(0, 5)
        .map((m) => ({ name: m.name, cagr: m.cagr })),
    []
  );

  // Highest denial rates (harder to get a loan = riskier)
  const highDenialStates = useMemo(
    () =>
      [...STATES]
        .sort((a, b) => b.denial[2025] - a.denial[2025])
        .slice(0, 5)
        .map((s) => ({ name: s.name, denial: s.denial[2025] })),
    []
  );

  // Key numbers
  const idahoGrowthPct = Math.round(((idaho.values[2025] - idaho.values[2018]) / idaho.values[2018]) * 100);
  const usGrowthPct = Math.round(
    ((nationalAnnual.find((n) => n.year === 2025).medianProperty - nationalAnnual.find((n) => n.year === 2018).medianProperty) /
      nationalAnnual.find((n) => n.year === 2018).medianProperty) *
      100
  );
  const boiseGrowthPct = Math.round(((boise.values[2025] - boise.values[2018]) / boise.values[2018]) * 100);
  const slowestState = [...STATES].sort((a, b) => a.cagr - b.cagr)[0];
  const slowestGrowthPct = Math.round(
    ((slowestState.values[2025] - slowestState.values[2018]) / slowestState.values[2018]) * 100
  );

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="rounded bg-[#1a237e] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">SUMMARY</span>
        <h2 className="text-[11px] font-bold text-[#333]">Top Reasons to Invest vs. Avoid — At a Glance</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      {/* Two columns: Invest vs Avoid */}
      <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        {/* INVEST column */}
        <div className="rounded-md border border-green-200 bg-green-50/40 p-2">
          <div className="flex items-center gap-1.5 pb-1.5">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-[11px] font-bold text-green-700">Top Reasons to INVEST</p>
          </div>

          {/* Simple bar: top 5 states */}
          <div className="mb-1.5 rounded-md border border-[#e5e7eb] bg-white p-1.5">
            <p className="mb-0.5 text-[9px] font-semibold text-[#333]">Fastest-growing states (annual growth rate)</p>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topStates} margin={{ top: 2, right: 4, left: -18, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#666" }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={36} interval={0} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "Growth/yr"]} />
                  <Bar dataKey="cagr" radius={[2, 2, 0, 0]}>
                    {topStates.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#16a34a" : "#86efac"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reasons list */}
          <div className="space-y-1">
            <ReasonRow
              icon={DollarSign}
              color="#16a34a"
              title="Values nearly doubled"
              detail={`Idaho grew ${idahoGrowthPct}% since 2018 — the US average only grew ${usGrowthPct}%`}
            />
            <ReasonRow
              icon={Award}
              color="#16a34a"
              title="#1 ranked state"
              detail={`Idaho has the highest annual growth rate (${idaho.cagr}%) of any state`}
            />
            <ReasonRow
              icon={MapPin}
              color="#16a34a"
              title="Boise is the hottest city"
              detail={`Boise City grew ${boiseGrowthPct}% — faster than any other metro area`}
            />
            <ReasonRow
              icon={CheckCircle2}
              color="#16a34a"
              title="Easier to get a loan"
              detail={`Idaho's denial rate (9.0%) is among the lowest — buyers can actually get mortgages`}
            />
          </div>
        </div>

        {/* AVOID column */}
        <div className="rounded-md border border-red-200 bg-red-50/40 p-2">
          <div className="flex items-center gap-1.5 pb-1.5">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <p className="text-[11px] font-bold text-red-700">Top Reasons to AVOID</p>
          </div>

          {/* Simple bar: bottom 5 states */}
          <div className="mb-1.5 rounded-md border border-[#e5e7eb] bg-white p-1.5">
            <p className="mb-0.5 text-[9px] font-semibold text-[#333]">Slowest-growing states (annual growth rate)</p>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bottomStates} margin={{ top: 2, right: 4, left: -18, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#666" }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={36} interval={0} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "Growth/yr"]} />
                  <Bar dataKey="cagr" radius={[2, 2, 0, 0]} fill="#dc2626">
                    <LabelList dataKey="cagr" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 7, fill: "#999" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reasons list */}
          <div className="space-y-1">
            <ReasonRow
              icon={TrendingDown}
              color="#dc2626"
              title="Barely any growth"
              detail={`${slowestState.name} only grew ${slowestGrowthPct}% since 2018 — money sits still`}
            />
            <ReasonRow
              icon={XCircle}
              color="#dc2626"
              title="Hard to get a loan"
              detail="States like Nevada & Florida have denial rates above 12% — buyers get rejected"
            />
            <ReasonRow
              icon={AlertTriangle}
              color="#dc2626"
              title="Already peaked"
              detail="Some markets surged in 2021 then flatlined — values stopped climbing after 2022"
            />
            <ReasonRow
              icon={DollarSign}
              color="#dc2626"
              title="High prices, low returns"
              detail="Expensive states like California & NY grow slowly — you pay more but earn less"
            />
          </div>
        </div>
      </div>

      {/* Quick comparison table */}
      <div className="rounded-md border border-[#e5e7eb] bg-white p-2 shadow-sm">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1a237e]">Quick comparison — Best vs. Worst</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <div className="rounded border border-green-200 bg-green-50/50 px-2 py-1.5 text-center">
            <p className="text-[8px] uppercase text-[#999]">Best state</p>
            <p className="text-sm font-bold text-green-700">Idaho</p>
            <p className="text-[9px] text-[#666]">{idaho.cagr}%/yr growth</p>
          </div>
          <div className="rounded border border-green-200 bg-green-50/50 px-2 py-1.5 text-center">
            <p className="text-[8px] uppercase text-[#999]">Best city</p>
            <p className="text-sm font-bold text-green-700">Boise</p>
            <p className="text-[9px] text-[#666]">{boise.cagr}%/yr growth</p>
          </div>
          <div className="rounded border border-red-200 bg-red-50/50 px-2 py-1.5 text-center">
            <p className="text-[8px] uppercase text-[#999]">Worst state</p>
            <p className="text-sm font-bold text-red-700">{slowestState.name}</p>
            <p className="text-[9px] text-[#666]">{slowestState.cagr}%/yr growth</p>
          </div>
          <div className="rounded border border-red-200 bg-red-50/50 px-2 py-1.5 text-center">
            <p className="text-[8px] uppercase text-[#999]">US average</p>
            <p className="text-sm font-bold text-[#333]">{usGrowthPct}%</p>
            <p className="text-[9px] text-[#666]">since 2018</p>
          </div>
        </div>
      </div>
    </div>
  );
}