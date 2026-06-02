import { useState, type ComponentType } from "react";
import { getNews } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/dashboard-api";
import { TrendingUp, TrendingDown, Droplet, Globe, ShieldAlert, Crown } from "lucide-react";
import RiskWorldMap from "@/components/RiskWorldMap";
import { getInsights } from "@/lib/insights-api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { supplierShare } from "@/lib/mock-data";
import { useChartColors } from "@/lib/use-chart-colors";

const CHART_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#6b7280", // Grey
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "India Oil Risk Dashboard" },
      {
        name: "description",
        content: "Real-time crude oil supply and geopolitical risk monitoring for India.",
      },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change?: string;
  tone?: "up" | "down" | "neutral";
}) {
  const ToneIcon = tone === "up" ? TrendingUp : TrendingDown;
  const toneColor =
    tone === "up"
      ? "text-success"
      : tone === "down"
      ? "text-danger"
      : "text-muted-foreground";

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
            {change && (
              <p className={`mt-1 flex items-center gap-1 text-xs ${toneColor}`}>
                {tone !== "neutral" && <ToneIcon className="h-3 w-3" />}
                {change}
              </p>
            )}
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-md bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const chartColors = useChartColors();
 const {
  data: dashboardData,
  isLoading: dashboardLoading,
} = useQuery({
  queryKey: ["dashboard"],
  queryFn: getDashboard,
});
const [selectedCountry, setSelectedCountry] =
  useState<any>(null);

const [search, setSearch] = useState("");
const [sentimentFilter, setSentimentFilter] = useState("");

const {
  data: newsData,
  isLoading: newsLoading,
  error,
} = useQuery({
  queryKey: ["news"],
  queryFn: getNews,
  refetchInterval: 60000,
});

  const positiveCount =
  newsData?.articles?.filter(
    (a: any) => a.sentiment === "positive"
  ).length || 0;

const negativeCount =
  newsData?.articles?.filter(
    (a: any) => a.sentiment === "negative"
  ).length || 0;

const neutralCount =
  newsData?.articles?.filter(
    (a: any) => a.sentiment === "neutral"
  ).length || 0;

const totalArticles = newsData?.count || 0;

const avgRisk =
  Math.round(
    dashboardData?.latest_risk_scores?.reduce(
      (sum: number, r: any) => sum + r.overall_risk_score,
      0
    ) / (dashboardData?.latest_risk_scores?.length || 1)
  ) || 0;

const supplierData =
  dashboardData?.countries?.map((c: any) => ({
    name: c.name,
    value: c.import_share,
  })) || [];

const top =
  supplierData.length > 0
    ? supplierData.reduce((a: any, b: any) =>
        a.value > b.value ? a : b
      )
    : { name: "-", value: 0 };

const oilPriceData =
  dashboardData?.recent_oil_prices
    ?.slice()
    .reverse()
    .map((p: any) => ({
      month: new Date(p.date).toLocaleString("default", {
        month: "short",
      }),
      price: p.price,
    })) || [];

const riskChartData =
  dashboardData?.latest_risk_scores?.map((r: any) => ({
    country: r.country_name,
    overallRisk: r.overall_risk_score,
  })) || [];
  const latestNegativeNews =
  newsData?.articles?.find(
    (n: any) => n.sentiment === "negative"
  );

const latestPositiveNews =
  newsData?.articles?.find(
    (n: any) => n.sentiment === "positive"
  );
  
  const { data: insightsData } = useQuery({
  queryKey: ["insights"],
  queryFn: getInsights,
});



  return (

  <AppLayout>
    <div id="dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Droplet} label="Brent Crude" value="$90.20" change="+1.7% today" tone="up" />
          <StatCard
            icon={Globe}
            label="Import Dependency"
            value="87.3%"
            change="+0.4% YoY"
            tone="down"
          />
          <StatCard
            icon={ShieldAlert}
            label="Avg Risk Score"
            value={`${avgRisk}/100`}
            change="Elevated"
            tone="down"
          />
          <StatCard
            icon={Crown}
            label="Top Supplier"
            value={top.name}
            change={`${top.value}% share`}
            tone="neutral"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Brent Oil Price Trend (USD/bbl)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={oilPriceData} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.axis} fontSize={12} />
                  <YAxis stroke={chartColors.axis} fontSize={12} domain={[70, 95]} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${chartColors.tooltipBorder}`, backgroundColor: chartColors.tooltipBg, color: chartColors.tooltipText }} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="url(#priceLine)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
  <CardHeader>
    <CardTitle>AI Risk Insights</CardTitle>
  </CardHeader>

  <CardContent className="space-y-3">
  {insightsData?.insights?.map(
    (i: string, idx: number) => (
      <div
        key={idx}
        className="rounded-lg border bg-muted/30 p-3"
      >
        {i}
      </div>
    )
  )}
</CardContent>
</Card>

        </div>

        <Card className="border-none bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-base text-center">Supplier Share</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-between min-h-[380px] p-6 pt-0">
            <div className="w-full flex items-center justify-center min-h-[220px]">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={supplierData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {supplierData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-xs border-t pt-4 w-full">
              {supplierData.map((item: any, idx: number) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                  <span className="text-muted-foreground font-medium">{item.name}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Country Risk Scores</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskChartData} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="country" stroke={chartColors.axis} fontSize={11} />
                <YAxis stroke={chartColors.axis} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${chartColors.tooltipBorder}`, backgroundColor: chartColors.tooltipBg, color: chartColors.tooltipText }} />
                <Bar dataKey="overallRisk" radius={[6, 6, 0, 0]}>
                 {riskChartData.map((c: any) => (
                    <Cell
                      key={c.country}
                      fill={
                        c.overallRisk > 70
                          ? "#ef4444"
                          : c.overallRisk > 50
                          ? "#f59e0b"
                          : "#22c55e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
    


        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest Oil News({totalArticles})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardLoading || newsLoading && <p>Loading news...</p>}
            {error && <p>Failed to load news</p>}
            <input
type="text"
placeholder="Search news..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="w-full rounded-md border p-2 mb-4"
/>

<div className="grid gap-4 md:grid-cols-4">

<Card>
  <CardHeader>
    <CardTitle>Total Articles</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">
      {totalArticles}
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Positive News</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-green-600">
      {positiveCount}
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Negative News</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-red-600">
      {negativeCount}
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Neutral News</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">
      {neutralCount}
    </div>
  </CardContent>
</Card>

</div>
{newsData?.articles
?.filter((n: any) =>
  n.title.toLowerCase().includes(search.toLowerCase())
)
?.filter((n: any) =>
  sentimentFilter
    ? n.sentiment === sentimentFilter
    : true
)
?.map((n: any, i: number) => (
  <div
    key={n.id || i}
    className="border-b pb-3 last:border-0 last:pb-0"
  >
    <div className="flex items-start justify-between gap-2">
      <a
        href={n.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium leading-snug hover:text-blue-600 hover:underline"
      >
        {n.title}
      </a>

      <Badge
        variant="outline"
        className={
          n.sentiment === "positive"
            ? "border-success/40 bg-success/10 text-success"
            : n.sentiment === "negative"
            ? "border-danger/40 bg-danger/10 text-danger"
            : "border-muted-foreground/40 bg-muted text-muted-foreground"
        }
      >
        {n.sentiment}
      </Badge>
    </div>

    <div className="mt-1 text-xs text-muted-foreground">
      <p>{n.source}</p>
      <p>
        {new Date(n.published_at).toLocaleString()}
      </p>
    </div>

    {n.description && (
      <p className="mt-2 text-xs text-muted-foreground">
        {n.description}
      </p>
    )}
  </div>
))}
          </CardContent>
        </Card>
        </div>
      </div>
    </AppLayout>
  );
}