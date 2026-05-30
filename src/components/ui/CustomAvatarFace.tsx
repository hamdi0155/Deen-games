import React from 'react';
import Svg, {
  Path, Circle, Ellipse, G, Defs, RadialGradient, Stop, LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

export interface AvatarConfig {
  skinTone: string;
  hairStyle: 'short' | 'long' | 'curly' | 'bun' | 'fade' | 'none';
  hairColor: string;
  eyeStyle: 'round' | 'almond' | 'large';
  eyeColor: string;
  browStyle: 'arched' | 'straight';
  mouthStyle: 'smile' | 'smirk' | 'neutral';
  accessory: 'none' | 'glasses' | 'cap';
  accentColor: string;
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: '#F5C9A0',
  hairStyle: 'short',
  hairColor: '#3D2B1F',
  eyeStyle: 'round',
  eyeColor: '#3D2B1F',
  browStyle: 'arched',
  mouthStyle: 'smile',
  accessory: 'none',
  accentColor: '#5B6CF5',
};

export const SKIN_TONES = ['#FDDBB4', '#F5C9A0', '#E8A87C', '#C68642', '#8D5524', '#4A2912'];
export const HAIR_COLORS = ['#1A1A1A', '#3D2B1F', '#7B4B2A', '#C4782A', '#D4A827', '#E8E8E8', '#C0392B', '#2980B9'];
export const EYE_COLORS  = ['#3D2B1F', '#1B5E20', '#1565C0', '#455A64', '#6B2D8B'];

function darken(hex: string, pct = 0.25): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor(((n >> 16) & 0xff) * (1 - pct)));
  const g = Math.max(0, Math.floor(((n >> 8)  & 0xff) * (1 - pct)));
  const b = Math.max(0, Math.floor((n & 0xff)         * (1 - pct)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ── Hair layers ───────────────────────────────────────────────────────────────

function HairBack({ style, color }: { style: AvatarConfig['hairStyle']; color: string }) {
  if (style === 'none' || style === 'fade') return null;
  const dark = darken(color, 0.2);
  if (style === 'long')
    return (
      <G>
        {/* Side panels flowing past face */}
        <Path d="M30 50 L20 55 L18 85 Q22 92 30 94 L32 82 Z" fill={dark} />
        <Path d="M70 50 L80 55 L82 85 Q78 92 70 94 L68 82 Z" fill={dark} />
      </G>
    );
  return null;
}

function HairFront({ style, color }: { style: AvatarConfig['hairStyle']; color: string }) {
  const dark = darken(color);
  switch (style) {
    case 'short':
      return (
        <Path
          d="M26 50 Q25 22 50 20 Q75 22 74 50 Q72 42 50 40 Q28 42 26 50 Z"
          fill={color}
        />
      );
    case 'long':
      return (
        <Path
          d="M26 50 Q25 22 50 20 Q75 22 74 50 Q72 42 50 40 Q28 42 26 50 Z"
          fill={color}
        />
      );
    case 'curly':
      return (
        <G>
          <Path
            d="M30 50 Q26 38 28 28 Q32 16 50 14 Q68 16 72 28 Q74 38 70 50 Q68 42 50 40 Q32 42 30 50 Z"
            fill={color}
          />
          {/* Curly bumps */}
          <Circle cx={28} cy={36} r={5} fill={color} />
          <Circle cx={35} cy={28} r={5} fill={color} />
          <Circle cx={44} cy={22} r={5} fill={color} />
          <Circle cx={56} cy={22} r={5} fill={color} />
          <Circle cx={65} cy={28} r={5} fill={color} />
          <Circle cx={72} cy={36} r={5} fill={color} />
          {/* Curl highlights */}
          <Circle cx={28} cy={34} r={2} fill={dark} opacity={0.4} />
          <Circle cx={72} cy={34} r={2} fill={dark} opacity={0.4} />
        </G>
      );
    case 'bun':
      return (
        <G>
          <Path
            d="M28 50 Q26 30 50 22 Q74 30 72 50 Q70 42 50 40 Q30 42 28 50 Z"
            fill={color}
          />
          {/* Bun on top */}
          <Circle cx={50} cy={14} r={10} fill={color} />
          <Circle cx={50} cy={14} r={7} fill={dark} opacity={0.25} />
          <Path d="M44 22 Q50 20 56 22" stroke={dark} strokeWidth={1.5} fill="none" />
        </G>
      );
    case 'fade':
      return (
        <Path
          d="M28 52 Q28 28 50 24 Q72 28 72 52 Q70 46 50 44 Q30 46 28 52 Z"
          fill={color}
        />
      );
    case 'none':
    default:
      return null;
  }
}

// ── Face ─────────────────────────────────────────────────────────────────────

function Face({ skin }: { skin: string }) {
  const shadow = darken(skin, 0.12);
  return (
    <G>
      {/* Neck */}
      <Path
        d="M43 82 L41 94 L59 94 L57 82 Q50 85 43 82 Z"
        fill={skin}
      />
      {/* Ears */}
      <Path d="M28 54 Q22 56 22 61 Q22 66 28 68" stroke={shadow} strokeWidth={2} fill={skin} />
      <Path d="M72 54 Q78 56 78 61 Q78 66 72 68" stroke={shadow} strokeWidth={2} fill={skin} />
      {/* Face oval */}
      <Path
        d="M28 54 Q28 26 50 23 Q72 26 72 54 Q72 76 64 82 Q57 87 50 87 Q43 87 36 82 Q28 76 28 54 Z"
        fill={skin}
      />
      {/* Subtle shading */}
      <Path
        d="M28 54 Q28 26 50 23 Q72 26 72 54 Q72 76 64 82 Q57 87 50 87 Q43 87 36 82 Q28 76 28 54 Z"
        fill={darken(skin, 0.05)}
        opacity={0.18}
      />
    </G>
  );
}

// ── Brows ─────────────────────────────────────────────────────────────────────

function Brows({ style, skin }: { style: AvatarConfig['browStyle']; skin: string }) {
  const color = darken(skin, 0.45);
  if (style === 'arched')
    return (
      <G>
        <Path d="M35 47 Q40 43 46 45" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <Path d="M54 45 Q60 43 65 47" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </G>
    );
  return (
    <G>
      <Path d="M35 45 L46 44" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Path d="M54 44 L65 45" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ── Eyes ──────────────────────────────────────────────────────────────────────

function Eyes({ style, color }: { style: AvatarConfig['eyeStyle']; color: string }) {
  const white = '#FAFAFA';
  const pupil = darken(color, 0.7);

  const Eye = ({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) => (
    <G>
      <Ellipse cx={cx} cy={cy} rx={rx + 1} ry={ry + 1} fill={white} />
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
      <Ellipse cx={cx} cy={cy} rx={rx * 0.55} ry={ry * 0.55} fill={pupil} />
      {/* Catchlight */}
      <Circle cx={cx + rx * 0.35} cy={cy - ry * 0.3} r={rx * 0.25} fill="white" opacity={0.9} />
    </G>
  );

  if (style === 'large')
    return (
      <G>
        <Eye cx={40} cy={54} rx={6} ry={6.5} />
        <Eye cx={60} cy={54} rx={6} ry={6.5} />
      </G>
    );

  if (style === 'almond')
    return (
      <G>
        <Eye cx={40} cy={54} rx={6.5} ry={4.5} />
        <Eye cx={60} cy={54} rx={6.5} ry={4.5} />
      </G>
    );

  // round
  return (
    <G>
      <Eye cx={40} cy={54} rx={5} ry={5.5} />
      <Eye cx={60} cy={54} rx={5} ry={5.5} />
    </G>
  );
}

// ── Nose ──────────────────────────────────────────────────────────────────────

function Nose({ skin }: { skin: string }) {
  const shadow = darken(skin, 0.22);
  return (
    <G>
      <Path d="M50 58 Q48 63 46 65" stroke={shadow} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Path d="M50 58 Q52 63 54 65" stroke={shadow} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Path d="M44 65 Q50 67 56 65" stroke={shadow} strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ── Mouth ─────────────────────────────────────────────────────────────────────

function Mouth({ style, skin }: { style: AvatarConfig['mouthStyle']; skin: string }) {
  const lip = darken(skin, 0.32);
  if (style === 'smile')
    return (
      <G>
        <Path d="M42 72 Q50 79 58 72" stroke={lip} strokeWidth={2} fill="none" strokeLinecap="round" />
        <Path d="M42 72 Q50 76 58 72" fill={darken(skin, 0.18)} opacity={0.5} />
      </G>
    );
  if (style === 'smirk')
    return (
      <Path d="M43 73 Q48 76 58 71" stroke={lip} strokeWidth={2} fill="none" strokeLinecap="round" />
    );
  return (
    <Path d="M43 73 L57 73" stroke={lip} strokeWidth={2} fill="none" strokeLinecap="round" />
  );
}

// ── Accessories ───────────────────────────────────────────────────────────────

function Accessory({ type, accent }: { type: AvatarConfig['accessory']; accent: string }) {
  if (type === 'glasses')
    return (
      <G>
        <Circle cx={40} cy={54} r={8} stroke={accent} strokeWidth={2} fill="none" />
        <Circle cx={60} cy={54} r={8} stroke={accent} strokeWidth={2} fill="none" />
        <Path d="M48 54 L52 54" stroke={accent} strokeWidth={2} strokeLinecap="round" />
        <Path d="M32 51 L28 48" stroke={accent} strokeWidth={2} strokeLinecap="round" />
        <Path d="M68 51 L72 48" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      </G>
    );

  if (type === 'cap')
    return (
      <G>
        {/* Cap top */}
        <Path
          d="M26 46 Q26 16 50 14 Q74 16 74 46 Q72 40 50 38 Q28 40 26 46 Z"
          fill={accent}
        />
        {/* Brim */}
        <Path
          d="M20 47 Q22 44 50 43 Q78 44 80 47 Q78 50 50 49 Q22 50 20 47 Z"
          fill={darken(accent, 0.15)}
        />
        {/* Button on top */}
        <Circle cx={50} cy={16} r={3} fill={darken(accent, 0.2)} />
      </G>
    );

  return null;
}

// ── Background circle ─────────────────────────────────────────────────────────

function Background({ accent }: { accent: string }) {
  return (
    <G>
      <Defs>
        <RadialGradient id="bgGrad" cx="50%" cy="40%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={accent} stopOpacity={0.28} />
          <Stop offset="100%" stopColor={accent} stopOpacity={0.06} />
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={50} fill="#0D0F1A" />
      <Circle cx={50} cy={50} r={50} fill="url(#bgGrad)" />
    </G>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  config: AvatarConfig;
  size: number;
}

export function CustomAvatarFace({ config, size }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Background accent={config.accentColor} />
      <HairBack style={config.hairStyle} color={config.hairColor} />
      <Face skin={config.skinTone} />
      <Brows style={config.browStyle} skin={config.skinTone} />
      <Eyes style={config.eyeStyle} color={config.eyeColor} />
      <Nose skin={config.skinTone} />
      <Mouth style={config.mouthStyle} skin={config.skinTone} />
      <HairFront style={config.hairStyle} color={config.hairColor} />
      <Accessory type={config.accessory} accent={config.accentColor} />
    </Svg>
  );
}
