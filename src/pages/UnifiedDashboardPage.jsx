import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileBarChart, Upload as UploadIcon, Maximize2, Minimize2, Scale } from "lucide-react";
import UnifiedDashboard from "@/components/dashboard/UnifiedDashboard";

export default function UnifiedDashboardPage() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-3 pt-2">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-2 py-1 text-[10px] font-medium text-[#666] transition hover:bg-[#f5f5f5]"
        >
          <ArrowLeft className="h-3 w-3" />
          Reports
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-2 py-1 text-[10px] font-medium text-[#666] transition hover:bg-[#f5f5f5]"
          >
            <FileBarChart className="h-3 w-3" />
            Reports
          </Link>
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-2 py-1 text-[10px] font-medium text-[#666] transition hover:bg-[#f5f5f5]"
          >
            <UploadIcon className="h-3 w-3" />
            Upload
          </Link>
          <Link
            to="/investment-summary"
            className="inline-flex items-center gap-1.5 rounded border border-[#1a237e] bg-[#1a237e] px-2 py-1 text-[10px] font-medium text-white transition hover:bg-[#283593]"
          >
            <Scale className="h-3 w-3" />
            Invest vs. Avoid
          </Link>
          <button
            onClick={() => setFullscreen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-2 py-1 text-[10px] font-medium text-[#666] transition hover:bg-[#f5f5f5]"
          >
            {fullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            {fullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>
      {fullscreen ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-[#f5f5f5]">
          <UnifiedDashboard />
        </div>
      ) : (
        <UnifiedDashboard />
      )}
    </div>
  );
}