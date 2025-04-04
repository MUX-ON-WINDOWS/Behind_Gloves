
import { useState } from "react";
import { useDataStore, MatchLog } from "@/lib/data-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, ClipboardCheck, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MatchLogComponent = () => {
  const { matchLogs, addMatchLog, updateMatchLog, deleteMatchLog, recalculatePerformanceSummary } = useDataStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // State for the currently selected match (for editing or deleting)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Omit<MatchLog, "id">>({
    date: new Date().toISOString().split('T')[0],
    homeTeam: "FC United",
    awayTeam: "",
    homeScore: 0,
    awayScore: 0,
    venue: "United Stadium",
    saves: 0,
    cleanSheet: false,
    notes: ""
  });
  
  const selectedMatch = selectedMatchId ? matchLogs.find(m => m.id === selectedMatchId) : null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "homeScore" || name === "awayScore" || name === "saves") {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Auto-update clean sheet based on goals conceded
    if ((name === "homeScore" && formData.awayTeam === "FC United") || 
        (name === "awayScore" && formData.homeTeam === "FC United")) {
      const goalsAgainstUnited = formData.homeTeam === "FC United" 
        ? parseInt(value) || 0 
        : formData.awayScore;
      
      setFormData(prev => ({
        ...prev,
        cleanSheet: goalsAgainstUnited === 0
      }));
    }
  };
  
  const openAddDialog = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      homeTeam: "FC United",
      awayTeam: "",
      homeScore: 0,
      awayScore: 0,
      venue: "United Stadium",
      saves: 0,
      cleanSheet: true,
      notes: ""
    });
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (id: string) => {
    const match = matchLogs.find(m => m.id === id);
    if (match) {
      setSelectedMatchId(id);
      setFormData({
        date: match.date,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        venue: match.venue,
        saves: match.saves,
        cleanSheet: match.cleanSheet,
        notes: match.notes || ""
      });
      setIsEditDialogOpen(true);
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setSelectedMatchId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddMatch = () => {
    addMatchLog(formData);
    recalculatePerformanceSummary();
    toast({
      title: "Match Added",
      description: "New match has been added to your log."
    });
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateMatch = () => {
    if (selectedMatchId) {
      updateMatchLog(selectedMatchId, formData);
      recalculatePerformanceSummary();
      toast({
        title: "Match Updated",
        description: "Match details have been updated."
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteMatch = () => {
    if (selectedMatchId) {
      deleteMatchLog(selectedMatchId);
      recalculatePerformanceSummary();
      toast({
        title: "Match Deleted",
        description: "Match has been removed from your log."
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Sort matches by date (most recent first)
  const sortedMatches = [...matchLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Match Log</CardTitle>
          <CardDescription>Record of all matches played</CardDescription>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Match
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Match</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center">
                    <Save size={16} className="mr-1 text-keeper-blue" />
                    <span>Saves</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center">
                    <ClipboardCheck size={16} className="mr-1 text-keeper-green" />
                    <span>Clean Sheet</span>
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMatches.length > 0 ? (
                sortedMatches.map((match) => {
                  const isHomeGame = match.homeTeam === "FC United";
                  const ourScore = isHomeGame ? match.homeScore : match.awayScore;
                  const theirScore = isHomeGame ? match.awayScore : match.homeScore;
                  const matchResult = ourScore > theirScore ? "win" : ourScore < theirScore ? "loss" : "draw";
                  
                  return (
                    <TableRow key={match.id}>
                      <TableCell>
                        {new Date(match.date).toLocaleDateString("en-US", { 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className={isHomeGame ? "font-medium" : ""}>
                            {match.homeTeam}
                          </span>
                          {" vs "}
                          <span className={!isHomeGame ? "font-medium" : ""}>
                            {match.awayTeam}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {match.venue}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={
                          matchResult === "win" 
                            ? "text-keeper-green font-medium" 
                            : matchResult === "loss" 
                              ? "text-keeper-red font-medium" 
                              : "font-medium"
                        }>
                          {match.homeScore} - {match.awayScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{match.saves}</TableCell>
                      <TableCell className="text-center">
                        {match.cleanSheet ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(match.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit match</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDeleteDialog(match.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete match</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No matches recorded yet. Add your first match to start tracking.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Match Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Match</DialogTitle>
              <DialogDescription>Record a new match in your log</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="venue" className="text-sm font-medium">Venue</label>
                  <Input
                    id="venue"
                    name="venue" 
                    value={formData.venue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="homeTeam" className="text-sm font-medium">Home Team</label>
                  <Input
                    id="homeTeam"
                    name="homeTeam"
                    value={formData.homeTeam}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="awayTeam" className="text-sm font-medium">Away Team</label>
                  <Input
                    id="awayTeam"
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="homeScore" className="text-sm font-medium">Home Score</label>
                  <Input
                    id="homeScore"
                    name="homeScore"
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="awayScore" className="text-sm font-medium">Away Score</label>
                  <Input
                    id="awayScore"
                    name="awayScore"
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="saves" className="text-sm font-medium">Saves Made</label>
                  <Input
                    id="saves"
                    name="saves"
                    type="number"
                    min="0"
                    value={formData.saves}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    id="cleanSheet"
                    name="cleanSheet"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={formData.cleanSheet}
                    onChange={(e) => setFormData(prev => ({ ...prev, cleanSheet: e.target.checked }))}
                  />
                  <label htmlFor="cleanSheet" className="ml-2 text-sm font-medium">
                    Clean Sheet
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Match Notes</label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any notes about the match performance..."
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMatch}>Add Match</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Match Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Match</DialogTitle>
              <DialogDescription>Update match details</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-date" className="text-sm font-medium">Date</label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-venue" className="text-sm font-medium">Venue</label>
                  <Input
                    id="edit-venue"
                    name="venue" 
                    value={formData.venue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-homeTeam" className="text-sm font-medium">Home Team</label>
                  <Input
                    id="edit-homeTeam"
                    name="homeTeam"
                    value={formData.homeTeam}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-awayTeam" className="text-sm font-medium">Away Team</label>
                  <Input
                    id="edit-awayTeam"
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-homeScore" className="text-sm font-medium">Home Score</label>
                  <Input
                    id="edit-homeScore"
                    name="homeScore"
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-awayScore" className="text-sm font-medium">Away Score</label>
                  <Input
                    id="edit-awayScore"
                    name="awayScore"
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-saves" className="text-sm font-medium">Saves Made</label>
                  <Input
                    id="edit-saves"
                    name="saves"
                    type="number"
                    min="0"
                    value={formData.saves}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    id="edit-cleanSheet"
                    name="cleanSheet"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={formData.cleanSheet}
                    onChange={(e) => setFormData(prev => ({ ...prev, cleanSheet: e.target.checked }))}
                  />
                  <label htmlFor="edit-cleanSheet" className="ml-2 text-sm font-medium">
                    Clean Sheet
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-notes" className="text-sm font-medium">Match Notes</label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  placeholder="Add any notes about the match performance..."
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateMatch}>Update Match</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Match</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this match? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedMatch && (
              <div className="py-4">
                <p className="font-medium">
                  {selectedMatch.homeTeam} {selectedMatch.homeScore} - {selectedMatch.awayScore} {selectedMatch.awayTeam}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedMatch.date).toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })} at {selectedMatch.venue}
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteMatch}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
