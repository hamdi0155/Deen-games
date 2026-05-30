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
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../src/store/habitStore';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { AddHabitSheet } from '../../src/components/habits/AddHabitSheet';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { Habit } from '../../src/types';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { StatIconCard } from '../../src/components/ui/StatIconCard';

export default function HabitsScreen() {
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
  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
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

      {habits.length > 0 && (
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatIconCard
              icon="flame"
              iconColor="#F97316"
              label="Streak"
              value={`${longestActiveStreak}d`}
              style={styles.halfCard}
            />
            <StatIconCard
              icon="flash"
              iconColor="#6366F1"
              label="Total Reps"
              value={totalCompletions}
              style={styles.halfCard}
            />
          </View>
          <StatIconCard
            icon="checkmark-circle"
            iconColor="#10B981"
            label="Today's Progress"
            value={`${todayDone}/${todayHabits.length} Done`}
          />
        </View>
      )}

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
              <Ionicons name="pulse-outline" size={36} color="#F97316" />
            </View>
            <Text style={styles.emptyTitle}>No Rituals Yet</Text>
            <Text style={styles.emptySub}>
              Build daily rituals that compound into mastery.
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
                <Text style={styles.emptyBtnText}>Forge First Habit</Text>
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
  statsGrid: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCard: {
    flex: 1,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#F97316' + '30',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316' + '15',
    shadowColor: '#F97316',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    shadowColor: '#F97316',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    alignSelf: 'stretch',
  },
  emptyBtnGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyBtnText: {
    color: '#fff',
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.8,
  },
});
