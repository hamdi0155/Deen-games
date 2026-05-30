import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit } from '../../types';
import { PressableScale } from '../ui/PressableScale';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';
import { isStreakMilestone } from '../ui/StreakMilestoneModal';

interface Props {
  habit: Habit;
  onComplete: (id: string) => void;
  onStreakMilestone?: (days: number, habitTitle: string) => void;
  onLongPress?: () => void;
}

function computeNextStreak(habit: Habit): number {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];
  if (
    habit.lastCompletedDate === yesterdayStr ||
    habit.lastCompletedDate === todayStr
  ) {
    return habit.currentStreak + 1;
  }
  return 1;
}

export function HabitCard({ habit, onComplete, onStreakMilestone, onLongPress }: Props) {
  const color = CATEGORY_COLORS[habit.categoryId] ?? COLORS.accent;
  const checkScale = useSharedValue(1);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleCheck = () => {
    if (habit.isCompletedToday) return;
    const nextStreak = computeNextStreak(habit);
    checkScale.value = withSpring(1.2, { damping: 8, stiffness: 300 }, () => {
      checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
    onComplete(habit.id);
    if (isStreakMilestone(nextStreak)) {
      onStreakMilestone?.(nextStreak, habit.title);
    }
  };

  return (
    <PressableScale
      disabled={habit.isCompletedToday}
      onLongPress={onLongPress}
      style={[styles.pressable, { shadowColor: color }]}
    >
      <View style={[styles.card, { borderColor: color + '25' }]}>
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
          {habit.xpReward > 0 && (
            <View style={[styles.xpPill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
              <Text style={[styles.xpPillText, { color }]}>+{habit.xpReward} XP</Text>
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                {habit.icon && <Text style={styles.icon}>{habit.icon}</Text>}
                <Text style={styles.title}>{habit.title}</Text>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.streakRow}>
                  <Text style={styles.flame}>🔥</Text>
                  <Text style={[styles.streak, { color, fontFamily: FONTS.families.display }]}>
                    {habit.currentStreak}
                  </Text>
                  <Text style={styles.streakLabel}>streak</Text>
                </View>
                <View style={[styles.freqBadge, { backgroundColor: color + '18', borderColor: color + '35' }]}>
                  <Text style={[styles.freqText, { color: color + 'CC' }]}>
                    {habit.frequency === 'daily' ? 'Every day'
                      : habit.frequency === 'weekdays' ? 'Weekdays'
                      : habit.frequency === 'weekends' ? 'Weekends'
                      : 'Weekly'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Checkbox */}
            <Animated.View style={checkAnimStyle}>
              <TouchableOpacity
                onPress={handleCheck}
                disabled={habit.isCompletedToday}
                style={styles.checkboxWrapper}
                activeOpacity={0.8}
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
            </Animated.View>
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
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
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  flame: { fontSize: 20 },
  freqBadge: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  freqText: {
    fontSize: 9,
    fontFamily: FONTS.families.bodyMedium,
    letterSpacing: 0.3,
  },
  streak: {
    fontSize: FONTS.sizes.lg,
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
