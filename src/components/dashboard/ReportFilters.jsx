import React from "react";

export default function ReportFilters({ years, yearRange, setYearRange, states, state, setState, stateLabel = "State" }) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">From</label>
        <select
          value={yearRange[0]}
          onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">To</label>
        <select
          value={yearRange[1]}
          onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {states && (
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{stateLabel}</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="max-w-[200px] rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
          >
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}