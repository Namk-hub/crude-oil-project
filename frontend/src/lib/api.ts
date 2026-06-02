const API_BASE = "http://127.0.0.1:8000";

export async function getNews() {
  const response = await fetch(`${API_BASE}/news?limit=50`);

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return response.json();
}
export async function getCountryRisks() {
  const response = await fetch(
    "http://127.0.0.1:8000/risk-scores?limit=100"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk scores");
  }

  return response.json();
}
