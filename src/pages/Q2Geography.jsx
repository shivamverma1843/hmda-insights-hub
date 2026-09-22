import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import ReportLayout from "@/components/dashboard/ReportLayout";
import ReportFilters from "@/components/dashboard/ReportFilters";
import ChartCard from "@/components/dashboard/ChartCard";
import StateChoropleth from "@/components/dashboard/StateChoropleth";
import { STATES, MSAS, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export default function Q2Geography() {
  const [yearRange, setYearRange] = useState([2017, 2025]);
  const [state, setState] = useState(STATES[0].code);

  const valueByState = useMemo(() => {
    const map = {};
    STATES.forEach((s) => {
      map[s.name] = s.values[yearRange[1]];
    });
    return map;
  }, [yearRange]);

  const topMSAs = useMemo(() => {
    return [...MSAS].sort((a, b) => b.cagr - a.cagr).slice(0, 15);
  }, []);

  const scatterData = useMemo(() => {
    return MSAS.map((m) => ({
      x: m.values[FULL_YEARS[FULL_YEARS.length - 1]],
      y: m.cagr,
      name: m.name,
    }));
  }, []);

  const selectedState = STATES.find((s) => s.code === state);
  const fastest = STATES[0];
  const slowest = STATES[STATES.length - 1];

  return (
    <ReportLayout
      question="Business Question 2"
      title="Geography of Value Growth"
      subtitle="State and metro median property values, growth leaders, and the gap between fastest and slowest markets."
    >
      <ReportFilters years={FULL_YEARS} yearRange={yearRange} setYearRange={setYearRange} states={STATES} state={state} setState={setState} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Fastest-growing state" value={`${fastest.name}`} sub={`CAGR ${fastest.cagr}% · ${fmtUSD(fastest.values[2025])}`} />
        <KpiTile label="Slowest-growing state" value={`${slowest.name}`} sub={`CAGR ${slowest.cagr}% · ${fmtUSD(slowest.values[2025])}`} />
        <KpiTile label="Growth gap (CAGR)" value={`${(fastest.cagr - slowest.cagr).toFixed(1)} pts`} sub={`${fmtUSD(fastest.values[2025])} vs ${fmtUSD(slowest.values[2025])}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Choropleth: Median Property Value" subtitle={`State median value in ${yearRange[1]}`}>
          <StateChoropleth valueByState={valueByState} metricLabel="Median value" format={fmtUSD} />
        </ChartCard>

        <ChartCard title="Top 15 MSAs by CAGR" subtitle="Compound annual growth rate, 2017–2025">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMSAs} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "CAGR"]} />
                <Bar dataKey="cagr" name="CAGR" radius={[0, 6, 6, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Volume vs. Growth Rate" subtitle="Latest median value vs. CAGR across MSAs">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 24, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="x" name="Median value" tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="number" dataKey="y" name="CAGR" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <ZAxis range={[120, 120]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={tooltipStyle}
                formatter={(v, n) => [n === "x" ? fmtUSD(v) : `${v}%`, n === "x" ? "Median value" : "CAGR"]}
                labelFormatter={() => ""}
              />
              <Scatter data={scatterData} fill="#10b981">
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={entry.y > 12 ? "#10b981" : "#94a3b8"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {selectedState && (
        <ChartCard title={`${selectedState.name} · median value trend`} subtitle={`CAGR ${selectedState.cagr}% (2017–2025)`}>
          <div className="flex flex-wrap gap-3">
            {FULL_YEARS.map((y) => (
              <div key={y} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-xs text-muted-foreground">{y}</p>
                <p className="font-display text-sm font-semibold">{fmtUSD(selectedState.values[y])}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </ReportLayout>
  );
}

function KpiTile({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-base font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}