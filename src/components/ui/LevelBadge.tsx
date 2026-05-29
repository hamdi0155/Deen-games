import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../constants/theme';

interface Props {
  level: number;
  color?: string;
  size?: number;
}

export function LevelBadge({ level, color = COLORS.accent, size = 40 }: Props) {
  return (
    <LinearGradient
      colors={[color + '30', color + '10']}
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          shadowColor: color,
        },
      ]}
    >
      <Text style={[styles.level, { fontSize: size * 0.34, color }]}>{level}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  level: {
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
});
