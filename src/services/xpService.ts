import { LIFE_RANKS } from '../constants/xp';

export const calcLevel = (xp: number): number =>
  Math.floor(Math.sqrt(xp / 100));

export const xpForLevel = (level: number): number =>
  level * level * 100;

export const xpProgress = (xp: number): {
  level: number;
  progress: number;
  xpToNext: number;
} => {
  const level = calcLevel(xp);
  const curr = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    progress: level === 0 && xp === 0 ? 0 : (xp - curr) / (next - curr),
    xpToNext: next - xp,
  };
};

export const calcOverallLevel = (totalXP: number): number =>
  Math.floor(Math.sqrt(totalXP / 500));

export const getLifeRank = (overallLevel: number): string =>
  LIFE_RANKS[Math.min(Math.floor(overallLevel / 5), LIFE_RANKS.length - 1)];

export const todayString = (): string =>
  new Date().toISOString().split('T')[0];
