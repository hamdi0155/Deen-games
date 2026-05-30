import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Rect } from 'react-native-svg';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkinTone = 'light' | 'medium' | 'tan' | 'brown' | 'dark';
export type HairStyle = 'short' | 'medium' | 'long' | 'bald' | 'hijab' | 'afro';
export type HairColor = 'black' | 'brown' | 'blonde' | 'auburn' | 'white' | 'gray';
export type EyeColor = 'brown' | 'hazel' | 'blue' | 'green';
export type MouthStyle = 'smile' | 'grin' | 'neutral';
export type Accessory = 'none' | 'glasses' | 'beard' | 'beard_glasses';

export interface MemojiConfig {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeColor: EyeColor;
  mouth: MouthStyle;
  accessory: Accessory;
  bgColor: string;
}

export const DEFAULT_MEMOJI: MemojiConfig = {
  skinTone: 'medium',
  hairStyle: 'short',
  hairColor: 'black',
  eyeColor: 'brown',
  mouth: 'smile',
  accessory: 'none',
  bgColor: '#5B6CF5',
};

// ─── Color maps ───────────────────────────────────────────────────────────────

export const SKIN_COLORS: Record<SkinTone, { base: string; shadow: string; highlight: string }> = {
  light:  { base: '#FDE8C8', shadow: '#EECDA0', highlight: '#FFF5E8' },
  medium: { base: '#F5C28A', shadow: '#DFA06A', highlight: '#FFDAAA' },
  tan:    { base: '#D4915E', shadow: '#B87040', highlight: '#E8AA7A' },
  brown:  { base: '#A05C3A', shadow: '#7A3E22', highlight: '#BC7856' },
  dark:   { base: '#5C3525', shadow: '#3E1E12', highlight: '#784840' },
};

export const HAIR_COLORS: Record<HairColor, string> = {
  black:  '#1A1008',
  brown:  '#4A2E1A',
  blonde: '#C8942A',
  auburn: '#7A3020',
  white:  '#DCD8D0',
  gray:   '#888880',
};

export const EYE_COLORS: Record<EyeColor, string> = {
  brown: '#5B3820',
  hazel: '#7A6040',
  blue:  '#2E6EA8',
  green: '#2A7840',
};

export const BG_COLORS = [
  '#5B6CF5', '#8B5CF6', '#EC4899', '#EF4444',
  '#F97316', '#F59E0B', '#C9A84C', '#10B981',
  '#14B8A6', '#06B6D4', '#3B82F6', '#1E1B4B',
];

// ─── Preset configs (maps old string IDs to Memoji configs) ──────────────────

export const MEMOJI_PRESETS: Record<string, MemojiConfig> = {
  apex:     { skinTone: 'medium', hairStyle: 'short',  hairColor: 'black',  eyeColor: 'brown', mouth: 'smile',   accessory: 'none',         bgColor: '#5B6CF5' },
  blaze:    { skinTone: 'tan',    hairStyle: 'short',  hairColor: 'auburn', eyeColor: 'brown', mouth: 'grin',    accessory: 'none',         bgColor: '#F97316' },
  shield:   { skinTone: 'light',  hairStyle: 'medium', hairColor: 'brown',  eyeColor: 'green', mouth: 'neutral', accessory: 'none',         bgColor: '#10B981' },
  cosmos:   { skinTone: 'dark',   hairStyle: 'afro',   hairColor: 'black',  eyeColor: 'brown', mouth: 'smile',   accessory: 'none',         bgColor: '#8B5CF6' },
  diamond:  { skinTone: 'light',  hairStyle: 'long',   hairColor: 'blonde', eyeColor: 'blue',  mouth: 'smile',   accessory: 'none',         bgColor: '#C9A84C' },
  leaf:     { skinTone: 'medium', hairStyle: 'long',   hairColor: 'brown',  eyeColor: 'hazel', mouth: 'grin',    accessory: 'none',         bgColor: '#14B8A6' },
  rocket:   { skinTone: 'tan',    hairStyle: 'short',  hairColor: 'black',  eyeColor: 'brown', mouth: 'grin',    accessory: 'glasses',       bgColor: '#EF4444' },
  flash:    { skinTone: 'light',  hairStyle: 'short',  hairColor: 'blonde', eyeColor: 'blue',  mouth: 'grin',    accessory: 'none',         bgColor: '#F59E0B' },
  infinite: { skinTone: 'medium', hairStyle: 'bald',   hairColor: 'black',  eyeColor: 'brown', mouth: 'neutral', accessory: 'beard',        bgColor: '#06B6D4' },
  compass:  { skinTone: 'tan',    hairStyle: 'hijab',  hairColor: 'black',  eyeColor: 'brown', mouth: 'smile',   accessory: 'none',         bgColor: '#EC4899' },
  eye:      { skinTone: 'light',  hairStyle: 'long',   hairColor: 'black',  eyeColor: 'blue',  mouth: 'neutral', accessory: 'glasses',       bgColor: '#3B82F6' },
  crown:    { skinTone: 'brown',  hairStyle: 'short',  hairColor: 'black',  eyeColor: 'brown', mouth: 'smile',   accessory: 'beard_glasses', bgColor: '#D97706' },
};

