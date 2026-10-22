import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
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
import {
  STATES,
  MSAS,
  nationalAnnual,
  FULL_YEARS,
  FORECAST_YEARS,
  forecastValues,
  fmtUSD,
} from "@/data/hmdaMarket";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--popover))",
  fontSize: 12,
  padding: "8px 12px",
};

export default function Q5Forecast() {
  const [yearRange, setYearRange] = useState([2018, 2025]);
  const [state, setState] = useState(STATES[0].code);
  const [msa, setMsa] = useState(MSAS[0].name);

  // National forecast
  const nationalForecast = useMemo(() => {
    const valuesByYear = {};
    nationalAnnual.forEach((n) => (valuesByYear[n.year] = n.medianProperty));
    const fc = forecastValues(valuesByYear);
    const actual = FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => ({
      year: y,
      actual: valuesByYear[y],
    }));
    const projected = fc.map((f) => ({ year: f.year, forecast: f.value }));
    return [...actual, ...projected];
  }, [yearRange]);

  // State forecast
  const stateForecast = useMemo(() => {
    const s = STATES.find((x) => x.code === state) ?? STATES[0];
    const fc = forecastValues(s.values);
    const actual = FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => ({
      year: y,
      actual: s.values[y],
    }));
    const projected = fc.map((f) => ({ year: f.year, forecast: f.value }));
    return { state: s, rows: [...actual, ...projected] };
  }, [state, yearRange]);

  // MSA forecast
  const msaForecast = useMemo(() => {
    const m = MSAS.find((x) => x.name === msa) ?? MSAS[0];
    const fc = forecastValues(m.values);
    const actual = FULL_YEARS.filter((y) => y >= yearRange[0] && y <= yearRange[1]).map((y) => ({
      year: y,
      actual: m.values[y],
    }));
    const projected = fc.map((f) => ({ year: f.year, forecast: f.value }));
    return { msa: m, rows: [...actual, ...projected] };
  }, [msa, yearRange]);

  // Ranked markets by projected 3-year CAGR
  const ranked = useMemo(() => {
    const all = [
      ...STATES.map((s) => {
        const fc = forecastValues(s.values);
        const end = fc[fc.length - 1].value;
        return { name: s.name, type: "State", start: s.values[2025], end, cagr: +(((end / s.values[2025]) ** (1 / 3) - 1) * 100).toFixed(2) };
      }),
      ...MSAS.map((m) => {
        const fc = forecastValues(m.values);
        const end = fc[fc.length - 1].value;
        return { name: m.name, type: "MSA", start: m.values[2025], end, cagr: +(((end / m.values[2025]) ** (1 / 3) - 1) * 100).toFixed(2) };
      }),
    ];
    return all.sort((a, b) => b.cagr - a.cagr).slice(0, 12);
  }, []);

  return (
    <ReportLayout
      question="Business Question 5"
      title="Forecasting Where Growth Continues"
      subtitle="Linear-regression forecast of median site-built property values for 2026–2028 at national, state, and MSA level."
    >
      <ReportFilters
        years={FULL_YEARS}
        yearRange={yearRange}
        setYearRange={setYearRange}
        states={STATES}
        state={state}
        setState={setState}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiTile label="National 2028 forecast" value={fmtUSD(nationalForecast[nationalForecast.length - 1].forecast)} />
        <KpiTile label={`${stateForecast.state.name} 2028`} value={fmtUSD(stateForecast.rows[stateForecast.rows.length - 1].forecast)} />
        <KpiTile label="Top projected market" value={ranked[0].name} sub={`${ranked[0].cagr}% / yr (2025–28)`} />
      </div>

      <ChartCard title="National Median Value — Actual & Forecast"         subtitle="Historical 2018–2025, forecast 2026–2028 (linear regression)">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={nationalForecast} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [fmtUSD(v), n === "actual" ? "Actual" : "Forecast"]} labelFormatter={(l) => `Year ${l}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="actual" name="actual" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="forecast" name="forecast" stroke="#10b981" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={`State Forecast — ${stateForecast.state.name}`} subtitle="Actual & forecast median value">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stateForecast.rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [fmtUSD(v), n === "actual" ? "Actual" : "Forecast"]} labelFormatter={(l) => `Year ${l}`} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#10b981" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={`MSA Forecast — ${msaForecast.msa.name}`} subtitle="Actual & forecast median value">
          <div className="flex items-center gap-2 pb-3">
            <select
              value={msa}
              onChange={(e) => setMsa(e.target.value)}
              className="max-w-[220px] rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            >
              {MSAS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={msaForecast.rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={(v) => fmtUSD(v)} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [fmtUSD(v), n === "actual" ? "Actual" : "Forecast"]} labelFormatter={(l) => `Year ${l}`} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#10b981" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Fastest-Growing Markets — Projected (2025–2028)" subtitle="Top 12 markets ranked by forecast 3-year CAGR">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ranked} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "CAGR"]} />
              <Bar dataKey="cagr" name="Projected CAGR" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
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