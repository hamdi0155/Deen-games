import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { LevelBadge } from '../ui/LevelBadge';
import { XPBar } from '../ui/XPBar';
import { xpProgress } from '../../services/xpService';

interface Props {
  name: string;
  avatarEmoji: string;
  overallLevel: number;
  totalXP: number;
  lifeRank: string;
}

export function CharacterHeader({ name, avatarEmoji, overallLevel, totalXP, lifeRank }: Props) {
  const { progress, xpToNext } = xpProgress(totalXP);

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>{avatarEmoji}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rank}>{lifeRank}</Text>
        <View style={styles.xpRow}>
          <XPBar progress={progress} height={8} style={styles.bar} />
          <Text style={styles.xpText}>{xpToNext} XP to next level</Text>
        </View>
      </View>
      <LevelBadge level={overallLevel} size={52} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  avatar: {
    fontSize: 48,
  },
  info: {
    flex: 1,
    gap: SPACING.xs,
  },
  name: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  rank: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  xpRow: {
    gap: 4,
  },
  bar: {
    marginTop: 2,
  },
  xpText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textDim,
  },
});
