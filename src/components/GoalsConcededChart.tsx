
import { useTheme } from "@/hooks/useTheme";
import { useDataStore } from "@/hooks/useDataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const GoalsConcededChart = () => {
  const { theme } = useTheme();
  const { goalsConcededData } = useDataStore();
  
  const textColor = theme === "dark" ? "#f8fafc" : "#0f172a";
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Goals Conceded per Match</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={goalsConcededData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                color: textColor,
                border: "none",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="goals" fill="#F44336" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
