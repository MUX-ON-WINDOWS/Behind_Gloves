
import { useDataStore } from "@/lib/data-store";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "react-router-dom";

export const PerformanceSummary = () => {
  const { performanceSummary } = useDataStore();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link to="/match-overview" className="block hover:opacity-90 transition-opacity">
        <StatsCard 
          title="Matches Played"
          value={performanceSummary.matches}
        />
      </Link>
      <Link to="/match-overview" className="block hover:opacity-90 transition-opacity">
        <StatsCard 
          title="Total Saves"
          value={performanceSummary.totalSaves}
          trend="up"
        />
      </Link>
      <Link to="/match-overview" className="block hover:opacity-90 transition-opacity">
        <StatsCard 
          title="Clean Sheets"
          value={performanceSummary.cleanSheets}
          description={`${Math.round((performanceSummary.cleanSheets / performanceSummary.matches) * 100)}% of matches`}
          trend="up"
        />
      </Link>
      <Link to="/match-overview" className="block hover:opacity-90 transition-opacity">
        <StatsCard 
          title="Save Percentage"
          value={`${performanceSummary.savePercentage}%`}
          trend="up"
        />
      </Link>
    </div>
  );
};
