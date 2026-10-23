import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  LineChart,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import ChartCard from "./ChartCard";
import { fmtNum, fmtUSD } from "@/data/hmdaMarket";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export function NationalOriginationsChart({ data }) {
  return (
    <ChartCard title="National Purchase Originations" subtitle="Site-built, owner-occupied, single-family home-purchase loans">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtNum(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtNum(v), "Originations"]} labelFormatter={(l) => `Year ${l}`} />
            <Bar dataKey="originations" name="Originations" radius={[6, 6, 0, 0]} fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function NationalMedianValueChart({ data }) {
  return (
    <ChartCard title="Median Property Value (National)" subtitle="Site-built single-family purchase median">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v), "Median value"]} labelFormatter={(l) => `Year ${l}`} />
            <Line type="monotone" dataKey="medianProperty" name="Median value" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function SiteBuiltPremiumChart({ siteBuilt, manufactured }) {
  const rows = siteBuilt.map((s, i) => ({
    year: s.year,
    siteBuilt: s.medianProperty,
    manufactured: manufactured[i]?.medianProperty,
    ratio: +(((siteBuilt[i]?.medianProperty || 1) / (manufactured[i]?.medianProperty || 1))).toFixed(2),
  }));
  return (
    <ChartCard title="Site-Built vs Manufactured Value" subtitle="Median property value & premium ratio">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis yAxisId="left" tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar yAxisId="left" dataKey="siteBuilt" name="Site-built" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="manufactured" name="Manufactured" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="ratio" name="Premium ratio" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopStatesGrowthChart({ states }) {
  const rows = [...states].sort((a, b) => b.cagr - a.cagr).slice(0, 10).map((s) => ({ name: s.name, cagr: s.cagr }));
  return (
    <ChartCard title="Top States by Value Growth" subtitle="CAGR of median property value, 2018–2025">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "CAGR"]} />
            <Bar dataKey="cagr" name="CAGR" radius={[0, 6, 6, 0]} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function NationalForecastChart({ actual, forecast }) {
  const rows = [
    ...actual.map((a) => ({ year: a.year, actual: a.medianProperty, forecast: null })),
    ...forecast.map((f) => ({ year: f.year, actual: null, forecast: f.value })),
  ];
  return (
    <ChartCard title="Median Value: Actual vs Forecast" subtitle="Historical 2018–2025, projected 2026–2028 (linear regression)">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v)]} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <ReferenceLine x={2025} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
            <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopMSAsGrowthChart({ msas }) {
  const rows = [...msas].sort((a, b) => b.cagr - a.cagr).slice(0, 10).map((m) => ({ name: m.name, cagr: m.cagr }));
  return (
    <ChartCard title="Top MSAs by Value Growth" subtitle="CAGR of median property value, 2018–2025">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "CAGR"]} />
            <Bar dataKey="cagr" name="CAGR" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}