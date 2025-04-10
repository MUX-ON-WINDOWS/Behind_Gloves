
import { Link } from "react-router-dom";
import { useDataStore } from "@/lib/data-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Save, ArrowRight } from "lucide-react";

export const LastMatch = () => {
  const { lastMatch, userSettings } = useDataStore();
  const { homeTeam, homeScore, awayTeam, awayScore, date, venue, cleanSheet, saves } = lastMatch;
  const matchResult = homeScore > awayScore ? "win" : homeScore < awayScore ? "loss" : "draw";
  const isHomeTeam = homeTeam === userSettings.clubTeam;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Last Match Result</span>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="text-xs"
          >
            <Link to="/match-overview">
              Edit in Match Overview
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {venue}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="text-center flex-1">
              <p className={`text-lg font-semibold ${isHomeTeam ? "font-bold" : ""}`}>{homeTeam}</p>
              <p className={`text-4xl font-bold ${
                isHomeTeam ? 
                  (matchResult === "win" ? "text-keeper-green" : matchResult === "loss" ? "text-keeper-red" : "") :
                  (matchResult === "loss" ? "text-keeper-green" : matchResult === "win" ? "text-keeper-red" : "")
              }`}>{homeScore}</p>
            </div>
            <div className="text-muted-foreground mx-4">vs</div>
            <div className="text-center flex-1">
              <p className={`text-lg font-semibold ${!isHomeTeam ? "font-bold" : ""}`}>{awayTeam}</p>
              <p className={`text-4xl font-bold ${
                !isHomeTeam ? 
                  (matchResult === "win" ? "text-keeper-red" : matchResult === "loss" ? "text-keeper-green" : "") : 
                  (matchResult === "loss" ? "text-keeper-red" : matchResult === "win" ? "text-keeper-green" : "")
              }`}>{awayScore}</p>
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
          
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/match-overview">View All Matches</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
