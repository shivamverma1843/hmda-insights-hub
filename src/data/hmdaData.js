// Representative HMDA (Home Mortgage Disclosure Act) US market data, 2019-2025.
// Figures are aggregated/illustrative annual totals reflecting public HMDA trends.

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Annual headline metrics
export const annualMetrics = [
  { year: 2019, applications: 8_900_000, originations: 5_500_000, loanAmount: 1_950_000_000_000, avgLoan: 354_000, approvalRate: 71.8, denialRate: 9.6, medianRate: 4.05 },
  { year: 2020, applications: 11_600_000, originations: 8_200_000, loanAmount: 3_100_000_000_000, avgLoan: 378_000, approvalRate: 73.2, denialRate: 8.2, medianRate: 3.11 },
  { year: 2021, applications: 12_800_000, originations: 9_900_000, loanAmount: 4_000_000_000_000, avgLoan: 404_000, approvalRate: 75.4, denialRate: 7.4, medianRate: 3.02 },
  { year: 2022, applications: 7_400_000, originations: 4_100_000, loanAmount: 1_650_000_000_000, avgLoan: 402_000, approvalRate: 68.9, denialRate: 11.8, medianRate: 5.34 },
  { year: 2023, applications: 6_100_000, originations: 3_200_000, loanAmount: 1_380_000_000_000, avgLoan: 431_000, approvalRate: 66.5, denialRate: 13.1, medianRate: 6.84 },
  { year: 2024, applications: 6_900_000, originations: 3_900_000, loanAmount: 1_620_000_000_000, avgLoan: 415_000, approvalRate: 68.2, denialRate: 11.9, medianRate: 6.86 },
  { year: 2025, applications: 7_800_000, originations: 4_600_000, loanAmount: 1_910_000_000_000, avgLoan: 415_000, approvalRate: 70.1, denialRate: 10.4, medianRate: 6.42 },
];

// Loan purpose mix by year (share %)
export const loanPurposeTrend = [
  { year: 2019, Purchase: 42, Refinance: 49, "Home Improvement": 6, "Cash-out Refi": 3 },
  { year: 2020, Purchase: 36, Refinance: 58, "Home Improvement": 4, "Cash-out Refi": 2 },
  { year: 2021, Purchase: 33, Refinance: 61, "Home Improvement": 4, "Cash-out Refi": 2 },
  { year: 2022, Purchase: 52, Refinance: 28, "Home Improvement": 12, "Cash-out Refi": 8 },
  { year: 2023, Purchase: 58, Refinance: 20, "Home Improvement": 14, "Cash-out Refi": 8 },
  { year: 2024, Purchase: 55, Refinance: 24, "Home Improvement": 13, "Cash-out Refi": 8 },
  { year: 2025, Purchase: 53, Refinance: 27, "Home Improvement": 12, "Cash-out Refi": 8 },
];

// Action taken distribution (millions of applications) by year
export const actionTakenTrend = [
  { year: 2019, "Originated": 5.5, "Approved not accepted": 0.6, "Denied": 0.9, "Withdrawn": 1.1, "Closed incomplete": 0.8 },
  { year: 2020, "Originated": 8.2, "Approved not accepted": 0.7, "Denied": 0.9, "Withdrawn": 1.2, "Closed incomplete": 0.6 },
  { year: 2021, "Originated": 9.9, "Approved not accepted": 0.8, "Denied": 0.9, "Withdrawn": 0.8, "Closed incomplete": 0.4 },
  { year: 2022, "Originated": 4.1, "Approved not accepted": 0.5, "Denied": 0.9, "Withdrawn": 1.0, "Closed incomplete": 0.9 },
  { year: 2023, "Originated": 3.2, "Approved not accepted": 0.4, "Denied": 0.8, "Withdrawn": 0.9, "Closed incomplete": 0.8 },
  { year: 2024, "Originated": 3.9, "Approved not accepted": 0.5, "Denied": 0.8, "Withdrawn": 0.9, "Closed incomplete": 0.8 },
  { year: 2025, "Originated": 4.6, "Approved not accepted": 0.6, "Denied": 0.8, "Withdrawn": 0.9, "Closed incomplete": 0.9 },
];

// Applicant race/ethnicity share (%) — latest year snapshot
export const raceEthnicity = [
  { group: "White", share: 62.4, originations: 2_870_000 },
  { group: "Hispanic/Latino", share: 12.8, originations: 589_000 },
  { group: "Black", share: 8.9, originations: 410_000 },
  { group: "Asian", share: 7.6, originations: 350_000 },
  { group: "Am. Indian/AK Native", share: 0.9, originations: 41_000 },
  { group: "Native HI/Pacific", share: 0.6, originations: 28_000 },
  { group: "2+ Races / Other", share: 6.8, originations: 313_000 },
];

// Denial rate by race/ethnicity (%) — latest year
export const denialByRace = [
  { group: "White", rate: 8.4 },
  { group: "Asian", rate: 9.8 },
  { group: "Hispanic/Latino", rate: 16.2 },
  { group: "Black", rate: 20.1 },
  { group: "Am. Indian/AK Native", rate: 17.5 },
  { group: "Native HI/Pacific", rate: 15.9 },
];

// Top lenders by 2025 originations (illustrative)
export const topLenders = [
  { lender: "Rocket Mortgage", originations: 349_000, share: 7.6 },
  { lender: "United Wholesale", originations: 312_000, share: 6.8 },
  { lender: "Wells Fargo", originations: 198_000, share: 4.3 },
  { lender: "JPMorgan Chase", originations: 176_000, share: 3.8 },
  { lender: "Bank of America", originations: 142_000, share: 3.1 },
  { lender: "LoanDepot", originations: 96_000, share: 2.1 },
  { lender: "Mr. Cooper", originations: 88_000, share: 1.9 },
];

// Loan type mix (%) — latest year
export const loanTypeMix = [
  { type: "Conventional", share: 78.2 },
  { type: "FHA", share: 11.4 },
  { type: "VA", share: 7.1 },
  { type: "RHS/FSA", share: 1.8 },
  { type: "Other", share: 1.5 },
];

// Median interest rate trend
export const rateTrend = annualMetrics.map((m) => ({
  year: m.year,
  rate: m.medianRate,
}));

// Helper: format currency
export const fmtUSD = (n) => {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

export const fmtNum = (n) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return `${n}`;
};

export const fmtPct = (n) => `${n.toFixed(1)}%`;