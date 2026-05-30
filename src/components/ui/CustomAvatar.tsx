import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import { CustomAvatarFace, AvatarConfig } from './CustomAvatarFace';

function parseAvatarConfig(avatarId: string): AvatarConfig | null {
  if (!avatarId.startsWith('{')) return null;
  try { return JSON.parse(avatarId) as AvatarConfig; } catch { return null; }
}

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

function AvatarGlyph({ id, size, color }: { id: string; size: number; color: string }) {
  const s = size;

  switch (id) {
    case 'apex':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M3 17 L9 11 L13 15 L21 7" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M15 7 L21 7 L21 13" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'blaze':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M12 2 C12 2 8 6 8 11 C8 14.3 10 16 12 17 C14 16 16 14.3 16 11 C16 6 12 2Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" />
          <Path d="M10 17 C10 19.2 11 21 12 21 C13 21 14 19.2 14 17" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'shield':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M12 2 L20 6 L20 13 C20 17.5 16.5 21 12 22 C7.5 21 4 17.5 4 13 L4 6 Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9 12 L11 14 L15 10" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'cosmos':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} />
          <G transform="rotate(30, 12, 12)">
            <Ellipse cx={12} cy={12} rx={10} ry={4} stroke={color} strokeWidth={1.8} fill="none" />
          </G>
        </Svg>
      );
    case 'diamond':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M12 2 L22 12 L12 22 L2 12 Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M12 7 L17 12 L12 17 L7 12 Z" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'leaf':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M12 21 C12 21 5 15 5 8 C5 4.7 8.1 2 12 2 C15.9 2 19 4.7 19 8 C19 15 12 21 12 21Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" />
          <Path d="M12 21 L12 8" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'rocket':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M12 2 C8 2 5 5 5 12 L5 17 L7 19 L12 21 L17 19 L19 17 L19 12 C19 5 16 2 12 2Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9 21 L9 19" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M15 21 L15 19" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Circle cx={12} cy={10} r={2} stroke={color} strokeWidth={1.5} fill="none" />
        </Svg>
      );
    case 'flash':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M13 2 L6 14 L11 14 L11 22 L18 10 L13 10 Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'infinite':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M5 12 C5 9.8 6.8 8 9 8 C11 8 12 9.5 12 12 C12 14.5 13 16 15 16 C17.2 16 19 14.2 19 12 C19 9.8 17.2 8 15 8 C13 8 12 9.5 12 12 C12 14.5 11 16 9 16 C6.8 16 5 14.2 5 12Z" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'compass':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} fill="none" />
          <Path d="M12 3 L12 5" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M12 19 L12 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M3 12 L5 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M19 12 L21 12" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M9 9 L15 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M15 9 L9 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M2 12 C2 12 6 6 12 6 C18 6 22 12 22 12 C22 12 18 18 12 18 C6 18 2 12 2 12Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.2} strokeLinecap="round" />
          <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.4} />
        </Svg>
      );
    case 'crown':
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M6 9 L4 3 L9 7 L12 2 L15 7 L20 3 L18 9 C18 13 15 15 12 15 C9 15 6 13 6 9Z" stroke={color} strokeWidth={1.8} fill={color} fillOpacity={0.3} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M8 15 L8 19 L16 19 L16 15" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M6 19 L18 19" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    default:
      return (
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Circle cx={12} cy={12} r={6} stroke={color} strokeWidth={2} fill={color} fillOpacity={0.3} />
        </Svg>
      );
  }
}

interface CustomAvatarProps {
  avatarId: string;
  size: number;
  selected?: boolean;
}

export function CustomAvatar({ avatarId, size, selected = false }: CustomAvatarProps) {
  const ringPad = 3;
  const outerSize = size + ringPad * 2;

  const ringStyle = {
    width: outerSize,
    height: outerSize,
    borderRadius: outerSize / 2,
    borderColor: selected ? '#C9A84C' : 'rgba(201,168,76,0.35)',
    borderWidth: selected ? 2.5 : 1.5,
    shadowColor: '#C9A84C',
    shadowOpacity: selected ? 0.8 : 0.25,
    shadowRadius: selected ? 14 : 6,
    shadowOffset: { width: 0, height: 0 },
  };

  // JSON-encoded AvatarConfig → render custom SVG face
  const avatarCfg = parseAvatarConfig(avatarId);
  if (avatarCfg) {
    return (
      <View style={[styles.outerRing, ringStyle]}>
        <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
          <CustomAvatarFace config={avatarCfg} size={size} />
        </View>
      </View>
    );
  }

  // Legacy preset ID → Unsplash portrait photo
  const config = getAvatarConfig(avatarId);
  const borderRadius = size / 2;

  return (
    <View style={[styles.outerRing, ringStyle]}>
      <View style={{ width: size, height: size, borderRadius, overflow: 'hidden' }}>
        <Image
          source={{ uri: config.portrait }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(4,5,8,0.45)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: config.colors[0] + '18', borderRadius }]} />
      </View>
    </View>
  );
}

export { AvatarGlyph };

const styles = StyleSheet.create({
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
