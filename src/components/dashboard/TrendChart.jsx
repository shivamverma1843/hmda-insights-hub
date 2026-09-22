import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "./ChartCard";
import { annualMetrics, fmtNum, fmtUSD } from "@/data/hmdaData";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export default function TrendChart({ data }) {
  const rows = data ?? annualMetrics;
  return (
    <ChartCard
      title="Application & Origination Volume"
      subtitle="Annual HMDA-reported mortgage applications and originations"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gOrig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              tickFormatter={(v) => fmtNum(v)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v, name) => [fmtNum(v), name]}
              labelFormatter={(l) => `Year ${l}`}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Area type="monotone" dataKey="applications" name="Applications" stroke="#4f46e5" strokeWidth={2.5} fill="url(#gApps)" />
            <Area type="monotone" dataKey="originations" name="Originations" stroke="#10b981" strokeWidth={2.5} fill="url(#gOrig)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function RateTrendChart({ data }) {
  const rows = data ?? annualMetrics;
  return (
    <ChartCard title="Median Interest Rate" subtitle="30-year fixed mortgage median rate (%)">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              domain={[2, 8]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Median rate"]} labelFormatter={(l) => `Year ${l}`} />
            <Line type="monotone" dataKey="medianRate" name="Median rate" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function LoanAmountChart({ data }) {
  const rows = data ?? annualMetrics;
  return (
    <ChartCard
      title="Total Loan Amount Originated"
      subtitle="Aggregate dollar volume originated each year"
    >
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtUSD(v), "Loan amount"]} labelFormatter={(l) => `Year ${l}`} />
            <Area type="monotone" dataKey="loanAmount" name="Loan amount" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gAmt)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}