
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useDataStore } from "@/lib/data-store";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamManagement } from "@/components/TeamManagement";

const League = () => {
  const { userSettings } = useDataStore();
  const [activeTab, setActiveTab] = useState<"teams" | "fixtures" | "settings">("teams");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">League Management</h2>
            <p className="text-muted-foreground">
              Manage teams and fixtures for your league
            </p>
          </div>
        </div>

        <div className="flex space-x-2 border-b pb-2">
          <Button
            variant={activeTab === "teams" ? "default" : "ghost"}
            onClick={() => setActiveTab("teams")}
            className="rounded-none rounded-t-lg"
          >
            Teams
          </Button>
          <Button
            variant={activeTab === "fixtures" ? "default" : "ghost"}
            onClick={() => setActiveTab("fixtures")}
            className="rounded-none rounded-t-lg"
          >
            Fixtures
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            onClick={() => setActiveTab("settings")}
            className="rounded-none rounded-t-lg"
          >
            Settings
          </Button>
        </div>

        {activeTab === "teams" && (
          <TeamManagement />
        )}
        
        {activeTab === "fixtures" && (
          <Card>
            <CardHeader>
              <CardTitle>League Fixtures</CardTitle>
              <CardDescription>Coming soon: Manage league fixture schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This feature is under development.</p>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>League Settings</CardTitle>
              <CardDescription>Coming soon: Configure league settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This feature is under development.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default League;
