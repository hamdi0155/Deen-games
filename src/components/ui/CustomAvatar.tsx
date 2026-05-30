import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Portrait-style avatars using Unsplash CDN (dark, moody, RPG-compatible)
export const AVATAR_CONFIGS = [
  {
    id: 'apex',
    portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    colors: ['#5B6CF5', '#4550D4'] as const,
    label: 'Apex',
  },
  {
    id: 'blaze',
    portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    colors: ['#F97316', '#EA580C'] as const,
    label: 'Blaze',
  },
  {
    id: 'shield',
    portrait: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    colors: ['#10B981', '#059669'] as const,
    label: 'Shield',
  },
  {
    id: 'cosmos',
    portrait: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200&h=200&fit=crop&crop=face',
    colors: ['#8B5CF6', '#7C3AED'] as const,
    label: 'Cosmos',
  },
  {
    id: 'diamond',
    portrait: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face',
    colors: ['#C9A84C', '#B8952A'] as const,
    label: 'Diamond',
  },
  {
    id: 'leaf',
    portrait: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    colors: ['#14B8A6', '#0D9488'] as const,
    label: 'Leaf',
  },
  {
    id: 'rocket',
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    colors: ['#EF4444', '#DC2626'] as const,
    label: 'Rocket',
  },
  {
    id: 'flash',
    portrait: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    colors: ['#F59E0B', '#D97706'] as const,
    label: 'Flash',
  },
  {
    id: 'infinite',
    portrait: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200&h=200&fit=crop&crop=face',
    colors: ['#06B6D4', '#0891B2'] as const,
    label: 'Infinite',
  },
  {
    id: 'compass',
    portrait: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
    colors: ['#EC4899', '#DB2777'] as const,
    label: 'Compass',
  },
  {
    id: 'eye',
    portrait: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face',
    colors: ['#3B82F6', '#2563EB'] as const,
    label: 'Vision',
  },
  {
    id: 'crown',
    portrait: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face',
    colors: ['#D97706', '#B45309'] as const,
    label: 'Crown',
  },
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
  const borderRadius = size / 2;
  const ringPad = 3;
  const outerSize = size + ringPad * 2;

  return (
    <View
      style={[
        styles.outerRing,
        {
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          borderColor: selected ? '#C9A84C' : 'rgba(201,168,76,0.35)',
          borderWidth: selected ? 2.5 : 1.5,
          shadowColor: '#C9A84C',
          shadowOpacity: selected ? 0.8 : 0.25,
          shadowRadius: selected ? 14 : 6,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: config.portrait }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
        {/* Dark overlay to preserve RPG feel */}
        <LinearGradient
          colors={['transparent', 'rgba(4,5,8,0.45)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Subtle color tint from avatar's palette */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: config.colors[0] + '18',
              borderRadius,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
