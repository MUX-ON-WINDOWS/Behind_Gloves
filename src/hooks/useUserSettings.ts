
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/store-types';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage-keys';

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    return saved ? JSON.parse(saved) : { clubTeam: "VV Dongen" };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(userSettings));
  }, [userSettings]);

  return {
    userSettings,
    setUserSettings
  };
};
