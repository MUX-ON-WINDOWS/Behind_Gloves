
import { useState } from "react";
import { upcomingMatch as initialUpcomingMatch } from "@/lib/chart-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UpcomingMatch = () => {
  const [upcomingMatch, setUpcomingMatch] = useState(initialUpcomingMatch);
  const { homeTeam, awayTeam, date, time, venue, competition } = upcomingMatch;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHomeTeam, setNewHomeTeam] = useState(homeTeam);
  const [newAwayTeam, setNewAwayTeam] = useState(awayTeam);
  const [newDate, setNewDate] = useState(date);
  const [newTime, setNewTime] = useState(time);
  const [newVenue, setNewVenue] = useState(venue);
  const [newCompetition, setNewCompetition] = useState(competition);
  const { toast } = useToast();
  
  const updateUpcomingMatch = () => {
    setUpcomingMatch({
      homeTeam: newHomeTeam,
      awayTeam: newAwayTeam,
      date: newDate,
      time: newTime,
      venue: newVenue,
      competition: newCompetition
    });
    
    toast({
      title: "Upcoming Match Updated",
      description: "The upcoming match details have been updated."
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Upcoming Match</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setNewHomeTeam(homeTeam);
              setNewAwayTeam(awayTeam);
              setNewDate(date);
              setNewTime(time);
              setNewVenue(venue);
              setNewCompetition(competition);
              setIsDialogOpen(true);
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit upcoming match</span>
          </Button>
        </CardTitle>
        <CardDescription>{competition}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="text-center flex-1">
              <p className="text-lg font-semibold">{homeTeam}</p>
            </div>
            <div className="text-muted-foreground mx-4">vs</div>
            <div className="text-center flex-1">
              <p className="text-lg font-semibold">{awayTeam}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full border-t pt-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-keeper-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-keeper-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold">{time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-keeper-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Venue</p>
                <p className="font-semibold">{venue}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Upcoming Match</DialogTitle>
              <DialogDescription>
                Edit the details for the upcoming match
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="homeTeam" className="text-sm font-medium">Home Team</label>
                  <Input
                    id="homeTeam"
                    value={newHomeTeam}
                    onChange={(e) => setNewHomeTeam(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="awayTeam" className="text-sm font-medium">Away Team</label>
                  <Input
                    id="awayTeam"
                    value={newAwayTeam}
                    onChange={(e) => setNewAwayTeam(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input
                    id="date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">Time</label>
                  <Input
                    id="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="venue" className="text-sm font-medium">Venue</label>
                  <Input
                    id="venue"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="competition" className="text-sm font-medium">Competition</label>
                  <Input
                    id="competition"
                    value={newCompetition}
                    onChange={(e) => setNewCompetition(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={updateUpcomingMatch}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
