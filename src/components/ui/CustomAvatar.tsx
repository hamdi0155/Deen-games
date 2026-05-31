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
  const eyebrowColor = config.hairColor === 'white' || config.hairColor === 'gray'
    ? '#888'
    : config.hairColor === 'blonde' ? '#9A7020' : hair;
  const hasBeard = config.accessory === 'beard' || config.accessory === 'beard_glasses';
  const hasGlasses = config.accessory === 'glasses' || config.accessory === 'beard_glasses';

  // Shared hair shine overlay path (top-center arc)
  const hairShine = (cx: number, cy: number) => (
    <Ellipse cx={cx} cy={cy} rx="10" ry="5" fill="white" fillOpacity="0.13" />
  );

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">

      {/* ── 1. Background with subtle radial vignette ── */}
      <Circle cx="50" cy="50" r="50" fill={config.bgColor} />
      <Circle cx="50" cy="50" r="50" fill="rgba(0,0,0,0.10)" />
      <Circle cx="50" cy="50" r="50" fill="rgba(255,255,255,0.07)" />

      {/* ── 2. Body / shoulders ── */}
      <Ellipse cx="50" cy="102" rx="38" ry="20" fill={isHijab ? hair : skin.base} />

      {/* ── 3. Neck ── */}
      {!isHijab && (
        <Rect x="43" y="76" width="14" height="18" rx="6" fill={skin.base} />
      )}

      {/* ── 4. Long hair back curtains ── */}
      {config.hairStyle === 'long' && (
        <G>
          {/* Wide flowing panels behind the head */}
          <Path d="M 25 44 Q 12 62 14 100 Q 24 84 30 68 Q 28 56 27 44 Z" fill={hair} />
          <Path d="M 75 44 Q 88 62 86 100 Q 76 84 70 68 Q 72 56 73 44 Z" fill={hair} />
          {/* Sheen streaks */}
          <Path d="M 17 60 Q 16 72 18 84 Q 20 74 19 64 Z" fill="white" fillOpacity="0.12" />
          <Path d="M 83 60 Q 84 72 82 84 Q 80 74 81 64 Z" fill="white" fillOpacity="0.12" />
        </G>
      )}

      {/* ── 5. Hijab fabric ── */}
      {isHijab && (
        <G>
          <Circle cx="50" cy="48" r="47" fill={hair} />
          {/* Fabric fold shadow */}
          <Path
            d="M 18 55 Q 50 45 82 55 Q 76 60 50 58 Q 24 60 18 55 Z"
            fill="rgba(0,0,0,0.15)"
          />
          {/* Fabric shine */}
          <Ellipse cx="42" cy="30" rx="12" ry="6" fill="white" fillOpacity="0.12" />
        </G>
      )}

      {/* ── 6. Head — slightly taller oval ── */}
      <Ellipse cx="50" cy="53" rx="25" ry="27" fill={skin.base} />

      {/* Chin shadow for depth */}
      <Ellipse cx="50" cy="77" rx="15" ry="5" fill={skin.shadow} fillOpacity="0.30" />

      {/* ── 7. Ears ── */}
      {!isHijab && (
        <G>
          <Ellipse cx="25" cy="55" rx="5" ry="6" fill={skin.base} />
          <Ellipse cx="26.5" cy="55" rx="3" ry="4.2" fill={skin.shadow} fillOpacity="0.55" />
          <Ellipse cx="75" cy="55" rx="5" ry="6" fill={skin.base} />
          <Ellipse cx="73.5" cy="55" rx="3" ry="4.2" fill={skin.shadow} fillOpacity="0.55" />
        </G>
      )}

      {/* Forehead highlight */}
      <Ellipse cx="43" cy="37" rx="11" ry="6" fill={skin.highlight} fillOpacity="0.45" />

      {/* ── 8. Hair front cap ── */}
      {config.hairStyle === 'short' && (
        <G>
          {/* Outer arc rises high above head (y=9) for visible crown volume */}
          <Path
            d="M 26 52 Q 21 12 50 8 Q 79 12 74 52 Q 68 36 50 34 Q 32 36 26 52 Z"
            fill={hair}
          />
          <Ellipse cx="43" cy="21" rx="11" ry="5" fill="white" fillOpacity="0.16" />
        </G>
      )}

      {config.hairStyle === 'medium' && (
        <G>
          <Path
            d="M 26 52 Q 21 12 50 8 Q 79 12 74 52 Q 68 36 50 34 Q 32 36 26 52 Z"
            fill={hair}
          />
          {/* Side panels curving down past jawline */}
          <Path d="M 26 52 Q 19 66 20 86 Q 26 72 30 58 Z" fill={hair} />
          <Path d="M 74 52 Q 81 66 80 86 Q 74 72 70 58 Z" fill={hair} />
          <Ellipse cx="43" cy="21" rx="11" ry="5" fill="white" fillOpacity="0.16" />
        </G>
      )}

      {config.hairStyle === 'long' && (
        <G>
          <Path
            d="M 26 52 Q 21 12 50 8 Q 79 12 74 52 Q 68 36 50 34 Q 32 36 26 52 Z"
            fill={hair}
          />
          <Ellipse cx="43" cy="21" rx="11" ry="5" fill="white" fillOpacity="0.16" />
        </G>
      )}

      {config.hairStyle === 'afro' && (
        <G>
          {/* Large central puff + perimeter bumps for volume */}
          <Ellipse cx="50" cy="22" rx="32" ry="26" fill={hair} />
          <Circle cx="30" cy="20" r="7"   fill={hair} />
          <Circle cx="70" cy="18" r="8"   fill={hair} />
          <Circle cx="50" cy="6"  r="7"   fill={hair} />
          <Circle cx="38" cy="10" r="6"   fill={hair} />
          <Circle cx="63" cy="10" r="6.5" fill={hair} />
          <Circle cx="22" cy="32" r="6"   fill={hair} />
          <Circle cx="78" cy="30" r="6"   fill={hair} />
          <Circle cx="20" cy="44" r="5"   fill={hair} />
          <Circle cx="80" cy="42" r="5"   fill={hair} />
          <Ellipse cx="42" cy="14" rx="11" ry="5" fill="white" fillOpacity="0.14" />
        </G>
      )}

      {/* ── 9. Eyebrows — thicker, arched ── */}
      <Path
        d="M 32 43 Q 39 38.5 45 41"
        stroke={eyebrowColor} strokeWidth="3" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M 55 41 Q 61 38.5 68 43"
        stroke={eyebrowColor} strokeWidth="3" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── 10. Left Eye — large and expressive ── */}
      {/* White sclera */}
      <Ellipse cx="39" cy="51" rx="9.5" ry="8" fill="white" />
      {/* Iris */}
      <Circle cx="39" cy="51" r="5.5" fill={iris} />
      {/* Pupil */}
      <Circle cx="39" cy="51" r="3"   fill="#0D0D0D" />
      {/* Catchlight */}
      <Circle cx="41.5" cy="48.5" r="1.8" fill="white" />
      <Circle cx="38"   cy="54"   r="0.8" fill="white" fillOpacity="0.6" />
      {/* Upper eyelid line */}
      <Path
        d="M 30 51 Q 39 43 48 51"
        stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      {/* Lower lash hint */}
      <Path
        d="M 31 53 Q 39 58 47 53"
        stroke={skin.shadow} strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.4"
      />

      {/* ── 11. Right Eye ── */}
      <Ellipse cx="61" cy="51" rx="9.5" ry="8" fill="white" />
      <Circle cx="61" cy="51" r="5.5" fill={iris} />
      <Circle cx="61" cy="51" r="3"   fill="#0D0D0D" />
      <Circle cx="63.5" cy="48.5" r="1.8" fill="white" />
      <Circle cx="60"   cy="54"   r="0.8" fill="white" fillOpacity="0.6" />
      <Path
        d="M 52 51 Q 61 43 70 51"
        stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <Path
        d="M 53 53 Q 61 58 69 53"
        stroke={skin.shadow} strokeWidth="1" fill="none" strokeLinecap="round" strokeOpacity="0.4"
      />

      {/* ── 12. Nose — minimal, two soft nostrils ── */}
      <Path
        d="M 47 66 Q 45.5 68.5 47.5 69.5"
        stroke={skin.shadow} strokeWidth="1.6" fill="none" strokeLinecap="round"
      />
      <Path
        d="M 53 66 Q 54.5 68.5 52.5 69.5"
        stroke={skin.shadow} strokeWidth="1.6" fill="none" strokeLinecap="round"
      />

      {/* ── 13. Mouth ── */}
      {config.mouth === 'smile' && (
        <Path
          d="M 41 73 Q 50 81 59 73"
          stroke="#1A1A1A" strokeWidth="2.8" fill="none" strokeLinecap="round"
        />
      )}
      {config.mouth === 'grin' && (
        <G>
          {/* Outer lip outline */}
          <Path
            d="M 39 72 Q 50 83 61 72"
            stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
          {/* Teeth fill */}
          <Path d="M 41 73 Q 50 80 59 73 Q 55 77 50 77.5 Q 45 77 41 73 Z" fill="white" />
          {/* Tooth divider */}
          <Path d="M 50 73.5 L 50 77" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
          {/* Upper lip line */}
          <Path
            d="M 39 72 Q 44 70 50 71 Q 56 70 61 72"
            stroke="#1A1A1A" strokeWidth="1.8" fill="none" strokeLinecap="round"
          />
        </G>
      )}
      {config.mouth === 'neutral' && (
        <Path
          d="M 42 74 Q 50 76 58 74"
          stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
      )}

      {/* ── Cheek blush ── */}
      {(config.skinTone === 'light' || config.skinTone === 'medium') && (
        <G>
          <Ellipse cx="32" cy="64" rx="8" ry="4.5" fill="#FF6B88" fillOpacity="0.20" />
          <Ellipse cx="68" cy="64" rx="8" ry="4.5" fill="#FF6B88" fillOpacity="0.20" />
        </G>
      )}

      {/* ── 14. Beard ── */}
      {hasBeard && (
        <G>
          <Path
            d="M 30 68 Q 31 85 50 88 Q 69 85 70 68 Q 64 76 50 78 Q 36 76 30 68 Z"
            fill={hair} fillOpacity="0.90"
          />
          {/* Beard texture sheen */}
          <Path
            d="M 36 70 Q 38 78 50 80 Q 62 78 64 70 Q 57 74 50 74.5 Q 43 74 36 70 Z"
            fill="white" fillOpacity="0.06"
          />
        </G>
      )}

      {/* ── 15. Glasses ── */}
      {hasGlasses && (
        <G>
          {/* Left lens */}
          <Ellipse cx="39" cy="51" rx="10.5" ry="9" stroke="#222" strokeWidth="2.5" fill="rgba(180,220,255,0.10)" />
          {/* Right lens */}
          <Ellipse cx="61" cy="51" rx="10.5" ry="9" stroke="#222" strokeWidth="2.5" fill="rgba(180,220,255,0.10)" />
          {/* Bridge */}
          <Path d="M 49.5 51 L 50.5 51" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
          {/* Left arm */}
          <Path d="M 28.5 49 L 23 47" stroke="#222" strokeWidth="2" strokeLinecap="round" />
          {/* Right arm */}
          <Path d="M 71.5 49 L 77 47" stroke="#222" strokeWidth="2" strokeLinecap="round" />
          {/* Lens shine */}
          <Path d="M 33 46 Q 36 44 38 46" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
          <Path d="M 55 46 Q 58 44 60 46" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.5" />
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
