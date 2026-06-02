export const oilPriceTrend = [
  { month: "Jan", price: 76.2 },
  { month: "Feb", price: 78.5 },
  { month: "Mar", price: 82.1 },
  { month: "Apr", price: 85.3 },
  { month: "May", price: 83.7 },
  { month: "Jun", price: 81.2 },
  { month: "Jul", price: 79.8 },
  { month: "Aug", price: 84.5 },
  { month: "Sep", price: 87.9 },
  { month: "Oct", price: 86.4 },
  { month: "Nov", price: 88.7 },
  { month: "Dec", price: 90.2 },
];

export const supplierShare = [
  { name: "Russia", value: 35, color: "oklch(0.6 0.22 25)" },
  { name: "Iraq", value: 22, color: "oklch(0.72 0.17 55)" },
  { name: "Saudi Arabia", value: 18, color: "oklch(0.55 0.13 150)" },
  { name: "UAE", value: 10, color: "oklch(0.55 0.15 250)" },
  { name: "USA", value: 8, color: "oklch(0.5 0.15 300)" },
  { name: "Others", value: 7, color: "oklch(0.55 0.02 250)" },
];

export interface CountryRisk {
  country: string;
  importShare: number;
  sentimentScore: number;
  geopoliticalScore: number;
  overallRisk: number;
}

export const countryRisks: CountryRisk[] = [
  { country: "Russia", importShare: 35, sentimentScore: 42, geopoliticalScore: 85, overallRisk: 78 },
  { country: "Iraq", importShare: 22, sentimentScore: 55, geopoliticalScore: 72, overallRisk: 65 },
  { country: "Saudi Arabia", importShare: 18, sentimentScore: 68, geopoliticalScore: 58, overallRisk: 52 },
  { country: "UAE", importShare: 10, sentimentScore: 75, geopoliticalScore: 45, overallRisk: 38 },
  { country: "USA", importShare: 8, sentimentScore: 80, geopoliticalScore: 35, overallRisk: 32 },
  { country: "Nigeria", importShare: 4, sentimentScore: 50, geopoliticalScore: 68, overallRisk: 60 },
  { country: "Venezuela", importShare: 3, sentimentScore: 38, geopoliticalScore: 82, overallRisk: 76 },
];

export const newsItems = [
  { title: "OPEC+ extends production cuts through Q2 2026", source: "Reuters", time: "2h ago", sentiment: "negative" as const },
  { title: "India signs new long-term crude deal with UAE", source: "Bloomberg", time: "5h ago", sentiment: "positive" as const },
  { title: "Red Sea tensions disrupt tanker routes from Gulf", source: "FT", time: "8h ago", sentiment: "negative" as const },
  { title: "Brent crude steady as inventories rise in US", source: "WSJ", time: "12h ago", sentiment: "neutral" as const },
  { title: "Strategic petroleum reserve expansion approved", source: "ET Energy", time: "1d ago", sentiment: "positive" as const },
];
