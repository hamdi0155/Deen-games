import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { XPBar } from './XPBar';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  habitsTotal: number;
  habitsDone: number;
  disciplinesTotal: number;
  disciplinesDone: number;
  streakDays: number;
}

const PHRASES = [
  'Discipline is the bridge between goals and accomplishment.',
  'Success is nothing more than a few simple disciplines, practiced every day.',
  'What you do daily determines who you become permanently.',
  'Every day you either move toward your goals or away from them.',
  'The challenge of leadership is to be strong, but not rude.',
];

function getDayPhrase() {
  return PHRASES[new Date().getDay() % PHRASES.length];
}

export function TodayCard({ habitsTotal, habitsDone, disciplinesTotal, disciplinesDone, streakDays }: Props) {
  const total = habitsTotal + disciplinesTotal;
  const done = habitsDone + disciplinesDone;
  const progress = total > 0 ? done / total : 0;
  const allDone = total > 0 && done === total;

  const progressColor = allDone
    ? COLORS.success
    : progress > 0.5
    ? '#A78BFA'
    : COLORS.accent;

  // Animated checkmark scale
  const checkScale = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withSpring(allDone ? 1 : 0, {
      damping: 12,
      stiffness: 180,
    });
  }, [allDone]);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <LinearGradient
      colors={
        allDone
          ? ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)', 'transparent']
          : ['rgba(99,102,241,0.12)', 'rgba(124,58,237,0.06)', 'transparent']
      }
      style={[
        styles.container,
        allDone && { borderColor: COLORS.success + '40' },
      ]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.topRowText}>
          <Text style={styles.label}>TODAY'S MISSION</Text>
          <Text style={styles.status}>
            {total === 0
              ? 'No tasks scheduled'
              : allDone
              ? 'All complete — Jim Rohn would be proud.'
              : `${done} of ${total} complete`}
          </Text>
        </View>

        <View style={styles.topRowRight}>
          {/* Animated check circle (only when allDone) */}
          <Animated.View style={[styles.checkCircle, checkAnimStyle]}>
            <Text style={styles.checkText}>✓</Text>
          </Animated.View>

          {streakDays > 0 && !allDone && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakFlame}>🔥</Text>
              <Text style={styles.streakNum}>{streakDays}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress bar */}
      {total > 0 && (
        <XPBar progress={progress} color={progressColor} height={5} />
      )}

      {/* Stats row */}
      {total > 0 && (
        <View style={styles.statsRow}>
          {habitsTotal > 0 && (
            <View style={styles.statChip}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statText}>{habitsDone}/{habitsTotal} habits</Text>
            </View>
          )}
          {disciplinesTotal > 0 && (
            <View style={styles.statChip}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statText}>{disciplinesDone}/{disciplinesTotal} disciplines</Text>
            </View>
          )}
        </View>
      )}

      {/* Jim Rohn quote */}
      <Text style={styles.quote}>"{getDayPhrase()}"</Text>
      <Text style={styles.attribution}>— Jim Rohn</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.15)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topRowText: {
    flex: 1,
  },
  topRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success + '20',
    borderWidth: 1,
    borderColor: COLORS.success + '60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.success,
    fontFamily: FONTS.families.bodyBold,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    letterSpacing: 3,
    marginBottom: 4,
  },
  status: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyBold,
    color: COLORS.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.3)',
  },
  streakFlame: { fontSize: 14 },
  streakNum: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.display,
    color: '#F97316',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  statIcon: { fontSize: 12 },
  statText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  quote: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  attribution: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textDim,
    letterSpacing: 1,
    marginTop: -SPACING.xs,
  },
});
