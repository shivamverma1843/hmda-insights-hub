import {
  annualMetrics,
  loanPurposeTrend,
  actionTakenTrend,
  raceEthnicity,
  denialByRace,
  topLenders,
  loanTypeMix,
} from "@/data/hmdaData";

const KEY = "hmda_uploads";

export function getUploads() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUpload(upload) {
  const all = getUploads().filter((u) => u.year !== upload.year);
  all.push(upload);
  all.sort((a, b) => a.year - b.year);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function clearUploads() {
  localStorage.removeItem(KEY);
}

export function clearUploadYear(year) {
  const all = getUploads().filter((u) => u.year !== year);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

// Merge sample data with any uploaded real-data overrides.
export function buildMergedData() {
  const uploads = getUploads();
  const byYear = Object.fromEntries(uploads.map((u) => [u.year, u]));

  const years = Array.from(new Set([...annualMetrics.map((m) => m.year), ...uploads.map((u) => u.year)])).sort(
    (a, b) => a - b
  );

  const mergedAnnual = years.map((y) => {
    const u = byYear[y];
    if (u) return u.annual;
    return annualMetrics.find((m) => m.year === y);
  });

  const mergedPurpose = years.map((y) => {
    const u = byYear[y];
    if (u) return u.loanPurpose;
    return loanPurposeTrend.find((p) => p.year === y) || { year: y };
  });

  const mergedAction = years.map((y) => {
    const u = byYear[y];
    if (u) return u.actionTaken;
    return actionTakenTrend.find((p) => p.year === y) || { year: y };
  });

  const latest = uploads.length ? uploads[uploads.length - 1] : null;

  return {
    annualMetrics: mergedAnnual,
    loanPurposeTrend: mergedPurpose,
    actionTakenTrend: mergedAction,
    raceEthnicity: latest ? latest.raceEthnicity : raceEthnicity,
    denialByRace: latest ? latest.denialByRace : denialByRace,
    loanTypeMix: latest ? latest.loanTypeMix : loanTypeMix,
    topLenders: latest ? latest.topLenders : topLenders,
    uploads,
    uploadedYears: uploads.map((u) => u.year),
  };
}