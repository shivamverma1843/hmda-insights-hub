import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  LineChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import ChartCard from "./ChartCard";
import { fmtNum, fmtUSD } from "@/data/hmdaMarket";

export const CD_TOOLTIP = {
  borderRadius: 10,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export const CD_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#ec4899", "#eab308", "#a3a3a3", "#8b5cf6", "#10b981"];

// 1. YoY % Change in Median Value
export function YoYChangeChart({ data }) {
  const rows = data.slice(1).map((d, i) => ({
    year: d.year,
    change: +(((d.medianProperty - data[i].medianProperty) / data[i].medianProperty) * 100).toFixed(2),
  }));
  return (
    <ChartCard title="YoY % Change in Median Value" subtitle="Annual change in national median property value">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="yoyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [`${v}%`, "YoY change"]} labelFormatter={(l) => `${l}`} />
            <Bar dataKey="change" name="YoY change" radius={[5, 5, 0, 0]} fill="url(#yoyGrad)">
              <LabelList dataKey="change" position="top" formatter={(v) => `${v}%`} style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 2. Top 15 MSAs by CAGR
export function TopMSAsCAGRChart({ msas }) {
  const rows = [...msas].sort((a, b) => b.cagr - a.cagr).slice(0, 15).map((m) => ({ name: m.name, cagr: m.cagr }));
  return (
    <ChartCard title="Top 15 MSAs by CAGR" subtitle="Compound annual growth rate, 2018–2025">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 6, right: 16, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="msaGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d4c4b0" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="name" width={140} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [`${v}%`, "CAGR"]} />
            <Bar dataKey="cagr" name="CAGR" radius={[0, 5, 5, 0]} fill="url(#msaGrad)">
              <LabelList dataKey="cagr" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 3. Average Loan Amount by State
export function AvgLoanByStateChart({ states, year }) {
  const rows = [...states]
    .map((s) => ({ name: s.code, value: s.values[year] }))
    .sort((a, b) => b.value - a.value);
  return (
    <ChartCard title="Average Loan Amount by State" subtitle={`Median property value · ${year}`}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 6, right: 16, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="name" width={40} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [fmtUSD(v), "Median value"]} />
            <Bar dataKey="value" name="Median value" radius={[0, 5, 5, 0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 4. Site-Built vs Manufactured (multi-line)
export function SiteBuiltVsManufacturedLine({ siteBuilt, manufactured }) {
  const rows = siteBuilt.map((s, i) => ({
    year: s.year,
    "Site-Built": s.medianProperty,
    Manufactured: manufactured[i]?.medianProperty,
  }));
  return (
    <ChartCard title="Median Value: Site-Built vs Manufactured" subtitle="National median property value trend">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <Line type="monotone" dataKey="Site-Built" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Manufactured" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 5. Denial Rate vs Value Growth (grouped bar)
export function DenialVsGrowthChart({ states, year }) {
  const rows = [...states].slice(0, 12).map((s) => ({
    name: s.code,
    "Denial rate": s.denial[year],
    "Value growth": +(((s.values[year] - s.values[2018]) / s.values[2018]) * 100).toFixed(1),
  }));
  return (
    <ChartCard title="Denial Rate vs Value Growth" subtitle={`By state · ${year}`}>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [`${v}%`]} labelFormatter={(l) => l} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <Bar dataKey="Denial rate" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Value growth" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 6. Median Property Value Trend (line with dots)
export function MedianValueTrendChart({ data }) {
  return (
    <ChartCard title="Median Property Value Trend" subtitle="National site-built median value">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [fmtUSD(v), "Median value"]} labelFormatter={(l) => `Year ${l}`} />
            <Line type="monotone" dataKey="medianProperty" name="Median value" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 7. Volume vs Growth Rate (scatter)
export function VolumeVsGrowthScatter({ states, year }) {
  const rows = states.map((s) => ({
    name: s.code,
    volume: s.originations,
    growth: +(((s.values[year] - s.values[2018]) / s.values[2018]) * 100).toFixed(1),
  }));
  return (
    <ChartCard title="Volume vs Growth Rate" subtitle={`Originations vs value growth · ${year}`}>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="volume" name="Volume" tickFormatter={(v) => fmtNum(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="number" dataKey="growth" name="Growth" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <ZAxis range={[80, 80]} />
            <Tooltip contentStyle={CD_TOOLTIP} cursor={{ strokeDasharray: "3 3" }} formatter={(v, n) => [n === "growth" ? `${v}%` : fmtNum(v), n]} />
            <Scatter data={rows} fill="#6366f1" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 8. Manufactured Value (line)
export function ManufacturedValueChart({ data }) {
  return (
    <ChartCard title="Manufactured Value" subtitle="National manufactured home median value">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [fmtUSD(v), "Median value"]} labelFormatter={(l) => `Year ${l}`} />
            <Line type="monotone" dataKey="medianProperty" name="Manufactured" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 9. Value Growth — Top 5 Markets (line)
export function Top5MarketsGrowthChart({ msas }) {
  const top5 = [...msas].sort((a, b) => b.cagr - a.cagr).slice(0, 5);
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const rows = years.map((y) => {
    const r = { year: y };
    top5.forEach((m) => {
      r[m.name] = m.values[y];
    });
    return r;
  });
  return (
    <ChartCard title="Value Growth — Top 5 Markets" subtitle="Top 5 MSAs median value trend">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
            {top5.map((m, i) => (
              <Line key={m.name} type="monotone" dataKey={m.name} stroke={CD_COLORS[i % CD_COLORS.length]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 10. National Median Value — Actual & Forecast
export function NationalForecastLine({ actual, forecast }) {
  const rows = [
    ...actual.map((a) => ({ year: a.year, Actual: a.medianProperty, Forecast: null })),
    ...forecast.map((f) => ({ year: f.year, Actual: null, Forecast: f.value })),
  ];
  return (
    <ChartCard title="National Median Value — Actual & Forecast" subtitle="Historical 2018–2025, projected to 2028">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <Line type="monotone" dataKey="Actual" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="Forecast" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 11. MSA Forecast (selected MSA)
export function MSAForecastChart({ msa, forecast }) {
  const rows = [
    ...[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map((y) => ({ year: y, Actual: msa.values[y], Forecast: null })),
    ...forecast.map((f) => ({ year: f.year, Actual: null, Forecast: f.value })),
  ];
  return (
    <ChartCard title="MSA Forecast" subtitle={`${msa.name} — actual & projected`}>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => fmtUSD(v)} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <Line type="monotone" dataKey="Actual" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="Forecast" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 12. Fastest-Growing Markets (horizontal bar, gradient)
export function FastestGrowingMarketsChart({ states }) {
  const rows = [...states].sort((a, b) => b.cagr - a.cagr).slice(0, 10).map((s) => ({ name: s.code, cagr: s.cagr }));
  return (
    <ChartCard title="Fastest-Growing Markets" subtitle="Top 10 states by median value CAGR">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 6, right: 16, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fastGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="name" width={40} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [`${v}%`, "CAGR"]} />
            <Bar dataKey="cagr" name="CAGR" radius={[0, 5, 5, 0]} fill="url(#fastGrad)">
              <LabelList dataKey="cagr" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 13. Originations by Year (column)
export function OriginationsByYearChart({ data }) {
  return (
    <ChartCard title="Originations by Year" subtitle="National purchase originations">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtNum(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [fmtNum(v), "Originations"]} labelFormatter={(l) => `Year ${l}`} />
            <Bar dataKey="originations" name="Originations" radius={[5, 5, 0, 0]} fill="#6366f1">
              <LabelList dataKey="originations" position="top" formatter={(v) => fmtNum(v)} style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// 14. Denial Rate Trend — Top 5 Growth Markets (multi-line)
export function DenialTrendTop5Chart({ states }) {
  const top5 = [...states].sort((a, b) => b.cagr - a.cagr).slice(0, 5);
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const rows = years.map((y) => {
    const r = { year: y };
    top5.forEach((s) => {
      r[s.code] = s.denial[y];
    });
    return r;
  });
  return (
    <ChartCard title="Denial Rate Trend — Top 5 Growth Markets" subtitle="Denial rate (%) over time">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={CD_TOOLTIP} formatter={(v) => [`${v}%`]} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
            {top5.map((s, i) => (
              <Line key={s.code} type="monotone" dataKey={s.code} stroke={CD_COLORS[i % CD_COLORS.length]} strokeWidth={2} dot={{ r: 2 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}