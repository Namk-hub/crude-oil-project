import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getRiskScores } from "@/lib/risk-api";

export const Route = createFileRoute("/country-risk")({
  head: () => ({
    meta: [
      { title: "Country Risk Analysis · India Oil Risk" },
      { name: "description", content: "Per-country oil supply risk breakdown for India." },
    ],
  }),
  component: CountryRiskPage,
});

function riskBadge(score: number) {
  if (score > 70) return <Badge className="bg-danger/15 text-danger hover:bg-danger/15">High</Badge>;
  if (score > 50) return <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/20" style={{ color: "#ef4444" }}>Medium</Badge>;
  return <Badge className="bg-success/15 text-success hover:bg-success/15">Low</Badge>;
}

function Bar({ value, tone }: { value: number; tone: "neutral" | "warm" | "danger" }) {
  const color = tone === "danger" ? "bg-danger" : tone === "warm" ? "bg-saffron" : "bg-primary";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
    </div>
  );
}

function CountryRiskPage() {
  const { data, isLoading, error } = useQuery({
  queryKey: ["country-risk"],
  queryFn: getRiskScores,
});

const sorted = [...(data || [])].sort(
  (a, b) => b.overall_risk_score - a.overall_risk_score
);
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle>Country Risk Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Weighted composite of geopolitical exposure and market sentiment.</p>
        </CardHeader>
        <CardContent>
          {isLoading && (
  <p>Loading country risks...</p>
)}


{error && (
  <p>Failed to load country risks</p>
)}

{!isLoading && !error && (
  <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Country</th>
                  <th className="py-3 pr-4 font-medium">Import Share</th>
                  <th className="py-3 pr-4 font-medium">Sentiment</th>
                  <th className="py-3 pr-4 font-medium">Geopolitical</th>
                  <th className="py-3 pr-4 font-medium">Overall Risk</th>
                  <th className="py-3 font-medium">Level</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-4 pr-4 font-medium">{c.country_name}</td>
                    <td className="py-4 pr-4"><Bar value={c.dependency_score} tone="neutral" /></td>
                    <td className="py-4 pr-4"><Bar value={c.sentiment_score} tone="warm" /></td>
                    <td className="py-4 pr-4"><Bar value={c.geopolitical_score} tone="danger" /></td>
                    <td className="py-4 pr-4 font-display text-base font-semibold">{c.overall_risk_score}</td>
                    <td className="py-4">{riskBadge(c.overall_risk_score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
