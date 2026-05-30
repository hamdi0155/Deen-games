import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quest, Task, CategoryId, LevelUpResult } from '../types';
import { generateQuest } from '../services/claudeService';
import { useCharacterStore } from './characterStore';

interface QuestStore {
  quests: Quest[];
  isGenerating: boolean;
  generationError: string | null;
  generateAndAddQuest: (goal: string, categoryId: CategoryId) => Promise<LevelUpResult | null>;
  completeTask: (questId: string, taskId: string) => LevelUpResult | null;
  abandonQuest: (questId: string) => void;
  clearError: () => void;
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
  getQuestById: (id: string) => Quest | undefined;
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      quests: [],
      isGenerating: false,
      generationError: null,

      generateAndAddQuest: async (goal, categoryId) => {
        set({ isGenerating: true, generationError: null });
        try {
          const payload = await generateQuest(goal, categoryId);

          const questId = crypto.randomUUID();
          const tasks: Task[] = payload.tasks.map((t) => ({
            id: crypto.randomUUID(),
            questId,
            title: t.title,
            description: t.description,
            tip: t.tip,
            xpReward: t.xpReward,
            categoryId,
            completed: false,
            order: t.order,
          }));

          const totalXP = tasks.reduce((sum, t) => sum + t.xpReward, 0);

          const quest: Quest = {
            id: questId,
            title: payload.questTitle,
            description: payload.questDescription,
            aiNarrative: payload.aiNarrative,
            categoryId,
            status: 'active',
            tasks,
            totalXP,
            earnedXP: 0,
            createdAt: new Date().toISOString(),
            sourceGoal: goal,
            difficulty: payload.difficulty,
            estimatedDays: payload.estimatedDays,
            tags: payload.tags,
          };

          set((state) => ({ quests: [quest, ...state.quests], isGenerating: false }));
          return null;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Failed to generate quest';
          set({ isGenerating: false, generationError: msg });
          return null;
        }
      },

      completeTask: (questId, taskId) => {
        const { quests } = get();
        const quest = quests.find((q) => q.id === questId);
        if (!quest) return null;

        const task = quest.tasks.find((t) => t.id === taskId);
        if (!task || task.completed) return null;

        const updatedTasks = quest.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
        );

        const earnedXP = quest.earnedXP + task.xpReward;
        const allDone = updatedTasks.every((t) => t.completed);

        const updatedQuest: Quest = {
          ...quest,
          tasks: updatedTasks,
          earnedXP,
          status: allDone ? 'completed' : 'active',
          completedAt: allDone ? new Date().toISOString() : undefined,
        };

        set((state) => ({
          quests: state.quests.map((q) => (q.id === questId ? updatedQuest : q)),
        }));

        const characterStore = useCharacterStore.getState();
        const result = characterStore.addXP(task.categoryId, task.xpReward);
        characterStore.logActivity({
          type: 'quest_task',
          title: task.title,
          categoryId: task.categoryId,
          xpGained: task.xpReward,
          timestamp: new Date().toISOString(),
        });
        return result;
      },

      abandonQuest: (questId) => {
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, status: 'abandoned' } : q
          ),
        }));
      },

      clearError: () => set({ generationError: null }),

      getActiveQuests: () => get().quests.filter((q) => q.status === 'active'),
      getCompletedQuests: () => get().quests.filter((q) => q.status === 'completed'),
      getQuestById: (id) => get().quests.find((q) => q.id === id),
    }),
    {
      name: 'ascend-quests-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