export function parseMemojiConfig(stored: string): MemojiConfig {
  try {
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && 'skinTone' in parsed) {
      return parsed as MemojiConfig;
    }
  } catch {}
  return MEMOJI_PRESETS[stored] ?? DEFAULT_MEMOJI;
}

// ─── AvatarFace SVG ───────────────────────────────────────────────────────────

interface FaceProps {
  config: MemojiConfig;
  size: number;
}

export function AvatarFace({ config, size }: FaceProps) {
  const skin = SKIN_COLORS[config.skinTone];
  const hair = HAIR_COLORS[config.hairColor];
  const iris = EYE_COLORS[config.eyeColor];
  const isHijab = config.hairStyle === 'hijab';
  const eyebrowColor = config.hairColor === 'white' || config.hairColor === 'gray' ? '#666' : hair;
  const hasBeard = config.accessory === 'beard' || config.accessory === 'beard_glasses';
  const hasGlasses = config.accessory === 'glasses' || config.accessory === 'beard_glasses';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">

      {/* ── 1. Background ── */}
      <Circle cx="50" cy="50" r="50" fill={config.bgColor} />

      {/* ── 2. Body / shoulder stub ── */}
      <Ellipse
        cx="50" cy="100"
        rx="36" ry="22"
        fill={isHijab ? hair : skin.base}
      />

      {/* ── 3. Neck (non-hijab) ── */}
      {!isHijab && (
        <Rect x="43" y="77" width="14" height="16" rx="5" fill={skin.base} />
      )}

      {/* ── 4. Long hair back curtains ── */}
      {config.hairStyle === 'long' && (
        <G>
          <Path d="M 27 52 Q 18 68 20 96 Q 28 86 33 76 L 31 52 Z" fill={hair} />
          <Path d="M 73 52 Q 82 68 80 96 Q 72 86 67 76 L 69 52 Z" fill={hair} />
        </G>
      )}

      {/* ── 5. Hijab outer fabric ── */}
      {isHijab && (
        <G>
          <Circle cx="50" cy="50" r="47" fill={hair} />
          <Path
            d="M 20 24 Q 50 12 80 24 Q 86 40 82 52 Q 68 44 50 42 Q 32 44 18 52 Q 14 40 20 24 Z"
            fill={hair}
            fillOpacity="0.5"
          />
        </G>
      )}

      {/* ── 6. Head ellipse ── */}
      <Ellipse cx="50" cy="54" rx="24" ry="26" fill={skin.base} />

      {/* ── 7. Ears (non-hijab) ── */}
      {!isHijab && (
        <G>
          <Ellipse cx="26" cy="56" rx="4.5" ry="5.5" fill={skin.base} />
          <Ellipse cx="27.5" cy="56" rx="2.8" ry="4" fill={skin.shadow} />
          <Ellipse cx="74" cy="56" rx="4.5" ry="5.5" fill={skin.base} />
          <Ellipse cx="72.5" cy="56" rx="2.8" ry="4" fill={skin.shadow} />
        </G>
      )}

      {/* Forehead highlight */}
      <Ellipse cx="44" cy="40" rx="9" ry="5" fill={skin.highlight} fillOpacity="0.40" />

      {/* ── 8. Hair front cap ── */}
      {config.hairStyle === 'short' && (
        <Path
          d="M 27 52 Q 27 27 50 25 Q 73 27 73 52 Q 67 37 50 35 Q 33 37 27 52 Z"
          fill={hair}
        />
      )}

      {config.hairStyle === 'medium' && (
        <G>
          <Path
            d="M 27 52 Q 27 27 50 25 Q 73 27 73 52 Q 67 37 50 35 Q 33 37 27 52 Z"
            fill={hair}
          />
          <Path d="M 27 52 Q 24 60 25 68 Q 29 62 31 56 Z" fill={hair} />
          <Path d="M 73 52 Q 76 60 75 68 Q 71 62 69 56 Z" fill={hair} />
        </G>
      )}

      {config.hairStyle === 'long' && (
        <Path
          d="M 27 52 Q 27 27 50 25 Q 73 27 73 52 Q 67 37 50 35 Q 33 37 27 52 Z"
          fill={hair}
        />
      )}

      {config.hairStyle === 'afro' && (
        <G>
          <Ellipse cx="50" cy="34" rx="29" ry="25" fill={hair} />
          <Circle cx="36" cy="30" r="3.5" fill={hair} fillOpacity="0.55" />
          <Circle cx="64" cy="28" r="4"   fill={hair} fillOpacity="0.55" />
          <Circle cx="50" cy="20" r="3"   fill={hair} fillOpacity="0.55" />
          <Circle cx="42" cy="22" r="2.5" fill={hair} fillOpacity="0.55" />
          <Circle cx="60" cy="22" r="2.5" fill={hair} fillOpacity="0.55" />
        </G>
      )}

      {/* ── 9. Eyebrows ── */}
      <Path
        d="M 34 42 Q 40 39 44 41"
        stroke={eyebrowColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <Path
        d="M 56 41 Q 60 39 66 42"
        stroke={eyebrowColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
      />

      {/* ── 10. Left Eye ── */}
      <Ellipse cx="40" cy="52" rx="7" ry="6" fill="white" />
      <Circle cx="40" cy="52" r="4" fill={iris} />
      <Circle cx="40" cy="52" r="2.2" fill="#080808" />
      <Circle cx="42" cy="50" r="1.4" fill="white" />
      <Path
        d="M 33.5 52 Q 40 46.5 46.5 52"
        stroke="#1A1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />

      {/* ── 11. Right Eye ── */}
      <Ellipse cx="60" cy="52" rx="7" ry="6" fill="white" />
      <Circle cx="60" cy="52" r="4" fill={iris} />
      <Circle cx="60" cy="52" r="2.2" fill="#080808" />
      <Circle cx="62" cy="50" r="1.4" fill="white" />
      <Path
        d="M 53.5 52 Q 60 46.5 66.5 52"
        stroke="#1A1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
      />

      {/* ── 12. Nose ── */}
      <Path
        d="M 48 60 Q 46 65 48 67 Q 50 68 52 67 Q 54 65 52 60"
        stroke={skin.shadow} strokeWidth="1.5" fill="none" strokeLinecap="round"
      />

      {/* ── 13. Mouth ── */}
      {config.mouth === 'smile' && (
        <Path
          d="M 42 72 Q 50 79 58 72"
          stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
      )}
      {config.mouth === 'grin' && (
        <G>
          <Path
            d="M 40 71 Q 50 80 60 71"
            stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
          <Path d="M 43 72 Q 50 77 57 72" fill="white" stroke="none" />
        </G>
      )}
      {config.mouth === 'neutral' && (
        <Path
          d="M 43 73 L 57 73"
          stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
      )}

      {/* Cheek blush */}
      {(config.skinTone === 'light' || config.skinTone === 'medium') && (
        <G>
          <Ellipse cx="34" cy="65" rx="7" ry="4" fill="#FF7070" fillOpacity="0.18" />
          <Ellipse cx="66" cy="65" rx="7" ry="4" fill="#FF7070" fillOpacity="0.18" />
        </G>
      )}

      {/* ── 14. Beard ── */}
      {hasBeard && (
        <Path
          d="M 33 70 Q 34 83 50 85 Q 66 83 67 70 Q 62 76 50 77 Q 38 76 33 70 Z"
          fill={hair}
          fillOpacity="0.88"
        />
      )}

      {/* ── 15. Glasses ── */}
      {hasGlasses && (
        <G>
          <Ellipse cx="40" cy="52" rx="8.5" ry="7" stroke="#1C1C1C" strokeWidth="2.5" fill="rgba(180,210,255,0.12)" />
          <Ellipse cx="60" cy="52" rx="8.5" ry="7" stroke="#1C1C1C" strokeWidth="2.5" fill="rgba(180,210,255,0.12)" />
          <Path d="M 48.5 52 L 51.5 52" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" />
          <Path d="M 31.5 52 L 26 50"  stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" />
          <Path d="M 68.5 52 L 74 50"  stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" />
        </G>
      )}

    </Svg>
  );
}

// ─── CustomAvatar wrapper (drop-in replacement) ───────────────────────────────

interface CustomAvatarProps {
  avatarId: string;
  size: number;
  selected?: boolean;
}

export function CustomAvatar({ avatarId, size, selected = false }: CustomAvatarProps) {
  const config = parseMemojiConfig(avatarId);
  const pad = 3;
  const outerSize = size + pad * 2;

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
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
        <AvatarFace config={config} size={size} />
      </View>
    </View>
  );
}

// ─── Legacy compat — kept so old imports don't break ─────────────────────────

export const AVATAR_CONFIGS = Object.entries(MEMOJI_PRESETS).map(([id, cfg]) => ({
  id,
  colors: [cfg.bgColor, cfg.bgColor] as const,
  label: id.charAt(0).toUpperCase() + id.slice(1),
}));

export function getAvatarConfig(avatarId: string) {
  return AVATAR_CONFIGS.find((a) => a.id === avatarId) ?? AVATAR_CONFIGS[0];
}

const styles = StyleSheet.create({
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
