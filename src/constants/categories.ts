import { CategoryId, Category } from '../types';
import { CATEGORY_COLORS } from './theme';

export const CATEGORY_ICON_NAMES: Record<string, string> = {
  education:     'book-outline',
  career:        'briefcase-outline',
  finance:       'cash-outline',
  physical:      'barbell-outline',
  appearance:    'sparkles-outline',
  mental:        'bulb-outline',
  social:        'people-outline',
  relationships: 'heart-outline',
  discipline:    'trophy-outline',
  spiritual:     'moon-outline',
  creativity:    'color-palette-outline',
  leadership:    'star-outline',
};

const CATEGORY_META: Array<{ id: CategoryId; label: string; emoji: string; iconName: string }> = [
  { id: 'education',     label: 'Education',         emoji: '📚', iconName: CATEGORY_ICON_NAMES.education },
  { id: 'career',        label: 'Career',             emoji: '💼', iconName: CATEGORY_ICON_NAMES.career },
  { id: 'finance',       label: 'Finance',            emoji: '💰', iconName: CATEGORY_ICON_NAMES.finance },
  { id: 'physical',      label: 'Physical Fitness',   emoji: '⚡', iconName: CATEGORY_ICON_NAMES.physical },
  { id: 'appearance',    label: 'Appearance',         emoji: '🪞', iconName: CATEGORY_ICON_NAMES.appearance },
  { id: 'mental',        label: 'Mental Health',      emoji: '🧠', iconName: CATEGORY_ICON_NAMES.mental },
  { id: 'social',        label: 'Social',             emoji: '🗣️', iconName: CATEGORY_ICON_NAMES.social },
  { id: 'relationships', label: 'Relationships',      emoji: '❤️', iconName: CATEGORY_ICON_NAMES.relationships },
  { id: 'discipline',    label: 'Discipline',         emoji: '🏆', iconName: CATEGORY_ICON_NAMES.discipline },
  { id: 'spiritual',     label: 'Spirituality',       emoji: '🌙', iconName: CATEGORY_ICON_NAMES.spiritual },
  { id: 'creativity',    label: 'Creativity',         emoji: '🎨', iconName: CATEGORY_ICON_NAMES.creativity },
  { id: 'leadership',    label: 'Leadership',         emoji: '👑', iconName: CATEGORY_ICON_NAMES.leadership },
];

export const DEFAULT_CATEGORIES: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORY_META.map(({ id, label, emoji }) => [
    id,
    { id, label, emoji, color: CATEGORY_COLORS[id], xp: 0, level: 0 },
  ])
) as Record<CategoryId, Category>;

export { CATEGORY_META };
