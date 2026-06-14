import { useState } from 'react';
import { Alert } from 'react-native';
import { useHabitStore } from '../store/habitStore';
import { Habit } from '../types';

export interface HabitsScreenData {
  // Store data
  habits: Habit[];

  // Derived values
  todayHabits: Habit[];
  todayDone: number;
  longestActiveStreak: number;
  totalCompletions: number;

  // UI state
  showAdd: boolean;
  editingHabit: Habit | null;
  streakMilestone: { days: number; title: string } | null;

  // Event handlers
  handleLongPressHabit: (habit: Habit) => void;
  handleAdd: (h: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completions' | 'createdAt' | 'isCompletedToday'>) => void;
  handleUpdate: (habitId: string, updates: Partial<Pick<Habit, 'title' | 'categoryId' | 'frequency' | 'xpReward' | 'icon'>>) => void;
  handleSheetClose: () => void;
  setShowAdd: (show: boolean) => void;
  setStreakMilestone: (milestone: { days: number; title: string } | null) => void;
  completeHabit: (habitId: string) => any;
}

export function useHabitsScreen(): HabitsScreenData {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

  const todayHabits = habits.filter((h) => {
    const day = new Date().getDay();
    if (h.frequency === 'daily') return true;
    if (h.frequency === 'weekdays') return day >= 1 && day <= 5;
    if (h.frequency === 'weekends') return day === 0 || day === 6;
    if (h.frequency === 'weekly') return day === 1;
    return true;
  });
  const todayDone = todayHabits.filter((h) => h.isCompletedToday).length;
  const longestActiveStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completions ?? []).length, 0);

  const [showAdd, setShowAdd] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<{ days: number; title: string } | null>(null);

  const handleLongPressHabit = (habit: Habit) => {
    Alert.alert(
      habit.title,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit Habit',
          onPress: () => {
            setEditingHabit(habit);
            setShowAdd(true);
          },
        },
        {
          text: 'Delete Habit',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Habit',
              `Are you sure you want to delete "${habit.title}"? Your streak will be lost.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
              ]
            );
          },
        },
      ]
    );
  };

  const handleAdd = (
    h: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completions' | 'createdAt' | 'isCompletedToday'>
  ) => {
    addHabit(h);
  };

  const handleUpdate = (
    habitId: string,
    updates: Partial<Pick<Habit, 'title' | 'categoryId' | 'frequency' | 'xpReward' | 'icon'>>
  ) => {
    updateHabit(habitId, updates);
  };

  const handleSheetClose = () => {
    setShowAdd(false);
    setEditingHabit(null);
  };

  return {
    habits,
    todayHabits,
    todayDone,
    longestActiveStreak,
    totalCompletions,
    showAdd,
    editingHabit,
    streakMilestone,
    handleLongPressHabit,
    handleAdd,
    handleUpdate,
    handleSheetClose,
    setShowAdd,
    setStreakMilestone,
    completeHabit,
  };
}
