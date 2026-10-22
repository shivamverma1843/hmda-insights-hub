import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import { STATES, nationalAnnual, manufacturedAnnual, FULL_YEARS, fmtUSD, fmtNum } from "@/data/hmdaMarket";

// Power BI navy-to-mauve palette
const PB_PALETTE = ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da", "#c5cae9", "#e1bee7"];
const colorFor = (i) => PB_PALETTE[i % PB_PALETTE.length];

const tooltipStyle = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 11,
  padding: "6px 10px",
};

function PbCard({ bq, title, children, className = "" }) {
  return (
    <div className={`flex flex-col rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-sm ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">{bq}</p>
      <p className="mb-2 text-xs font-semibold text-[#333]">{title}</p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function PowerBIComparison() {
  const [year, setYear] = useState(2018);

  // 1. YoY % change (single column for selected year)
  const yoyData = useMemo(() => {
    const idx = nationalAnnual.findIndex((n) => n.year === year);
    if (idx <= 0) return [{ year, yoy: 0 }];
    const prev = nationalAnnual[idx - 1];
    const cur = nationalAnnual[idx];
    return [{ year, yoy: +(((cur.medianProperty - prev.medianProperty) / prev.medianProperty) * 100).toFixed(1) }];
  }, [year]);

  // 2. Median property value by state (selected year), top 8
  const medianByState = useMemo(() => {
    return [...STATES]
      .map((s) => ({ name: s.code, value: s.values[year] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [year]);

  // 3. Average loan amount by state (originations * median value proxy), top 7
  const loanAmountByState = useMemo(() => {
    return [...STATES]
      .map((s) => ({ name: s.code, value: Math.round((s.originations * s.values[year]) / 1e9) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [year]);

  // 4. Loan records by construction method (selected year)
  const constructionData = useMemo(() => {
    const nat = nationalAnnual.find((n) => n.year === year);
    return [
      { name: "Site-built", value: Math.round(nat.originations / 1e6) },
      { name: "Manufactured", value: Math.round((nat.originations * 0.04) / 1e6) },
    ];
  }, [year]);

  // 6. Median property value trend line (all years)
  const trendData = useMemo(() => nationalAnnual.map((n) => ({ year: n.year, value: n.medianProperty })), []);

  // 7. Loan volume by state (originations)
  const volumeByState = useMemo(() => {
    return [...STATES]
      .map((s) => ({ name: s.code, value: Math.round(s.originations / 1000) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, []);

  // 8. Site-built premium ratio trend (all years)
  const premiumRatio = useMemo(() => {
    return FULL_YEARS.map((y) => {
      const sb = nationalAnnual.find((n) => n.year === y).medianProperty;
      const mh = manufacturedAnnual.find((m) => m.year === y).medianProperty;
      return { year: y, ratio: +(sb / mh).toFixed(2) };
    });
  }, []);

  // 7. Median property value — single point for selected year
  const trendPoint = useMemo(() => {
    const n = nationalAnnual.find((x) => x.year === year);
    return [{ year, value: n.medianProperty }];
  }, [year]);

  // 9. Site-built premium — single point for selected year
  const premiumPoint = useMemo(() => {
    const sb = nationalAnnual.find((n) => n.year === year).medianProperty;
    const mh = manufacturedAnnual.find((m) => m.year === year).medianProperty;
    return [{ year, ratio: +(sb / mh).toFixed(2) }];
  }, [year]);

  // 9. Loan denials by year (scatter) — denial count proxy
  const denialsByYear = useMemo(() => {
    return nationalAnnual.map((n) => ({ year: n.year, denials: Math.round((n.originations * n.denialRate) / 100 / 1e6) }));
  }, []);

  // 10. Loan denials by state (selected year)
  const denialsByState = useMemo(() => {
    return [...STATES]
      .map((s) => ({ name: s.code, value: Math.round((s.originations * s.denial[year]) / 100 / 1e9) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [year]);

  // 11. BQ5 loan volume by state (full width) — top 10
  const volumeFull = useMemo(() => {
    return [...STATES]
      .map((s) => ({ name: s.code, value: Math.round(s.originations / 1000) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/reports" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#666] hover:text-[#333]">
              <ArrowLeft className="h-3.5 w-3.5" />
              Reports
            </Link>
            <span className="text-[#ccc]">/</span>
            <h1 className="text-sm font-semibold text-[#333]">Power BI Comparison · HMDA Dashboard</h1>
          </div>
          <span className="text-xs text-[#999]">Mirrors the Power BI layout for side-by-side comparison</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-3 p-3">
        {/* Top row: 5 columns */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <PbCard bq="BQ1" title="Year-over-Year % Change">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yoyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "YoY"]} />
                  <Bar dataKey="yoy" radius={[3, 3, 0, 0]}>
                    {yoyData.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ2" title="Median Property Value by State">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medianByState} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <YAxis type="category" dataKey="name" width={24} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v), "Median"]} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {medianByState.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ2" title="Average Loan Amount by State">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loanAmountByState} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}B`} />
                  <YAxis type="category" dataKey="name" width={24} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}B`, "Loan amount"]} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {loanAmountByState.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ3" title="Loan Records by Construction Method">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={constructionData} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}M`, "Records"]} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {constructionData.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          {/* Filter card */}
          <div className="rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#666]">Filter</p>
            <p className="mb-2 text-xs font-semibold text-[#333]">activity_year</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button className="rounded border border-[#e5e7eb] px-1 py-1 text-[10px] text-[#666]">(Blank)</button>
              {FULL_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`rounded px-1 py-1 text-[10px] font-medium transition ${
                    y === year ? "bg-[#1a237e] text-white" : "border border-[#e5e7eb] text-[#666] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#999]">Selected: {year}</p>
          </div>
        </div>

        {/* Middle row: 4 columns */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <PbCard bq="BQ1" title="Median Property Value Trend">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" dataKey="year" domain={[2016, 2026]} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis type="number" dataKey="value" domain={[300000, 500000]} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v), "Median"]} labelFormatter={(l) => `Year ${l}`} />
                  <Scatter data={trendPoint} fill="#1a237e" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ2" title="Loan Volume by State">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeByState} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtNum(v * 1000), "Volume"]} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {volumeByState.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ3" title="Site-Built Premium Widening or Narrowing?">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" dataKey="year" domain={[2016, 2026]} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis type="number" dataKey="ratio" domain={[3, 5]} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}x`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}x`, "Ratio"]} labelFormatter={(l) => `Year ${l}`} />
                  <Scatter data={premiumPoint} fill="#5c6bc0" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ4" title="Loan Denials by Year">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" dataKey="year" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis type="number" dataKey="denials" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}M`, "Denials"]} labelFormatter={(l) => `Year ${l}`} />
                  <Scatter data={denialsByYear} fill="#3949ab" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </PbCard>
        </div>

        {/* BQ4 denials by state row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <PbCard bq="BQ4" title="Loan Denials by State">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={denialsByState} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}B`} />
                  <YAxis type="category" dataKey="name" width={24} tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}B`, "Denials"]} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {denialsByState.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>

          <PbCard bq="BQ2" title="Median Value by State (ranking)">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={medianByState} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v), "Median"]} />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {medianByState.map((_, i) => (
                      <Cell key={i} fill={colorFor(i)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PbCard>
        </div>

        {/* BQ5 full width */}
        <PbCard bq="BQ5" title="Loan Volume by State">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeFull} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                <XAxis type="number" domain={[0, 350]} tick={{ fontSize: 10, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}K`} />
                <YAxis type="category" dataKey="name" width={28} tick={{ fontSize: 10, fill: "#666" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtNum(v * 1000), "Volume"]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {volumeFull.map((_, i) => (
                    <Cell key={i} fill={colorFor(i)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PbCard>
      </main>
    </div>
  );
}