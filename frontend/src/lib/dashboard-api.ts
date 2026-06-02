import { API_BASE } from "@/lib/config";

export async function getDashboard() {
  const response = await fetch(`${API_BASE}/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return response.json();
}