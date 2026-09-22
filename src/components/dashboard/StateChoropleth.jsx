import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// US states GeoJSON (folium example dataset). Fetched at runtime.
const GEO_URL = "https://raw.githubusercontent.com/python-visualization/folium/main/examples/data/us-states.json";

function colorScale(v, min, max) {
  if (v == null) return "#e5e7eb";
  const t = (v - min) / (max - min || 1);
  const hue = 220 - t * 40;
  const light = 85 - t * 50;
  return `hsl(${hue}, 70%, ${light}%)`;
}

export default function StateChoropleth({ valueByState, metricLabel = "Median value", format }) {
  const [geo, setGeo] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((d) => active && setGeo(d))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  const entries = Object.entries(valueByState).filter(([, v]) => v != null);
  const values = entries.map(([, v]) => v);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const fmt = format || ((n) => n);

  const style = (feature) => {
    const name = feature.properties.name;
    const val = valueByState[name];
    return {
      fillColor: colorScale(val, min, max),
      weight: 1,
      color: "#ffffff",
      fillOpacity: 0.85,
    };
  };

  if (failed) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Map unavailable — state ranking shown in the adjacent chart.
      </div>
    );
  }

  if (!geo) {
    return <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">Loading map…</div>;
  }

  return (
    <div>
      <div style={{ height: 400, width: "100%" }}>
        <MapContainer center={[37.8, -96.9]} zoom={4} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
          <GeoJSON data={geo} style={style} />
        </MapContainer>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{metricLabel}</span>
        <div className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(to right, #dbeafe, #1e40af)" }} />
        <span>
          {fmt(min)} – {fmt(max)}
        </span>
      </div>
    </div>
  );
}