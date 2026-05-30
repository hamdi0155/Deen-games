import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../icons/AscendIcon';
import { Discipline, DisciplineFrequency } from '../../types';
import { PressableScale } from '../ui/PressableScale';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { haptic } from '../../services/haptics';

interface Props {
  discipline: Discipline;
  categoryColor?: string;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FREQ_CONFIG: Record<
  DisciplineFrequency,
  { label: string; color: string; bg: string }
> = {
  daily: { label: 'Daily', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  weekdays: { label: 'Weekdays', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  weekly: { label: 'Weekly', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  monthly: { label: 'Monthly', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
};

export function DisciplineCard({ discipline, categoryColor, onComplete, onDelete }: Props) {
  const accent = categoryColor ?? COLORS.accent;
  const freq = FREQ_CONFIG[discipline.frequency];
  const checkScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (!discipline.isCompletedToday) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800 }),
          withTiming(1, { duration: 800 }),
        ),
        -1,
        true,
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [discipline.isCompletedToday]);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value * pulseScale.value }],
  }));

  const handleCheck = () => {
    if (discipline.isCompletedToday) return;
    haptic.success();
    checkScale.value = withSpring(1.2, { damping: 8, stiffness: 300 }, () => {
      checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
    onComplete(discipline.id);
  };

  return (
    <PressableScale
      disabled={discipline.isCompletedToday}
      onLongPress={onDelete ? () => onDelete(discipline.id) : undefined}
      style={styles.pressable}
    >
      <View style={[styles.card, { borderColor: discipline.isCompletedToday ? accent + '40' : accent + '26', shadowColor: accent }]}>
        {/* Solid full-width top accent bar */}
        <View style={[styles.topBar, { backgroundColor: accent }]} />

        {/* Completed overlay */}
        {discipline.isCompletedToday && (
          <LinearGradient
            colors={[accent + '10', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.completedOverlay}
            pointerEvents="none"
          />
        )}

        <View style={styles.row}>
          <View style={styles.info}>
            {/* Frequency badge + minutes */}
            <View style={styles.metaRow}>
              <View style={[styles.freqBadge, { backgroundColor: freq.bg }]}>
                <Text style={[styles.freqText, { color: freq.color, fontFamily: FONTS.families.displayLight }]}>
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
                <AscendIcon name="flame" size={13} color={COLORS.warning} filled />
                <Text style={[styles.streak, { color: accent, fontFamily: FONTS.families.display }]}>
                  {discipline.currentStreak}
                </Text>
                <Text style={styles.streakLabel}>streak</Text>
              </View>
              <View style={[styles.xpBadge, { borderColor: `${accent}40` }]}>
                <Text style={[styles.xpText, { color: accent, fontFamily: FONTS.families.display }]}>
                  +{discipline.xpReward} XP
                </Text>
              </View>
            </View>
          </View>

          {/* Check-off button */}
          <Animated.View style={checkAnimStyle}>
            <TouchableOpacity
              onPress={handleCheck}
              disabled={discipline.isCompletedToday}
              style={styles.checkboxOuter}
              activeOpacity={0.8}
            >
              {discipline.isCompletedToday ? (
                <AscendIcon name="check-circle" filled size={36} color={COLORS.success} />
              ) : (
                <AscendIcon name="circle" size={36} color={accent} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pressable: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  topBar: { height: 3, width: '100%' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.md,
  },
  info: { flex: 1, gap: SPACING.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  freqBadge: {
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  freqText: {
    fontSize: FONTS.sizes.xs,
    letterSpacing: 0.5,
  },
  minutes: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontFamily: FONTS.families.body },
  title: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  desc: {
    fontFamily: FONTS.families.body,
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
  streak: { fontSize: FONTS.sizes.sm },
  streakLabel: { fontFamily: FONTS.families.body, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  xpBadge: {
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  xpText: { fontSize: FONTS.sizes.xs },
  checkboxOuter: {
    width: 36,
    height: 36,
    flexShrink: 0,
    marginTop: SPACING.xs,
  },

});
