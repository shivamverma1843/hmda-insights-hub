import React from "react";
import { TrendingUp, MapPin, ArrowDownRight } from "lucide-react";
import { STATES, MSAS, fmtUSD } from "@/data/hmdaMarket";

export default function InvestmentInsights() {
  const topState = STATES[0];
  const topMsa = MSAS[0];
  const leastState = [...STATES].sort((a, b) => a.cagr - b.cagr)[0];

  const cards = [
    {
      icon: TrendingUp,
      accent: "#1a237e",
      label: "Best State to Invest",
      value: topState.name,
      detail: `${topState.cagr}% CAGR · ${fmtUSD(topState.values[2025])} (2025)`,
    },
    {
      icon: MapPin,
      accent: "#283593",
      label: "Best City to Invest",
      value: topMsa.name.split("-")[0],
      detail: `${topMsa.cagr}% CAGR · ${fmtUSD(topMsa.values[2025])} (2025)`,
    },
    {
      icon: ArrowDownRight,
      accent: "#c62828",
      label: "Least Invested Market",
      value: leastState.name,
      detail: `${leastState.cagr}% CAGR · ${fmtUSD(leastState.values[2025])} (2025)`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-2.5 py-1.5 shadow-sm">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded" style={{ background: `${c.accent}15`, color: c.accent }}>
            <c.icon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9px] font-medium uppercase tracking-wide text-[#999]">{c.label}</p>
            <p className="truncate text-sm font-bold text-[#333]">{c.value}</p>
            <p className="truncate text-[9px] text-[#999]">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}