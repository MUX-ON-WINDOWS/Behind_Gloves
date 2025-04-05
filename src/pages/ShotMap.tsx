
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ShotMap = () => {
  const { theme } = useTheme();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shot Map</h2>
          <p className="text-muted-foreground">
            Visualize shot locations and outcomes
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs defaultValue="all" className="w-full max-w-md">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All Shots</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="saves">Saves</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-3">
            <Select defaultValue="season">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Entire Season</SelectItem>
                <SelectItem value="last10">Last 10 Matches</SelectItem>
                <SelectItem value="last5">Last 5 Matches</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Shot Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shot Types</SelectItem>
                <SelectItem value="open">Open Play</SelectItem>
                <SelectItem value="set">Set Pieces</SelectItem>
                <SelectItem value="penalty">Penalties</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="p-0">
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-gradient-to-b from-muted/30 to-muted">
              <svg
                className="h-full w-full"
                viewBox="0 0 1000 650"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Goal frame */}
                <rect x="350" y="50" width="300" height="100" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="4" />
                
                {/* Goal area */}
                <rect x="250" y="50" width="500" height="200" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="2" />
                
                {/* Penalty area */}
                <rect x="150" y="50" width="700" height="350" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="2" />
                
                {/* Center circle */}
                <circle cx="500" cy="400" r="100" fill="none" stroke={theme === "dark" ? "#ffffff" : "#000000"} strokeWidth="2" />
                
                {/* Penalty spot */}
                <circle cx="500" cy="275" r="5" fill={theme === "dark" ? "#ffffff" : "#000000"} />
                
                {/* Shot markers - Goals (red) */}
                <circle cx="380" cy="100" r="15" fill="#ef4444" opacity="0.8" />
                <circle cx="450" cy="80" r="15" fill="#ef4444" opacity="0.8" />
                <circle cx="620" cy="90" r="15" fill="#ef4444" opacity="0.8" />
                
                {/* Shot markers - Saves (green) */}
                <circle cx="410" cy="120" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="500" cy="90" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="550" cy="100" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="400" cy="95" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="600" cy="120" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="500" cy="125" r="15" fill="#4CAF50" opacity="0.8" />
                
                {/* Shot markers - Outside box */}
                <circle cx="300" cy="300" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="400" cy="350" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="500" cy="380" r="15" fill="#ef4444" opacity="0.8" />
                <circle cx="600" cy="320" r="15" fill="#4CAF50" opacity="0.8" />
                <circle cx="700" cy="280" r="15" fill="#4CAF50" opacity="0.8" />
              </svg>
            </div>
          </div>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Shot Zones</CardTitle>
              <CardDescription>Goals conceded by zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Top Left</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">2</span>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-full w-1/3 rounded-full bg-keeper-red"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top Center</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">1</span>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-full w-1/6 rounded-full bg-keeper-red"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top Right</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">3</span>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-full w-1/2 rounded-full bg-keeper-red"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bottom Left</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">3</span>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-full w-1/2 rounded-full bg-keeper-red"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bottom Center</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">2</span>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-full w-1/3 rounded-full bg-keeper-red"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bottom Right</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-muted-foreground">4</span>
                    <div className="h-2 w-24 rounded-full bg-slate-100">
                      <div className="h-full w-2/3 rounded-full bg-keeper-red"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shot Statistics</CardTitle>
              <CardDescription>Key shot metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Total Shots Faced</span>
                    <span className="text-sm font-medium">85</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full w-full rounded-full bg-slate-400"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Saves Made</span>
                    <span className="text-sm font-medium">67</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full w-[79%] rounded-full bg-keeper-green"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Goals Conceded</span>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full w-[21%] rounded-full bg-keeper-red"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Expected Goals (xG)</span>
                    <span className="text-sm font-medium">22.5</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full w-[26%] rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shot Types</CardTitle>
              <CardDescription>Breakdown by shot type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Open Play</span>
                  <span className="text-muted-foreground">58 (68%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Set Pieces</span>
                  <span className="text-muted-foreground">14 (16%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Corner Kicks</span>
                  <span className="text-muted-foreground">8 (9%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Penalties</span>
                  <span className="text-muted-foreground">5 (6%)</span>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Save % by Type</span>
                    <span>Rate</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Open Play</span>
                      <span className="text-keeper-green">82%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Set Pieces</span>
                      <span className="text-keeper-green">78%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Corner Kicks</span>
                      <span className="text-keeper-green">75%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Penalties</span>
                      <span className="text-keeper-green">40%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ShotMap;
