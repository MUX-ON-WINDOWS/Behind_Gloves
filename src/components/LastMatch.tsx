
import { useState } from "react";
import { lastMatch as initialLastMatch } from "@/lib/chart-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LastMatch = () => {
  const [lastMatch, setLastMatch] = useState(initialLastMatch);
  const { homeTeam, homeScore, awayTeam, awayScore, date, venue, cleanSheet, saves } = lastMatch;
  const matchResult = homeScore > awayScore ? "win" : homeScore < awayScore ? "loss" : "draw";
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHomeScore, setNewHomeScore] = useState(homeScore);
  const [newAwayScore, setNewAwayScore] = useState(awayScore);
  const [newSaves, setNewSaves] = useState(saves);
  const { toast } = useToast();
  
  const updateMatchResult = () => {
    const updatedCleanSheet = newHomeScore > 0 ? false : true;
    
    setLastMatch({
      ...lastMatch,
      homeScore: newHomeScore,
      awayScore: newAwayScore,
      saves: newSaves,
      cleanSheet: updatedCleanSheet
    });
    
    toast({
      title: "Match Result Updated",
      description: "The last match result has been updated successfully."
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Last Match Result</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setNewHomeScore(homeScore);
              setNewAwayScore(awayScore);
              setNewSaves(saves);
              setIsDialogOpen(true);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit match result</span>
          </Button>
        </CardTitle>
        <CardDescription>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {venue}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="text-center flex-1">
              <p className="text-lg font-semibold">{homeTeam}</p>
              <p className={`text-4xl font-bold ${matchResult === "win" ? "text-keeper-green" : matchResult === "loss" ? "text-keeper-red" : ""}`}>{homeScore}</p>
            </div>
            <div className="text-muted-foreground mx-4">vs</div>
            <div className="text-center flex-1">
              <p className="text-lg font-semibold">{awayTeam}</p>
              <p className={`text-4xl font-bold ${matchResult === "loss" ? "text-keeper-green" : matchResult === "win" ? "text-keeper-red" : ""}`}>{awayScore}</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 w-full border-t pt-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-keeper-green" />
              <div>
                <p className="text-sm text-muted-foreground">Clean Sheet</p>
                <p className="font-semibold">{cleanSheet ? "Yes" : "No"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Save size={18} className="text-keeper-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Saves</p>
                <p className="font-semibold">{saves}</p>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Match Result</DialogTitle>
              <DialogDescription>
                Edit the score and statistics for the latest match
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="homeScore" className="text-sm font-medium">{homeTeam} Score</label>
                  <Input
                    id="homeScore"
                    type="number"
                    min="0"
                    value={newHomeScore}
                    onChange={(e) => setNewHomeScore(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="awayScore" className="text-sm font-medium">{awayTeam} Score</label>
                  <Input
                    id="awayScore"
                    type="number"
                    min="0"
                    value={newAwayScore}
                    onChange={(e) => setNewAwayScore(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="saves" className="text-sm font-medium">Saves Made</label>
                <Input
                  id="saves"
                  type="number"
                  min="0"
                  value={newSaves}
                  onChange={(e) => setNewSaves(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={updateMatchResult}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
