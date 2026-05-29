import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlowCard } from './GlowCard';
import { Achievement } from '../../constants/achievements';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import type { ViewStyle } from 'react-native';

interface Props {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: Props) {
  return (
    <View style={[styles.wrapper, !unlocked && styles.lockedWrapper]}>
      <GlowCard
        glowColor={unlocked ? '#FFD700' : undefined}
        style={StyleSheet.flatten([
          styles.card,
          unlocked && styles.unlockedCard,
        ]) as ViewStyle}
      >
        <Text style={styles.emoji}>
          {unlocked ? achievement.emoji : '🔒'}
        </Text>
        <Text style={[styles.title, !unlocked && styles.lockedTitle]}>
          {achievement.title}
        </Text>
        <Text style={[styles.description, !unlocked && styles.lockedDescription]}>
          {achievement.description}
        </Text>
      </GlowCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '47%',
  },
  lockedWrapper: {
    opacity: 0.35,
  },
  card: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  unlockedCard: {
    borderColor: 'rgba(255,215,0,0.4)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  lockedTitle: {
    color: COLORS.textMuted,
  },
  description: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  lockedDescription: {
    color: COLORS.textDim,
  },
});
