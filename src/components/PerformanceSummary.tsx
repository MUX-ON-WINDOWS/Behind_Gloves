
import { performanceSummary } from "@/lib/chart-data";
import { StatsCard } from "@/components/StatsCard";

export const PerformanceSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Matches Played"
        value={performanceSummary.matches}
      />
      <StatsCard 
        title="Total Saves"
        value={performanceSummary.totalSaves}
        trend="up"
      />
      <StatsCard 
        title="Clean Sheets"
        value={performanceSummary.cleanSheets}
        description={`${Math.round((performanceSummary.cleanSheets / performanceSummary.matches) * 100)}% of matches`}
        trend="up"
      />
      <StatsCard 
        title="Save Percentage"
        value={`${performanceSummary.savePercentage}%`}
        trend="up"
      />
    </div>
  );
};
