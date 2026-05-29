import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Character, CategoryId, LevelUpResult } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { calcLevel, calcOverallLevel, getLifeRank, todayString } from '../services/xpService';

interface CharacterStore {
  character: Character | null;
  isOnboarded: boolean;
  customCategoryXP: Record<string, { xp: number; level: number }>;
  createCharacter: (name: string, avatarEmoji: string) => void;
  addXP: (categoryId: CategoryId, amount: number) => LevelUpResult;
  addCustomCategoryXP: (categoryId: string, amount: number) => { xp: number; level: number };
  resetCharacter: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: null,
      isOnboarded: false,
      customCategoryXP: {},

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

      addCustomCategoryXP: (categoryId, amount) => {
        const { customCategoryXP, character } = get();
        const prev = customCategoryXP[categoryId] ?? { xp: 0, level: 0 };
        const newXP = prev.xp + amount;
        const newLevel = calcLevel(newXP);
        const updated = { xp: newXP, level: newLevel };

        // Also add to totalXP on character
        if (character) {
          const newTotalXP = character.totalXP + amount;
          const newOverallLevel = calcOverallLevel(newTotalXP);
          const newRank = getLifeRank(newOverallLevel);
          set({
            customCategoryXP: { ...customCategoryXP, [categoryId]: updated },
            character: {
              ...character,
              totalXP: newTotalXP,
              overallLevel: newOverallLevel,
              lifeRank: newRank,
              lastActiveDate: todayString(),
            },
          });
        } else {
          set({ customCategoryXP: { ...customCategoryXP, [categoryId]: updated } });
        }

        return updated;
      },

      resetCharacter: () => set({ character: null, isOnboarded: false, customCategoryXP: {} }),
    }),
    {
      name: 'ascend-character-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
