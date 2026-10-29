import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { STATES, MSAS, nationalAnnual, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";

const TT = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 10,
  padding: "4px 8px",
};

function ChartCard({ step, title, takeaway, children }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-sm">
      <div className="border-b border-[#f0f0f0] px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1a237e] text-[8px] font-bold text-white">{step}</span>
          <p className="truncate text-[11px] font-semibold text-[#333]">{title}</p>
        </div>
      </div>
      <div className="flex-1 p-1.5">{children}</div>
      {takeaway && (
        <div className="border-t border-[#f0f0f0] bg-[#f8fafc] px-2.5 py-1">
          <p className="text-[9px] text-[#555]">
            <span className="font-semibold text-[#1a237e]">What this means: </span>
            {takeaway}
          </p>
        </div>
      )}
    </div>
  );
}

export default function InvestmentEvidence() {
  const idaho = STATES.find((s) => s.code === "ID");
  const boise = MSAS.find((m) => m.name.startsWith("Boise"));

  // Chart 1: Idaho vs National — "Did Idaho grow faster?"
  const idahoVsNational = useMemo(
    () =>
      FULL_YEARS.map((y) => ({
        year: y,
        Idaho: idaho.values[y],
        "US Average": nationalAnnual.find((n) => n.year === y).medianProperty,
      })),
    []
  );

  // Chart 2: Top 5 states ranked (full names)
  const top5States = useMemo(() => STATES.slice(0, 5).map((s) => ({ name: s.name, cagr: s.cagr })), []);

  // Chart 3: Boise vs Idaho vs US
  const boiseVsIdaho = useMemo(
    () =>
      FULL_YEARS.map((y) => ({
        year: y,
        "Boise City": boise.values[y],
        Idaho: idaho.values[y],
        "US Average": nationalAnnual.find((n) => n.year === y).medianProperty,
      })),
    []
  );

  // Chart 4: Idaho forecast
  const idahoForecast = useMemo(() => {
    const pts = FULL_YEARS.map((y) => ({ x: y, y: idaho.values[y] }));
    const n = pts.length;
    const sx = pts.reduce((s, p) => s + p.x, 0);
    const sy = pts.reduce((s, p) => s + p.y, 0);
    const sxx = pts.reduce((s, p) => s + p.x * p.x, 0);
    const sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const intercept = (sy - slope * sx) / n;
    return [2026, 2027, 2028].map((y) => ({ year: y, value: Math.round(slope * y + intercept) }));
  }, []);

  const idahoForecastData = useMemo(
    () => [
      ...FULL_YEARS.map((y) => ({ year: y, "Past values": idaho.values[y], "Projected": null })),
      ...idahoForecast.map((f) => ({ year: f.year, "Past values": null, "Projected": f.value })),
    ],
    [idahoForecast]
  );

  // Simple numbers
  const idaho2018 = idaho.values[2018];
  const idaho2025 = idaho.values[2025];
  const us2018 = nationalAnnual.find((n) => n.year === 2018).medianProperty;
  const us2025 = nationalAnnual.find((n) => n.year === 2025).medianProperty;
  const idahoGrowthPct = Math.round(((idaho2025 - idaho2018) / idaho2018) * 100);
  const usGrowthPct = Math.round(((us2025 - us2018) / us2018) * 100);
  const boiseGrowthPct = Math.round(((boise.values[2025] - boise.values[2018]) / boise.values[2018]) * 100);

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="rounded bg-[#1a237e] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">INSIGHT</span>
        <h2 className="text-[11px] font-bold text-[#333]">Why Idaho & Boise City are the best places to invest</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      {/* Big simple takeaway box */}
      <div className="rounded-md border border-[#1a237e]/30 bg-[#1a237e]/5 px-3 py-2">
        <p className="text-[11px] font-bold text-[#1a237e]">In short:</p>
        <p className="mt-0.5 text-[10px] text-[#444]">
          A home in Idaho that cost <b>{fmtUSD(idaho2018)}</b> in 2018 is now worth <b>{fmtUSD(idaho2025)}</b> — that's a{" "}
          <b>{idahoGrowthPct}% gain</b> in 7 years. The US average only grew {usGrowthPct}% in the same period. Boise City did even
          better, with a <b>{boiseGrowthPct}% gain</b>. Here's the proof:
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        <ChartCard
          step="1"
          title="Idaho vs the rest of the country (US average)"
          takeaway="Idaho's line rises much faster than the US average — property values grew nearly twice as fast. The gap between the two lines is your profit advantage."
        >
          <div className="mb-1 rounded bg-[#f0f4ff] px-1.5 py-1 text-[9px] text-[#1a237e]">
            📖 <b>How to read this:</b> The solid navy line is <b>Idaho</b>. The dashed grey line is the <b>US average</b> (all states combined). The higher Idaho's line sits above the US line, the more Idaho is outperforming the country. In 2018 they were close — by 2025 Idaho is far ahead.
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={idahoVsNational} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={TT} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="Idaho" stroke="#1a237e" strokeWidth={2.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="US Average" stroke="#9fa8da" strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          step="2"
          title="Top 5 fastest-growing states"
          takeaway="Idaho is #1 — it grew faster than every other state in the dataset."
        >
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5States} margin={{ top: 2, right: 4, left: -18, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#666" }} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={36} interval={0} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}% per year`, "Growth"]} />
                <Bar dataKey="cagr" radius={[2, 2, 0, 0]}>
                  {top5States.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#1a237e" : "#9fa8da"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          step="3"
          title="Boise City grows even faster than Idaho"
          takeaway="Boise's line is above Idaho's — the city is the engine driving the state's growth."
        >
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={boiseVsIdaho} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={TT} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 8 }} />
                <Line type="monotone" dataKey="Boise City" stroke="#1a237e" strokeWidth={2.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Idaho" stroke="#5c6bc0" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="US Average" stroke="#9fa8da" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          step="4"
          title="Idaho is expected to keep growing"
          takeaway="The forecast (dashed red) shows values continuing to rise through 2028 — the trend isn't slowing down."
        >
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={idahoForecastData} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={TT} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="Past values" stroke="#1a237e" strokeWidth={2.5} dot={{ r: 2 }} connectNulls />
                <Line type="monotone" dataKey="Projected" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Simple reasons summary */}
      <div className="rounded-md border border-[#e5e7eb] bg-white px-3 py-2 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#1a237e]">Top 4 reasons to invest</p>
        <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <div className="flex gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1a237e] text-[8px] font-bold text-white">1</span>
            <p className="text-[10px] text-[#444]">
              <b>Values nearly doubled.</b> Idaho grew {idahoGrowthPct}% since 2018 — the US average only grew {usGrowthPct}%.
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1a237e] text-[8px] font-bold text-white">2</span>
            <p className="text-[10px] text-[#444]">
              <b>Boise is the hottest city.</b> It grew {boiseGrowthPct}% — faster than Idaho and every other metro we track.
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1a237e] text-[8px] font-bold text-white">3</span>
            <p className="text-[10px] text-[#444]">
              <b>#1 ranked state.</b> Idaho has the highest annual growth rate ({idaho.cagr}%) of any state in the dataset.
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1a237e] text-[8px] font-bold text-white">4</span>
            <p className="text-[10px] text-[#444]">
              <b>Still climbing.</b> The forecast projects Idaho values to reach {fmtUSD(idahoForecast[2].value)} by 2028.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}