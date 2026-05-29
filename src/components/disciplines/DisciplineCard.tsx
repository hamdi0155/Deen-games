import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Discipline, DisciplineFrequency } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  discipline: Discipline;
  categoryColor?: string;
  onComplete: (id: string) => void;
}

const FREQ_CONFIG: Record<
  DisciplineFrequency,
  { label: string; color: string; bg: string }
> = {
  daily: { label: 'Daily', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  weekdays: {
    label: 'Weekdays',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.15)',
  },
  weekly: { label: 'Weekly', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  monthly: {
    label: 'Monthly',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.15)',
  },
};

export function DisciplineCard({ discipline, categoryColor, onComplete }: Props) {
  const accent = categoryColor ?? COLORS.accent;
  const freq = FREQ_CONFIG[discipline.frequency];

  return (
    <GlowCard
      glowColor={discipline.isCompletedToday ? accent : undefined}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          {/* Frequency badge + minutes */}
          <View style={styles.metaRow}>
            <View style={[styles.freqBadge, { backgroundColor: freq.bg }]}>
              <Text style={[styles.freqText, { color: freq.color }]}>
                {freq.label}
              </Text>
            </View>
            <Text style={styles.minutes}>
              {discipline.estimatedMinutes} min
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{discipline.title}</Text>

          {/* Description */}
          <Text style={styles.desc} numberOfLines={2}>
            {discipline.description}
          </Text>

          {/* Streak + XP row */}
          <View style={styles.bottomRow}>
            <View style={styles.streakRow}>
              <Text style={styles.flame}>🔥</Text>
              <Text style={[styles.streak, { color: accent }]}>
                {discipline.currentStreak}
              </Text>
              <Text style={styles.streakLabel}>streak</Text>
            </View>
            <View style={[styles.xpBadge, { borderColor: `${accent}40` }]}>
              <Text style={[styles.xpText, { color: accent }]}>
                +{discipline.xpReward} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Check-off button */}
        <TouchableOpacity
          onPress={() => !discipline.isCompletedToday && onComplete(discipline.id)}
          disabled={discipline.isCompletedToday}
          style={[
            styles.checkbox,
            { borderColor: accent },
            discipline.isCompletedToday && { backgroundColor: accent },
          ]}
          activeOpacity={0.7}
        >
          {discipline.isCompletedToday && (
            <Text style={styles.check}>✓</Text>
          )}
        </TouchableOpacity>
      </View>
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  info: { flex: 1, gap: SPACING.xs },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  freqBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  freqText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  minutes: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.semibold,
    lineHeight: 20,
  },
  desc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  flame: { fontSize: 12 },
  streak: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  streakLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  xpBadge: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  xpText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: SPACING.xs,
  },
  check: { color: '#000', fontSize: 18, fontWeight: FONTS.weights.bold },
});
