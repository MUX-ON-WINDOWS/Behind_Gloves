
import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataStore } from "@/lib/data-store";

const ShotMap = () => {
  const { theme } = useTheme();
  const { matchLogs, performanceSummary } = useDataStore();
  const [shotFilter, setShotFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("season");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Calculate shot stats based on match data
  const shotStats = useMemo(() => {
    // Define zones
    const zones = {
      "Top Left": { goals: 0, saves: 0 },
      "Top Center": { goals: 0, saves: 0 },
      "Top Right": { goals: 0, saves: 0 },
      "Bottom Left": { goals: 0, saves: 0 },
      "Bottom Center": { goals: 0, saves: 0 },
      "Bottom Right": { goals: 0, saves: 0 },
    };
    
    // Simulate shot distribution across zones based on goals conceded and saves
    const totalShots = performanceSummary.totalGoalsConceded + performanceSummary.totalSaves;
    
    if (totalShots > 0) {
      // Fill in simulated data based on real match stats
      // This is a placeholder - in a real app, this would use actual shot location data
      zones["Top Left"].goals = Math.round(performanceSummary.totalGoalsConceded * 0.15);
      zones["Top Center"].goals = Math.round(performanceSummary.totalGoalsConceded * 0.05);
      zones["Top Right"].goals = Math.round(performanceSummary.totalGoalsConceded * 0.2);
      zones["Bottom Left"].goals = Math.round(performanceSummary.totalGoalsConceded * 0.2);
      zones["Bottom Center"].goals = Math.round(performanceSummary.totalGoalsConceded * 0.15);
      zones["Bottom Right"].goals = Math.round(performanceSummary.totalGoalsConceded * 0.25);
      
      // Distribute saves across zones
      zones["Top Left"].saves = Math.round(performanceSummary.totalSaves * 0.2);
      zones["Top Center"].saves = Math.round(performanceSummary.totalSaves * 0.15);
      zones["Top Right"].saves = Math.round(performanceSummary.totalSaves * 0.15);
      zones["Bottom Left"].saves = Math.round(performanceSummary.totalSaves * 0.15);
      zones["Bottom Center"].saves = Math.round(performanceSummary.totalSaves * 0.2);
      zones["Bottom Right"].saves = Math.round(performanceSummary.totalSaves * 0.15);
    }
    
    return zones;
  }, [performanceSummary]);
  
  // Calculate shot types
  const shotTypes = useMemo(() => {
    const totalShots = performanceSummary.totalGoalsConceded + performanceSummary.totalSaves;
    
    // Simulated shot type distribution
    return {
      openPlay: Math.round(totalShots * 0.68),
      setPieces: Math.round(totalShots * 0.16),
      cornerKicks: Math.round(totalShots * 0.09),
      penalties: Math.round(totalShots * 0.06),
    };
  }, [performanceSummary]);
  
  // Calculate save percentage by type
  const savePercentageByType = useMemo(() => {
    return {
      openPlay: 82,
      setPieces: 78,
      cornerKicks: 75,
      penalties: 40,
    };
  }, []);
  
  // Filter shot markers based on selected filter
  const getShotMarkers = () => {
    if (shotFilter === "all") {
      return (
        <>
          {/* Goals (red) */}
          <circle cx="380" cy="100" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="450" cy="80" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="620" cy="90" r="15" fill="#ef4444" opacity="0.8" />
          
          {/* Saves (green) */}
          <circle cx="410" cy="120" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="500" cy="90" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="550" cy="100" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="400" cy="95" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="600" cy="120" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="500" cy="125" r="15" fill="#4CAF50" opacity="0.8" />
          
          {/* Outside box */}
          <circle cx="300" cy="300" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="400" cy="350" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="500" cy="380" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="600" cy="320" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="700" cy="280" r="15" fill="#4CAF50" opacity="0.8" />
        </>
      );
    } else if (shotFilter === "goals") {
      return (
        <>
          {/* Only goals */}
          <circle cx="380" cy="100" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="450" cy="80" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="620" cy="90" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="500" cy="380" r="15" fill="#ef4444" opacity="0.8" />
        </>
      );
    } else { // saves
      return (
        <>
          {/* Only saves */}
          <circle cx="410" cy="120" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="500" cy="90" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="550" cy="100" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="400" cy="95" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="600" cy="120" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="500" cy="125" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="300" cy="300" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="400" cy="350" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="600" cy="320" r="15" fill="#4CAF50" opacity="0.8" />
          <circle cx="700" cy="280" r="15" fill="#4CAF50" opacity="0.8" />
        </>
      );
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shot Map</h2>
          <p className="text-muted-foreground">
            Visualize shot locations and outcomes from {performanceSummary.matches} matches
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs defaultValue="all" className="w-full max-w-md" value={shotFilter} onValueChange={setShotFilter}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All Shots</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="saves">Saves</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-3">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Entire Season</SelectItem>
                <SelectItem value="last10">Last 10 Matches</SelectItem>
                <SelectItem value="last5">Last 5 Matches</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Shot Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shot Types</SelectItem>
                <SelectItem value="open">Open Play</SelectItem>
                <SelectItem value="set">Set Pieces</SelectItem>
                <SelectItem value="penalty">Penalties</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="p-0">
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-gradient-to-b from-muted/30 to-muted">
              <svg
                className="h-full w-full"
                viewBox="0 0 1000 650"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Goal frame */}
                <rect x="350" y="50" width="300" height="100" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="4" />
                
                {/* Goal area */}
                <rect x="250" y="50" width="500" height="200" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="2" />
                
                {/* Penalty area */}
                <rect x="150" y="50" width="700" height="350" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="2" />
                
                {/* Center circle */}
                <circle cx="500" cy="400" r="100" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="2" />
                
                {/* Penalty spot */}
                <circle cx="500" cy="275" r="5" fill={theme === "dark" ? "#ffffff" : "#000000"} />
                
                {/* Shot markers - dynamically rendered based on filter */}
                {getShotMarkers()}
              </svg>
            </div>
          </div>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Shot Zones</CardTitle>
              <CardDescription>Goals conceded by zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(shotStats).map(([zone, stats]) => (
                  <div key={zone} className="flex items-center justify-between">
                    <span>{zone}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-muted-foreground">{stats.goals}</span>
                      <div className="h-2 w-24 rounded-full bg-slate-100">
                        <div 
                          className="h-full rounded-full bg-keeper-red"
                          style={{ 
                            width: `${Math.min(100, (stats.goals / performanceSummary.totalGoalsConceded) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shot Statistics</CardTitle>
              <CardDescription>Key shot metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Total Shots Faced</span>
                    <span className="text-sm font-medium">{performanceSummary.totalSaves + performanceSummary.totalGoalsConceded}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full w-full rounded-full bg-slate-400"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Saves Made</span>
                    <span className="text-sm font-medium">{performanceSummary.totalSaves}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div 
                      className="h-full rounded-full bg-keeper-green"
                      style={{ 
                        width: `${performanceSummary.savePercentage}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Goals Conceded</span>
                    <span className="text-sm font-medium">{performanceSummary.totalGoalsConceded}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div 
                      className="h-full rounded-full bg-keeper-red"
                      style={{ 
                        width: `${100 - performanceSummary.savePercentage}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Expected Goals (xG)</span>
                    <span className="text-sm font-medium">
                      {(performanceSummary.totalGoalsConceded * 1.25).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div 
                      className="h-full rounded-full bg-blue-500"
                      style={{ 
                        width: `${Math.min(100, ((performanceSummary.totalGoalsConceded * 1.25) / (performanceSummary.totalSaves + performanceSummary.totalGoalsConceded)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shot Types</CardTitle>
              <CardDescription>Breakdown by shot type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Open Play</span>
                  <span className="text-muted-foreground">{shotTypes.openPlay} ({Math.round((shotTypes.openPlay / (performanceSummary.totalSaves + performanceSummary.totalGoalsConceded)) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Set Pieces</span>
                  <span className="text-muted-foreground">{shotTypes.setPieces} ({Math.round((shotTypes.setPieces / (performanceSummary.totalSaves + performanceSummary.totalGoalsConceded)) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Corner Kicks</span>
                  <span className="text-muted-foreground">{shotTypes.cornerKicks} ({Math.round((shotTypes.cornerKicks / (performanceSummary.totalSaves + performanceSummary.totalGoalsConceded)) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Penalties</span>
                  <span className="text-muted-foreground">{shotTypes.penalties} ({Math.round((shotTypes.penalties / (performanceSummary.totalSaves + performanceSummary.totalGoalsConceded)) * 100)}%)</span>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Save % by Type</span>
                    <span>Rate</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Open Play</span>
                      <span className="text-keeper-green">{savePercentageByType.openPlay}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Set Pieces</span>
                      <span className="text-keeper-green">{savePercentageByType.setPieces}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Corner Kicks</span>
                      <span className="text-keeper-green">{savePercentageByType.cornerKicks}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Penalties</span>
                      <span className="text-keeper-green">{savePercentageByType.penalties}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ShotMap;
