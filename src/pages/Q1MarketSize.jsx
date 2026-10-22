import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ReportLayout from "@/components/dashboard/ReportLayout";
import ReportFilters from "@/components/dashboard/ReportFilters";
import ChartCard from "@/components/dashboard/ChartCard";
import { nationalAnnual, FULL_YEARS, fmtNum, fmtUSD } from "@/data/hmdaMarket";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export default function Q1MarketSize() {
  const [yearRange, setYearRange] = useState([2018, 2025]);

  const data = useMemo(() => {
    return nationalAnnual
      .filter((d) => d.year >= yearRange[0] && d.year <= yearRange[1])
      .map((d) => ({ ...d, yoy: undefined }));
  }, [yearRange]);

  const yoyData = useMemo(() => {
    const rows = [];
    for (let i = 1; i < nationalAnnual.length; i++) {
      const prev = nationalAnnual[i - 1];
      const cur = nationalAnnual[i];
      if (cur.year < yearRange[0] || cur.year > yearRange[1]) continue;
      rows.push({ year: cur.year, yoy: +(((cur.medianProperty - prev.medianProperty) / prev.medianProperty) * 100).toFixed(1) });
    }
    return rows;
  }, [yearRange]);

  return (
    <ReportLayout
      question="Business Question 1"
      title="Market Size & Value Trend"
      subtitle="Site-built, owner-occupied, single-family home-purchase originations and median property value, 2018–2025."
    >
      <ReportFilters years={FULL_YEARS} yearRange={yearRange} setYearRange={setYearRange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Total originations (range)" value={fmtNum(data.reduce((s, d) => s + d.originations, 0))} />
        <KpiTile label="Median value (latest)" value={fmtUSD(data[data.length - 1]?.medianProperty ?? 0)} />
        <KpiTile label="Value growth (range)" value={`${(((data[data.length - 1]?.medianProperty ?? 0) - data[0]?.medianProperty) / (data[0]?.medianProperty || 1) * 100).toFixed(1)}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Originations by Year" subtitle="Home-purchase loans originated (millions)">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={(v) => `${fmtNum(v)}`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtNum(v), "Originations"]} labelFormatter={(l) => `Year ${l}`} />
                <Bar dataKey="originations" name="Originations" radius={[6, 6, 0, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Median Property Value Trend" subtitle="Median value of originated loans ($)">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v), "Median value"]} labelFormatter={(l) => `Year ${l}`} />
                <Line type="monotone" dataKey="medianProperty" name="Median value" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Year-over-Year % Change in Median Value" subtitle="Annual change in median property value (%)">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yoyData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "YoY change"]} labelFormatter={(l) => `Year ${l}`} />
              <Bar dataKey="yoy" name="YoY change" radius={[6, 6, 0, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </ReportLayout>
  );
}

function KpiTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold">{value}</p>
    </div>
  );
}