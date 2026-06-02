const API_BASE = "http://127.0.0.1:8000";

export async function getInsights() {
  const response = await fetch(
    `${API_BASE}/insights`
  );

  if (!response.ok) {
    throw new Error("Failed to load insights");
  }

  return response.json();
}

