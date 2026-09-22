import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Database,
} from "lucide-react";
import { streamCsv } from "@/lib/csvStream";
import { createAggregator, buildIndex, aggregateRow, finalize } from "@/lib/hmdaAggregate";
import { getUploads, saveUpload, clearUploadYear } from "@/lib/hmdaStore";
import { YEARS } from "@/data/hmdaData";

export default function Upload() {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [uploads, setUploads] = useState(getUploads());

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setDone(false);
    setStatus("Detecting format…");
    setProgress(0);
    const agg = createAggregator();
    let idx = null;
    try {
      await streamCsv(file, {
        onRow: (header, row, i) => {
          if (!idx) idx = buildIndex(header);
          aggregateRow(agg, row, idx);
          if (i % 100000 === 0) setStatus(`Processed ${i.toLocaleString()} rows…`);
        },
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      const result = finalize(agg, year, file.name);
      saveUpload(result);
      setUploads(getUploads());
      setDone(true);
      setStatus(`Done — ${result.recordCount.toLocaleString()} rows aggregated for ${year}.`);
    } catch (e) {
      setStatus(`Error: ${e.message || e}`);
    } finally {
      setProcessing(false);
    }
  };

  const removeYear = (y) => {
    setUploads(clearUploadYear(y));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UploadIcon className="h-4 w-4" />
            </div>
            <h1 className="font-display text-base font-semibold">Upload HMDA Dataset</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Load a real FFIEC LAR file</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Download the Loan/Application Records (LAR) CSV from{" "}
                <a
                  href="https://ffiec.cfpb.gov/data-publication/snapshot-national-loan-level-dataset/2025"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 underline"
                >
                  ffiec.cfpb.gov
                </a>
                , unzip it, then select the year and upload the CSV below. The file is parsed
                locally in your browser — nothing is uploaded to a server.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Filing year
              </label>
              <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      y === year ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                LAR CSV file
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="truncate">{file ? file.name : "Choose .csv file…"}</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setDone(false);
                    setStatus("");
                  }}
                />
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleProcess}
              disabled={!file || processing}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
              {processing ? "Processing…" : "Parse & aggregate"}
            </button>
            {done && (
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                View on dashboard
              </button>
            )}
          </div>

          {(processing || progress > 0) && (
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{status || "Reading…"}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {done && !processing && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{status}</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-base font-semibold">Loaded datasets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Years with real uploaded data override the sample figures on the dashboard.
          </p>
          {uploads.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No datasets loaded yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {uploads.map((u) => (
                <li key={u.year} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.year}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.fileName} · {u.recordCount?.toLocaleString()} rows
                    </p>
                  </div>
                  <button
                    onClick={() => removeYear(u.year)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}