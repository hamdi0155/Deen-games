import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabitStore } from '../../src/store/habitStore';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { AddHabitSheet } from '../../src/components/habits/AddHabitSheet';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { Habit } from '../../src/types';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';

export default function HabitsScreen() {
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
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

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['rgba(249,115,22,0.10)', 'transparent']}
        style={styles.header}
      >
        <Text style={styles.heading}>Daily Habits</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)} activeOpacity={0.8}>
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Text style={styles.addBtnText}>+ New</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_OFFSET }]}
      >
        {habits.length === 0 ? (
          <LinearGradient
            colors={['rgba(249,115,22,0.08)', 'transparent']}
            style={styles.emptyContainer}
          >
            <View style={styles.emptyRing}>
              <Text style={styles.emptyIcon}>🔥</Text>
            </View>
            <Text style={styles.emptyTitle}>No Habits Forged</Text>
            <Text style={styles.emptySub}>
              Forge daily habits to build unstoppable streaks and shape your identity.
            </Text>
            <TouchableOpacity
              onPress={() => setShowAdd(true)}
              activeOpacity={0.85}
              style={styles.emptyBtn}
            >
              <LinearGradient
                colors={['#F97316', '#EA580C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyBtnGradient}
              >
                <Text style={styles.emptyBtnText}>Forge a Habit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          habits.map((h, index) => (
            <FadeInView key={h.id} delay={index * 60}>
              <HabitCard
                habit={h}
                onComplete={completeHabit}
                onLongPress={() => handleLongPressHabit(h)}
                onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
              />
            </FadeInView>
          ))
        )}
      </ScrollView>

      <AddHabitSheet
        visible={showAdd}
        onClose={handleSheetClose}
        onAdd={handleAdd}
        editHabit={editingHabit ?? undefined}
        onUpdate={handleUpdate}
      />

      <StreakMilestoneModal
        visible={streakMilestone !== null}
        streakDays={streakMilestone?.days ?? 0}
        habitTitle={streakMilestone?.title ?? ''}
        color="#F97316"
        onDismiss={() => setStreakMilestone(null)}
      />
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
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  addBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    shadowColor: '#F97316',
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  addBtnGradient: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  addBtnText: {
    color: '#fff',
    fontFamily: FONTS.families.bodyBold,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 0.3,
  },
  list: { paddingTop: SPACING.sm },
  emptyContainer: {
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: 24,
    padding: SPACING.xl,
    margin: SPACING.lg,
    marginTop: 40,
  },
  emptyRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(249,115,22,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249,115,22,0.08)',
    shadowColor: '#F97316',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    shadowColor: '#F97316',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyBtnGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  emptyBtnText: {
    color: '#fff',
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.8,
  },
});
