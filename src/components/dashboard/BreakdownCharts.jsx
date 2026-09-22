import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import ChartCard from "./ChartCard";
import {
  loanPurposeTrend,
  actionTakenTrend,
  raceEthnicity,
  denialByRace,
  topLenders,
  loanTypeMix,
  fmtNum,
} from "@/data/hmdaData";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

const PURPOSE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];
const ACTION_COLORS = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#a3a3a3"];
const TYPE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#8b5cf6", "#a3a3a3"];

export function LoanPurposeChart() {
  return (
    <ChartCard title="Loan Purpose Mix Over Time" subtitle="Share of applications by purpose (%)">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={loanPurposeTrend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {Object.keys(loanPurposeTrend[0])
              .filter((k) => k !== "year")
              .map((k, i) => (
                <Bar key={k} dataKey={k} stackId="a" fill={PURPOSE_COLORS[i % PURPOSE_COLORS.length]} />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function ActionTakenChart() {
  return (
    <ChartCard title="Application Disposition" subtitle="Action taken on applications (millions)">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={actionTakenTrend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => `${v}M`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}M`, n]} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {Object.keys(actionTakenTrend[0])
              .filter((k) => k !== "year")
              .map((k, i) => (
                <Bar key={k} dataKey={k} stackId="a" fill={ACTION_COLORS[i % ACTION_COLORS.length]} radius={[0, 0, 0, 0]} />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function RaceEthnicityChart() {
  return (
    <ChartCard title="Originations by Race / Ethnicity" subtitle="2025 originated loans by applicant group">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={raceEthnicity} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => fmtNum(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="group" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtNum(v), "Originations"]} />
            <Bar dataKey="originations" name="Originations" radius={[0, 6, 6, 0]} fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function DenialByRaceChart() {
  return (
    <ChartCard title="Denial Rate by Race / Ethnicity" subtitle="2025 denial rate (%)">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={denialByRace} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="group" tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Denial rate"]} />
            <Bar dataKey="rate" name="Denial rate" radius={[6, 6, 0, 0]} fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function TopLendersChart() {
  return (
    <ChartCard title="Top Lenders by Originations" subtitle="2025 originations volume">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topLenders} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => fmtNum(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="lender" width={130} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtNum(v), "Originations"]} />
            <Bar dataKey="originations" name="Originations" radius={[0, 6, 6, 0]} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function LoanTypePie() {
  return (
    <ChartCard title="Loan Type Mix" subtitle="2025 share by loan type">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={loanTypeMix} dataKey="share" nameKey="type" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {loanTypeMix.map((_, i) => (
                <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}