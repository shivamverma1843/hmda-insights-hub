import React, { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import StateChoropleth from "@/components/dashboard/StateChoropleth";

export default function ChoroplethCard({ valueByState, year }) {
  const [fullscreen, setFullscreen] = useState(false);

  const map = <StateChoropleth valueByState={valueByState} metricLabel="Median value" format={(n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`)} />;

  const header = (
    <div className="flex items-center gap-1.5">
      <span className="rounded bg-[#283593] px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">Q2</span>
      <p className="truncate text-[11px] font-semibold text-[#333]">Choropleth: Median Property Value</p>
      <button
        onClick={() => setFullscreen((v) => !v)}
        className="ml-auto flex items-center gap-1 rounded bg-[#f3f4f6] px-1.5 py-0.5 text-[9px] font-medium text-[#555] hover:bg-[#e5e7eb]"
      >
        {fullscreen ? <Minimize2 className="h-2.5 w-2.5" /> : <Maximize2 className="h-2.5 w-2.5" />}
        {fullscreen ? "Exit" : "Fullscreen"}
      </button>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex items-center gap-1.5 border-b border-[#e5e7eb] px-3 py-2">
          {header}
        </div>
        <p className="px-3 py-1 truncate text-[10px] text-[#999]">State median value · {year}</p>
        <div className="flex-1 overflow-auto p-2">{map}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-visible rounded-md border border-[#e5e7eb] bg-white shadow-sm lg:col-span-4">
      <div className="border-b border-[#f0f0f0] px-2.5 py-1.5">{header}</div>
      <p className="px-2.5 py-0.5 truncate text-[9px] text-[#999]">State median value · {year}</p>
      <div className="p-1.5">{map}</div>
    </div>
  );
}