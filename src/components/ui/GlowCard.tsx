import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  padding?: number;
}

export function GlowCard({ children, style, glowColor, padding = SPACING.md }: Props) {
  const webBlur: any = Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {};

  return (
    <View
      style={[
        styles.card,
        webBlur,
        glowColor && {
          shadowColor: glowColor,
          shadowOpacity: 0.5,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 6 },
          elevation: 16,
        },
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
});
