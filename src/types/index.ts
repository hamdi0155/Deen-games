export type CategoryId =
  | 'education'
  | 'career'
  | 'finance'
  | 'physical'
  | 'appearance'
  | 'mental'
  | 'social'
  | 'relationships'
  | 'discipline'
  | 'spiritual'
  | 'creativity'
  | 'leadership';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
  xp: number;
  level: number;
}

export interface Character {
  id: string;
  name: string;
  avatarEmoji: string;
  createdAt: string;
  categories: Record<CategoryId, Category>;
  totalXP: number;
  overallLevel: number;
  lifeRank: string;
  lastActiveDate: string;
}

export type QuestStatus = 'active' | 'completed' | 'abandoned';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'epic';

export interface Task {
  id: string;
  questId: string;
  title: string;
  description?: string;
  tip?: string;
  xpReward: number;
  categoryId: CategoryId;
  completed: boolean;
  completedAt?: string;
  order: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  aiNarrative?: string;
  categoryId: CategoryId;
  status: QuestStatus;
  tasks: Task[];
  totalXP: number;
  earnedXP: number;
  createdAt: string;
  completedAt?: string;
  sourceGoal: string;
  difficulty: Difficulty;
  estimatedDays?: number;
  tags: string[];
}

export interface Habit {
  id: string;
  title: string;
  categoryId: CategoryId;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  xpReward: number;
  currentStreak: number;
  longestStreak: number;
  completions: { date: string; completedAt: string }[];
  createdAt: string;
  lastCompletedDate?: string;
  isCompletedToday: boolean;
  icon?: string;
}

export interface AIQuestPayload {
  questTitle: string;
  questDescription: string;
  aiNarrative: string;
  difficulty: Difficulty;
  estimatedDays: number;
  tags: string[];
  tasks: Array<{
    title: string;
    description: string;
    tip: string;
    xpReward: number;
    order: number;
  }>;
}

export interface LevelUpResult {
  leveledUp: boolean;
  newLevel: number;
  rankUp: boolean;
  newRank: string;
}
