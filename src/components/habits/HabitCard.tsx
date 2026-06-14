import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AscendIcon } from '../icons/AscendIcon';
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
import { haptic } from '../../services/haptics';

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
    haptic.success();
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
        {/* Solid full-width top accent bar */}
        <View style={[styles.topBar, { backgroundColor: color }]} />

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
            <View style={[styles.xpPill, { backgroundColor: color + '2A', borderColor: color + '60' }]}>
              <Text style={[styles.xpPillText, { color }]}>+{habit.xpReward} pts</Text>
            </View>
          )}

          <View style={styles.row}>
            <View style={[styles.info, habit.isCompletedToday && styles.infoCompleted]}>
              <View style={styles.titleRow}>
                {habit.icon && <Text style={styles.icon}>{habit.icon}</Text>}
                <Text style={styles.title}>{habit.title}</Text>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.streakRow}>
                  <AscendIcon name="flame" size={16} color={COLORS.warning} filled />
                  <Text style={styles.streak}>
                    {habit.currentStreak}d
                  </Text>
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
                  <AscendIcon name="check-circle" filled size={36} color={COLORS.success} />
                ) : (
                  <AscendIcon name="circle" size={36} color={color} />
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
    borderRadius: RADIUS.lg,
    shadowOpacity: 0.55,
    shadowRadius: 18,
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
    borderRadius: RADIUS.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: SPACING.sm,
  },
  xpPillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.display,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  info: { flex: 1, gap: SPACING.xs },
  infoCompleted: { opacity: 0.6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  icon: { fontSize: 18 },
  title: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.text,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  freqBadge: {
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  freqText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  streak: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.warning,
  },
  checkboxWrapper: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
