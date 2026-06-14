import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import { CATEGORY_META } from '../constants/categories';
import { CategoryId, Quest } from '../types';

export type SortBy = 'newest' | 'oldest' | 'progress' | 'xp';

export const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'progress', label: 'Progress' },
  { key: 'xp', label: 'Reward' },
  { key: 'oldest', label: 'Oldest' },
];

export function sortQuests(quests: Quest[], sortBy: SortBy): Quest[] {
  const sorted = [...quests];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'progress':
      return sorted.sort((a, b) => {
        const pa = a.totalXP > 0 ? a.earnedXP / a.totalXP : 0;
        const pb = b.totalXP > 0 ? b.earnedXP / b.totalXP : 0;
        return pb - pa;
      });
    case 'xp':
      return sorted.sort((a, b) => b.totalXP - a.totalXP);
    default:
      return sorted;
  }
}

export interface CategoryMeta {
  id: string;
  label: string;
  emoji: string;
}

export interface QuestsScreenData {
  // UI state
  tab: 'active' | 'completed';
  categoryFilter: CategoryId | 'all';
  sortBy: SortBy;

  // Derived data
  activeQuests: Quest[];
  allTabQuests: Quest[];
  quests: Quest[];
  activeCategories: CategoryMeta[];

  // Event handlers
  handleTabChange: (t: 'active' | 'completed') => void;
  setCategoryFilter: (filter: CategoryId | 'all') => void;
  setSortBy: (sortBy: SortBy) => void;
  navigateToNewGoal: () => void;
}

export function useQuestsScreen(): QuestsScreenData {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const getCompletedQuests = useQuestStore((s) => s.getCompletedQuests);

  const activeQuests = getActiveQuests();
  const allTabQuests = tab === 'active' ? activeQuests : getCompletedQuests();

  // Determine which categories have quests in the current tab
  const activeCategories = useMemo(() => {
    const ids = new Set(allTabQuests.map((q) => q.categoryId));
    return CATEGORY_META.filter((m) => ids.has(m.id));
  }, [allTabQuests]);

  // Apply category filter + sorting
  const quests = useMemo(() => {
    const filtered = categoryFilter === 'all'
      ? allTabQuests
      : allTabQuests.filter((q) => q.categoryId === categoryFilter);
    return tab === 'active' ? sortQuests(filtered, sortBy) : filtered;
  }, [allTabQuests, categoryFilter, sortBy, tab]);

  // When switching tabs, reset category filter if it no longer applies
  const handleTabChange = (t: 'active' | 'completed') => {
    setTab(t);
    setCategoryFilter('all');
  };

  const navigateToNewGoal = () => {
    router.push('/(tabs)/goals' as any);
  };

  return {
    tab,
    categoryFilter,
    sortBy,
    activeQuests,
    allTabQuests,
    quests,
    activeCategories,
    handleTabChange,
    setCategoryFilter,
    setSortBy,
    navigateToNewGoal,
  };
}
