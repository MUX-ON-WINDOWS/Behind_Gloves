
import { upcomingMatch } from "@/lib/chart-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

export const UpcomingMatch = () => {
  const { homeTeam, awayTeam, date, time, venue, competition } = upcomingMatch;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Upcoming Match
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
      </CardContent>
    </Card>
  );
};
