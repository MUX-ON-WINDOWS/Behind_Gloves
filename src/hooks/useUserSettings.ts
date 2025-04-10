
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserSettings } from '@/types/store-types';
import { fetchUserSettings, updateUserSettings } from '@/services/database';

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>({ clubTeam: "VV Dongen" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load user settings from Supabase on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const settings = await fetchUserSettings();
        setUserSettings(settings);
      } catch (err) {
        console.error("Failed to load user settings:", err);
        setError("Failed to load user settings");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not load user settings from database",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSettings();
  }, [toast]);

  // Update Supabase whenever userSettings change
  const updateSettings = async (settings: UserSettings) => {
    try {
      setUserSettings(settings);
      await updateUserSettings(settings);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved",
      });
    } catch (err) {
      console.error("Failed to update user settings:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to save settings to database",
      });
    }
  };

  return {
    userSettings,
    setUserSettings: updateSettings,
    isLoading,
    error
  };
};
