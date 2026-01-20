import { create } from "zustand";

interface LoadingState {
    isLoading: boolean;
    progress: number;
    setIsLoading: (isLoading: boolean) => void;
    setProgress: (progress: number) => void;
    startLoading: () => void;
    stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    progress: 0,
    setIsLoading: (isLoading) => set({ isLoading, progress: isLoading ? 0 : 0 }),
    setProgress: (progress) => set({ progress }),
    startLoading: () => set({ isLoading: true, progress: 0 }),
    stopLoading: () => set({ isLoading: false, progress: 0 }),
}));
