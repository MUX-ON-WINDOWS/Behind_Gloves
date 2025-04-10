
import { useState } from "react";
import { useDataStore } from "@/lib/data-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { TeamData } from "@/types/store-types";
import { Users, List, ListCheck, Settings } from "lucide-react";

interface TeamFormData {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export const TeamManagement = () => {
  const { teamScoreboard, setTeamScoreboard } = useDataStore();
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const { toast } = useToast();

  const addForm = useForm<TeamFormData>({
    defaultValues: {
      team: "",
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    }
  });

  const editForm = useForm<TeamFormData>({
    defaultValues: {
      team: "",
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    }
  });

  const openEditDialog = (team: TeamData) => {
    setSelectedTeam(team);
    editForm.reset({
      team: team.team,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst
    });
    setIsEditTeamOpen(true);
  };

  const addTeam = (data: TeamFormData) => {
    const newTeam: TeamData = {
      position: teamScoreboard.length + 1,
      team: data.team,
      played: data.played,
      won: data.won,
      drawn: data.drawn,
      lost: data.lost,
      goalsFor: data.goalsFor,
      goalsAgainst: data.goalsAgainst,
      points: (data.won * 3) + data.drawn
    };

    setTeamScoreboard([...teamScoreboard, newTeam].sort((a, b) => b.points - a.points)
      .map((team, index) => ({...team, position: index + 1})));
    
    toast({
      title: "Team Added",
      description: `${data.team} has been added to the league.`
    });
    
    setIsAddTeamOpen(false);
    addForm.reset();
  };

  const updateTeam = (data: TeamFormData) => {
    if (!selectedTeam) return;

    const updated = teamScoreboard.map(team => 
      team.team === selectedTeam.team
        ? { 
            ...team, 
            ...data,
            points: (data.won * 3) + data.drawn
          }
        : team
    );

    setTeamScoreboard(updated.sort((a, b) => b.points - a.points)
      .map((team, index) => ({...team, position: index + 1})));
    
    toast({
      title: "Team Updated",
      description: `${data.team} has been updated.`
    });
    
    setIsEditTeamOpen(false);
  };

  const deleteTeam = () => {
    if (!selectedTeam) return;
    
    setTeamScoreboard(teamScoreboard
      .filter(team => team.team !== selectedTeam.team)
      .sort((a, b) => b.points - a.points)
      .map((team, index) => ({...team, position: index + 1}))
    );
    
    toast({
      title: "Team Removed",
      description: `${selectedTeam.team} has been removed from the league.`
    });
    
    setIsEditTeamOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Teams</CardTitle>
            <CardDescription>Manage teams in your league</CardDescription>
          </div>
          <Button onClick={() => setIsAddTeamOpen(true)}>Add Team</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Teams</CardTitle>
                    <CardDescription>{teamScoreboard.length}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <ListCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Matches</CardTitle>
                    <CardDescription>
                      {teamScoreboard.reduce((total, team) => total + team.played, 0) / 2}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <List className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Games Played</CardTitle>
                    <CardDescription>
                      {teamScoreboard.reduce((total, team) => total + team.played, 0)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
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
                {teamScoreboard.map((team) => (
                  <TableRow key={team.team}>
                    <TableCell className="text-center font-medium">{team.position}</TableCell>
                    <TableCell className="font-medium">{team.team}</TableCell>
                    <TableCell className="text-center">{team.played}</TableCell>
                    <TableCell className="text-center">{team.won}</TableCell>
                    <TableCell className="text-center">{team.drawn}</TableCell>
                    <TableCell className="text-center">{team.lost}</TableCell>
                    <TableCell className="text-center">{team.goalsFor}</TableCell>
                    <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                    <TableCell className="text-center font-bold">{team.points}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(team)}
                      >
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit team</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Team Dialog */}
      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
            <DialogDescription>
              Add a new team to your league
            </DialogDescription>
          </DialogHeader>

          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(addTeam)} className="space-y-4 py-2">
              <FormField
                control={addForm.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter team name" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={addForm.control}
                  name="played"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Played</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="won"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Won</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="drawn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drawn</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={addForm.control}
                  name="lost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="goalsFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goals For</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="goalsAgainst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goals Against</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddTeamOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Team</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update team information
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(updateTeam)} className="space-y-4 py-2">
              <FormField
                control={editForm.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter team name" required />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={editForm.control}
                  name="played"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Played</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="won"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Won</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="drawn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drawn</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={editForm.control}
                  name="lost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="goalsFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goals For</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="goalsAgainst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goals Against</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          min={0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={deleteTeam} 
                  className="mr-auto"
                >
                  Delete
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditTeamOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
