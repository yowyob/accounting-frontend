import React from 'react';
import { create } from 'zustand';

interface ComposeState {
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    title: string;
    content: React.ReactNode | null;
    onOpen: (props: { title: string; content: React.ReactNode }) => void;
    onClose: () => void;
    onToggleMinimize: () => void;
    onToggleMaximize: () => void;
}

export const useCompose = create<ComposeState>((set) => ({
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    title: '',
    content: null,
    onOpen: ({ title, content }) => set({
        isOpen: true,
        isMinimized: false,
        isMaximized: true,
        title,
        content
    }),
    onClose: () => set({
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        title: '',
        content: null
    }),
    onToggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
    onToggleMaximize: () => set((state) => ({ isMaximized: !state.isMaximized })),
}));