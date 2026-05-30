import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowCard } from './GlowCard';
import { AscendIcon } from '../icons/AscendIcon';
import { Achievement } from '../../types';
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
        glowColor={unlocked ? '#F59E0B' : undefined}
        style={StyleSheet.flatten([
          styles.card,
          unlocked && styles.unlockedCard,
        ]) as ViewStyle}
      >
        {unlocked && (
          <LinearGradient
            colors={['rgba(245,158,11,0.12)', 'rgba(245,158,11,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.iconWrap}>
          <AscendIcon
            name={unlocked ? achievement.iconName : 'lock'}
            size={32}
            color={unlocked ? '#F59E0B' : 'rgba(255,255,255,0.3)'}
          />
        </View>
        <Text style={[styles.title, unlocked ? styles.unlockedTitle : styles.lockedTitle]}>
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
    overflow: 'hidden',
    borderColor: '#F59E0B' + '15',
  },
  unlockedCard: {
    borderColor: '#F59E0B' + '60',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
  },
  iconWrap: {
    marginBottom: 4,
  },
  title: {
    fontSize: FONTS.sizes.sm,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  unlockedTitle: {
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  lockedTitle: {
    fontFamily: FONTS.families.displayLight,
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
