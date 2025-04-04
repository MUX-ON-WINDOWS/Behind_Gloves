
import { useContext } from 'react';
import { DataStoreContext } from '@/contexts/DataStoreContext';

// Hook to use the data store
export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
};
