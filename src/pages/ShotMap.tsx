import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useDataStore } from "@/lib/data-store";

export default function Shotmap() {
  const { videoAnalyses, isLoading } = useDataStore();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  // Get events for the selected analysis
  const events = videoAnalyses.find(v => v.id === selectedAnalysisId)?.videoStats.events || [];
  // Convert timestamps (MM:SS) to total seconds and find max for scaling
  const eventTimes = events.map(evt => {
    const [min = '0', sec = '0'] = evt.timestamp.split(':');
    return parseInt(min, 10) * 60 + parseInt(sec, 10);
  });
  const maxTime = Math.max(...eventTimes, 1);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Season Shot Map</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="analysis-select" className="font-medium">Select Analysis:</label>
          <select
            id="analysis-select"
            value={selectedAnalysisId || ""}
            onChange={(e) => setSelectedAnalysisId(e.target.value || null)}
            className="border rounded px-2 py-1"
          >
            <option value="">-- Choose Analysis --</option>
            {videoAnalyses.map((analysis) => (
              <option key={analysis.id} value={analysis.id}>
                {analysis.title || analysis.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>

        {/* Goal diagram shotmap */}
        <div className="w-full h-64">
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="w-full h-full border rounded-lg bg-gray-100"
          >
            {/* Goal frame */}
            <rect x={1} y={1} width={98} height={48} fill="none" stroke="#ccc" strokeWidth={0.5} />
            {/* Net grid */}
            {[...Array(4)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1={1}
                y1={((i + 1) / 5) * 50}
                x2={99}
                y2={((i + 1) / 5) * 50}
                stroke="#eee"
                strokeWidth={0.2}
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={((i + 1) / 11) * 100}
                y1={1}
                x2={((i + 1) / 11) * 100}
                y2={49}
                stroke="#eee"
                strokeWidth={0.2}
              />
            ))}
            {/* Event markers */}
            {events.map((evt, idx) => {
              // Position horizontally by event time relative to latest event
              const secs = eventTimes[idx];
              const x = (secs / maxTime) * 100;
              // Goals up high, saves lower
              const y = evt.type === 'goal' ? 15 : 35;
              return evt.type === 'save' ? (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={2}
                  fill="#4299e1"
                  stroke="#fff"
                  strokeWidth={0.5}
                />
              ) : (
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
            })}
          </svg>
        </div>
      </div>
    </Layout>
  );
}