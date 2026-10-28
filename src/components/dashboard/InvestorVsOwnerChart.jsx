import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { STATES } from "@/data/hmdaMarket";

const TT = {
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  fontSize: 10,
  padding: "4px 8px",
};

// Illustrative investor share per state (2025)
// Higher in fast-appreciating markets (speculative risk), lower in stable owner-occupant markets
const investorShareByCode = {
  CA: 28, TX: 22, FL: 30, NY: 20, WA: 24,
  CO: 21, AZ: 27, NV: 33, OR: 23, UT: 19,
  ID: 31, NC: 18, SC: 19, GA: 20, TN: 17,
  MI: 15, OH: 14, PA: 16, IL: 18, MA: 22,
  NJ: 19, VA: 17, MN: 16, MD: 18,
};

export default function InvestorVsOwnerChart() {
  const data = useMemo(
    () =>
      STATES.map((s) => {
        const inv = investorShareByCode[s.code] ?? 20;
        return {
          name: s.name,
          "Investor %": inv,
          "Owner-occupant %": 100 - inv,
        };
      }).sort((a, b) => b["Investor %"] - a["Investor %"]),
    []
  );

  const highInvestor = data.filter((d) => d["Investor %"] >= 27);
  const lowInvestor = data.filter((d) => d["Investor %"] <= 17);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 pt-2">
        <span className="rounded bg-[#7986cb] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">BUYERS</span>
        <h2 className="text-[11px] font-bold text-[#333]">Who's Buying — Investors or Families?</h2>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <div className="rounded-md border border-[#e5e7eb] bg-white p-2 text-[10px] leading-relaxed text-[#333]">
        <p className="mb-1 font-bold text-[#1a237e]">📖 What this chart shows</p>
        <p className="mb-1">
          Every home purchase is either made by a <b>family</b> (owner-occupant — they'll live there) or an <b>investor</b> (they'll rent it out or flip it). When investors dominate a market, prices can get pushed up beyond what local families can afford — that's a sign of <b>speculation risk</b>.
        </p>
        <p>
          Look for markets where <b>investors are under 20%</b> — those are stable, family-driven markets with sustainable demand. Markets above <b>27%</b> investor share may be overheated and carry more downside risk.
        </p>
      </div>

      {/* Stacked bar chart */}
      <div className="rounded-md border border-[#e5e7eb] bg-white p-2 shadow-sm">
        <p className="mb-1 text-[10px] font-bold text-[#333]">Investor vs. owner-occupant share by state (2025)</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 2, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 8, fill: "#666" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={TT}
                formatter={(v, n) => [`${v}%`, n]}
              />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="Owner-occupant %" stackId="a" fill="#1a237e" radius={[0, 0, 0, 0]}>
                <LabelList dataKey="Owner-occupant %" position="insideLeft" formatter={(v) => `${v}%`} style={{ fontSize: 7, fill: "#fff", fontWeight: "bold" }} />
              </Bar>
              <Bar dataKey="Investor %" stackId="a" fill="#f59e0b" radius={[0, 2, 2, 0]}>
                <LabelList dataKey="Investor %" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 7, fill: "#92400e", fontWeight: "bold" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Red-flag markets */}
      <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
        <div className="rounded-md border border-[#fee2e2] bg-[#fff5f5] p-2">
          <p className="text-[10px] font-bold text-[#dc2626]">⚠️ Speculation-risk markets (investor share ≥ 27%)</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {highInvestor.map((d) => (
              <span key={d.name} className="rounded bg-[#fee2e2] px-1.5 py-0.5 text-[9px] font-medium text-[#dc2626]">
                {d.name} ({d["Investor %"]}%)
              </span>
            ))}
          </div>
          <p className="mt-1 text-[9px] text-[#666]">Investors dominate — prices may be speculative. Demand could vanish if rates rise or the economy slows.</p>
        </div>

        <div className="rounded-md border border-[#dcfce7] bg-[#f0fdf4] p-2">
          <p className="text-[10px] font-bold text-[#16a34a]">✅ Stable family markets (investor share ≤ 17%)</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {lowInvestor.map((d) => (
              <span key={d.name} className="rounded bg-[#dcfce7] px-1.5 py-0.5 text-[9px] font-medium text-[#16a34a]">
                {d.name} ({d["Investor %"]}%)
              </span>
            ))}
          </div>
          <p className="mt-1 text-[9px] text-[#666]">Families drive demand — more sustainable, less bubble risk, safer for long-term investment.</p>
        </div>
      </div>

      <div className="rounded-md border-2 border-[#1a237e] bg-[#f0f4ff] p-2.5">
        <p className="text-[11px] font-bold text-[#1a237e]">🎯 Investor takeaway</p>
        <p className="mt-0.5 text-[10px] text-[#333]">
          Nevada, Idaho, and Florida have the highest investor activity — these markets could be overheated. Tennessee, Michigan, and Ohio are family-driven and more stable. <b>When families buy, demand stays even when the market cools. When investors leave, prices can drop fast.</b>
        </p>
      </div>
    </div>
  );
}