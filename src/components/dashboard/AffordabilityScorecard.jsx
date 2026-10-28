import React, { useMemo } from "react";
import { STATES, fmtUSD } from "@/data/hmdaMarket";

// Approximate median household income per state (2025, illustrative)
const incomeByCode = {
  CA: 91000, TX: 73000, FL: 67000, NY: 81000, WA: 84000,
  CO: 87000, AZ: 72000, NV: 71000, OR: 76000, UT: 86000,
  ID: 70000, NC: 66000, SC: 63000, GA: 67000, TN: 65000,
  MI: 63000, OH: 62000, PA: 68000, IL: 72000, MA: 96000,
  NJ: 97000, VA: 80000, MN: 78000, MD: 90000,
};

function statusBadge(ratio) {
  if (ratio < 3) return { label: "✅ Easy to afford", color: "#16a34a", bg: "#dcfce7" };
  if (ratio < 4) return { label: "🟡 Okay", color: "#ca8a04", bg: "#fef9c3" };
  if (ratio < 5) return { label: "🟠 Stretched", color: "#ea580c", bg: "#ffedd5" };
  return { label: "🔴 Too expensive", color: "#dc2626", bg: "#fee2e2" };
}

export default function AffordabilityScorecard() {
  const rows = useMemo(
    () =>
      STATES.map((s) => {
        const price = s.values[2025];
        const income = incomeByCode[s.code] ?? 70000;
        const ratio = +(price / income).toFixed(2);
        const mortgage = Math.round((price * 0.8 * 0.0642 / 12));
        const burden = +((mortgage / (income / 12)) * 100).toFixed(0);
        return { ...s, price, income, ratio, mortgage, burden, status: statusBadge(ratio) };
      }),
    []
  );

  // Top 5 most affordable (lowest ratio)
  const top5 = useMemo(() => [...rows].sort((a, b) => a.ratio - b.ratio).slice(0, 5), [rows]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 pt-2">
        <span className="rounded bg-[#1a237e] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">SCORECARD</span>
        <h2 className="text-[11px] font-bold text-[#333]">Top 5 Most Affordable States (2025)</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <div className="rounded-md border border-[#e5e7eb] bg-white p-2 text-[10px] leading-relaxed text-[#333]">
        <p className="mb-1 font-bold text-[#1a237e]">📖 What this means</p>
        <p className="mb-1">
          We compare the <b>median home price</b> to the <b>median family income</b> in each state. If a home costs <b>2x</b> what a family earns in a year, it's easy to afford. If it costs <b>5x</b> or more, most families can't buy without being financially stretched.
        </p>
        <p>
          Below are the <b>5 most affordable states</b> — where homes are cheapest compared to local incomes. These are the safest markets for first-time buyers and investors.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-[#e5e7eb] bg-white shadow-sm">
        <table className="w-full text-[11px]">
          <thead className="bg-[#1a237e] text-white">
            <tr className="text-left">
              <th className="px-2 py-2 font-semibold">#</th>
              <th className="px-2 py-2 font-semibold">State</th>
              <th className="px-2 py-2 font-semibold">Home Price</th>
              <th className="px-2 py-2 font-semibold">Family Income</th>
              <th className="px-2 py-2 font-semibold">Price vs Income</th>
              <th className="px-2 py-2 font-semibold">Mortgage/mo</th>
              <th className="px-2 py-2 font-semibold">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((s, i) => (
              <tr key={s.code} className="border-t border-[#f0f0f0]">
                <td className="px-2 py-2 font-bold text-[#999]">{i + 1}</td>
                <td className="px-2 py-2 font-bold text-[#333]">{s.name}</td>
                <td className="px-2 py-2 text-[#333]">{fmtUSD(s.price)}</td>
                <td className="px-2 py-2 text-[#666]">{fmtUSD(s.income)}</td>
                <td className="px-2 py-2 font-bold" style={{ color: s.status.color }}>{s.ratio}x</td>
                <td className="px-2 py-2 text-[#666]">{fmtUSD(s.mortgage)}</td>
                <td className="px-2 py-2">
                  <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ background: s.status.bg, color: s.status.color }}>
                    {s.status.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border-2 border-[#1a237e] bg-[#f0f4ff] p-2.5">
        <p className="text-[11px] font-bold text-[#1a237e]">🎯 Bottom line</p>
        <p className="mt-0.5 text-[10px] text-[#333]">
          In the top affordable states, a family earning the median income can comfortably buy a home — the mortgage eats up less than 25% of their monthly pay. These markets are <b>low-risk</b> because buyers aren't stretched. If the economy slows, fewer people default, and prices hold steady.
        </p>
      </div>
    </div>
  );
}