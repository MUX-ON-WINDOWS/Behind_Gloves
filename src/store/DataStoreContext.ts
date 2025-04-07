
import { createContext } from 'react';
import { DataStoreContextType } from '@/types/store-types';

// Create the context
export const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);
