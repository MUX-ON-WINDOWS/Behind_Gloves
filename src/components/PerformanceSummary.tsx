import { useDataStore } from "@/lib/data-store";
import { StatsCard } from "@/components/StatsCard";

export const PerformanceSummary = () => {
  const { performanceSummary,  } = useDataStore();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Matches Played"
        value={performanceSummary.matches}
      />
      <StatsCard 
        title="Total Saves"
        value={performanceSummary.totalSaves}
        description={`${Math.round((performanceSummary.totalSaves / performanceSummary.matches))} saves per match`}
        trend="down"
      />
      <StatsCard 
        title="Clean Sheets"
        value={performanceSummary.cleanSheets}
        description={`${Math.round((performanceSummary.cleanSheets / performanceSummary.matches) * 100)}% of matches`}
        trend="up"
      />
      <StatsCard 
        title="Save Percentage"
        value={`${Math.round((performanceSummary.totalSaves / (performanceSummary.totalSaves + performanceSummary.totalGoalsConceded)) * 100)}%`}
        description={`${Math.round((performanceSummary.totalSaves + performanceSummary.totalGoalsConceded))} total shots faced`}
        trend="up"
      />
    </div>
  );
};
