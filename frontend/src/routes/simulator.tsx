import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertTriangle, TrendingDown, Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getRiskScores,
  getDashboard,
} from "@/lib/risk-api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React, { useState } from "react";


export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Scenario Simulator · India Oil Risk" },
      { name: "description", content: "Simulate supply disruptions from key oil partners." },
    ],
  }),
  component: SimulatorPage,
});

const TOTAL_IMPORT_MBPD = 4.6; // million barrels per day (illustrative)

function SimulatorPage() {
  const { data: dashboardData } = useQuery({
  queryKey: ["dashboard"],
  queryFn: getDashboard,
});
const TOTAL_IMPORT_MBPD =
  dashboardData?.countries?.reduce(
    (sum: number, c: any) =>
      sum + c.import_share,
    0
  ) || 100;


  const {
  data: riskData,
  isLoading,
  error,
} = useQuery({
  queryKey: ["risk-scores"],
  queryFn: getRiskScores,
});
  const [country, setCountry] = useState("");
  const [reduction, setReduction] = useState(50);

 const result = useMemo(() => {
  const c = riskData?.find(
    (x: any) => x.country_name === country
  );

if (!c) {
  return {
    gap: 0,
    gapPct: 0,
    level: "Low",
    riskImpact: 0,
    recommendation: "Select a country",
    country: null,
  };
}
  const importShare = c.import_share;

  const gap =
    (TOTAL_IMPORT_MBPD *
      importShare *
      reduction) /
    10000;

  const gapPct = (gap / TOTAL_IMPORT_MBPD) * 100;

  const riskImpact =
    (c.overall_risk_score * reduction) / 100;

  const level =
    riskImpact > 60
      ? "Critical"
      : riskImpact > 40
      ? "High"
      : riskImpact > 20
      ? "Moderate"
      : "Low";

  const recs = {
    Low:
      "Maintain current sourcing mix.",
    Moderate:
      "Increase imports from UAE and USA.",
    High:
      "Activate diversification strategy.",
    Critical:
      "Release strategic reserves and emergency procurement.",
  };



  return {
    gap,
    gapPct,
    level,
    riskImpact,
    recommendation: recs[level],
    country: c,
  };
}, [country, reduction, riskData]);
const disruptionData = [
  {
    name: "Available",
    value: TOTAL_IMPORT_MBPD - result.gap,
  },
  {
    name: "Lost",
    value: result.gap,
  },
];
  const levelColor = {
    Low: "bg-success/15 text-success border-success/30",
    Moderate: "bg-warning/20 border-warning/40",
    High: "bg-saffron/20 text-saffron border-saffron/40",
    Critical: "bg-danger/15 text-danger border-danger/40",
  }[result.level];
  if (isLoading) {
  return (
    <AppLayout>
      <p>Loading simulator...</p>
    </AppLayout>
  );
}

if (error) {
  return (
    <AppLayout>
      <p>Failed to load simulator data</p>
    </AppLayout>
  );
}
  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scenario Parameters</CardTitle>
            <p className="text-sm text-muted-foreground">Model a supply disruption from a key partner.</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label>Supplier country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
  {riskData?.map((c: any) => (
    <SelectItem
      key={c.country_name}
      value={c.country_name}
    >
      {c.country_name} — Risk {c.overall_risk_score}
    </SelectItem>
  ))}
</SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Supply reduction</Label>
                <span className="font-display text-2xl font-semibold">{reduction}%</span>
              </div>
              <Slider value={[reduction]} onValueChange={(v) => setReduction(v[0])} min={0} max={100} step={5} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>No disruption</span><span>Full embargo</span>
              </div>
            </div>

            <div className="rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
              Baseline: India imports ~4.6 mbpd of crude. Results are illustrative
              and combine sentiment, geopolitical exposure and share-weighted gap.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <TrendingDown className="h-4 w-4" /> Supply Gap
                </div>
                <p className="mt-3 font-display text-3xl font-semibold">{result.gap.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">mbpd ({result.gapPct.toFixed(1)}% of imports)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" /> Risk Level
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className={`${levelColor} text-sm`}>{result.level}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Impact score: {result.riskImpact}/100</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Affected Partner</div>
                <p className="mt-3 font-display text-2xl font-semibold">{result.country?.country_name || "Select Country"}</p>
                <p className="text-xs text-muted-foreground">
  Import Share:
  {result.country?.import_share || 0}%
</p>

<p className="text-xs text-muted-foreground">
  Base Risk:
  {result.country?.overall_risk_score || 0}/100
</p>
              </CardContent>
            </Card>
          </div>
          <Card>
  <CardHeader>
    <CardTitle>
      Recommended Response
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">

    <div className="rounded-md border p-3">
      ✓ Increase imports from UAE
    </div>

    <div className="rounded-md border p-3">
      ✓ Increase imports from USA
    </div>

    <div className="rounded-md border p-3">
      ✓ Activate strategic petroleum reserves
    </div>

    <div className="rounded-md border p-3">
      ✓ Monitor Brent above $95/bbl
    </div>

  </CardContent>
</Card>

          <Card>
  <CardHeader>
    <CardTitle>
      Supply Disruption Impact
    </CardTitle>
  </CardHeader>

  <CardContent className="h-64">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={disruptionData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
        >
          <Cell fill="#22c55e" />
          <Cell fill="#ef4444" />
        </Pie>
        <Tooltip />
<Legend />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-5 w-5 text-saffron" /> Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-foreground">{result.recommendation}</p>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-md border bg-background p-3">
                  <div className="text-xs text-muted-foreground">Diversification target</div>
                  <div className="font-medium">{Math.min(100, Math.round(result.gapPct * 1.2))}% redistribution</div>
                </div>
                <div className="rounded-md border bg-background p-3">
                  <div className="text-xs text-muted-foreground">SPR coverage</div>
                  <div className="font-medium">~{Math.max(1, Math.round(74 / Math.max(1, result.gap)))} days at current gap</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
