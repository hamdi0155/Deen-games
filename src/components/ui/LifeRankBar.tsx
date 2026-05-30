import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  lifeRank: string;
  totalXP: number;
  overallLevel: number;
}

function xpForOverallLevel(level: number): number {
  return level * level * 500;
}

export function LifeRankBar({ lifeRank, totalXP, overallLevel }: Props) {
  const currentLevelXP = xpForOverallLevel(overallLevel);
  const nextLevelXP    = xpForOverallLevel(overallLevel + 1);
  const progress       = Math.max(0, Math.min(1, (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)));

  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(
      200,
      withTiming(progress, { duration: 1000, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%` as any,
  }));

  return (
    <View style={styles.container}>
      {/* Row: label | rank name | XP text */}
      <View style={styles.row}>
        <Text style={styles.label}>LIFE RANK</Text>
        <View style={styles.rankRow}>
          <Text style={styles.wingIcon}>⫶</Text>
          <Text style={styles.rankName}>{lifeRank}</Text>
          <Text style={styles.wingIcon}>⫶</Text>
        </View>
        <Text style={styles.xpText}>
          {totalXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]}>
          <LinearGradient
            colors={[COLORS.gold, '#E8C96A', COLORS.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Shimmer end cap glow */}
          <View style={styles.capGlow} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wingIcon: {
    fontSize: 11,
    color: COLORS.gold,
    opacity: 0.8,
  },
  rankName: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  xpText: {
    fontSize: 10,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  track: {
    height: 6,
    borderRadius: RADIUS.full ?? 99,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full ?? 99,
    overflow: 'hidden',
    position: 'relative',
  },
  capGlow: {
    position: 'absolute',
    right: 0,
    top: -2,
    bottom: -2,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#E8C96A',
    shadowColor: COLORS.gold,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
