
import { lastMatch } from "@/lib/chart-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Save } from "lucide-react";

export const LastMatch = () => {
  const { homeTeam, homeScore, awayTeam, awayScore, date, venue, cleanSheet, saves } = lastMatch;
  const matchResult = homeScore > awayScore ? "win" : homeScore < awayScore ? "loss" : "draw";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Last Match Result
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
      </CardContent>
    </Card>
  );
};
