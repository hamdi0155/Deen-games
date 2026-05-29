import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Discipline,
  CategoryProfile,
  CustomCategory,
  QuestionnaireAnswers,
  DisciplineFrequency,
} from '../types';
import { useCharacterStore } from './characterStore';
import { todayString } from '../services/xpService';
import { generateDisciplines } from '../services/categoryService';

interface DisciplineStore {
  disciplines: Discipline[];
  profiles: CategoryProfile[];
  customCategories: CustomCategory[];
  isGenerating: boolean;
  generationError: string | null;

  // Custom category management
  addCustomCategory: (
    cat: Omit<CustomCategory, 'id' | 'xp' | 'level' | 'isCustom'>
  ) => string; // returns id

  // Discipline management
  addDisciplines: (disciplines: Discipline[]) => void;
  addProfile: (profile: CategoryProfile) => void;
  completeDiscipline: (disciplineId: string) => { xpGained: number; categoryId: string; leveledUp: boolean; newLevel: number; rankUp: boolean; newRank: string } | null;
  deleteDiscipline: (disciplineId: string) => void;

  // Daily reset
  runDailyReset: () => void;

  // AI generation + save pipeline
  generateAndAddDisciplines: (
    answers: QuestionnaireAnswers,
    categoryId: string,
    categoryLabel: string
  ) => Promise<void>;

  // Save pre-generated payload (used when we already have the payload from a separate call)
  saveGeneratedPayload: (
    payload: import('../types').AIDisciplinePayload,
    answers: QuestionnaireAnswers,
    categoryId: string
  ) => void;

  // Selectors
  getDisciplinesForCategory: (categoryId: string) => Discipline[];
  getTodaysDisciplines: () => Discipline[];
  getProfileForCategory: (categoryId: string) => CategoryProfile | undefined;
}

function shouldShowToday(freq: DisciplineFrequency): boolean {
  const day = new Date().getDay();
  if (freq === 'daily') return true;
  if (freq === 'weekdays') return day >= 1 && day <= 5;
  if (freq === 'weekly') return day === 1; // Mondays
  if (freq === 'monthly') return new Date().getDate() === 1; // 1st of month
  return false;
}

