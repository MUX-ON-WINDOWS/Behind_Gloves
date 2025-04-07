
import { Layout } from "@/components/Layout";
import { SavesChart } from "@/components/SavesChart";
import { GoalsConcededChart } from "@/components/GoalsConcededChart";
import { PerformanceSummary } from "@/components/PerformanceSummary";
import { LastMatch } from "@/components/LastMatch";
import { UpcomingMatch } from "@/components/UpcomingMatch";
import { TeamScoreboard } from "@/components/TeamScoreboard";
import { MatchLogComponent } from "@/components/MatchLog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, BarChart, ClipboardCheck } from "lucide-react";
import { useDataStore } from "@/lib/data-store";

const Index = () => {
  const navigate = useNavigate();
  const { performanceSummary, userSettings } = useDataStore();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Goalkeeper Dashboard</h2>
            <p className="text-muted-foreground">
              Analyze your goalkeeper's performance with detailed metrics and visualizations.
            </p>
          </div>
          <Button onClick={() => navigate("/match-overview")} className="w-full sm:w-auto gap-2">
            <Calendar size={16} />
            View All Matches
          </Button>
        </div>
        
        <PerformanceSummary />

        <div className="grid gap-6 md:grid-cols-2">
          <LastMatch />
          <UpcomingMatch />
        </div>

        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="scoreboard">Scoreboard</TabsTrigger>
            <TabsTrigger value="matchlog">Match Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts">
            <div className="grid gap-6 md:grid-cols-2">
              <SavesChart />
              <GoalsConcededChart />
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>
                    Detailed breakdown of goalkeeper performance
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate("/performance")}>
                  <BarChart size={16} className="mr-2" />
                  Full Analysis
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Strengths</h3>
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>Excellent at saving shots from the top left corner</li>
                      <li>Strong performance on one-on-one situations</li>
                      <li>Consistent save percentage above league average</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Areas for Improvement</h3>
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>Positioning on set pieces needs work</li>
                      <li>Tendency to concede from bottom right corner shots</li>
                      <li>Distribution accuracy could be improved</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scoreboard">
            <TeamScoreboard />
          </TabsContent>
          
          <TabsContent value="matchlog">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => navigate("/match-overview")} size="sm">
                  <Calendar size={16} className="mr-2" />
                  View All Matches
                </Button>
              </div>
              <MatchLogComponent />
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Team: {userSettings.clubTeam} — Last {performanceSummary.matches} matches</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/match-overview")}>
              <ClipboardCheck size={16} className="mr-2" />
              Match History
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <p className="text-4xl font-bold">{performanceSummary.savePercentage}%</p>
              <p className="text-muted-foreground mt-2">Save success rate</p>
              
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-keeper-green">{performanceSummary.totalSaves}</p>
                  <p className="text-muted-foreground text-sm">Saves Made</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-keeper-red">{performanceSummary.totalGoalsConceded}</p>
                  <p className="text-muted-foreground text-sm">Goals Conceded</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-keeper-blue">{performanceSummary.cleanSheets}</p>
                  <p className="text-muted-foreground text-sm">Clean Sheets</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
