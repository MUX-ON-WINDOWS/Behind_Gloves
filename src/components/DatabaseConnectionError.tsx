
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { checkSupabaseConnection } from "@/lib/supabase";

export function DatabaseConnectionError() {
  const { toast } = useToast();
  
  const handleRetryConnection = async () => {
    try {
      toast({
        title: "Checking connection...",
        description: "Attempting to connect to the database"
      });
      
      const isConnected = await checkSupabaseConnection();
      
      if (isConnected) {
        toast({
          title: "Connection successful",
          description: "Reloading app to refresh data..."
        });
        
        // Force reload the page
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Unable to connect to the database. Please check your configuration."
        });
      }
    } catch (error) {
      console.error("Connection retry error:", error);
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "An error occurred while checking the connection"
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="text-destructive h-6 w-6" />
          Database Connection Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the database. This could be due to:
            <ul className="list-disc pl-5 mt-2">
              <li>Invalid Supabase API key or URL</li>
              <li>Network connectivity issues</li>
              <li>Database server is down</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Check your Supabase configuration in <code>src/lib/supabase.ts</code> and ensure your API key is correct.
          </p>
          <Button onClick={handleRetryConnection} className="w-full">
            Retry Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
