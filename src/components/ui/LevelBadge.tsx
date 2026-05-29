import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface Props {
  level: number;
  color?: string;
  size?: number;
}

export function LevelBadge({ level, color = COLORS.accent, size = 40 }: Props) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          shadowColor: color,
          backgroundColor: color + '18',
        },
      ]}
    >
      <Text style={[styles.level, { fontSize: size * 0.34, color }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  level: {
    fontWeight: FONTS.weights.bold,
  },
});
