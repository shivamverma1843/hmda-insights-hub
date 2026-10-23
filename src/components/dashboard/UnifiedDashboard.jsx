import React, { useMemo, useState } from "react";
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
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  MapPin,
  Home,
  ShieldCheck,
  LineChart as LineChartIcon,
  DollarSign,
  CheckCircle2,
  XCircle,
  Percent,
  Landmark,
} from "lucide-react";
import { nationalAnnual, manufacturedAnnual, STATES, MSAS, forecastValues, FULL_YEARS, fmtUSD, fmtNum } from "@/data/hmdaMarket";
import StateChoropleth from "@/components/dashboard/StateChoropleth";

// Power BI navy-to-mauve palette
const PB = ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da", "#c5cae9", "#e1bee7"];
const colorFor = (i) => PB[i % PB.length];

const TT = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 10,
  padding: "4px 8px",
};

function PbCard({ bq, title, subtitle, children, className = "" }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-sm ${className}`}>
      <div className="border-b border-[#f0f0f0] px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-[#1a237e] px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">{bq}</span>
          <p className="truncate text-[11px] font-semibold text-[#333]">{title}</p>
        </div>
        {subtitle && <p className="mt-0.5 truncate text-[9px] text-[#999]">{subtitle}</p>}
      </div>
      <div className="flex-1 p-1.5">{children}</div>
    </div>
  );
}

function PbKpi({ label, value, delta, icon: Icon, accent = "#1a237e" }) {
  const positive = delta != null && delta >= 0;
  return (
    <div className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 shadow-sm">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded" style={{ background: `${accent}15`, color: accent }}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[9px] font-medium uppercase tracking-wide text-[#999]">{label}</p>
        <p className="truncate text-sm font-bold text-[#333]">{value}</p>
      </div>
      {delta != null && (
        <span
          className="shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold"
          style={{ background: positive ? "#dcfce7" : "#fee2e2", color: positive ? "#16a34a" : "#dc2626" }}
        >
          {positive ? "+" : ""}
          {delta}%
        </span>
      )}
    </div>
  );
}

export default function UnifiedDashboard({ year: initialYear }) {
  const [year, setYear] = useState(initialYear ?? 2025);
  const [selectedMsa, setSelectedMsa] = useState(MSAS[0]?.name ?? "");

  const current = nationalAnnual.find((n) => n.year === year) ?? nationalAnnual[nationalAnnual.length - 1];
  const prevIdx = nationalAnnual.findIndex((n) => n.year === year) - 1;
  const prev = prevIdx >= 0 ? nationalAnnual[prevIdx] : null;
  const delta = (k) => (prev ? +(((current[k] - prev[k]) / prev[k]) * 100).toFixed(1) : null);

  const nationalForecast = useMemo(() => forecastValues(Object.fromEntries(nationalAnnual.map((n) => [n.year, n.medianProperty]))), []);
  const activeMsa = MSAS.find((m) => m.name === selectedMsa) ?? MSAS[0];
  const msaForecast = useMemo(() => {
    if (!activeMsa) return [];
    const vals = {};
    FULL_YEARS.forEach((y) => (vals[y] = activeMsa.values[y]));
    return forecastValues(vals);
  }, [selectedMsa]);

  // --- Chart data ---
  const yoyData = useMemo(
    () =>
      nationalAnnual.slice(1).map((d, i) => ({
        year: d.year,
        change: +(((d.medianProperty - nationalAnnual[i].medianProperty) / nationalAnnual[i].medianProperty) * 100).toFixed(1),
      })),
    []
  );

  const originationsData = useMemo(() => nationalAnnual.map((n) => ({ year: n.year, value: n.originations })), []);

  const medianTrendData = useMemo(() => nationalAnnual.map((n) => ({ year: n.year, value: n.medianProperty })), []);

  const topMSAs = useMemo(
    () => [...MSAS].sort((a, b) => b.cagr - a.cagr).slice(0, 10).map((m) => ({ name: m.name.split("-")[0], cagr: m.cagr })),
    []
  );

  const stateByValue = useMemo(
    () => [...STATES].map((s) => ({ name: s.code, value: s.values[year] })).sort((a, b) => b.value - a.value).slice(0, 12),
    [year]
  );

  const choroplethByState = useMemo(() => {
    const map = {};
    STATES.forEach((s) => {
      map[s.name] = s.values[year];
    });
    return map;
  }, [year]);

  const volumeVsGrowth = useMemo(
    () =>
      STATES.map((s) => ({
        name: s.code,
        volume: s.originations,
        growth: +(((s.values[year] - s.values[2018]) / s.values[2018]) * 100).toFixed(1),
      })),
    [year]
  );

  const siteVsMfg = useMemo(
    () =>
      nationalAnnual.map((n, i) => ({
        year: n.year,
        "Site-Built": n.medianProperty,
        Manufactured: manufacturedAnnual[i]?.medianProperty,
      })),
    []
  );

  const premiumRatio = useMemo(
    () =>
      FULL_YEARS.map((y) => {
        const sb = nationalAnnual.find((n) => n.year === y).medianProperty;
        const mh = manufacturedAnnual.find((m) => m.year === y).medianProperty;
        return { year: y, ratio: +(sb / mh).toFixed(2) };
      }),
    []
  );

  const denialVsGrowth = useMemo(
    () =>
      [...STATES].slice(0, 10).map((s) => ({
        name: s.code,
        "Denial rate": s.denial[year],
        "Value growth": +(((s.values[year] - s.values[2018]) / s.values[2018]) * 100).toFixed(1),
      })),
    [year]
  );

  const denialTrend = useMemo(() => {
    const top5 = [...STATES].sort((a, b) => b.cagr - a.cagr).slice(0, 5);
    return FULL_YEARS.map((y) => {
      const r = { year: y };
      top5.forEach((s) => (r[s.code] = s.denial[y]));
      return r;
    });
  }, []);

  const forecastData = useMemo(
    () => [
      ...nationalAnnual.map((a) => ({ year: a.year, Actual: a.medianProperty, Forecast: null })),
      ...nationalForecast.map((f) => ({ year: f.year, Actual: null, Forecast: f.value })),
    ],
    [nationalForecast]
  );

  const msaForecastData = useMemo(
    () => [
      ...FULL_YEARS.map((y) => ({ year: y, Actual: activeMsa?.values[y], Forecast: null })),
      ...msaForecast.map((f) => ({ year: f.year, Actual: null, Forecast: f.value })),
    ],
    [selectedMsa, msaForecast]
  );

  const fastestStates = useMemo(
    () => [...STATES].sort((a, b) => b.cagr - a.cagr).slice(0, 8).map((s) => ({ name: s.code, cagr: s.cagr })),
    []
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-[#1a237e] text-white">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-white/15">
              <LineChartIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <h1 className="text-xs font-bold sm:text-sm">HMDA Unified Dashboard</h1>
              <p className="hidden text-[9px] text-white/60 sm:block">All 5 business questions · 2018–2025</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-white/70">Year</span>
            <div className="flex gap-0.5 rounded bg-white/10 p-0.5">
              {FULL_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                    y === year ? "bg-white text-[#1a237e]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-2 p-2">
        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-8">
          <PbKpi label="Median Value" value={fmtUSD(current.medianProperty)} delta={delta("medianProperty")} icon={DollarSign} accent="#1a237e" />
          <PbKpi label="Originations" value={fmtNum(current.originations)} delta={delta("originations")} icon={CheckCircle2} accent="#283593" />
          <PbKpi label="Denial Rate" value={`${current.denialRate}%`} delta={delta("denialRate")} icon={XCircle} accent="#c62828" />
          <PbKpi label="Median Rate" value={`${current.medianRate}%`} delta={delta("medianRate")} icon={Percent} accent="#5c6bc0" />
          <PbKpi label="Mfg Value" value={fmtUSD(manufacturedAnnual.find((m) => m.year === year)?.medianProperty)} icon={Home} accent="#7986cb" />
          <PbKpi label="Top State CAGR" value={`${STATES[0]?.cagr}%`} icon={TrendingUp} accent="#3949ab" />
          <PbKpi label="Top MSA CAGR" value={`${MSAS[0]?.cagr}%`} icon={Landmark} accent="#5c6bc0" />
          <PbKpi label="Avg Loan" value={fmtUSD(Math.round((current.originations * current.medianProperty) / current.originations))} icon={DollarSign} accent="#1a237e" />
        </div>

        {/* BQ1 — Market Size */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="rounded bg-[#1a237e] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Q1</span>
          <h2 className="text-[11px] font-bold text-[#333]">Market Size & Value</h2>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          <PbCard bq="Q1" title="Originations by Year" subtitle="National purchase volume">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={originationsData} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtNum(v)} />
                  <Tooltip contentStyle={TT} formatter={(v) => [fmtNum(v), "Originations"]} labelFormatter={(l) => `Year ${l}`} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {originationsData.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q1" title="Median Value Trend" subtitle="National site-built median">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={medianTrendData} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [fmtUSD(v), "Median"]} labelFormatter={(l) => `Year ${l}`} />
                  <Line type="monotone" dataKey="value" stroke="#1a237e" strokeWidth={2} dot={{ r: 2, fill: "#1a237e" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q1" title="YoY % Change" subtitle="Annual median value change">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yoyData} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "YoY"]} />
                  <Bar dataKey="change" radius={[2, 2, 0, 0]} fill="#5c6bc0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q1" title="National Forecast" subtitle="Actual & projected to 2028">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [fmtUSD(v)]} labelFormatter={(l) => `Year ${l}`} />
                  <Line type="monotone" dataKey="Actual" stroke="#1a237e" strokeWidth={2} dot={false} connectNulls />
                  <Line type="monotone" dataKey="Forecast" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PbCard>
        </div>

        {/* BQ2 — Geography */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="rounded bg-[#283593] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Q2</span>
          <h2 className="text-[11px] font-bold text-[#333]">Geography</h2>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          <PbCard bq="Q2" title="Top 10 MSAs by CAGR" subtitle="2018–2025 growth rate" className="lg:col-span-2">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMSAs} layout="vertical" margin={{ top: 2, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "CAGR"]} />
                  <Bar dataKey="cagr" radius={[0, 2, 2, 0]} fill="#283593" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q2" title="Median Value by State" subtitle={`Top 12 · ${year}`}>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateByValue} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 7, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [fmtUSD(v), "Median"]} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#3949ab" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q2" title="Volume vs Growth" subtitle={`Originations vs value growth · ${year}`}>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" dataKey="volume" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtNum(v)} />
                  <YAxis type="number" dataKey="growth" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <ZAxis range={[30, 30]} />
                  <Tooltip contentStyle={TT} cursor={{ strokeDasharray: "3 3" }} formatter={(v, n) => [n === "growth" ? `${v}%` : fmtNum(v), n]} />
                  <Scatter data={volumeVsGrowth} fill="#5c6bc0" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </PbCard>
        </div>

        <div className="flex flex-col overflow-visible rounded-md border border-[#e5e7eb] bg-white shadow-sm lg:col-span-4">
          <div className="border-b border-[#f0f0f0] px-2.5 py-1.5">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-[#283593] px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">Q2</span>
              <p className="truncate text-[11px] font-semibold text-[#333]">Choropleth: Median Property Value</p>
            </div>
            <p className="mt-0.5 truncate text-[9px] text-[#999]">State median value · {year}</p>
          </div>
          <div className="p-1.5">
            <StateChoropleth valueByState={choroplethByState} metricLabel="Median value" format={fmtUSD} />
          </div>
        </div>

        {/* BQ3 — Site-Built Premium */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="rounded bg-[#3949ab] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Q3</span>
          <h2 className="text-[11px] font-bold text-[#333]">Site-Built Premium</h2>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          <PbCard bq="Q3" title="Site-Built vs Manufactured" subtitle="Median value trend" className="lg:col-span-2">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={siteVsMfg} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [fmtUSD(v)]} labelFormatter={(l) => `Year ${l}`} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="Site-Built" stroke="#1a237e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Manufactured" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q3" title="Premium Ratio" subtitle="Site-built ÷ manufactured">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={premiumRatio} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}x`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}x`, "Ratio"]} />
                  <Bar dataKey="ratio" radius={[2, 2, 0, 0]} fill="#7986cb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q3" title="Manufactured Value" subtitle="National median">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={manufacturedAnnual} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mfgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [fmtUSD(v), "Median"]} labelFormatter={(l) => `Year ${l}`} />
                  <Area type="monotone" dataKey="medianProperty" stroke="#f59e0b" fill="url(#mfgGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PbCard>
        </div>

        {/* BQ4 — Credit Access */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="rounded bg-[#5c6bc0] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Q4</span>
          <h2 className="text-[11px] font-bold text-[#333]">Credit Access</h2>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          <PbCard bq="Q4" title="Denial Rate vs Value Growth" subtitle={`By state · ${year}`} className="lg:col-span-2">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={denialVsGrowth} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`]} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Denial rate" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Value growth" fill="#1a237e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q4" title="Denial Rate Trend" subtitle="Top 5 growth markets" className="lg:col-span-2">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={denialTrend} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`]} labelFormatter={(l) => `Year ${l}`} />
                  <Legend wrapperStyle={{ fontSize: 8 }} />
                  {[0, 1, 2, 3, 4].map((i) => {
                    const code = [...STATES].sort((a, b) => b.cagr - a.cagr)[i].code;
                    return <Line key={code} type="monotone" dataKey={code} stroke={colorFor(i)} strokeWidth={1.5} dot={false} />;
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PbCard>
        </div>

        {/* BQ5 — Forecast */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="rounded bg-[#7986cb] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Q5</span>
          <h2 className="text-[11px] font-bold text-[#333]">Forecast</h2>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          <PbCard bq="Q5" title="Fastest-Growing States" subtitle="Top 8 by CAGR" className="lg:col-span-2">
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fastestStates} layout="vertical" margin={{ top: 2, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={28} tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, "CAGR"]} />
                  <Bar dataKey="cagr" radius={[0, 2, 2, 0]} fill="#7986cb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="Q5" title="MSA Forecast" subtitle={`${activeMsa?.name?.split("-")[0] ?? ""} — actual & projected`} className="lg:col-span-2">
            <div className="space-y-1">
              <select
                value={selectedMsa}
                onChange={(e) => setSelectedMsa(e.target.value)}
                className="w-full rounded border border-[#e5e7eb] bg-white px-1.5 py-1 text-[10px] text-[#333]"
              >
                {MSAS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={msaForecastData} margin={{ top: 2, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip contentStyle={TT} formatter={(v) => [fmtUSD(v)]} labelFormatter={(l) => `Year ${l}`} />
                    <Line type="monotone" dataKey="Actual" stroke="#283593" strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="Forecast" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 3" dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PbCard>
        </div>

        <footer className="pt-1 pb-2 text-center text-[9px] text-[#999]">
          HMDA Unified Dashboard · 2018–2025 · Navy-to-mauve Power BI palette
        </footer>
      </main>
    </div>
  );
}