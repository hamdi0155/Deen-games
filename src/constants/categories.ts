import { CategoryId, Category } from '../types';
import { CATEGORY_COLORS } from './theme';

const CATEGORY_META: Array<{ id: CategoryId; label: string; emoji: string }> = [
  { id: 'education',     label: 'Education',         emoji: '📚' },
  { id: 'career',        label: 'Career',             emoji: '💼' },
  { id: 'finance',       label: 'Finance',            emoji: '💰' },
  { id: 'physical',      label: 'Physical Fitness',   emoji: '⚡' },
  { id: 'appearance',    label: 'Appearance',         emoji: '🪞' },
  { id: 'mental',        label: 'Mental Health',      emoji: '🧠' },
  { id: 'social',        label: 'Social',             emoji: '🗣️' },
  { id: 'relationships', label: 'Relationships',      emoji: '❤️' },
  { id: 'discipline',    label: 'Discipline',         emoji: '🏆' },
  { id: 'spiritual',     label: 'Spirituality',       emoji: '🌙' },
  { id: 'creativity',    label: 'Creativity',         emoji: '🎨' },
  { id: 'leadership',    label: 'Leadership',         emoji: '👑' },
];

export const DEFAULT_CATEGORIES: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORY_META.map(({ id, label, emoji }) => [
    id,
    { id, label, emoji, color: CATEGORY_COLORS[id], xp: 0, level: 0 },
  ])
) as Record<CategoryId, Category>;

export { CATEGORY_META };
