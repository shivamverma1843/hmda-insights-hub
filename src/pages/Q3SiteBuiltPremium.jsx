import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
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
import { nationalAnnual, manufacturedAnnual, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export default function Q3SiteBuiltPremium() {
  const [yearRange, setYearRange] = useState([2017, 2025]);

  const dualData = useMemo(() => {
    return FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => {
      const sb = nationalAnnual.find((n) => n.year === y);
      const mh = manufacturedAnnual.find((m) => m.year === y);
      return {
        year: y,
        siteBuilt: sb.medianProperty,
        manufactured: mh.medianProperty,
        ratio: +(sb.medianProperty / mh.medianProperty).toFixed(2),
      };
    });
  }, [yearRange]);

  const latest = dualData[dualData.length - 1];
  const first = dualData[0];
  const ratioChange = latest && first ? (latest.ratio - first.ratio).toFixed(2) : "0";
  const widening = latest.ratio >= first.ratio;

  return (
    <ReportLayout
      question="Business Question 3"
      title="Is the Site-Built Premium Widening or Narrowing?"
      subtitle="Median property value: site-built vs. manufactured homes, and the ratio between them over time."
    >
      <ReportFilters years={FULL_YEARS} yearRange={yearRange} setYearRange={setYearRange} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="Site-built (latest)" value={fmtUSD(latest.siteBuilt)} />
        <KpiTile label="Manufactured (latest)" value={fmtUSD(latest.manufactured)} />
        <KpiTile label="Premium ratio change" value={ratioChange} sub={widening ? "Gap widening" : "Gap narrowing"} accent={widening ? "rose" : "emerald"} />
      </div>

      <ChartCard title="Median Value: Site-Built vs. Manufactured" subtitle="Dual line chart of median property value by year">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dualData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [fmtUSD(v), n === "siteBuilt" ? "Site-built" : "Manufactured"]} labelFormatter={(l) => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} formatter={(v) => (v === "siteBuilt" ? "Site-built" : "Manufactured")} />
              <Line type="monotone" dataKey="siteBuilt" name="siteBuilt" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="manufactured" name="manufactured" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Site-Built / Manufactured Value Ratio" subtitle="Ratio of median values — rising means the premium is widening">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dualData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => `${v}x`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}x`, "Ratio"]} labelFormatter={(l) => `Year ${l}`} />
              <Line type="monotone" dataKey="ratio" name="Ratio" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </ReportLayout>
  );
}

function KpiTile({ label, value, sub, accent }) {
  const accentClass = accent === "rose" ? "text-rose-600" : accent === "emerald" ? "text-emerald-600" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-base font-semibold ${accentClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}