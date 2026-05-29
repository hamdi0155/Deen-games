import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, CategoryId, LevelUpResult } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { calcLevel, calcOverallLevel, getLifeRank, todayString } from '../services/xpService';

interface CharacterStore {
  character: Character | null;
  isOnboarded: boolean;
  createCharacter: (name: string, avatarEmoji: string) => void;
  addXP: (categoryId: CategoryId, amount: number) => LevelUpResult;
  resetCharacter: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: null,
      isOnboarded: false,

      createCharacter: (name, avatarEmoji) => {
        const character: Character = {
          id: crypto.randomUUID(),
          name,
          avatarEmoji,
          createdAt: new Date().toISOString(),
          categories: { ...DEFAULT_CATEGORIES },
          totalXP: 0,
          overallLevel: 0,
          lifeRank: 'Wanderer',
          lastActiveDate: todayString(),
        };
        set({ character, isOnboarded: true });
      },

      addXP: (categoryId, amount) => {
        const { character } = get();
        if (!character) return { leveledUp: false, newLevel: 0, rankUp: false, newRank: '' };

        const cat = character.categories[categoryId];
        const oldLevel = cat.level;
        const newXP = cat.xp + amount;
        const newLevel = calcLevel(newXP);

        const newTotalXP = character.totalXP + amount;
        const newOverallLevel = calcOverallLevel(newTotalXP);
        const oldRank = character.lifeRank;
        const newRank = getLifeRank(newOverallLevel);

        set({
          character: {
            ...character,
            totalXP: newTotalXP,
            overallLevel: newOverallLevel,
            lifeRank: newRank,
            lastActiveDate: todayString(),
            categories: {
              ...character.categories,
              [categoryId]: {
                ...cat,
                xp: newXP,
                level: newLevel,
              },
            },
          },
        });

        return {
          leveledUp: newLevel > oldLevel,
          newLevel,
          rankUp: newRank !== oldRank,
          newRank,
        };
      },

      resetCharacter: () => set({ character: null, isOnboarded: false }),
    }),
    {
      name: 'ascend-character-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
