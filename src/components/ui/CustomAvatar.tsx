import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const AVATAR_CONFIGS = [
  { id: 'apex',     icon: 'trending-up' as const,      colors: ['#5B6CF5', '#4550D4'] as const, label: 'Apex' },
  { id: 'blaze',    icon: 'flame' as const,             colors: ['#F97316', '#EA580C'] as const, label: 'Blaze' },
  { id: 'shield',   icon: 'shield-checkmark' as const,  colors: ['#10B981', '#059669'] as const, label: 'Shield' },
  { id: 'cosmos',   icon: 'planet' as const,            colors: ['#8B5CF6', '#7C3AED'] as const, label: 'Cosmos' },
  { id: 'diamond',  icon: 'diamond' as const,           colors: ['#C9A84C', '#B8952A'] as const, label: 'Diamond' },
  { id: 'leaf',     icon: 'leaf' as const,              colors: ['#14B8A6', '#0D9488'] as const, label: 'Leaf' },
  { id: 'rocket',   icon: 'rocket' as const,            colors: ['#EF4444', '#DC2626'] as const, label: 'Rocket' },
  { id: 'flash',    icon: 'flash' as const,             colors: ['#F59E0B', '#D97706'] as const, label: 'Flash' },
  { id: 'infinite', icon: 'infinite' as const,          colors: ['#06B6D4', '#0891B2'] as const, label: 'Infinite' },
  { id: 'compass',  icon: 'compass' as const,           colors: ['#EC4899', '#DB2777'] as const, label: 'Compass' },
  { id: 'eye',      icon: 'eye' as const,               colors: ['#3B82F6', '#2563EB'] as const, label: 'Vision' },
  { id: 'crown',    icon: 'trophy' as const,            colors: ['#D97706', '#B45309'] as const, label: 'Crown' },
];

export function getAvatarConfig(avatarId: string) {
  return AVATAR_CONFIGS.find((a) => a.id === avatarId) ?? AVATAR_CONFIGS[0];
}

interface CustomAvatarProps {
  avatarId: string;
  size: number;
  selected?: boolean;
}

export function CustomAvatar({ avatarId, size, selected = false }: CustomAvatarProps) {
  const config = getAvatarConfig(avatarId);
  const iconSize = Math.round(size * 0.45);
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius,
        },
        selected && {
          shadowColor: '#C9A84C',
          shadowOpacity: 0.9,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    >
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { width: size, height: size, borderRadius }]}
      >
        <Ionicons name={config.icon} size={iconSize} color="#fff" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
