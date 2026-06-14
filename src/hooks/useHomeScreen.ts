import { useState } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { useHabitStore } from '../store/habitStore';
import { useDisciplineStore } from '../store/disciplineStore';
import { useAchievementStore } from '../store/achievementStore';
import { useQuestStore } from '../store/questStore';
import { CATEGORY_COLORS, COLORS } from '../constants/theme';
import { Character, Habit, Discipline, Quest } from '../types';

export interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

export interface TaskItem {
  type: 'habit' | 'discipline';
  id: string;
  xp: number;
  done: boolean;
  habit?: Habit;
  discipline?: Discipline;
  color?: string;
}

export interface HomeScreenData {
  // Character
  character: Character;

  // Today's tasks
  todaysHabits: Habit[];
  todaysDisciplines: Discipline[];
  recentQuests: Quest[];

  // Derived values
  tasksDone: number;
  totalTasks: number;
  todayProgress: number;
  longestStreak: number;
  isAllDone: boolean;
  overallLvlProgress: number;
  xpToNext: number;

  // UI feedback state
  toast: { xp: number; color: string; key: number } | null;
  levelUp: LevelUpState | null;
  streakMilestone: { days: number; title: string } | null;
  streakMilestoneColor: string;
  suggestionsOpen: boolean;
  tasksExpanded: boolean;

  // Pending achievement
  pendingAchievement: { title: string; iconName: any } | null;

  // Event handlers
  handleCompleteHabit: (habitId: string) => void;
  handleCompleteDiscipline: (disciplineId: string) => void;
  setToast: (toast: { xp: number; color: string; key: number } | null) => void;
  setLevelUp: (levelUp: LevelUpState | null) => void;
  setStreakMilestone: (milestone: { days: number; title: string } | null) => void;
  setSuggestionsOpen: (open: boolean) => void;
  setTasksExpanded: (expanded: boolean) => void;
  clearPendingToast: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still awake';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getTodayFocus(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Start strong today.';
  if (hour < 17) return 'Stay the course.';
  return 'Finish what you started.';
}

export { getGreeting, getTodayFocus };

export function useHomeScreen(): HomeScreenData {
  const character = useCharacterStore((s) => s.character)!;
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const getTodaysDisciplines = useDisciplineStore((s) => s.getTodaysDisciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);
  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const pendingAchievement = useAchievementStore((s) => s.pendingToast);
  const clearPendingToast = useAchievementStore((s) => s.clearPendingToast);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);

  const todaysHabits = getTodaysHabits();
  const todaysDisciplines = getTodaysDisciplines();
  const recentQuests = getActiveQuests().slice(0, 3);

  const [toast, setToast] = useState<{ xp: number; color: string; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<{ days: number; title: string } | null>(null);
  const [streakMilestoneColor] = useState('#F97316');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);

  // Overall level XP progress
  const xpForLvl = (l: number) => l * l * 500;
  const ovLvl = character.overallLevel;
  const xpCurr = xpForLvl(ovLvl);
  const xpNext = xpForLvl(ovLvl + 1);
  const overallLvlProgress = ovLvl === 0
    ? Math.min(character.totalXP / 500, 1)
    : (character.totalXP - xpCurr) / (xpNext - xpCurr);
  const xpToNext = Math.max(0, xpNext - character.totalXP);

  const habitsDone = todaysHabits.filter((h) => h.isCompletedToday).length;
  const disciplinesDone = todaysDisciplines.filter((d) => d.isCompletedToday).length;
  const totalTasks = todaysHabits.length + todaysDisciplines.length;
  const tasksDone = habitsDone + disciplinesDone;
  const todayProgress = totalTasks > 0 ? tasksDone / totalTasks : 0;
  const longestStreak = todaysHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const isAllDone = totalTasks > 0 && tasksDone === totalTasks;

  const handleCompleteHabit = (habitId: string) => {
    const result = completeHabit(habitId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        setLevelUp({
          level: result.newLevel,
          categoryId: result.categoryId,
          rankUp: result.rankUp,
          newRank: result.newRank,
          color: catColor,
        });
      }, 900);
    }
    setTimeout(() => {
      const latestHabits = useHabitStore.getState().getTodaysHabits();
      const latestDiscs = useDisciplineStore.getState().getTodaysDisciplines();
      const allHabitsDone = latestHabits.every((h) => h.isCompletedToday);
      const allDiscsDone = latestDiscs.every((d) => d.isCompletedToday);
      if (latestHabits.length + latestDiscs.length > 0 && allHabitsDone && allDiscsDone) {
        checkAndUnlock('perfect_day');
      }
    }, 100);
  };

  const handleCompleteDiscipline = (disciplineId: string) => {
    const result = completeDiscipline(disciplineId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId as keyof typeof CATEGORY_COLORS] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        setLevelUp({
          level: result.newLevel,
          categoryId: result.categoryId,
          rankUp: result.rankUp,
          newRank: result.newRank,
          color: catColor,
        });
      }, 900);
    }
    setTimeout(() => {
      const latestHabits = useHabitStore.getState().getTodaysHabits();
      const latestDiscs = useDisciplineStore.getState().getTodaysDisciplines();
      const allHabitsDone = latestHabits.every((h) => h.isCompletedToday);
      const allDiscsDone = latestDiscs.every((d) => d.isCompletedToday);
      if (latestHabits.length + latestDiscs.length > 0 && allHabitsDone && allDiscsDone) {
        checkAndUnlock('perfect_day');
      }
    }, 100);
  };

  return {
    character,
    todaysHabits,
    todaysDisciplines,
    recentQuests,
    tasksDone,
    totalTasks,
    todayProgress,
    longestStreak,
    isAllDone,
    overallLvlProgress,
    xpToNext,
    toast,
    levelUp,
    streakMilestone,
    streakMilestoneColor,
    suggestionsOpen,
    tasksExpanded,
    pendingAchievement,
    handleCompleteHabit,
    handleCompleteDiscipline,
    setToast,
    setLevelUp,
    setStreakMilestone,
    setSuggestionsOpen,
    setTasksExpanded,
    clearPendingToast,
  };
}
