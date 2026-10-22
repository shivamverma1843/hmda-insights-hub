import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Map, GitCompare, CreditCard, LineChart, ArrowRight, LayoutGrid } from "lucide-react";

const REPORTS = [
  {
    to: "/reports/q1",
    question: "Business Question 1",
    title: "Market Size & Value Trend",
    desc: "Site-built single-family purchase originations and median property value, 2017–2025, with year-over-year change.",
    icon: TrendingUp,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    to: "/reports/q2",
    question: "Business Question 2",
    title: "Geography of Value Growth",
    desc: "State & metro median values, fastest-growing markets, choropleth map, and volume-vs-growth scatter.",
    icon: Map,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    to: "/reports/q3",
    question: "Business Question 3",
    title: "Site-Built Premium",
    desc: "Site-built vs. manufactured home median value, and whether the value gap is widening or narrowing.",
    icon: GitCompare,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    to: "/reports/q4",
    question: "Business Question 4",
    title: "Credit Access as a Growth Signal",
    desc: "Denial-rate trends overlaid on value growth for the fastest-growing markets.",
    icon: CreditCard,
    accent: "bg-rose-50 text-rose-600",
  },
  {
    to: "/reports/q5",
    question: "Business Question 5",
    title: "Forecasting Where Growth Continues",
    desc: "Linear-regression forecast of median values for 2026–2028 at national, state, and MSA level, with market rankings.",
    icon: LineChart,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    to: "/powerbi",
    question: "Power BI Comparison",
    title: "Power BI Layout Mirror",
    desc: "Side-by-side comparison view replicating your Power BI report grid, navy-to-mauve palette, and year-filter cards.",
    icon: LayoutGrid,
    accent: "bg-indigo-50 text-indigo-600",
  },
];

export default function Reports() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground sm:text-xl">Reports</h1>
            <p className="text-xs text-muted-foreground">HMDA market analysis · 2017–2025</p>
          </div>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REPORTS.map((r, i) => (
            <motion.div
              key={r.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                to={r.to}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.accent}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <span className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.question}</span>
                <h2 className="mt-1 font-display text-base font-semibold text-foreground">{r.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open report
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}