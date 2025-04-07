
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useDataStore } from "@/lib/data-store";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamManagement } from "@/components/TeamManagement";
import { TeamScoreboard } from "@/components/TeamScoreboard";
import { Trophy, Calendar, Flag } from "lucide-react"; 

const League = () => {
  const { userSettings, matchLogs, recalculatePerformanceSummary } = useDataStore();
  const [activeTab, setActiveTab] = useState<"overview" | "teams" | "fixtures" | "settings">("overview");
  
  // Ensure league data is always in sync with match logs
  useEffect(() => {
    recalculatePerformanceSummary();
  }, [matchLogs, recalculatePerformanceSummary]);

  const getTeamStats = () => {
    const teamMatches = matchLogs.filter(match => 
      match.homeTeam === userSettings.clubTeam || match.awayTeam === userSettings.clubTeam
    );
    
    const wins = teamMatches.filter(match => {
      const isHomeGame = match.homeTeam === userSettings.clubTeam;
      return isHomeGame ? match.homeScore > match.awayScore : match.awayScore > match.homeScore;
    }).length;
    
    const draws = teamMatches.filter(match => match.homeScore === match.awayScore).length;
    const losses = teamMatches.filter(match => {
      const isHomeGame = match.homeTeam === userSettings.clubTeam;
      return isHomeGame ? match.homeScore < match.awayScore : match.awayScore < match.homeScore;
    }).length;
    
    return { 
      played: teamMatches.length,
      wins,
      draws,
      losses,
      points: wins * 3 + draws
    };
  };
  
  const teamStats = getTeamStats();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">League Management</h2>
            <p className="text-muted-foreground">
              Manage teams and fixtures for your league
            </p>
          </div>
        </div>

        <div className="flex space-x-2 border-b pb-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="rounded-none rounded-t-lg"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "teams" ? "default" : "ghost"}
            onClick={() => setActiveTab("teams")}
            className="rounded-none rounded-t-lg"
          >
            Teams
          </Button>
          <Button
            variant={activeTab === "fixtures" ? "default" : "ghost"}
            onClick={() => setActiveTab("fixtures")}
            className="rounded-none rounded-t-lg"
          >
            Fixtures
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            onClick={() => setActiveTab("settings")}
            className="rounded-none rounded-t-lg"
          >
            Settings
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Team Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Team</p>
                      <p className="font-semibold">{userSettings.clubTeam}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Matches Played</p>
                      <p className="font-semibold">{teamStats.played}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Win-Draw-Loss</p>
                      <p className="font-semibold">{teamStats.wins}-{teamStats.draws}-{teamStats.losses}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Points</p>
                      <p className="font-semibold">{teamStats.points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Recent Matches</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {matchLogs.length > 0 ? (
                    <div className="space-y-2">
                      {matchLogs
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 3)
                        .map((match, idx) => {
                          const isHomeGame = match.homeTeam === userSettings.clubTeam;
                          const ourScore = isHomeGame ? match.homeScore : match.awayScore;
                          const theirScore = isHomeGame ? match.awayScore : match.homeScore;
                          const opponent = isHomeGame ? match.awayTeam : match.homeTeam;
                          const result = ourScore > theirScore ? "W" : ourScore < theirScore ? "L" : "D";
                          const resultClass = 
                            result === "W" ? "text-keeper-green" : 
                            result === "L" ? "text-keeper-red" : 
                            "text-muted-foreground";
                          
                          return (
                            <div key={idx} className="flex justify-between items-center py-1 border-b border-dashed last:border-none">
                              <div className="text-sm">
                                <p>{new Date(match.date).toLocaleDateString()}</p>
                                <p className="text-muted-foreground">{userSettings.clubTeam} vs {opponent}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{ourScore} - {theirScore}</span>
                                <span className={`font-bold ${resultClass}`}>{result}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No matches recorded yet</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">League Position</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {matchLogs.length > 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-5xl font-bold text-primary mb-4">
                        #3
                      </div>
                      <div className="text-sm text-muted-foreground text-center">
                        <p className="font-medium">{userSettings.clubTeam}</p>
                        <p>{teamStats.points} points</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">Add matches to see league position</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <TeamScoreboard />
          </div>
        )}
        
        {activeTab === "teams" && (
          <TeamManagement />
        )}
        
        {activeTab === "fixtures" && (
          <Card>
            <CardHeader>
              <CardTitle>League Fixtures</CardTitle>
              <CardDescription>Coming soon: Manage league fixture schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This feature is under development.</p>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>League Settings</CardTitle>
              <CardDescription>Coming soon: Configure league settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This feature is under development.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default League;
