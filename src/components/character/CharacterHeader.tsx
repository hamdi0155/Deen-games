import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { CustomAvatar } from '../ui/CustomAvatar';

interface Props {
  name: string;
  avatarId: string;
  overallLevel: number;
  totalXP?: number;
  lifeRank: string;
  rightSlot?: React.ReactNode;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still awake,';
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  if (hour < 21) return 'Good evening,';
  return 'Good night,';
}

export function CharacterHeader({ name, avatarId, overallLevel, lifeRank, rightSlot }: Props) {
  return (
    <LinearGradient
      colors={['rgba(99,102,241,0.14)', 'rgba(124,58,237,0.06)', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Left: avatar + level pin */}
      <View style={styles.avatarWrap}>
        <CustomAvatar avatarId={avatarId} size={62} />
        <View style={styles.levelPin}>
          <Text style={styles.levelPinText}>{overallLevel}</Text>
        </View>
      </View>

      {/* Center: name + greeting + rank */}
      <View style={styles.info}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>Every small step compounds.</Text>
        <Text style={styles.rank}>{lifeRank.toUpperCase()}</Text>
      </View>

      {/* Right: slot (MomentumCard) */}
      {rightSlot && (
        <View style={styles.rightSlot}>
          {rightSlot}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: SPACING.sm,
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  levelPin: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.bg,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  levelPinText: {
    fontSize: 11,
    color: COLORS.bg,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.3,
  },
  info: { flex: 1, gap: 2, paddingTop: 2 },
  greeting: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  name: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textDim,
    letterSpacing: 0.2,
  },
  rank: {
    fontSize: 9,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontFamily: FONTS.families.displayLight,
    marginTop: 1,
  },
  rightSlot: {
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
});
