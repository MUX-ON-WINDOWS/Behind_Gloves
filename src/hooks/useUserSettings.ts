
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/store-types';
import { fetchUserSettings, updateUserSettings } from '@/services/database';

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>({ clubTeam: "VV Dongen" });
  const [isLoading, setIsLoading] = useState(true);

  // Load user settings from Supabase on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      setIsLoading(true);
      const settings = await fetchUserSettings();
      setUserSettings(settings);
      setIsLoading(false);
    };
    
    loadUserSettings();
  }, []);

  // Update Supabase whenever userSettings change
  const updateSettings = async (settings: UserSettings) => {
    setUserSettings(settings);
    await updateUserSettings(settings);
  };

  return {
    userSettings,
    setUserSettings: updateSettings,
    isLoading
  };
};
