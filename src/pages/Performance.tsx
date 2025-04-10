
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/hooks/useTheme";
import { useDataStore } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useMemo } from "react";

const Performance = () => {
  const { theme } = useTheme();
  const { performanceSummary, savesMadeData, matchLogs, userSettings } = useDataStore();
  
  const textColor = theme === "dark" ? "#f8fafc" : "#0f172a";
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  // Generate performance trends from match logs
  const performanceTrends = useMemo(() => {
    // Get the last 6 months of data
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate);
      month.setMonth(currentDate.getMonth() - i);
      months.push({
        date: month,
        month: month.toLocaleString('default', { month: 'short' }),
        savePercentage: 0,
        saves: 0,
        goalsAgainst: 0,
        matches: 0
      });
    }
    
    // Calculate monthly stats from match logs
    matchLogs.forEach(match => {
      const matchDate = new Date(match.date);
      const monthIndex = months.findIndex(m => 
        m.date.getMonth() === matchDate.getMonth() && 
        m.date.getFullYear() === matchDate.getFullYear()
      );
      
      if (monthIndex !== -1) {
        const isHomeGame = match.homeTeam === userSettings.clubTeam;
        const goalsAgainst = isHomeGame ? match.awayScore : match.homeScore;
        
        months[monthIndex].saves += match.saves;
        months[monthIndex].goalsAgainst += goalsAgainst;
        months[monthIndex].matches += 1;
      }
    });
    
    // Calculate save percentages
    return months.map(month => {
      const totalShots = month.saves + month.goalsAgainst;
      const savePercentage = totalShots > 0 
        ? Math.round((month.saves / totalShots) * 100) 
        : 0;
        
      // League average is simulated (about 5-10% lower)
      const leagueAverage = Math.max(60, savePercentage - Math.floor(Math.random() * 10) - 5);
      
      return {
        month: month.month,
        savePercentage,
        leagueAverage,
        matches: month.matches
      };
    });
  }, [matchLogs, userSettings.clubTeam]);
  
  // Calculate positioning and distribution scores based on match performance
  const positioningScore = useMemo(() => {
    if (matchLogs.length === 0) return 0;
    
    // Calculate based on clean sheets and saves
    const cleanSheetRatio = performanceSummary.cleanSheets / performanceSummary.matches;
    const savesPerMatch = performanceSummary.totalSaves / performanceSummary.matches;
    
    // Formula: weight clean sheets heavily and consider save rate
    const baseScore = (cleanSheetRatio * 6) + (performanceSummary.savePercentage / 20);
    return parseFloat(Math.min(10, baseScore).toFixed(1));
  }, [performanceSummary, matchLogs]);
  
  const distributionAccuracy = useMemo(() => {
    // Simulate distribution accuracy based on performance
    return 65 + Math.floor((performanceSummary.savePercentage - 70) / 2);
  }, [performanceSummary]);
  
  // Calculate trend percentages
  const savePercentageTrend = useMemo(() => {
    if (performanceTrends.length < 2) return 0;
    const current = performanceTrends[performanceTrends.length - 1].savePercentage;
    const previous = performanceTrends[performanceTrends.length - 2].savePercentage;
    return current - previous;
  }, [performanceTrends]);

  const positioningTrend = 0.5; // Simulated trend
  const distributionTrend = 2; // Simulated trend

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Performance Analysis</h2>
            <p className="text-muted-foreground">
              Detailed trends and metrics for {userSettings.clubTeam}
            </p>
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Save Percentage Trend</CardTitle>
            <CardDescription>Compared to league average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={textColor} />
                  <YAxis stroke={textColor} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                      color: textColor,
                      border: "none",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="savePercentage" 
                    stroke="#4CAF50" 
                    strokeWidth={2} 
                    name="Your Save %" 
                    dot={{ strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leagueAverage" 
                    stroke="#64748b" 
                    strokeDasharray="5 5" 
                    name="League Average" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Save Success Rate</CardTitle>
              <CardDescription>Last {performanceSummary.matches} matches</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-5xl font-bold text-keeper-green">{performanceSummary.savePercentage}%</p>
              <p className="text-muted-foreground mt-2">
                {savePercentageTrend > 0 ? "+" : ""}{savePercentageTrend}% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Positioning Score</CardTitle>
              <CardDescription>Based on match performance</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-5xl font-bold">{positioningScore}/10</p>
              <p className="text-muted-foreground mt-2">
                +{positioningTrend} from previous assessment
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution Accuracy</CardTitle>
              <CardDescription>Successful passes</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-5xl font-bold text-keeper-blue">{distributionAccuracy}%</p>
              <p className="text-muted-foreground mt-2">
                +{distributionTrend}% from season average
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key strengths and areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Excellent reflexes on close-range shots ({Math.round(performanceSummary.savePercentage)}% save rate)</li>
                  <li>Strong command of the penalty area during set pieces</li>
                  <li>{performanceSummary.cleanSheets} clean sheets in {performanceSummary.matches} matches</li>
                  <li>Above-average distribution to initiate counterattacks</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Positioning for long-range shots from right side</li>
                  <li>Communication with defensive line during transitions</li>
                  <li>Decision making on when to come off the line</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Performance;
