import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ReportLayout from "@/components/dashboard/ReportLayout";
import ReportFilters from "@/components/dashboard/ReportFilters";
import ChartCard from "@/components/dashboard/ChartCard";
import { STATES, nationalAnnual, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export default function Q4CreditAccess() {
  const [yearRange, setYearRange] = useState([2018, 2025]);
  const [state, setState] = useState(STATES[0].code);

  // Top 5 fastest-growing states
  const topGrowth = useMemo(() => STATES.slice(0, 5), []);

  const overlayData = useMemo(() => {
    const selected = STATES.find((s) => s.code === state) ?? STATES[0];
    return FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => ({
      year: y,
      denial: selected.denial[y],
      value: selected.values[y],
    }));
  }, [state, yearRange]);

  const topGrowthData = useMemo(() => {
    return FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => {
      const row = { year: y };
      topGrowth.forEach((s) => {
        row[`${s.code}_denial`] = s.denial[y];
      });
      return row;
    });
  }, [topGrowth, yearRange]);

  const valueGrowthData = useMemo(() => {
    return FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => {
      const row = { year: y };
      topGrowth.forEach((s) => {
        row[`${s.code}_value`] = s.values[y];
      });
      return row;
    });
  }, [topGrowth, yearRange]);

  const selectedState = STATES.find((s) => s.code === state);

  return (
    <ReportLayout
      question="Business Question 4"
      title="Credit Access as a Growth Signal"
      subtitle="Denial-rate trends overlaid on value growth for the fastest-growing markets."
    >
      <ReportFilters years={FULL_YEARS} yearRange={yearRange} setYearRange={setYearRange} states={STATES} state={state} setState={setState} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Selected state" value={selectedState.name} sub={`CAGR ${selectedState.cagr}%`} />
        <KpiTile label="Denial rate (2025)" value={`${selectedState.denial[2025]}%`} />
        <KpiTile label="Median value (2025)" value={fmtUSD(selectedState.values[2025])} />
      </div>

      <ChartCard
        title={`Denial Rate vs. Value Growth — ${selectedState.name}`}
        subtitle="Denial rate (%) overlaid on median property value ($)"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={overlayData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="left" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => (n === "denial" ? [`${v}%`, "Denial rate"] : [fmtUSD(v), "Median value"])} labelFormatter={(l) => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} formatter={(v) => (v === "denial" ? "Denial rate" : "Median value")} />
              <Bar yAxisId="right" dataKey="value" name="value" fill="#c7d2fe" radius={[6, 6, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="denial" name="denial" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Denial Rate Trend — Top 5 Growth Markets" subtitle="Denial rate (%) by year for the fastest-growing states">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={topGrowthData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} labelFormatter={(l) => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {topGrowth.map((s, i) => (
                <Line key={s.code} type="monotone" dataKey={`${s.code}_denial`} name={`${s.code} denial`} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Value Growth — Top 5 Markets" subtitle="Median property value ($) for the fastest-growing states">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={valueGrowthData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [fmtUSD(v), n]} labelFormatter={(l) => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {topGrowth.map((s, i) => (
                <Line key={s.code} type="monotone" dataKey={`${s.code}_value`} name={`${s.code} value`} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </ReportLayout>
  );
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function KpiTile({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-base font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}