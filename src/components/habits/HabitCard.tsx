import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';

interface Props {
  habit: Habit;
  onComplete: (id: string) => void;
}

export function HabitCard({ habit, onComplete }: Props) {
  const color = CATEGORY_COLORS[habit.categoryId] ?? COLORS.accent;

  return (
    <GlowCard glowColor={habit.isCompletedToday ? color : undefined} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            {habit.icon && <Text style={styles.icon}>{habit.icon}</Text>}
            <Text style={styles.title}>{habit.title}</Text>
          </View>
          <View style={styles.streakRow}>
            <Text style={styles.flame}>🔥</Text>
            <Text style={[styles.streak, { color }]}>{habit.currentStreak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => !habit.isCompletedToday && onComplete(habit.id)}
          disabled={habit.isCompletedToday}
          style={[
            styles.checkbox,
            { borderColor: color },
            habit.isCompletedToday && { backgroundColor: color },
          ]}
        >
          {habit.isCompletedToday && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  info: { flex: 1, gap: SPACING.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  icon: { fontSize: 18 },
  title: { fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: FONTS.weights.medium },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  flame: { fontSize: 14 },
  streak: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  streakLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  check: { color: '#000', fontSize: 16, fontWeight: FONTS.weights.bold },
});
