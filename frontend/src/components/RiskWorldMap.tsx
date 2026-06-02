import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function RiskWorldMap() {
  return (
    <ComposableMap>
  <Geographies geography={geoUrl}>
    {({ geographies }) =>
      geographies.map((geo) => {
        const name =
          geo.properties.name;

        const risk =
          dashboardData?.latest_risk_scores?.find(
            (r: any) =>
              r.country_name === name
          );

        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            onClick={() =>
              setSelectedCountry(risk)
            }
            style={{
              default: {
                fill: risk
                  ? risk.overall_risk_score > 70
                    ? "#ef4444"
                    : risk.overall_risk_score > 50
                    ? "#f59e0b"
                    : "#22c55e"
                  : "#1e293b",
              },
              hover: {
                fill: "#3b82f6",
              },
            }}
          />
        );
      })
    }
      </Geographies>
    </ComposableMap>
  );
}

