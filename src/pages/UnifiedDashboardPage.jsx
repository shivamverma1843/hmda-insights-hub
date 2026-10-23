import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UnifiedDashboard from "@/components/dashboard/UnifiedDashboard";

export default function UnifiedDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="mb-1 flex items-center gap-2 px-3 pt-2">
        <Link
          to="/interactive"
          className="inline-flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-white px-2 py-1 text-[10px] font-medium text-[#666] transition hover:bg-[#f5f5f5]"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
      </div>
      <UnifiedDashboard />
    </div>
  );
}