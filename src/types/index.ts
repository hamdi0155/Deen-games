import type { AscendIconName } from '../components/icons/AscendIcon';
export type { AscendIconName };

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
  iconName?: string;
  color: string;
  xp: number;
  level: number;
}

export interface Character {
  id: string;
  name: string;
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

// ─── Disciplines & Custom Categories ──────────────────────────────────────────

export type DisciplineFrequency = 'daily' | 'weekdays' | 'weekly' | 'monthly';

export interface Discipline {
  id: string;
  categoryId: string;       // can be built-in OR custom category id
  title: string;
  description: string;
  frequency: DisciplineFrequency;
  xpReward: number;
  estimatedMinutes: number;
  isCompletedToday: boolean;
  lastCompletedDate?: string;
  currentStreak: number;
  longestStreak: number;
  completions: { date: string; completedAt: string }[];
  createdAt: string;
}

export interface CategoryProfile {
  categoryId: string;
  vision: string;
  currentScore: number;         // 1-10
  whyStatement: string;
  philosophyStatement: string;  // Jim Rohn-voiced personal manifesto line
  jimRohnQuote: string;
  createdAt: string;
}

export interface CustomCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  xp: number;
  level: number;
  isCustom: true;
}

export interface AIDisciplinePayload {
  philosophyStatement: string;
  jimRohnQuote: string;
  disciplines: Array<{
    title: string;
    description: string;
    frequency: DisciplineFrequency;
    xpReward: number;
    estimatedMinutes: number;
  }>;
}

export interface QuestionnaireAnswers {
  categoryName: string;
  categoryEmoji: string;
  categoryColor: string;
  vision3Years: string;
  whoBecoming: string;
  currentScore: number;
  alreadyDoingWell: string;
  whyMatters: string;
  whoElseBenefits: string;
  dailyMinutes: number;
  preferredFrequency: 'daily' | 'weekdays' | 'weekly';
  mainObstacle: string;
}

export interface ActivityEntry {
  id: string;
  type: 'habit' | 'discipline' | 'quest_task' | 'level_up';
  title: string;
  categoryId: string;
  xpGained: number;
  timestamp: string; // ISO string
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: AscendIconName;
  unlockedAt?: string; // ISO string, undefined = locked
  category: 'habits' | 'quests' | 'disciplines' | 'xp' | 'level' | 'social';
}
