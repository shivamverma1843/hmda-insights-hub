import React from "react";

export default function InsightCallout({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
      <div className="flex items-start gap-2.5">
        {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
        <div>
          {title && <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>}
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{children}</p>
        </div>
      </div>
    </div>
  );
}