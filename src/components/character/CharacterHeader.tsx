import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { LevelBadge } from '../ui/LevelBadge';
import { XPBar } from '../ui/XPBar';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { xpProgress } from '../../services/xpService';

interface Props {
  name: string;
  avatarEmoji: string;
  overallLevel: number;
  totalXP: number;
  lifeRank: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still awake,';
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  if (hour < 21) return 'Good evening,';
  return 'Good night,';
}

export function CharacterHeader({ name, avatarEmoji, overallLevel, totalXP, lifeRank }: Props) {
  const { progress, xpToNext } = xpProgress(totalXP);

  return (
    <LinearGradient
      colors={['rgba(99,102,241,0.14)', 'rgba(124,58,237,0.06)', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.avatarWrap}>
        <LinearGradient
          colors={['rgba(99,102,241,0.3)', 'rgba(124,58,237,0.15)']}
          style={styles.avatarRing}
        >
          <Text style={styles.avatar}>{avatarEmoji}</Text>
        </LinearGradient>
        <View style={styles.levelPin}>
          <Text style={styles.levelPinText}>{overallLevel}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rank}>{lifeRank}</Text>
        <View style={styles.xpRow}>
          <XPBar progress={progress} height={5} color={COLORS.accent} style={styles.bar} />
          <View style={styles.xpMeta}>
            <AnimatedCounter
              value={totalXP}
              style={styles.xpTotal}
              formatter={(n) => n.toLocaleString()}
            />
            <Text style={styles.xpText}>{xpToNext.toLocaleString()} to next</Text>
          </View>
        </View>
      </View>

      <LevelBadge level={overallLevel} size={52} />
    </LinearGradient>
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
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: SPACING.lg,
  },
  avatarWrap: { position: 'relative' },
  avatarRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99,102,241,0.5)',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  avatar: { fontSize: 38 },
  levelPin: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  levelPinText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: FONTS.families.display,
    letterSpacing: 0.3,
  },
  info: { flex: 1, gap: 2 },
  greeting: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  name: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.8,
    lineHeight: 26,
  },
  rank: {
    fontSize: 10,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontFamily: FONTS.families.displayLight,
  },
  xpRow: { gap: 4 },
  bar: { marginTop: 2 },
  xpMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpTotal: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    fontFamily: FONTS.families.bodyBold,
  },
  xpText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textDim,
    fontFamily: FONTS.families.body,
  },
});
