
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataStore } from "@/lib/data-store";

export const TeamScoreboard = () => {
  const { teamScoreboard, setTeamScoreboard, matchLogs, userSettings, recalculatePerformanceSummary } = useDataStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [goalsFor, setGoalsFor] = useState(0);
  const [goalsAgainst, setGoalsAgainst] = useState(0);
  const { toast } = useToast();

  // Force recalculation when component mounts to ensure league data is in sync with match logs
  useEffect(() => {
    recalculatePerformanceSummary();
  }, [recalculatePerformanceSummary]);

  const openScoreDialog = (teamIndex: number) => {
    setSelectedTeam(teamIndex);
    setGoalsFor(0);
    setGoalsAgainst(0);
    setIsDialogOpen(true);
  };

  const updateScore = () => {
    if (selectedTeam === null) return;
    
    setTeamScoreboard(currentTeams => {
      const updatedTeams = [...currentTeams];
      const team = {...updatedTeams[selectedTeam]};
      
      // Update goals
      team.goalsFor += goalsFor;
      team.goalsAgainst += goalsAgainst;
      
      // Update wins, losses, draws based on this match result
      if (goalsFor > goalsAgainst) {
        team.won += 1;
        team.points += 3;
      } else if (goalsFor < goalsAgainst) {
        team.lost += 1;
      } else if (goalsFor === goalsAgainst && (goalsFor > 0 || goalsAgainst > 0)) {
        team.drawn += 1;
        team.points += 1;
      }
      
      // Update played matches
      if (goalsFor > 0 || goalsAgainst > 0) {
        team.played += 1;
      }
      
      updatedTeams[selectedTeam] = team;
      
      // Re-sort teams by points
      return updatedTeams.sort((a, b) => b.points - a.points)
        .map((team, index) => ({...team, position: index + 1}));
    });
    
    toast({
      title: "Score Updated",
      description: `Updated scores for ${teamScoreboard[selectedTeam].team}`,
    });
    
    setIsDialogOpen(false);
  };

  // Get team stats directly from match logs for the current user's team
  const yourTeamLogs = matchLogs.filter(match => 
    match.homeTeam === userSettings.clubTeam || match.awayTeam === userSettings.clubTeam
  );

  const yourTeamWins = yourTeamLogs.filter(match => {
    const isHomeGame = match.homeTeam === userSettings.clubTeam;
    return isHomeGame ? match.homeScore > match.awayScore : match.awayScore > match.homeScore;
  }).length;

  const yourTeamDraws = yourTeamLogs.filter(match => {
    return match.homeScore === match.awayScore;
  }).length;

  const yourTeamLosses = yourTeamLogs.filter(match => {
    const isHomeGame = match.homeTeam === userSettings.clubTeam;
    return isHomeGame ? match.homeScore < match.awayScore : match.awayScore < match.homeScore;
  }).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>League Table</CardTitle>
        <CardDescription>Current standings in the league</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Pos</TableHead>
                <TableHead className="text-left">Team</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">GF</TableHead>
                <TableHead className="text-center">GA</TableHead>
                <TableHead className="text-center">Pts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamScoreboard.map((team, index) => {
                // For the user's team, ensure data is synced with match logs
                const isUserTeam = team.team === userSettings.clubTeam;
                
                // Display either database values or dynamically calculated ones for user team
                const displayData = {
                  ...team,
                  played: isUserTeam ? yourTeamLogs.length : team.played,
                  won: isUserTeam ? yourTeamWins : team.won,
                  drawn: isUserTeam ? yourTeamDraws : team.drawn,
                  lost: isUserTeam ? yourTeamLosses : team.lost
                };
                
                return (
                  <TableRow key={team.team} className={team.team === userSettings.clubTeam ? "bg-primary/10" : ""}>
                    <TableCell className="text-center font-medium">{team.position}</TableCell>
                    <TableCell className="font-medium">{team.team}</TableCell>
                    <TableCell className="text-center">{displayData.played}</TableCell>
                    <TableCell className="text-center">{displayData.won}</TableCell>
                    <TableCell className="text-center">{displayData.drawn}</TableCell>
                    <TableCell className="text-center">{displayData.lost}</TableCell>
                    <TableCell className="text-center">{team.goalsFor}</TableCell>
                    <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                    <TableCell className="text-center font-bold">{team.points}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openScoreDialog(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add score</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Match Result</DialogTitle>
              <DialogDescription>
                {selectedTeam !== null ? `Update scores for ${teamScoreboard[selectedTeam].team}` : 'Update team scores'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="goalsFor" className="text-sm font-medium">Goals Scored</label>
                  <Input
                    id="goalsFor"
                    type="number"
                    min="0"
                    value={goalsFor}
                    onChange={(e) => setGoalsFor(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="goalsAgainst" className="text-sm font-medium">Goals Conceded</label>
                  <Input
                    id="goalsAgainst"
                    type="number"
                    min="0"
                    value={goalsAgainst}
                    onChange={(e) => setGoalsAgainst(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={updateScore}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
