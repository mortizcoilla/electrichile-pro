import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentScreen: 'home',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      setIsOnline: (online) => set({ isOnline: online }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    { name: 'electrichile-app' }
  )
);
