// ============================================================
// FocusCard — compact dashboard card for Focus Mode status
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { AscendIcon } from '../icons/AscendIcon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface FocusCardProps {
  todayFocusMinutes: number; // total focused minutes today
  streak: number;            // daily focus streak
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DAILY_TARGET_MINUTES = 135; // 2h 15m target
const PROGRESS_BAR_WIDTH = 220;

// ---------------------------------------------------------------------------
// Starfield SVG — faint diagonal lines suggesting depth/space
// ---------------------------------------------------------------------------
function StarfieldScene() {
  return (
    <Svg
      width={280}
      height={100}
      style={StyleSheet.absoluteFillObject}
      pointerEvents="none"
    >
      {/* Faint diagonal streaks */}
      <Line x1="20" y1="0" x2="0" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      <Line x1="70" y1="0" x2="50" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
      <Line x1="140" y1="0" x2="110" y2="60" stroke="rgba(255,255,255,0.025)" strokeWidth={1} />
      <Line x1="200" y1="10" x2="175" y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
      <Line x1="250" y1="5" x2="230" y2="45" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      <Line x1="280" y1="20" x2="258" y2="65" stroke="rgba(255,255,255,0.025)" strokeWidth={1} />

      {/* Distant stars (dots) */}
      <Circle cx="45" cy="18" r="0.8" fill="rgba(255,255,255,0.2)" />
      <Circle cx="95" cy="8" r="0.6" fill="rgba(255,255,255,0.15)" />
      <Circle cx="160" cy="22" r="1" fill="rgba(255,255,255,0.18)" />
      <Circle cx="215" cy="12" r="0.7" fill="rgba(255,255,255,0.12)" />
      <Circle cx="265" cy="30" r="0.9" fill="rgba(255,255,255,0.2)" />
      <Circle cx="30" cy="50" r="0.6" fill="rgba(255,255,255,0.1)" />
      <Circle cx="120" cy="40" r="0.7" fill="rgba(255,255,255,0.14)" />
      <Circle cx="190" cy="55" r="0.8" fill="rgba(255,255,255,0.12)" />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function FocusCard({ todayFocusMinutes, streak, onPress }: FocusCardProps) {
  const progress = Math.min(todayFocusMinutes / DAILY_TARGET_MINUTES, 1);
  const hoursToday = Math.floor(todayFocusMinutes / 60);
  const minutesToday = todayFocusMinutes % 60;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
      <LinearGradient
        colors={['#070C14', '#0D1520', '#0F1C2E']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      >
        {/* Ambient starfield */}
        <StarfieldScene />

        {/* Content */}
        <View style={styles.inner}>
          {/* Top row: label + play button */}
          <View style={styles.topRow}>
            <View style={styles.leftContent}>
              {/* Label */}
              <Text style={styles.label}>FOCUS MODE</Text>

              {/* Timer */}
              <Text style={styles.timer}>25:00</Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>Deep Work Session</Text>

              {/* Streak badge */}
              {streak > 0 && (
                <View style={styles.streakBadge}>
                  <AscendIcon name="flame" size={11} color={COLORS.warning} />
                  <Text style={styles.streakText}>{streak}d streak</Text>
                </View>
              )}
            </View>

            {/* Play button */}
            <View style={styles.playButton}>
              <AscendIcon name="focus" size={18} color={COLORS.text} />
            </View>
          </View>

          {/* Progress section */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Today</Text>
              <Text style={styles.progressValue}>
                {hoursToday > 0 ? `${hoursToday}h ` : ''}
                {minutesToday}m
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(progress * 100)}%` as unknown as number },
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  touchable: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  container: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    minWidth: 240,
  },
  inner: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  leftContent: {
    flex: 1,
  },
  label: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.gold,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  timer: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 32,
    color: COLORS.text,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: FONTS.families.body,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: 10,
    color: COLORS.warning,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
    marginTop: 4,
  },
  progressSection: {
    gap: SPACING.xs,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: FONTS.families.body,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  progressValue: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.full,
  },
});
