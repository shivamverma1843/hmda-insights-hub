import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UnifiedDashboard from "@/components/dashboard/UnifiedDashboard";

export default function UnifiedDashboardPage() {
  const [year, setYear] = useState(2025);
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Link
              to="/interactive"
              className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-[#333] transition hover:bg-black/5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <h1 className="font-sans text-sm font-bold text-[#333]">Unified Dashboard</h1>
          </div>
          <span className="rounded-md bg-[#2C3E50] px-2 py-0.5 text-xs font-semibold text-white">{year}</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-4 p-3 sm:p-4">
        <UnifiedDashboard year={year} />
      </main>
    </div>
  );
}