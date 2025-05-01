import { Layout } from "@/components/Layout";
import { useState, useMemo, useEffect } from "react";
import { useDataStore } from "@/lib/data-store";
import { useParams } from 'react-router-dom';
import { Hand } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

export default function Shotmap() {
  const { videoAnalyses, isLoading } = useDataStore();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const { id: routeId } = useParams();
  const { theme } = useTheme();

  // Read optional ID from URL via react-router-dom
  useEffect(() => {
    if (routeId) {
      setSelectedAnalysisId(routeId);
    }
  }, [routeId]);

  // Get the selected analysis
  const selectedVideo = videoAnalyses.find(v => v.id === selectedAnalysisId);
  // Normalize events: parse string JSON or accept array
  let events: Array<{ type: string; timestamp: string; description: string }> = [];
  const rawEvents = selectedVideo?.videoStats.events;
  if (typeof rawEvents === 'string') {
    try {
      const parsed = JSON.parse(rawEvents);
      if (Array.isArray(parsed)) {
        events = parsed;
      }
    } catch {
      events = [];
    }
  } else if (Array.isArray(rawEvents)) {
    events = rawEvents;
  } else if (rawEvents && Array.isArray((rawEvents as any).events)) {
    // Support nested shape: { events: [...] }
    events = (rawEvents as any).events;
  }

  const saveCount = events.filter(evt => evt.type === 'save').length;
  const goalCount = events.filter(evt => evt.type === 'goal').length;
  const missCount = events.filter(evt => evt.type === 'miss').length;

  // Precompute net grid lines with useMemo
  const gridLines = useMemo(() => {
    const gridColor = theme === 'dark' ? '#374151' : '#eee';
    const horizontal = [...Array(4)].map((_, i) => (
      <line
        key={`h-${i}`}
        x1={1}
        y1={((i + 1) / 5) * 50}
        x2={99}
        y2={((i + 1) / 5) * 50}
        stroke={gridColor}
        strokeWidth={0.2}
      />
    ));
    const vertical = [...Array(10)].map((_, i) => (
      <line
        key={`v-${i}`}
        x1={((i + 1) / 11) * 100}
        y1={1}
        x2={((i + 1) / 11) * 100}
        y2={49}
        stroke={gridColor}
        strokeWidth={0.2}
      />
    ));
    return [...horizontal, ...vertical];
  }, [theme]);

  // Map descriptions to base goal coordinates
  const coordMap = {
    'top left': [25, 10],
    'top right': [75, 10],
    'bottom left': [25, 40],
    'bottom right': [75, 40],
    center: [50, 25]
  };

  // Function to render each event marker with jitter
  const renderEventMarker = (evt, idx) => {
    const [baseX, baseY] = coordMap[evt.description.toLowerCase()] || coordMap.center;
    const jitterX = (Math.random() - 0.5) * 6;
    const jitterY = (Math.random() - 0.5) * 6;
    const x = baseX + jitterX;
    const y = baseY + jitterY;

    if (evt.type === 'save') {
      return (
        <circle
          key={idx}
          cx={x}
          cy={y}
          r={2}
          fill="#35A6E2"
          opacity={0.8}
        />
      );
    }

    return (
      <text
        key={idx}
        x={x}
        y={y}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={4}
      >
        ⚽
      </text>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Season Shot Map</h1>
        {/* Only show selector when no direct ID provided in URL */}
        {!routeId && (
          <div className="flex items-center gap-4">
            <label htmlFor="analysis-select" className="font-medium">Select Analysis:</label>
            <select
              id="analysis-select"
              value={selectedAnalysisId || ""}
              onChange={(e) => setSelectedAnalysisId(e.target.value || null)}
              className="border rounded px-2 py-1 bg-background"
            >
              <option value="">-- Choose Analysis --</option>
              {videoAnalyses.map((analysis) => (
                <option key={analysis.id} value={analysis.id}>
                  {analysis.title || analysis.id.slice(0, 8)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Goal diagram shotmap for analysis ID: {selectedAnalysisId} */}
        <div className="w-full">
          <svg
            key={selectedAnalysisId || 'empty'}
            viewBox="0 0 100 50"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto border rounded-lg bg-card"
          >
            {/* Goal frame */}
            <rect x={1} y={1} width={98} height={48} fill="none" stroke={theme === 'dark' ? '#4B5563' : '#ccc'} strokeWidth={0.5} />
            {/* Net grid */}
            {gridLines}
            {/* Event markers */}
            {events.map((evt, idx) => renderEventMarker(evt, idx))}
          </svg>
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Shot Map Summary</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 flex flex-col items-center bg-card border rounded-lg">
            <h2 className="text-lg font-semibold">Save</h2>
            <p className="text-3xl font-bold">{saveCount}</p>
          </div>
          <div className="p-4 flex flex-col items-center bg-card border rounded-lg">
            <h2 className="text-lg font-semibold">Goal</h2>
            <p className="text-3xl font-bold">{goalCount}</p>
          </div>
          <div className="p-4 flex flex-col items-center bg-card border rounded-lg">
            <h2 className="text-lg font-semibold">Miss</h2>
            <p className="text-3xl font-bold">{missCount}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}