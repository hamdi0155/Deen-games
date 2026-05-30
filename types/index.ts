export type Category = 'quran' | 'hadith' | 'fiqh' | 'seerah';

export interface Question {
  id: string;
  category: Category;
  arabic?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface GameSession {
  questions: Question[];
  currentIndex: number;
  score: number;
  lives: number;
  streak: number;
  startedAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  totalXp: number;
  level: number;
  streak: number;
  lastPlayedAt: string | null;
  completedCategories: Category[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  totalXp: number;
  level: number;
}

export interface CategoryProgress {
  category: Category;
  questionsAnswered: number;
  correctAnswers: number;
  totalXp: number;
  unlockedAt: string;
}
