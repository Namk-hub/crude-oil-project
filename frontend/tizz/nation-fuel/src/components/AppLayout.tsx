import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Globe2, Sliders, Flame, Menu, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { exportDashboard } from "@/lib/pdf-export";
import { useTheme } from "@/lib/theme-context";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/country-risk", label: "Country Risk", icon: Globe2 },
  { to: "/simulator", label: "Scenario Simulator", icon: Sliders },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b px-6 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold leading-tight">India Oil Risk</div>
            <div className="text-xs text-muted-foreground">Intelligence Dashboard</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live feed connected
          </div>
          <div className="mt-2">Gov of India · MoPNG</div>
        </div>
      </aside>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
        )}
      >
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-card/80 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-display text-base font-semibold leading-tight text-foreground">
                Energy Intelligence Platform
              </h1>
              <p className="text-xs text-muted-foreground">
                Real-time crude oil supply & geopolitical risk monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={exportDashboard} className="font-medium">
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-md border bg-background px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">Updated</span>{" "}
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
<footer className="border-t mt-6 py-4 text-center text-xs text-muted-foreground">
  India Oil Risk Intelligence Platform • React • FastAPI • Recharts • 2026
</footer>