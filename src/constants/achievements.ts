export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: (stats: {
    totalXP: number;
    overallLevel: number;
    questsCompleted: number;
    habitsCount: number;
    longestStreak: number;
    categoriesWithXP: number;
  }) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Begin your journey',
    emoji: '👣',
    condition: (s) => s.totalXP > 0,
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Earn 500 XP',
    emoji: '📚',
    condition: (s) => s.totalXP >= 500,
  },
  {
    id: 'adept',
    title: 'Adept',
    description: 'Reach level 5',
    emoji: '⚡',
    condition: (s) => s.overallLevel >= 5,
  },
  {
    id: 'quest_master',
    title: 'Quest Master',
    description: 'Complete 3 quests',
    emoji: '⚔️',
    condition: (s) => s.questsCompleted >= 3,
  },
  {
    id: 'habit_forge',
    title: 'Habit Forger',
    description: 'Create 5 habits',
    emoji: '🔥',
    condition: (s) => s.habitsCount >= 5,
  },
  {
    id: 'streak_week',
    title: 'Week of Fire',
    description: '7-day streak',
    emoji: '🔥',
    condition: (s) => s.longestStreak >= 7,
  },
  {
    id: 'streak_month',
    title: 'Iron Will',
    description: '30-day streak',
    emoji: '💎',
    condition: (s) => s.longestStreak >= 30,
  },
  {
    id: 'all_rounder',
    title: 'All-Rounder',
    description: 'Earn XP in 6+ categories',
    emoji: '👑',
    condition: (s) => s.categoriesWithXP >= 6,
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Earn 10,000 XP',
    emoji: '🏆',
    condition: (s) => s.totalXP >= 10000,
  },
];
