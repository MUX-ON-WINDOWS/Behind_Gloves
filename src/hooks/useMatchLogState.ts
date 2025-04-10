
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MatchLog } from '@/types/store-types';
import { fetchMatchLogs, addMatchLog as addLog, updateMatchLog as updateLog, deleteMatchLog as deleteLog } from '@/services/database';

export const useMatchLogState = () => {
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMounted = useRef(true);
  const isOperationInProgress = useRef(false);

  // Load match logs from Supabase on component mount
  useEffect(() => {
    const loadMatchLogs = async () => {
      // Don't reload if already in progress
      if (isOperationInProgress.current) return;
      
      isOperationInProgress.current = true;
      setIsLoading(true);
      setError(null);
      
      try {
        const logs = await fetchMatchLogs();
        if (isMounted.current) {
          setMatchLogs(logs);
        }
      } catch (err) {
        console.error("Failed to load match logs:", err);
        if (isMounted.current) {
          setError("Failed to load match logs");
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Could not load match logs from database",
          });
        }
      } finally {
        isOperationInProgress.current = false;
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadMatchLogs();
    
    return () => {
      isMounted.current = false;
    };
  }, [toast]);

  const addMatchLog = useCallback(async (match: Omit<MatchLog, "id">) => {
    // Prevent multiple simultaneous operations
    if (isOperationInProgress.current) return false;
    
    isOperationInProgress.current = true;
    try {
      const newId = await addLog(match);
      if (newId && isMounted.current) {
        toast({
          title: "Match added",
          description: "Your match has been saved",
        });
        
        // Refresh the logs from the database to ensure consistency
        const updatedLogs = await fetchMatchLogs();
        if (isMounted.current) {
          setMatchLogs(updatedLogs);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add match log:", err);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Failed to save match log to database",
        });
      }
      return false;
    } finally {
      isOperationInProgress.current = false;
    }
  }, [toast]);

  const updateMatchLog = useCallback(async (id: string, match: Partial<MatchLog>) => {
    // Prevent multiple simultaneous operations
    if (isOperationInProgress.current) return false;
    
    isOperationInProgress.current = true;
    try {
      await updateLog(id, match);
      if (isMounted.current) {
        toast({
          title: "Match updated",
          description: "Match details have been updated",
        });
        
        // Refresh the logs to ensure consistency
        const updatedLogs = await fetchMatchLogs();
        if (isMounted.current) {
          setMatchLogs(updatedLogs);
        }
      }
      return true;
    } catch (err) {
      console.error("Failed to update match log:", err);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update match log in database",
        });
      }
      return false;
    } finally {
      isOperationInProgress.current = false;
    }
  }, [toast]);

  const deleteMatchLog = useCallback(async (id: string) => {
    // Prevent multiple simultaneous operations
    if (isOperationInProgress.current) return false;
    
    isOperationInProgress.current = true;
    try {
      await deleteLog(id);
      if (isMounted.current) {
        setMatchLogs(prev => prev.filter(log => log.id !== id));
        toast({
          title: "Match deleted",
          description: "Match has been removed",
        });
      }
      return true;
    } catch (err) {
      console.error("Failed to delete match log:", err);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Failed to remove match log from database",
        });
      }
      return false;
    } finally {
      isOperationInProgress.current = false;
    }
  }, [toast]);

  return {
    matchLogs,
    setMatchLogs,
    addMatchLog,
    updateMatchLog,
    deleteMatchLog,
    isLoading,
    error
  };
};
