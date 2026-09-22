// Aggregates HMDA LAR rows into the dashboard's metric structures.
// Column names follow the FFIEC public LAR schema (activity_year, action_taken,
// loan_amount, loan_purpose, loan_type, derived_race, interest_rate, lei, ...).

const ACTION_MAP = {
  "1": "Originated",
  "2": "Approved not accepted",
  "3": "Denied",
  "4": "Withdrawn",
  "5": "Closed incomplete",
  "6": "Purchased",
  "7": "Denied",
  "8": "Approved not accepted",
};

const PURPOSE_MAP = {
  "1": "Purchase",
  "2": "Home Improvement",
  "3": "Refinance",
  "4": "Cash-out Refi",
  "5": "Other",
  "32": "Other",
};

const TYPE_MAP = {
  "1": "Conventional",
  "2": "FHA",
  "3": "VA",
  "4": "RHS/FSA",
  "5": "Other",
};

const RACE_GROUPS = [
  "White",
  "Black",
  "Asian",
  "Am. Indian/AK Native",
  "Native HI/Pacific",
  "2+ Races / Other",
];

const RACE_MAP = {
  White: "White",
  "Black or African American": "Black",
  Asian: "Asian",
  "American Indian or Alaska Native": "Am. Indian/AK Native",
  "Native Hawaiian or Other Pacific Islander": "Native HI/Pacific",
  "2 or more minority races": "2+ Races / Other",
  Joint: "2+ Races / Other",
  "Free Form Text Only": "2+ Races / Other",
  "Race Not Available": "2+ Races / Other",
};

function mapRace(v) {
  const key = (v || "").trim();
  return RACE_MAP[key] || "2+ Races / Other";
}

function num(v) {
  if (v == null) return NaN;
  const s = String(v).trim();
  if (s === "" || s === "NA" || s === "Exempt" || s === "NaN") return NaN;
  const n = Number(s);
  return Number.isNaN(n) ? NaN : n;
}

export function buildIndex(header) {
  const idx = {};
  header.forEach((h, i) => {
    idx[h] = i;
  });
  return idx;
}

export function createAggregator() {
  return {
    count: 0,
    originations: 0,
    loanAmountSum: 0,
    loanAmountCount: 0,
    interestSum: 0,
    interestCount: 0,
    actionCounts: {},
    purposeCounts: {},
    typeCounts: {},
    raceCounts: {},
    raceDenied: {},
    lenders: {},
  };
}

export function aggregateRow(agg, row, idx) {
  agg.count++;

  const action = row[idx.action_taken] ?? "";
  const actionLabel = ACTION_MAP[action] || "Other";
  agg.actionCounts[actionLabel] = (agg.actionCounts[actionLabel] || 0) + 1;

  const purpose = row[idx.loan_purpose] ?? "";
  const purposeLabel = PURPOSE_MAP[purpose] || "Other";
  agg.purposeCounts[purposeLabel] = (agg.purposeCounts[purposeLabel] || 0) + 1;

  const type = row[idx.loan_type] ?? "";
  const typeLabel = TYPE_MAP[type] || "Other";
  agg.typeCounts[typeLabel] = (agg.typeCounts[typeLabel] || 0) + 1;

  const raceGroup = mapRace(row[idx.derived_race]);
  agg.raceCounts[raceGroup] = (agg.raceCounts[raceGroup] || 0) + 1;
  if (action === "3") {
    agg.raceDenied[raceGroup] = (agg.raceDenied[raceGroup] || 0) + 1;
  }

  const la = num(row[idx.loan_amount]);
  if (!Number.isNaN(la)) {
    agg.loanAmountSum += la;
    agg.loanAmountCount++;
  }

  const ir = num(row[idx.interest_rate]);
  if (!Number.isNaN(ir)) {
    agg.interestSum += ir;
    agg.interestCount++;
  }

  if (action === "1") agg.originations++;

  const lei = row[idx.lei];
  if (lei) agg.lenders[lei] = (agg.lenders[lei] || 0) + 1;
}

export function finalize(agg, year, fileName) {
  const total = agg.count || 1;
  const originations = agg.originations;
  const denied = agg.actionCounts["Denied"] || 0;
  const withdrawn = agg.actionCounts["Withdrawn"] || 0;
  const approvedNotAccepted = agg.actionCounts["Approved not accepted"] || 0;
  const closedIncomplete = agg.actionCounts["Closed incomplete"] || 0;

  const loanAmount = agg.loanAmountSum;
  const avgLoan = agg.loanAmountCount ? agg.loanAmountSum / agg.loanAmountCount : 0;
  const medianRate = agg.interestCount ? agg.interestSum / agg.interestCount : 0;
  const approvalRate = (originations / total) * 100;
  const denialRate = (denied / total) * 100;

  const purposeKeys = ["Purchase", "Home Improvement", "Refinance", "Cash-out Refi", "Other"];
  const loanPurpose = { year };
  purposeKeys.forEach((k) => {
    loanPurpose[k] = ((agg.purposeCounts[k] || 0) / total) * 100;
  });

  const actionTaken = {
    year,
    Originated: originations / 1e6,
    "Approved not accepted": approvedNotAccepted / 1e6,
    Denied: denied / 1e6,
    Withdrawn: withdrawn / 1e6,
    "Closed incomplete": closedIncomplete / 1e6,
  };

  const raceTotal = RACE_GROUPS.reduce((s, g) => s + (agg.raceCounts[g] || 0), 0) || 1;
  const raceEthnicity = RACE_GROUPS.map((g) => ({
    group: g,
    originations: agg.raceCounts[g] || 0,
    share: ((agg.raceCounts[g] || 0) / raceTotal) * 100,
  }));

  const denialByRace = RACE_GROUPS.map((g) => ({
    group: g,
    rate: agg.raceCounts[g] ? ((agg.raceDenied[g] || 0) / agg.raceCounts[g]) * 100 : 0,
  }));

  const typeKeys = ["Conventional", "FHA", "VA", "RHS/FSA", "Other"];
  const loanTypeMix = typeKeys.map((t) => ({
    type: t,
    share: ((agg.typeCounts[t] || 0) / total) * 100,
  }));

  const topLenders = Object.entries(agg.lenders)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([lei, count]) => ({
      lender: lei.length > 12 ? lei.slice(0, 10) + "…" : lei,
      originations: count,
      share: (count / total) * 100,
    }));

  return {
    year,
    fileName,
    uploadedAt: new Date().toISOString(),
    recordCount: agg.count,
    annual: {
      year,
      applications: agg.count,
      originations,
      loanAmount,
      avgLoan,
      approvalRate,
      denialRate,
      medianRate,
    },
    loanPurpose,
    actionTaken,
    raceEthnicity,
    denialByRace,
    loanTypeMix,
    topLenders,
  };
}