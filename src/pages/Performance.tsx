
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/hooks/useTheme";
import { useDataStore } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Performance = () => {
  const { theme } = useTheme();
  const { performanceSummary, savesMadeData } = useDataStore();
  
  const textColor = theme === "dark" ? "#f8fafc" : "#0f172a";
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  // Sample performance trends data
  const performanceTrends = [
    { month: "Jan", savePercentage: 76, leagueAverage: 71 },
    { month: "Feb", savePercentage: 78, leagueAverage: 72 },
    { month: "Mar", savePercentage: 81, leagueAverage: 73 },
    { month: "Apr", savePercentage: 79, leagueAverage: 72 },
    { month: "May", savePercentage: 82, leagueAverage: 74 },
    { month: "Jun", savePercentage: 85, leagueAverage: 75 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Performance Analysis</h2>
            <p className="text-muted-foreground">
              Detailed trends and metrics for season performance
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
                  <YAxis stroke={textColor} domain={[60, 100]} />
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
              <CardDescription>Last 10 matches</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-5xl font-bold text-keeper-green">{performanceSummary.savePercentage}%</p>
              <p className="text-muted-foreground mt-2">+4% from previous 10 matches</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Positioning Score</CardTitle>
              <CardDescription>Coach assessment</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-5xl font-bold">8.2/10</p>
              <p className="text-muted-foreground mt-2">+0.5 from last assessment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution Accuracy</CardTitle>
              <CardDescription>Successful passes</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-5xl font-bold text-keeper-blue">76%</p>
              <p className="text-muted-foreground mt-2">+2% from season average</p>
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
                  <li>Excellent reflexes on close-range shots (92% save rate)</li>
                  <li>Strong command of the penalty area during set pieces</li>
                  <li>Consistent performances in high-pressure matches</li>
                  <li>Above-average distribution to initiate counterattacks</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Positioning for long-range shots from right side (68% save rate)</li>
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
