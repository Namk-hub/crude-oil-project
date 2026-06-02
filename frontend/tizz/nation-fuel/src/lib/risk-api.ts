const API_BASE = "http://127.0.0.1:8000";

export async function getRiskScores() {
  const response = await fetch(
    `${API_BASE}/risk-scores?limit=100`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk scores");
  }

  return response.json();
}

export async function getDashboard() {
  const response = await fetch(
    `${API_BASE}/dashboard`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
}