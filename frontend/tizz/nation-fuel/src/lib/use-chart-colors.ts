import { useMemo } from "react";
import { useTheme } from "./theme-context";

/**
 * Returns resolved chart color tokens based on the current theme.
 * Recharts can't consume CSS var() directly, so we read them here.
 */
export function useChartColors() {
  const { theme } = useTheme();

  return useMemo(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      grid: style.getPropertyValue("--chart-grid").trim(),
      axis: style.getPropertyValue("--chart-axis").trim(),
      tooltipBg: style.getPropertyValue("--chart-tooltip-bg").trim(),
      tooltipBorder: style.getPropertyValue("--chart-tooltip-border").trim(),
      tooltipText: style.getPropertyValue("--chart-tooltip-text").trim(),
    };
  }, [theme]); // re-compute when theme toggles
}
