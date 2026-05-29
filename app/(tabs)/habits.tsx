import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useHabitStore } from '../../src/store/habitStore';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { AddHabitSheet } from '../../src/components/habits/AddHabitSheet';
import { Habit } from '../../src/types';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';

export default function HabitsScreen() {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (
    h: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completions' | 'createdAt' | 'isCompletedToday'>
  ) => {
    addHabit(h);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>Daily Habits</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_OFFSET }]}
      >
        {habits.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔥</Text>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySub}>
              Forge daily habits to build unstoppable streaks.
            </Text>
          </View>
        ) : (
          habits.map((h) => <HabitCard key={h.id} habit={h} onComplete={completeHabit} />)
        )}
      </ScrollView>

      <AddHabitSheet visible={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  addBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  addBtnText: { color: '#fff', fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.sm },
  list: { paddingTop: SPACING.sm },
  empty: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: 80,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  emptySub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textAlign: 'center' },
});
