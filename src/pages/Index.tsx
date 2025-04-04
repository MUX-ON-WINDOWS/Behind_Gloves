
import { Layout } from "@/components/Layout";
import { SavesChart } from "@/components/SavesChart";
import { GoalsConcededChart } from "@/components/GoalsConcededChart";
import { PerformanceSummary } from "@/components/PerformanceSummary";
import { LastMatch } from "@/components/LastMatch";
import { UpcomingMatch } from "@/components/UpcomingMatch";
import { TeamScoreboard } from "@/components/TeamScoreboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Goalkeeper Dashboard</h2>
          <p className="text-muted-foreground">
            Analyze your goalkeeper's performance with detailed metrics and visualizations.
          </p>
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
          </TabsList>
          
          <TabsContent value="charts">
            <div className="grid gap-6 md:grid-cols-2">
              <SavesChart />
              <GoalsConcededChart />
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of goalkeeper performance
                </CardDescription>
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
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Last 7 matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">
              <p className="text-4xl font-bold">85.4%</p>
              <p className="text-muted-foreground mt-2">Save success rate</p>
              
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-keeper-green">35</p>
                  <p className="text-muted-foreground text-sm">Saves Made</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-keeper-red">6</p>
                  <p className="text-muted-foreground text-sm">Goals Conceded</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-keeper-blue">3</p>
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
