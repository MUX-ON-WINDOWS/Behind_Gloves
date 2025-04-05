import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDataStore } from "@/lib/data-store";
import { MatchLog } from "@/types/store-types";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const matchFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  homeScore: z.coerce.number().int().min(0, "Score cannot be negative"),
  awayScore: z.coerce.number().int().min(0, "Score cannot be negative"),
  venue: z.string().min(1, "Venue is required"),
  saves: z.coerce.number().int().min(0, "Saves cannot be negative"),
  cleanSheet: z.boolean().default(false),
  notes: z.string().optional()
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

const MatchOverview = () => {
  const { matchLogs, addMatchLog, updateMatchLog, deleteMatchLog, recalculatePerformanceSummary } = useDataStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const addForm = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      homeTeam: "FC United",
      awayTeam: "",
      homeScore: 0,
      awayScore: 0,
      venue: "United Stadium",
      saves: 0,
      cleanSheet: false,
      notes: ""
    }
  });
  
  const editForm = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      homeTeam: "FC United",
      awayTeam: "",
      homeScore: 0,
      awayScore: 0,
      venue: "United Stadium",
      saves: 0,
      cleanSheet: false,
      notes: ""
    }
  });
  
  const openAddDialog = () => {
    addForm.reset({
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
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (id: string) => {
    const match = matchLogs.find(m => m.id === id);
    if (match) {
      setSelectedMatchId(id);
      editForm.reset({
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
  
  const handleAddMatch = (data: MatchFormValues) => {
    const newMatchData: Omit<MatchLog, "id"> = {
      date: data.date,
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      homeScore: data.homeScore,
      awayScore: data.awayScore,
      venue: data.venue,
      saves: data.saves,
      cleanSheet: data.cleanSheet,
      notes: data.notes || ""
    };
    
    addMatchLog(newMatchData);
    recalculatePerformanceSummary();
    toast({
      title: "Match Added",
      description: "New match has been added to your records."
    });
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateMatch = (data: MatchFormValues) => {
    if (selectedMatchId) {
      const updatedMatchData: Partial<MatchLog> = {
        date: data.date,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        venue: data.venue,
        saves: data.saves,
        cleanSheet: data.cleanSheet,
        notes: data.notes || ""
      };
      
      updateMatchLog(selectedMatchId, updatedMatchData);
      recalculatePerformanceSummary();
      toast({
        title: "Match Updated",
        description: "Match details have been successfully updated."
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
        description: "Match has been removed from your records."
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  const sortedMatches = [...matchLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const selectedMatch = selectedMatchId ? matchLogs.find(m => m.id === selectedMatchId) : null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Match Overview</h2>
            <p className="text-muted-foreground">
              View and manage all your match records
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-1">
            <Plus size={16} />
            Add Match
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableCaption>A comprehensive list of all match records</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Home Team</TableHead>
                <TableHead>Away Team</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center">
                    <Save size={16} className="mr-1 text-keeper-blue" />
                    <span>Saves</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">Clean Sheet</TableHead>
                <TableHead>Venue</TableHead>
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
                        {new Date(match.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className={isHomeGame ? "font-medium" : ""}>
                        {match.homeTeam}
                      </TableCell>
                      <TableCell className={!isHomeGame ? "font-medium" : ""}>
                        {match.awayTeam}
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
                      <TableCell>{match.venue}</TableCell>
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
                  <TableCell colSpan={8} className="text-center py-8">
                    No matches recorded yet. Add your first match to start tracking.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Match</DialogTitle>
            </DialogHeader>
            
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddMatch)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="homeTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Team</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="awayTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Team</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="homeScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Score</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="awayScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Score</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="saves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saves Made</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="cleanSheet"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Clean Sheet</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Match Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about the match performance..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="ghost" type="button" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Match</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Match</DialogTitle>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateMatch)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="homeTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Team</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="awayTeam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Team</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="homeScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Score</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="awayScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Away Score</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="saves"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saves Made</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="cleanSheet"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Clean Sheet</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Match Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about the match performance..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="ghost" type="button" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Match</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Match</DialogTitle>
            </DialogHeader>
            
            {selectedMatch && (
              <div className="py-4">
                <p className="font-medium">
                  {selectedMatch.homeTeam} {selectedMatch.homeScore} - {selectedMatch.awayScore} {selectedMatch.awayTeam}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedMatch.date).toLocaleDateString()} at {selectedMatch.venue}
                </p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this match record? This action cannot be undone.
            </p>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteMatch}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MatchOverview;
