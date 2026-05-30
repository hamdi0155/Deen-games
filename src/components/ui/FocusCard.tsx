// ============================================================
// FocusCard — compact dashboard card for Focus Mode status
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
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
const FOCUS_IMAGE = 'https://images.unsplash.com/photo-1500534314209-4de8e78dfb78?w=700&q=85&auto=format&fit=crop';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function FocusCard({ todayFocusMinutes, streak, onPress }: FocusCardProps) {
  const progress = Math.min(todayFocusMinutes / DAILY_TARGET_MINUTES, 1);
  const hoursToday = Math.floor(todayFocusMinutes / 60);
  const minutesToday = todayFocusMinutes % 60;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <ImageBackground
        source={{ uri: FOCUS_IMAGE }}
        style={styles.imageBg}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <LinearGradient
          colors={['rgba(5,8,14,0.88)', 'rgba(5,8,14,0.75)', 'rgba(5,8,14,0.60)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Content */}
        <View style={styles.content}>
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
      </ImageBackground>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  imageBg: {
    minHeight: 140,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: RADIUS.xl,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.xs,
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
