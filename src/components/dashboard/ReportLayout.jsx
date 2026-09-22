import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ReportLayout({ title, subtitle, question, children }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All reports
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
          </div>
          <div className="mt-3">
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {question}
            </span>
            <h1 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}