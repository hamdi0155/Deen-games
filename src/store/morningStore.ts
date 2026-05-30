import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MorningStore {
  lastActivationDate: string | null;
  todayMood: number | null;        // 1-5
  todaySleepQuality: number | null; // 1-5
  todayIntention: string;
  todayPriorities: string[];
  todayEnergyLevel: number | null;  // 1-5
  hasCompletedToday: boolean;
  setMorningData: (data: {
    mood: number;
    sleepQuality: number;
    intention: string;
    priorities: string[];
    energyLevel: number;
  }) => void;
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useMorningStore = create<MorningStore>()(
  persist(
    (set, get) => ({
      lastActivationDate: null,
      todayMood: null,
      todaySleepQuality: null,
      todayIntention: '',
      todayPriorities: [],
      todayEnergyLevel: null,
      hasCompletedToday: false,

      setMorningData: ({ mood, sleepQuality, intention, priorities, energyLevel }) => {
        set({
          lastActivationDate: today(),
          todayMood: mood,
          todaySleepQuality: sleepQuality,
          todayIntention: intention,
          todayPriorities: priorities,
          todayEnergyLevel: energyLevel,
          hasCompletedToday: true,
        });
      },

      reset: () => set({
        lastActivationDate: null,
        todayMood: null,
        todaySleepQuality: null,
        todayIntention: '',
        todayPriorities: [],
        todayEnergyLevel: null,
        hasCompletedToday: false,
      }),
    }),
    {
      name: 'ascend-morning-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
