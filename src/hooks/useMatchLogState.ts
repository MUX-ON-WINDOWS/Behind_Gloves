
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MatchLog } from '@/types/store-types';
import { fetchMatchLogs, addMatchLog as addLog, updateMatchLog as updateLog, deleteMatchLog as deleteLog } from '@/services/database';

export const useMatchLogState = () => {
  const [matchLogs, setMatchLogs] = useState<MatchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load match logs from Supabase on component mount
  useEffect(() => {
    const loadMatchLogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const logs = await fetchMatchLogs();
        setMatchLogs(logs);
      } catch (err) {
        console.error("Failed to load match logs:", err);
        setError("Failed to load match logs");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not load match logs from database",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMatchLogs();
  }, [toast]);

  const addMatchLog = async (match: Omit<MatchLog, "id">) => {
    try {
      const newId = await addLog(match);
      if (newId) {
        toast({
          title: "Match added",
          description: "Your match has been saved",
        });
        // Refresh the logs from the database to ensure consistency
        const updatedLogs = await fetchMatchLogs();
        setMatchLogs(updatedLogs);
      }
    } catch (err) {
      console.error("Failed to add match log:", err);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save match log to database",
      });
    }
  };

  const updateMatchLog = async (id: string, match: Partial<MatchLog>) => {
    try {
      await updateLog(id, match);
      toast({
        title: "Match updated",
        description: "Match details have been updated",
      });
      // Refresh the logs to ensure consistency
      const updatedLogs = await fetchMatchLogs();
      setMatchLogs(updatedLogs);
    } catch (err) {
      console.error("Failed to update match log:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update match log in database",
      });
    }
  };

  const deleteMatchLog = async (id: string) => {
    try {
      await deleteLog(id);
      setMatchLogs(prev => prev.filter(log => log.id !== id));
      toast({
        title: "Match deleted",
        description: "Match has been removed",
      });
    } catch (err) {
      console.error("Failed to delete match log:", err);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to remove match log from database",
      });
    }
  };

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
