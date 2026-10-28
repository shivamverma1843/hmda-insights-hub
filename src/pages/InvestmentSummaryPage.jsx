import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import InvestmentSummary from "@/components/dashboard/InvestmentSummary";
import DenialRateEvidence from "@/components/dashboard/DenialRateEvidence";

export default function InvestmentSummaryPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-[#1a237e] text-white">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1 text-[10px] text-white/70 hover:text-white">
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
            <h1 className="text-xs font-bold sm:text-sm">Investment Summary — Invest vs. Avoid</h1>
          </div>
          <Link to="/" className="flex items-center gap-1 text-[10px] text-white/70 hover:text-white">
            <LayoutDashboard className="h-3 w-3" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-3">
        <InvestmentSummary />
        <DenialRateEvidence />
      </main>
    </div>
  );
}