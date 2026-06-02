import { API_BASE } from "@/lib/config";

export async function getInsights() {
  const response = await fetch(
    `${API_BASE}/insights`
  );

  if (!response.ok) {
    throw new Error("Failed to load insights");
  }

  return response.json();
}

