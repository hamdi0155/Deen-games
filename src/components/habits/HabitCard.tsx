import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';

interface Props {
  habit: Habit;
  onComplete: (id: string) => void;
}

export function HabitCard({ habit, onComplete }: Props) {
  const color = CATEGORY_COLORS[habit.categoryId] ?? COLORS.accent;

  return (
    <View style={[styles.card, { borderColor: color + '25', shadowColor: color }]}>
      {/* 3px colored top gradient bar */}
      <LinearGradient
        colors={[color, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBar}
      />

      {/* Completed overlay gradient */}
      {habit.isCompletedToday && (
        <LinearGradient
          colors={[color + '08', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.completedOverlay}
          pointerEvents="none"
        />
      )}

      <View style={styles.body}>
        {/* XP reward badge */}
        <View style={[styles.xpPill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
          <Text style={[styles.xpPillText, { color }]}>+{habit.xpReward} XP</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.info}>
            <View style={styles.titleRow}>
              {habit.icon && <Text style={styles.icon}>{habit.icon}</Text>}
              <Text style={styles.title}>{habit.title}</Text>
            </View>
            <View style={styles.streakRow}>
              <Text style={styles.flame}>🔥</Text>
              <Text style={[styles.streak, { color, fontFamily: FONTS.families.display }]}>
                {habit.currentStreak}
              </Text>
              <Text style={styles.streakLabel}>day streak</Text>
            </View>
          </View>

          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => !habit.isCompletedToday && onComplete(habit.id)}
            disabled={habit.isCompletedToday}
            style={styles.checkboxWrapper}
          >
            {habit.isCompletedToday ? (
              <LinearGradient
                colors={[color, color + 'AA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkboxFilled}
              >
                <Text style={styles.check}>✓</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.checkboxEmpty, { borderColor: color }]} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  topBar: {
    height: 3,
    width: '100%',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  body: {
    padding: SPACING.md,
  },
  xpPill: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: SPACING.sm,
  },
  xpPillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  info: { flex: 1, gap: SPACING.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  icon: { fontSize: 18 },
  title: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.text,
  },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  flame: { fontSize: 20 },
  streak: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
  },
  streakLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  checkboxWrapper: {
    width: 36,
    height: 36,
    flexShrink: 0,
  },
  checkboxFilled: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONTS.families.bodyBold,
  },
});
