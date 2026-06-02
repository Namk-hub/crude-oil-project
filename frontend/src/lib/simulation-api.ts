import { API_BASE } from "@/lib/config";

export async function getRiskScores() {
  const response = await fetch(
    `${API_BASE}/risk-scores?limit=100`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk scores");
  }

  return response.json();
}