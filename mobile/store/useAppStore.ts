import { create } from 'zustand';

interface AppState { 
  isAuthenticated: boolean;
  currentVideoIndex: number;
  setAuthenticated: (value: boolean) => void;
  setCurrentVideo: (index: number) => void;
} 

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentVideoIndex: 0,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setCurrentVideo: (index) => set({ currentVideoIndex: index }),
}));
