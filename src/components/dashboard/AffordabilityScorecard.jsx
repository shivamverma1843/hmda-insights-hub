import React, { useMemo } from "react";
import { STATES, FULL_YEARS, fmtUSD } from "@/data/hmdaMarket";

// Affordability tier based on price-to-income ratio
function tier(ratio) {
  if (ratio < 3) return { label: "Affordable", color: "#16a34a", bg: "#dcfce7" };
  if (ratio < 4) return { label: "Moderate", color: "#ca8a04", bg: "#fef9c3" };
  if (ratio < 5) return { label: "Stretched", color: "#ea580c", bg: "#ffedd5" };
  return { label: "Unaffordable", color: "#dc2626", bg: "#fee2e2" };
}

export default function AffordabilityScorecard() {
  // Approximate median household income per state (2025, illustrative)
  const incomeByCode = {
    CA: 91000, TX: 73000, FL: 67000, NY: 81000, WA: 84000,
    CO: 87000, AZ: 72000, NV: 71000, OR: 76000, UT: 86000,
    ID: 70000, NC: 66000, SC: 63000, GA: 67000, TN: 65000,
    MI: 63000, OH: 62000, PA: 68000, IL: 72000, MA: 96000,
    NJ: 97000, VA: 80000, MN: 78000, MD: 90000,
  };

  const rows = useMemo(
    () =>
      STATES.map((s) => {
        const price = s.values[2025];
        const income = incomeByCode[s.code] ?? 70000;
        const ratio = +(price / income).toFixed(2);
        const mortgage = Math.round((price * 0.8 * 0.0642 / 12));
        const burden = +((mortgage / (income / 12)) * 100).toFixed(0);
        return { ...s, price, income, ratio, mortgage, burden, tier: tier(ratio) };
      }),
    []
  );

  const sorted = useMemo(() => [...rows].sort((a, b) => a.ratio - b.ratio), [rows]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 pt-2">
        <span className="rounded bg-[#1a237e] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">SCORECARD</span>
        <h2 className="text-[11px] font-bold text-[#333]">Affordability Scorecard — by state (2025)</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <div className="rounded-md border border-[#e5e7eb] bg-white p-2 text-[10px] leading-relaxed text-[#333]">
        <p className="mb-1 font-bold text-[#1a237e]">📖 How to read this table</p>
        <p>
          The <b>price-to-income ratio</b> compares the median home price to the median household income. A ratio below <b>3</b> means homes are affordable; above <b>5</b> means homes are out of reach for most local buyers. The <b>cost burden</b> shows what share of monthly income a typical mortgage payment eats up — anything over 30% is considered financially stretched.
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#e5e7eb] bg-white shadow-sm">
        <table className="w-full text-[10px]">
          <thead className="bg-[#f8f8f8] text-[#666]">
            <tr className="text-left">
              <th className="px-2 py-1.5 font-semibold">State</th>
              <th className="px-2 py-1.5 font-semibold">Median Price</th>
              <th className="px-2 py-1.5 font-semibold">Median Income</th>
              <th className="px-2 py-1.5 font-semibold">Price/Income</th>
              <th className="px-2 py-1.5 font-semibold">Mortgage/mo</th>
              <th className="px-2 py-1.5 font-semibold">% Burden</th>
              <th className="px-2 py-1.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.code} className="border-t border-[#f0f0f0]">
                <td className="px-2 py-1.5 font-medium text-[#333]">{s.name}</td>
                <td className="px-2 py-1.5 text-[#333]">{fmtUSD(s.price)}</td>
                <td className="px-2 py-1.5 text-[#666]">{fmtUSD(s.income)}</td>
                <td className="px-2 py-1.5 font-bold" style={{ color: s.tier.color }}>{s.ratio}x</td>
                <td className="px-2 py-1.5 text-[#666]">{fmtUSD(s.mortgage)}</td>
                <td className="px-2 py-1.5" style={{ color: s.burden > 30 ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{s.burden}%</td>
                <td className="px-2 py-1.5">
                  <span className="rounded px-1 py-0.5 text-[9px] font-bold" style={{ background: s.tier.bg, color: s.tier.color }}>
                    {s.tier.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border-2 border-[#1a237e] bg-[#f0f4ff] p-2.5">
        <p className="text-[11px] font-bold text-[#1a237e]">🎯 Investor takeaway</p>
        <p className="mt-0.5 text-[10px] text-[#333]">
          Affordable markets (ratio &lt; 3) like Ohio, Michigan, and Pennsylvania offer safer entry points with lower monthly burden. Overpriced markets (ratio &gt; 5) like California and Hawaii carry more risk — buyers are stretched, so demand is fragile. Target the <b>"Moderate"</b> band for the best balance of growth potential and affordability.
        </p>
      </div>
    </div>
  );
}