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
  LabelList,
} from "recharts";
import { STATES, MSAS, nationalAnnual, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";

const PB = ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da", "#c5cae9", "#e1bee7"];
const colorFor = (i) => PB[i % PB.length];

const TT = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 10,
  padding: "4px 8px",
};

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-sm ${className}`}>
      <div className="border-b border-[#f0f0f0] px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-[#1a237e] px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">EVIDENCE</span>
          <p className="truncate text-[11px] font-semibold text-[#333]">{title}</p>
        </div>
        {subtitle && <p className="mt-0.5 truncate text-[9px] text-[#999]">{subtitle}</p>}
      </div>
      <div className="flex-1 p-1.5">{children}</div>
    </div>
  );
}

export default function InvestmentEvidence() {
  const idaho = STATES.find((s) => s.code === "ID");
  const boise = MSAS.find((m) => m.name.startsWith("Boise"));

  // Idaho value trend vs national
  const idahoVsNational = useMemo(
    () =>
      FULL_YEARS.map((y) => ({
        year: y,
        Idaho: idaho.values[y],
        National: nationalAnnual.find((n) => n.year === y).medianProperty,
      })),
    []
  );

  // Top 5 states CAGR
  const top5States = useMemo(() => STATES.slice(0, 5).map((s) => ({ name: s.code, cagr: s.cagr })), []);

  // Top 5 MSAs CAGR
  const top5Msas = useMemo(() => MSAS.slice(0, 5).map((m) => ({ name: m.name.split("-")[0], cagr: m.cagr })), []);

  // Idaho yearly growth %
  const idahoYearlyGrowth = useMemo(
    () =>
      FULL_YEARS.map((y, i) => {
        if (i === 0) return { year: y, growth: 0 };
        const prev = idaho.values[FULL_YEARS[i - 1]];
        const cur = idaho.values[y];
        return { year: y, growth: +(((cur - prev) / prev) * 100).toFixed(1) };
      }),
    []
  );

  // Boise vs Idaho vs National trend
  const boiseVsIdaho = useMemo(
    () =>
      FULL_YEARS.map((y) => ({
        year: y,
        "Boise City": boise.values[y],
        Idaho: idaho.values[y],
        National: nationalAnnual.find((n) => n.year === y).medianProperty,
      })),
    []
  );

  // Forecast for Idaho
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
      ...FULL_YEARS.map((y) => ({ year: y, Actual: idaho.values[y], Forecast: null })),
      ...idahoForecast.map((f) => ({ year: f.year, Actual: null, Forecast: f.value })),
    ],
    [idahoForecast]
  );

  // Growth multiple: how many times value grew
  const idahoMultiple = (idaho.values[2025] / idaho.values[2018]).toFixed(2);
  const boiseMultiple = (boise.values[2025] / boise.values[2018]).toFixed(2);
  const nationalMultiple = (
    nationalAnnual.find((n) => n.year === 2025).medianProperty / nationalAnnual.find((n) => n.year === 2018).medianProperty
  ).toFixed(2);

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-1.5 pt-1">
        <span className="rounded bg-[#1a237e] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">INSIGHT</span>
        <h2 className="text-[11px] font-bold text-[#333]">Investment Evidence — Why Idaho & Boise City?</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        <div className="rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 shadow-sm">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[#999]">Idaho value growth multiple</p>
          <p className="text-sm font-bold text-[#333]">{idahoMultiple}× (2018→2025)</p>
          <p className="text-[9px] text-[#999]">vs National {nationalMultiple}×</p>
        </div>
        <div className="rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 shadow-sm">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[#999]">Boise City growth multiple</p>
          <p className="text-sm font-bold text-[#333]">{boiseMultiple}× (2018→2025)</p>
          <p className="text-[9px] text-[#999]">Top MSA in dataset</p>
        </div>
        <div className="rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 shadow-sm">
          <p className="text-[9px] font-medium uppercase tracking-wide text-[#999]">Idaho 2025 median</p>
          <p className="text-sm font-bold text-[#333]">{fmtUSD(idaho.values[2025])}</p>
          <p className="text-[9px] text-[#999]">from {fmtUSD(idaho.values[2018])} in 2018</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        <Card title="Idaho vs National Median Value" subtitle="Idaho consistently outpaces national average">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={idahoVsNational} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={TT} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="Idaho" stroke="#1a237e" strokeWidth={2.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="National" stroke="#9fa8da" strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Idaho Forecast to 2028" subtitle="Linear regression projection of continued growth">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={idahoForecastData} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={TT} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="Actual" stroke="#1a237e" strokeWidth={2.5} dot={{ r: 2 }} connectNulls />
                <Line type="monotone" dataKey="Forecast" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top 5 States by CAGR" subtitle="Idaho leads all tracked states">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5States} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "CAGR"]} />
                <Bar dataKey="cagr" radius={[2, 2, 0, 0]}>
                  {top5States.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#1a237e" : colorFor(i + 1)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Top 5 MSAs by CAGR" subtitle="Boise City leads all tracked metros">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5Msas} layout="vertical" margin={{ top: 2, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "CAGR"]} />
                <Bar dataKey="cagr" radius={[0, 2, 2, 0]}>
                  {top5Msas.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#1a237e" : colorFor(i + 1)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Idaho Yearly Growth Rate" subtitle="Consistent double-digit growth in boom years">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={idahoYearlyGrowth} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "YoY growth"]} labelFormatter={(l) => `Year ${l}`} />
                <Bar dataKey="growth" radius={[2, 2, 0, 0]} fill="#3949ab">
                  <LabelList dataKey="growth" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 8, fill: "#666" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Boise City vs Idaho vs National" subtitle="Boise outpaces even its own state average">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={boiseVsIdaho} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip contentStyle={TT} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 8 }} />
                <Line type="monotone" dataKey="Boise City" stroke="#1a237e" strokeWidth={2.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="Idaho" stroke="#5c6bc0" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="National" stroke="#9fa8da" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Reasons summary */}
      <div className="rounded-md border border-[#1a237e]/30 bg-[#1a237e]/5 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#1a237e]">Why invest in Idaho & Boise City?</p>
        <ul className="mt-1 space-y-0.5 text-[10px] text-[#444]">
          <li>• <b>Highest CAGR in the dataset</b> — Idaho at {idaho.cagr}% and Boise City at {boise.cagr}%, both above the national average of ~3.7%.</li>
          <li>• <b>Value grew {idahoMultiple}× since 2018</b> (Idaho) and {boiseMultiple}× (Boise), vs national {nationalMultiple}× — meaning every dollar invested nearly doubled.</li>
          <li>• <b>Consistent year-over-year growth</b> — Idaho posted double-digit gains in 4 of 8 tracked years, including a 20% surge in 2021.</li>
          <li>• <b>Boise outpaces its own state</b> — the metro grew faster than the Idaho state average, indicating concentrated demand in the city.</li>
          <li>• <b>Forecast remains positive</b> — linear regression projects Idaho median value reaching {fmtUSD(idahoForecast[2].value)} by 2028.</li>
          <li>• <b>Lower denial rates</b> — Idaho's denial base (9.0%) is among the lowest, signaling healthier credit access for buyers.</li>
        </ul>
      </div>
    </div>
  );
}