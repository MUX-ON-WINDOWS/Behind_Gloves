
import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';
import { UserSettings } from '@/types/store-types';

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    return saved ? JSON.parse(saved) : { clubTeam: "VV Dongen" };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettings));
  }, [userSettings]);

  return {
    userSettings,
    setUserSettings
  };
};