function wasYesterday(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

export const useDisciplineStore = create<DisciplineStore>()(
  persist(
    (set, get) => ({
      disciplines: [],
      profiles: [],
      customCategories: [],
      isGenerating: false,
      generationError: null,

      addCustomCategory: (cat) => {
        const id = crypto.randomUUID();
        const newCat: CustomCategory = {
          ...cat,
          id,
          xp: 0,
          level: 0,
          isCustom: true,
        };
        set((state) => ({
          customCategories: [...state.customCategories, newCat],
        }));
        return id;
      },

      addDisciplines: (newDisciplines) => {
        set((state) => ({
          disciplines: [...newDisciplines, ...state.disciplines],
        }));
      },

      addProfile: (profile) => {
        set((state) => ({
          profiles: [
            profile,
            ...state.profiles.filter((p) => p.categoryId !== profile.categoryId),
          ],
        }));
      },

      completeDiscipline: (disciplineId) => {
        const { disciplines } = get();
        const disc = disciplines.find((d) => d.id === disciplineId);
        if (!disc || disc.isCompletedToday) return null;

        const today = todayString();
        const newStreak =
          wasYesterday(disc.lastCompletedDate) || disc.lastCompletedDate === today
            ? disc.currentStreak + 1
            : 1;

        const updatedDisc: Discipline = {
          ...disc,
          isCompletedToday: true,
          lastCompletedDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, disc.longestStreak),
          completions: [
            ...disc.completions.filter((c) => c.date !== today),
            { date: today, completedAt: new Date().toISOString() },
          ].slice(-90),
        };

        set((state) => ({
          disciplines: state.disciplines.map((d) =>
            d.id === disciplineId ? updatedDisc : d
          ),
        }));

        // Award XP — check if built-in or custom category
        const characterStore = useCharacterStore.getState();
        const builtInCategoryIds = [
          'education', 'career', 'finance', 'physical', 'appearance',
          'mental', 'social', 'relationships', 'discipline', 'spiritual',
          'creativity', 'leadership',
        ];

        let leveledUp = false;
        let newLevel = 0;
        let rankUp = false;
        let newRank = '';

        if (builtInCategoryIds.includes(disc.categoryId)) {
          const result = characterStore.addXP(disc.categoryId as any, disc.xpReward);
          leveledUp = result.leveledUp;
          newLevel = result.newLevel;
          rankUp = result.rankUp;
          newRank = result.newRank;
        } else {
          characterStore.addCustomCategoryXP(disc.categoryId, disc.xpReward);
        }

        return { xpGained: disc.xpReward, categoryId: disc.categoryId, leveledUp, newLevel, rankUp, newRank };
      },

      deleteDiscipline: (disciplineId) => {
        set((state) => ({
          disciplines: state.disciplines.filter((d) => d.id !== disciplineId),
        }));
      },

      runDailyReset: () => {
        const today = todayString();
        const now = new Date();

        set((state) => ({
          disciplines: state.disciplines.map((disc) => {
            if (disc.lastCompletedDate === today) return disc;

            const shouldHaveCompleted = shouldShowToday(disc.frequency);
            const missedYesterday =
              shouldHaveCompleted &&
              disc.lastCompletedDate !== undefined &&
              !wasYesterday(disc.lastCompletedDate);

            return {
              ...disc,
              isCompletedToday: false,
              currentStreak: missedYesterday ? 0 : disc.currentStreak,
            };
          }),
        }));
      },

      generateAndAddDisciplines: async (answers, categoryId, categoryLabel) => {
        set({ isGenerating: true, generationError: null });
        try {
          const payload = await generateDisciplines(answers);

          const now = new Date().toISOString();
          const today = todayString();

          const newDisciplines: Discipline[] = payload.disciplines.map((d) => ({
            id: crypto.randomUUID(),
            categoryId,
            title: d.title,
            description: d.description,
            frequency: d.frequency,
            xpReward: d.xpReward,
            estimatedMinutes: d.estimatedMinutes,
            isCompletedToday: false,
            currentStreak: 0,
            longestStreak: 0,
            completions: [],
            createdAt: now,
          }));

          const profile: CategoryProfile = {
            categoryId,
            vision: answers.vision3Years,
            currentScore: answers.currentScore,
            whyStatement: answers.whyMatters,
            philosophyStatement: payload.philosophyStatement,
            jimRohnQuote: payload.jimRohnQuote,
            createdAt: now,
          };

          get().addDisciplines(newDisciplines);
          get().addProfile(profile);
          set({ isGenerating: false });
        } catch (err) {
          set({
            isGenerating: false,
            generationError:
              err instanceof Error
                ? err.message
                : 'Failed to generate disciplines. Please try again.',
          });
          throw err;
        }
      },

      saveGeneratedPayload: (payload, answers, categoryId) => {
        const now = new Date().toISOString();

        const newDisciplines: Discipline[] = payload.disciplines.map((d) => ({
          id: crypto.randomUUID(),
          categoryId,
          title: d.title,
          description: d.description,
          frequency: d.frequency,
          xpReward: d.xpReward,
          estimatedMinutes: d.estimatedMinutes,
          isCompletedToday: false,
          currentStreak: 0,
          longestStreak: 0,
          completions: [],
          createdAt: now,
        }));

        const profile: CategoryProfile = {
          categoryId,
          vision: answers.vision3Years,
          currentScore: answers.currentScore,
          whyStatement: answers.whyMatters,
          philosophyStatement: payload.philosophyStatement,
          jimRohnQuote: payload.jimRohnQuote,
          createdAt: now,
        };

        get().addDisciplines(newDisciplines);
        get().addProfile(profile);
      },

      getDisciplinesForCategory: (categoryId) =>
        get().disciplines.filter((d) => d.categoryId === categoryId),

      getTodaysDisciplines: () =>
        get().disciplines.filter((d) => shouldShowToday(d.frequency)),

      getProfileForCategory: (categoryId) =>
        get().profiles.find((p) => p.categoryId === categoryId),
    }),
    {
      name: 'ascend-disciplines-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
