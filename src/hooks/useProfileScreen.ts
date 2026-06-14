import { useRouter } from 'expo-router';
import { useCharacterStore } from '../store/characterStore';
import { useQuestStore } from '../store/questStore';
import { useHabitStore } from '../store/habitStore';
import { useAchievementStore } from '../store/achievementStore';
import { Achievement, ActivityEntry, Character } from '../types';

export interface ProfileScreenData {
  // Store data
  character: Character;
  activityLog: ActivityEntry[];

  // Derived values
  activeQuestsCount: number;
  completedQuestsCount: number;
  allCompletions: { date: string; completedAt: string }[];
  memberSince: string;
  unlockedAchievements: Achievement[];
  allAchievements: Achievement[];
  unlockedCount: number;

  // Navigation
  navigateToSettings: () => void;
}

export function useProfileScreen(): ProfileScreenData {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character)!;
  const activityLog = useCharacterStore((s) => s.activityLog);
  const quests = useQuestStore((s) => s.quests);
  const habits = useHabitStore((s) => s.habits);
  const allAchievements = useAchievementStore((s) => s.getAll)();
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);

  const activeQuestsCount = quests.filter((q) => q.status === 'active').length;
  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;
  const allCompletions = habits.flatMap((h) => h.completions ?? []);
  const memberSince = new Date(character.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const unlockedAchievements = allAchievements.filter((a: Achievement) => unlockedIds.includes(a.id));
  const unlockedCount = unlockedAchievements.length;

  const navigateToSettings = () => {
    router.push('/settings' as any);
  };

  return {
    character,
    activityLog,
    activeQuestsCount,
    completedQuestsCount,
    allCompletions,
    memberSince,
    unlockedAchievements,
    allAchievements,
    unlockedCount,
    navigateToSettings,
  };
}
