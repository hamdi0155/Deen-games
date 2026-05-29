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
      <View style={styles.avatarWrap}>
        <Text style={styles.avatar}>{avatarEmoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rank}>{lifeRank}</Text>
        <View style={styles.xpRow}>
          <XPBar progress={progress} height={5} color={COLORS.accent} style={styles.bar} />
          <Text style={styles.xpText}>{xpToNext} XP to next level</Text>
        </View>
      </View>

      <LevelBadge level={overallLevel} size={56} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: SPACING.lg,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  avatar: { fontSize: 36 },
  info: { flex: 1, gap: SPACING.xs },
  name: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  rank: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: FONTS.weights.semibold,
  },
  xpRow: { gap: 5 },
  bar: { marginTop: 2 },
  xpText: { fontSize: FONTS.sizes.xs, color: COLORS.textDim },
});
