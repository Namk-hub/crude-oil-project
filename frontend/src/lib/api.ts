import { API_BASE } from "@/lib/config";

export async function getNews() {
  const response = await fetch(`${API_BASE}/news?limit=50`);

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
}
export async function getCountryRisks() {
  const response = await fetch(
    `${API_BASE}/risk-scores?limit=100`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk scores");
  }

  return response.json();
}
