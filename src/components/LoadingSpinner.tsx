
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkSupabaseConnection } from "@/lib/supabase";
import { useState } from "react";

export function LoadingSpinner({ 
  message = "Loading...", 
  showRetry = false 
}: { 
  message?: string;
  showRetry?: boolean;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleRetryConnection = async () => {
    setIsRetrying(true);
    setErrorMessage(null);
    
    try {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        setErrorMessage("Unable to connect to database. Please check your network connection.");
      } else {
        // Force reload the page to refresh all data
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage("Connection error. Please try again later.");
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      {errorMessage ? (
        <>
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-muted-foreground text-center">{errorMessage}</p>
          <Button 
            variant="outline" 
            onClick={handleRetryConnection}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : 'Retry Connection'}
          </Button>
        </>
      ) : (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">{message}</p>
          {showRetry && (
            <Button 
              variant="outline" 
              onClick={handleRetryConnection}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : 'Check Connection'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
