import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AvatarState, Step } from '../types/avatar.types';
import { DEFAULT_AVATAR } from '../data/avatarData';
import { randomizeAvatar } from '../utils/randomize';

interface HistoryEntry {
  avatar: AvatarState;
}

interface AvatarStore {
  avatar: AvatarState;
  currentStep: Step;
  isDarkMode: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  presets: { id: string; name: string; avatar: AvatarState }[];
  isExporting: boolean;
  showWelcome: boolean;

  // Actions
  setAvatar: (updates: Partial<AvatarState>) => void;
  setStep: (step: Step) => void;
  toggleDarkMode: () => void;
  randomize: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
  setExporting: (v: boolean) => void;
  dismissWelcome: () => void;
  resetAvatar: () => void;
}

const MAX_HISTORY = 50;

export const useAvatarStore = create<AvatarStore>()(
  subscribeWithSelector((set, get) => ({
    avatar: { ...DEFAULT_AVATAR },
    currentStep: 'welcome',
    isDarkMode: true,
    history: [{ avatar: { ...DEFAULT_AVATAR } }],
    historyIndex: 0,
    presets: [],
    isExporting: false,
    showWelcome: true,

    setAvatar: (updates) => {
      const current = get().avatar;
      const newAvatar = { ...current, ...updates };
      const { history, historyIndex } = get();

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ avatar: newAvatar });
      if (newHistory.length > MAX_HISTORY) newHistory.shift();

      set({
        avatar: newAvatar,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    setStep: (step) => set({ currentStep: step }),

    toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

    randomize: () => {
      const randomAvatar = randomizeAvatar();
      const { history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ avatar: randomAvatar });
      set({
        avatar: randomAvatar,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        set({ avatar: history[newIndex].avatar, historyIndex: newIndex });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        set({ avatar: history[newIndex].avatar, historyIndex: newIndex });
      }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    savePreset: (name) => {
      const preset = {
        id: crypto.randomUUID(),
        name,
        avatar: { ...get().avatar },
      };
      set((s) => ({ presets: [...s.presets, preset] }));
    },

    loadPreset: (id) => {
      const preset = get().presets.find((p) => p.id === id);
      if (preset) get().setAvatar(preset.avatar);
    },

    deletePreset: (id) => {
      set((s) => ({ presets: s.presets.filter((p) => p.id !== id) }));
    },

    setExporting: (v) => set({ isExporting: v }),

    dismissWelcome: () => set({ showWelcome: false, currentStep: 'body' }),

    resetAvatar: () => {
      set({
        avatar: { ...DEFAULT_AVATAR },
        history: [{ avatar: { ...DEFAULT_AVATAR } }],
        historyIndex: 0,
      });
    },
  }))
);
