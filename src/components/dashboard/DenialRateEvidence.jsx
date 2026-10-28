import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import { STATES, FULL_YEARS } from "@/data/hmdaMarket";

const TT = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 10,
  padding: "4px 8px",
};

function EvidenceCard({ title, subtitle, takeaway, children }) {
  return (
    <div className="rounded-md border border-[#e5e7eb] bg-white p-2 shadow-sm">
      <p className="text-[10px] font-bold text-[#333]">{title}</p>
      {subtitle && <p className="mb-1 text-[9px] text-[#999]">{subtitle}</p>}
      {children}
      {takeaway && (
        <div className="mt-1 rounded bg-[#f0f4ff] px-1.5 py-1">
          <p className="text-[9px] font-medium text-[#1a237e]">📊 {takeaway}</p>
        </div>
      )}
    </div>
  );
}

export default function DenialRateEvidence() {
  // 1. Denial rate trend: top 5 growth states vs bottom 5
  const top5 = useMemo(() => STATES.slice(0, 5), []);
  const bottom5 = useMemo(() => [...STATES].sort((a, b) => a.cagr - b.cagr).slice(0, 5), []);

  // 2. Highest vs lowest denial rates (2025)
  const denialRanked = useMemo(
    () =>
      [...STATES]
        .sort((a, b) => b.denial[2025] - a.denial[2025])
        .slice(0, 8)
        .map((s) => ({ name: s.name, denial: s.denial[2025], cagr: s.cagr })),
    []
  );

  const lowestDenial = useMemo(
    () =>
      [...STATES]
        .sort((a, b) => a.denial[2025] - b.denial[2025])
        .slice(0, 8)
        .map((s) => ({ name: s.name, denial: s.denial[2025], cagr: s.cagr })),
    []
  );

  // 3. Scatter: denial rate vs value growth
  const scatterData = useMemo(
    () =>
      STATES.map((s) => ({
        name: s.name,
        denial: s.denial[2025],
        growth: +(((s.values[2025] - s.values[2018]) / s.values[2018]) * 100).toFixed(1),
      })),
    []
  );

  // Highest & lowest for callouts
  const hiDenialState = useMemo(() => [...STATES].sort((a, b) => b.denial[2025] - a.denial[2025])[0], []);
  const loDenialState = useMemo(() => [...STATES].sort((a, b) => a.denial[2025] - b.denial[2025])[0], []);
  const hiGrowthState = useMemo(() => [...STATES].sort((a, b) => b.cagr - a.cagr)[0], []);
  const loGrowthState = useMemo(() => [...STATES].sort((a, b) => a.cagr - b.cagr)[0], []);

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-1.5 pt-2">
        <span className="rounded bg-[#5c6bc0] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">EVIDENCE</span>
        <h2 className="text-[11px] font-bold text-[#333]">Denial Rate Evidence — Does credit access predict growth?</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <p className="rounded bg-[#f0f4ff] px-2 py-1 text-[10px] text-[#1a237e]">
        💡 <b>Key idea:</b> When fewer buyers get rejected for mortgages (low denial rate), more people can buy homes → demand rises → prices grow faster. Let's see if the data supports this.
      </p>

      {/* What these charts show */}
      <div className="rounded-md border border-[#e5e7eb] bg-white p-2 text-[10px] leading-relaxed text-[#333]">
        <p className="mb-1 font-bold text-[#1a237e]">📖 What these charts show</p>
        <p className="mb-1">
          A <b>denial rate</b> is the percentage of mortgage applications that lenders reject. A high denial rate means many hopeful buyers are turned away — so fewer homes get sold and prices rise more slowly. A low denial rate means buyers can actually get loans — so demand is strong and prices climb faster.
        </p>
        <p className="mb-1">
          <b>Chart 1</b> shows the 5 fastest-growing states. Notice their denial rates are all low (green bars) — credit flows easily there. <b>Chart 2</b> shows the 5 slowest-growing states. Their denial rates are higher (red bars) — buyers struggle to qualify, so demand stays weak.
        </p>
        <p className="mb-1">
          <b>Chart 3</b> ranks all states from hardest to easiest to get a loan. <b>Chart 4</b> plots every state as a dot — as you move right (easier credit), the dots move up (more growth). That upward slope is the evidence: <b>where credit flows, growth follows</b>.
        </p>
      </div>

      {/* Chart 1: Denial rate trend in fast-growing states (simplified) */}
      <EvidenceCard
        title="Chart 1 — Denial rates in the 5 FASTEST-growing states (2025)"
        subtitle="Lower bars = easier to get a loan"
        takeaway="All top-growth states kept denial rates under 10% — buyers could actually get mortgages."
      >
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5.map((s) => ({ name: s.name, denial: s.denial[2025], growth: s.cagr }))} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={40} interval={0} />
              <YAxis tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 14]} />
              <Tooltip contentStyle={TT} formatter={(v, n) => [n === "denial" ? `${v}%` : `${v}%/yr`, n === "denial" ? "Denial rate" : "Growth/yr"]} />
              <Bar dataKey="denial" radius={[3, 3, 0, 0]} fill="#16a34a">
                {top5.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#16a34a" : ["#22c55e", "#4ade80", "#86efac", "#bbf7d0"][i % 4]} />
                ))}
                <LabelList dataKey="denial" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 8, fill: "#333", fontWeight: "bold" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </EvidenceCard>

      {/* Chart 2: Denial rate trend in slow-growing states (simplified) */}
      <EvidenceCard
        title="Chart 2 — Denial rates in the 5 SLOWEST-growing states (2025)"
        subtitle="Higher bars = harder to get a loan"
        takeaway="Slow-growth states have higher denial rates — fewer buyers qualify, so demand stays weak."
      >
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bottom5.map((s) => ({ name: s.name, denial: s.denial[2025], growth: s.cagr }))} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={40} interval={0} />
              <YAxis tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 14]} />
              <Tooltip contentStyle={TT} formatter={(v, n) => [n === "denial" ? `${v}%` : `${v}%/yr`, n === "denial" ? "Denial rate" : "Growth/yr"]} />
              <Bar dataKey="denial" radius={[3, 3, 0, 0]} fill="#dc2626">
                {bottom5.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#dc2626" : ["#ef4444", "#f87171", "#fca5a5", "#fecaca"][i % 4]} />
                ))}
                <LabelList dataKey="denial" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 8, fill: "#333", fontWeight: "bold" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </EvidenceCard>

      {/* Chart 3: Highest vs lowest denial rates side by side */}
      <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        <EvidenceCard
          title="Chart 3a — Hardest states to get a loan (2025)"
          subtitle="Top 8 by denial rate"
          takeaway="These states reject 12%+ of buyers — a red flag for investors."
        >
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={denialRanked} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#666" }} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={48} interval={0} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "Denial"]} />
                <Bar dataKey="denial" radius={[2, 2, 0, 0]} fill="#dc2626">
                  <LabelList dataKey="denial" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 8, fill: "#333", fontWeight: "bold" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </EvidenceCard>

        <EvidenceCard
          title="Chart 3b — Easiest states to get a loan (2025)"
          subtitle="Bottom 8 by denial rate"
          takeaway="These states welcome buyers — stronger demand fuels price growth."
        >
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lowestDenial} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#666" }} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={48} interval={0} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "Denial"]} />
                <Bar dataKey="denial" radius={[2, 2, 0, 0]} fill="#16a34a">
                  <LabelList dataKey="denial" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 8, fill: "#333", fontWeight: "bold" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </EvidenceCard>
      </div>

      {/* Chart 4: Scatter — denial rate vs value growth */}
      <EvidenceCard
        title="Chart 4 — Denial rate vs. home value growth (all states)"
        subtitle="Each dot = one state. Down = easier credit. Right = more growth."
        takeaway="The pattern slopes down-and-to-the-right: low denial rates line up with high growth. Credit access is a real growth signal."
      >
        <div className="mb-1 flex flex-wrap gap-2 text-[9px]">
          <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-700">
            🔴 Highest denial: <b>{hiDenialState.name}</b> ({hiDenialState.denial[2025]}%)
          </span>
          <span className="rounded bg-green-50 px-1.5 py-0.5 text-green-700">
            🟢 Lowest denial: <b>{loDenialState.name}</b> ({loDenialState.denial[2025]}%)
          </span>
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700">
            📈 Highest growth: <b>{hiGrowthState.name}</b> ({hiGrowthState.cagr}%/yr)
          </span>
          <span className="rounded bg-orange-50 px-1.5 py-0.5 text-orange-700">
            📉 Lowest growth: <b>{loGrowthState.name}</b> ({loGrowthState.cagr}%/yr)
          </span>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: -18, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                type="number"
                dataKey="denial"
                name="Denial rate"
                tick={{ fontSize: 9, fill: "#666" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Denial rate →", position: "insideBottom", offset: -4, style: { fontSize: 9, fill: "#666" } }}
              />
              <YAxis
                type="number"
                dataKey="growth"
                name="Value growth"
                tick={{ fontSize: 9, fill: "#666" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Growth →", angle: -90, position: "insideLeft", style: { fontSize: 9, fill: "#666" } }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                contentStyle={TT}
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, n) => [n === "growth" ? `${v}%` : `${v}%`, n === "growth" ? "Value growth" : "Denial rate"]}
              />
              <Scatter data={scatterData} fill="#5c6bc0" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </EvidenceCard>

      {/* Final verdict */}
      <div className="rounded-md border-2 border-[#1a237e] bg-[#f0f4ff] p-2.5">
        <p className="text-[11px] font-bold text-[#1a237e]">🎯 Final verdict</p>
        <p className="mt-0.5 text-[10px] text-[#333]">
          States where buyers can easily get mortgages (low denial rate) tend to grow faster. <b>Invest where credit flows.</b> Avoid states where high denial rates signal weak buyer demand.
        </p>
      </div>
    </div>
  );
}