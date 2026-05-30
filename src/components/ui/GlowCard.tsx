import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  padding?: number;
  elevated?: boolean;
  noPadding?: boolean;
}

export function GlowCard({
  children,
  style,
  glowColor,
  padding = SPACING.md,
  elevated = false,
  noPadding = false,
}: Props) {
  const webBlur: any =
    Platform.OS === 'web'
      ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }
      : {};

  const shadowPreset = elevated ? SHADOWS.md : SHADOWS.sm;
  const glowOverride = glowColor
    ? {
        shadowColor: glowColor,
        shadowOpacity: 0.45,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        elevation: 16,
      }
    : shadowPreset;

  return (
    <View
      style={[
        styles.outer,
        elevated && styles.outerElevated,
        webBlur,
        glowOverride,
        style,
      ]}
    >
      <View style={[styles.inner, !noPadding && { padding }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
    backgroundColor: COLORS.bgCard,
  },
  outerElevated: {
    backgroundColor: COLORS.bgCardElevated as string,
  },
  inner: {
    flex: 1,
  },
});
