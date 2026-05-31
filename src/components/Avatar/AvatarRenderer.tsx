import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { AvatarState } from '../../types/avatar.types';
import { BACKGROUND_OPTIONS } from '../../data/avatarData';

interface AvatarRendererProps {
  avatar: AvatarState;
  size?: number;
  animated?: boolean;
  className?: string;
  id?: string;
}

// ─── Face shape paths ────────────────────────────────────────────────────────
const FACE_PATHS: Record<string, string> = {
  oval:      'M200 78C285 78 338 138 338 228C338 318 285 378 200 378C115 378 62 318 62 228C62 138 115 78 200 78Z',
  round:     'M200 90C292 90 332 165 332 248C332 328 282 382 200 382C118 382 68 328 68 248C68 165 108 90 200 90Z',
  square:    'M152 88L248 88C302 88 332 118 332 172L332 308C332 352 298 382 252 382L148 382C102 382 68 352 68 308L68 172C68 118 98 88 152 88Z',
  diamond:   'M200 72C248 72 310 128 328 188C346 248 324 302 288 340C260 368 232 384 200 384C168 384 140 368 112 340C76 302 54 248 72 188C90 128 152 72 200 72Z',
  heart:     'M200 112C195 94 172 76 142 88C98 108 78 158 88 212C98 262 142 308 176 344C185 358 200 376 200 376C200 376 215 358 224 344C258 308 302 262 312 212C322 158 302 108 258 88C228 76 205 94 200 112Z',
  rectangle: 'M148 80L252 80C306 80 336 110 336 164L336 316C336 360 302 388 254 388L146 388C98 388 64 360 64 316L64 164C64 110 94 80 148 80Z',
};

// ─── Eye shape definitions ────────────────────────────────────────────────────
function getEyeClip(shape: string, cx: number, cy: number) {
  switch (shape) {
    case 'round':
      return <ellipse cx={cx} cy={cy} rx={24} ry={22} />;
    case 'hooded':
      return <path d={`M${cx-26} ${cy+4}C${cx-20} ${cy-14} ${cx} ${cy-18} ${cx+26} ${cy+4}C${cx+20} ${cy+14} ${cx} ${cy+16} ${cx-26} ${cy+4}Z`} />;
    case 'monolid':
      return <path d={`M${cx-26} ${cy+6}C${cx-14} ${cy-8} ${cx+14} ${cy-8} ${cx+26} ${cy+6}C${cx+16} ${cy+18} ${cx-16} ${cy+18} ${cx-26} ${cy+6}Z`} />;
    case 'wide':
      return <ellipse cx={cx} cy={cy} rx={28} ry={24} />;
    default: // almond
      return <path d={`M${cx-28} ${cy+2}C${cx-18} ${cy-16} ${cx+18} ${cy-16} ${cx+28} ${cy+2}C${cx+18} ${cy+20} ${cx-18} ${cy+20} ${cx-28} ${cy+2}Z`} />;
  }
}

function EyePair({ avatar, scale }: { avatar: AvatarState; scale: number }) {
  const { eyeShape, eyeColor, eyelashes, eyebrowStyle, eyebrowThickness, eyebrowColor, expression, skinTone } = avatar;
  const leftCx = 150, rightCx = 250, eCy = 220;
  const isSleepy = expression === 'sleepy';
  const isAngry = expression === 'angry';
  const isExcited = expression === 'excited' || expression === 'happy';

  const pupilR = isExcited ? 9 : isSleepy ? 6 : 8;
  const eyeScaleY = isSleepy ? 0.45 : isAngry ? 0.75 : 1;

  const renderEye = (cx: number, isLeft: boolean) => {
    const clipId = `eyeClip-${isLeft ? 'L' : 'R'}`;
    const gradId = `eyeGrad-${isLeft ? 'L' : 'R'}`;
    return (
      <g key={cx} transform={`translate(0,0) scale(1,${eyeScaleY})`} style={{ transformOrigin: `${cx}px ${eCy}px` }}>
        <defs>
          <clipPath id={clipId}>{getEyeClip(eyeShape, cx, eCy)}</clipPath>
          <radialGradient id={gradId} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={eyeColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={eyeColor} />
          </radialGradient>
        </defs>
        {/* White */}
        <ellipse cx={cx} cy={eCy} rx={26} ry={22} fill="white" clipPath={`url(#${clipId})`} />
        {/* Iris */}
        <circle cx={cx} cy={eCy} r={14} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />
        {/* Pupil */}
        <circle cx={cx} cy={eCy} r={pupilR} fill="#0f0f0f" clipPath={`url(#${clipId})`} />
        {/* Highlight */}
        <circle cx={cx - 5} cy={eCy - 5} r={3.5} fill="white" opacity={0.9} clipPath={`url(#${clipId})`} />
        <circle cx={cx + 5} cy={eCy + 4} r={1.8} fill="white" opacity={0.5} clipPath={`url(#${clipId})`} />
        {/* Outline */}
        {getEyeClip(eyeShape, cx, eCy) && (
          <g clipPath={`url(#${clipId})`}>
            <ellipse cx={cx} cy={eCy + 1} rx={26} ry={22} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} />
          </g>
        )}
        {/* Lashes */}
        {eyelashes !== 'none' && (
          <EyeLashes cx={cx} cy={eCy} style={eyelashes} isLeft={isLeft} shape={eyeShape} />
        )}
      </g>
    );
  };

  const eyebrowThick = 2 + (eyebrowThickness / 100) * 5;
  const brows = getEyebrowPath(eyebrowStyle, isAngry);

  return (
    <g>
      {/* Eyebrows */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={brows.left}  stroke={eyebrowColor} strokeWidth={eyebrowThick} opacity={0.95} />
        <path d={brows.right} stroke={eyebrowColor} strokeWidth={eyebrowThick} opacity={0.95} />
      </g>
      {/* Eyes */}
      {renderEye(leftCx, true)}
      {renderEye(rightCx, false)}
    </g>
  );
}

function EyeLashes({ cx, cy, style, isLeft, shape }: { cx: number; cy: number; style: string; isLeft: boolean; shape: string }) {
  if (style === 'none') return null;
  const lashCount = style === 'natural' ? 4 : style === 'long' ? 6 : 8;
  const lashLen = style === 'natural' ? 7 : style === 'long' ? 11 : 14;
  const flip = isLeft ? 1 : -1;
  const lashes = [];
  for (let i = 0; i < lashCount; i++) {
    const t = (i / (lashCount - 1)) * 0.8 + 0.1;
    const angle = -80 + t * 160;
    const rad = (angle * Math.PI) / 180;
    const rx = (shape === 'round' || shape === 'wide') ? 24 : 26;
    const ry = 22;
    const bx = cx + rx * Math.cos(rad);
    const by = cy + ry * Math.sin(rad) - 20;
    if (by < cy - 5) {
      const ex = bx + flip * lashLen * Math.cos(rad - 0.3);
      const ey = by - lashLen * Math.abs(Math.sin(rad));
      lashes.push(
        <line key={i} x1={bx} y1={by} x2={ex} y2={ey}
          stroke="#1a1a1a" strokeWidth={1.5} strokeLinecap="round" />
      );
    }
  }
  return <g>{lashes}</g>;
}

function getEyebrowPath(style: number, angry: boolean) {
  const lift = angry ? -4 : 0;
  const tilt = angry ? 8 : 0;
  const brows: Record<number, { left: string; right: string }> = {
    0: { // Natural arch
      left:  `M122 ${186+lift+tilt}C133 ${178+lift} 148 ${176+lift} 165 ${180+lift}`,
      right: `M235 ${180+lift}C252 ${176+lift} 267 ${178+lift} 278 ${186+lift-tilt}`,
    },
    1: { // High arch
      left:  `M120 ${190+lift+tilt}C132 ${174+lift} 148 ${172+lift} 166 ${178+lift}`,
      right: `M234 ${178+lift}C252 ${172+lift} 268 ${174+lift} 280 ${190+lift-tilt}`,
    },
    2: { // Straight
      left:  `M120 ${183+lift+tilt}C135 ${181+lift} 150 ${181+lift} 166 ${183+lift}`,
      right: `M234 ${183+lift}C250 ${181+lift} 265 ${181+lift} 280 ${183+lift-tilt}`,
    },
    3: { // Rounded
      left:  `M123 ${188+lift+tilt}C134 ${179+lift} 148 ${177+lift} 163 ${182+lift}`,
      right: `M237 ${182+lift}C252 ${177+lift} 266 ${179+lift} 277 ${188+lift-tilt}`,
    },
    4: { // Peaked
      left:  `M120 ${190+lift+tilt}C132 ${176+lift} 142 ${173+lift} 148 ${175+lift}C154 ${173+lift} 162 ${180+lift} 168 ${186+lift}`,
      right: `M232 ${186+lift}C238 ${180+lift} 246 ${173+lift} 252 ${175+lift}C258 ${173+lift} 268 ${176+lift} 280 ${190+lift-tilt}`,
    },
    5: { // Bushy
      left:  `M118 ${186+lift+tilt}C130 ${177+lift} 147 ${175+lift} 167 ${180+lift}`,
      right: `M233 ${180+lift}C253 ${175+lift} 270 ${177+lift} 282 ${186+lift-tilt}`,
    },
    6: { // Thin
      left:  `M124 ${186+lift+tilt}C135 ${181+lift} 149 ${180+lift} 163 ${183+lift}`,
      right: `M237 ${183+lift}C251 ${180+lift} 265 ${181+lift} 276 ${186+lift-tilt}`,
    },
    7: { // Angled
      left:  `M120 ${192+lift+tilt}C135 ${178+lift} 150 ${176+lift} 166 ${182+lift}`,
      right: `M234 ${182+lift}C250 ${176+lift} 265 ${178+lift} 280 ${192+lift-tilt}`,
    },
    8: { // S-curve
      left:  `M120 ${188+lift+tilt}C130 ${179+lift} 140 ${183+lift} 150 ${178+lift}C158 ${174+lift} 165 ${180+lift} 168 ${185+lift}`,
      right: `M232 ${185+lift}C235 ${180+lift} 242 ${174+lift} 250 ${178+lift}C260 ${183+lift} 270 ${179+lift} 280 ${188+lift-tilt}`,
    },
    9: { // Bold
      left:  `M118 ${187+lift+tilt}C130 ${176+lift} 148 ${174+lift} 167 ${179+lift}`,
      right: `M233 ${179+lift}C252 ${174+lift} 270 ${176+lift} 282 ${187+lift-tilt}`,
    },
  };
  return brows[style % 10] || brows[0];
}

// ─── Nose ────────────────────────────────────────────────────────────────────
function Nose({ avatar }: { avatar: AvatarState }) {
  const { noseShape, skinTone, noseWidth, noseHeight } = avatar;
  const wScale = 0.7 + (noseWidth / 100) * 0.6;
  const hScale = 0.7 + (noseHeight / 100) * 0.6;
  const noseTone = darken(skinTone, 18);
  const nostrilTone = darken(skinTone, 30);

  const paths: Record<string, JSX.Element> = {
    small: (
      <g transform={`translate(200,265) scale(${wScale * 0.8},${hScale * 0.8})`}>
        <path d="M0-18C-8-18-16-10-16 0C-16 8-10 16 0 18C10 16 16 8 16 0C16-10 8-18 0-18Z" fill={noseTone} opacity={0.4} />
        <path d="M-12 4C-16 6-16 14-10 16" stroke={nostrilTone} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M12 4C16 6 16 14 10 16" stroke={nostrilTone} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
    ),
    medium: (
      <g transform={`translate(200,268) scale(${wScale},${hScale})`}>
        <path d="M0-20C-10-20-20-12-20 0C-20 10-12 20 0 22C12 20 20 10 20 0C20-12 10-20 0-20Z" fill={noseTone} opacity={0.35} />
        <path d="M-14 6C-20 8-20 18-12 20" stroke={nostrilTone} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M14 6C20 8 20 18 12 20" stroke={nostrilTone} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M-6 0C-2-4 2-4 6 0" stroke={nostrilTone} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </g>
    ),
    large: (
      <g transform={`translate(200,268) scale(${wScale * 1.2},${hScale * 1.2})`}>
        <path d="M0-22C-14-22-22-12-22 2C-22 14-14 24 0 26C14 24 22 14 22 2C22-12 14-22 0-22Z" fill={noseTone} opacity={0.35} />
        <path d="M-16 8C-22 10-22 22-14 24" stroke={nostrilTone} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M16 8C22 10 22 22 14 24" stroke={nostrilTone} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M-6 0C-2-5 2-5 6 0" stroke={nostrilTone} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </g>
    ),
    wide: (
      <g transform={`translate(200,268) scale(${wScale * 1.3},${hScale * 0.9})`}>
        <path d="M0-18C-12-18-22-10-22 2C-22 12-14 20 0 22C14 20 22 12 22 2C22-10 12-18 0-18Z" fill={noseTone} opacity={0.35} />
        <path d="M-18 6C-24 8-24 20-14 22" stroke={nostrilTone} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M18 6C24 8 24 20 14 22" stroke={nostrilTone} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </g>
    ),
    narrow: (
      <g transform={`translate(200,268) scale(${wScale * 0.7},${hScale * 1.1})`}>
        <path d="M0-24C-8-24-14-14-14 0C-14 12-8 22 0 24C8 22 14 12 14 0C14-14 8-24 0-24Z" fill={noseTone} opacity={0.35} />
        <path d="M-10 6C-14 8-14 20-8 22" stroke={nostrilTone} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M10 6C14 8 14 20 8 22" stroke={nostrilTone} strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
    ),
    button: (
      <g transform={`translate(200,268) scale(${wScale * 0.75},${hScale * 0.75})`}>
        <circle cx={0} cy={0} r={16} fill={noseTone} opacity={0.3} />
        <circle cx={-9} cy={6} r={5} fill={nostrilTone} opacity={0.4} />
        <circle cx={9} cy={6} r={5} fill={nostrilTone} opacity={0.4} />
      </g>
    ),
  };

  return paths[noseShape] || paths.medium;
}

// ─── Mouth ────────────────────────────────────────────────────────────────────
function Mouth({ avatar }: { avatar: AvatarState }) {
  const { mouthExpression, lipColor, lipThickness, expression, skinTone } = avatar;
  const thick = 0.6 + (lipThickness / 100) * 0.8;
  const expr = expression === 'sleepy' ? 'neutral' : expression;

  // Override expression with current expression state
  const effectiveExpr = expr === 'laughing' || expr === 'excited' || expr === 'happy' ? 'happy' :
    expr === 'sad' || expr === 'confused' ? 'sad' :
    expr === 'angry' ? 'serious' :
    mouthExpression;

  const toothColor = '#fff8f5';
  const innerColor = darken(lipColor, 25);
  const lipLight = lighten(lipColor, 20);

  const mouths: Record<string, JSX.Element> = {
    smile: (
      <g transform={`translate(200,308) scale(1,${thick})`}>
        {/* Upper lip */}
        <path d="M-30-4C-20-10 0-12 30-4" fill="none" stroke={lipColor} strokeWidth={3.5} strokeLinecap="round" />
        {/* Smile curve */}
        <path d="M-28 0C-18 14 18 14 28 0" fill={lipColor} stroke={lipColor} strokeWidth={1} />
        {/* Upper teeth hint */}
        <path d="M-20-2C-10-8 10-8 20-2L20 4C10 4-10 4-20 4Z" fill={toothColor} opacity={0.9} />
        {/* Lower lip */}
        <path d="M-28 0C-18 18 18 18 28 0" fill={lipLight} opacity={0.6} />
      </g>
    ),
    neutral: (
      <g transform={`translate(200,310) scale(1,${thick})`}>
        <path d="M-24 0C-12-4 12-4 24 0" fill="none" stroke={lipColor} strokeWidth={4} strokeLinecap="round" />
        <path d="M-24 0C-12 6 12 6 24 0" fill={lighten(lipColor, 10)} opacity={0.7} />
        <path d="M-24-0.5C-12-4 12-4 24-0.5" fill={lipColor} opacity={0.5} strokeWidth={2} />
      </g>
    ),
    serious: (
      <g transform={`translate(200,312) scale(1,${thick})`}>
        <path d="M-26 0C-14 4 14 4 26 0" fill="none" stroke={lipColor} strokeWidth={4} strokeLinecap="round" />
        <path d="M-26-2C-14-6 14-6 26-2" fill={lipColor} opacity={0.8} />
        <path d="M-26 0C-14 4 14 4 26 0" fill={lighten(lipColor, 15)} opacity={0.5} />
      </g>
    ),
    smirk: (
      <g transform={`translate(200,308) scale(1,${thick})`}>
        <path d="M-26 2C-16-4 0-4 10-2C18 0 24 6 26 2" fill="none" stroke={lipColor} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M-24 2C-14 12 8 12 26 2" fill={lipLight} opacity={0.5} />
        <path d="M-26 2C-16-6 0-6 10-2C20 0 24 6 26 2" fill={lipColor} opacity={0.4} />
      </g>
    ),
    happy: (
      <g transform={`translate(200,306) scale(1,${thick})`}>
        <path d="M-30-6C-20-12 0-14 30-6" fill="none" stroke={lipColor} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M-30-2C-18 16 18 16 30-2" fill={lipColor} />
        <path d="M-24-4C-12-10 12-10 24-4L24 4C12 6-12 6-24 4Z" fill={toothColor} opacity={0.95} />
        <path d="M-28-2C-16 18 16 18 28-2" fill={lipLight} opacity={0.5} />
        {/* Cheek blush */}
        <ellipse cx={-50} cy={-8} rx={16} ry={10} fill="#F48080" opacity={0.2} />
        <ellipse cx={50} cy={-8} rx={16} ry={10} fill="#F48080" opacity={0.2} />
      </g>
    ),
    sad: (
      <g transform={`translate(200,316) scale(1,${thick})`}>
        <path d="M-26-4C-16 2 16 2 26-4" fill="none" stroke={lipColor} strokeWidth={4} strokeLinecap="round" />
        <path d="M-26-4C-16 4 16 4 26-4" fill={lipColor} opacity={0.7} />
        <path d="M-24-4C-12 6 12 6 24-4" fill={lighten(lipColor, 10)} opacity={0.4} />
      </g>
    ),
  };

  return mouths[effectiveExpr] || mouths.smile;
}

// ─── Hair ────────────────────────────────────────────────────────────────────
function Hair({ avatar }: { avatar: AvatarState }) {
  const { hairStyle, hairColor, hairHighlights, facialHair, facialHairColor, facialHairDensity } = avatar;
  const hl = hairHighlights !== 'transparent' ? hairHighlights : hairColor;
  const hairDark = darken(hairColor, 20);

  const styles: Record<number, JSX.Element> = {
    0: ( // Buzz Cut
      <g>
        <path d="M60 228C60 138 110 72 200 72C290 72 340 138 340 228" fill={hairColor} />
        <path d="M60 228C60 138 110 72 200 72C290 72 340 138 340 228" fill="none" stroke={hairDark} strokeWidth={1} opacity={0.4} />
      </g>
    ),
    1: ( // Crew Cut
      <g>
        <path d="M58 210C58 120 108 64 200 64C292 64 342 120 342 210" fill={hairColor} />
        <path d="M65 195C85 135 128 95 200 88C272 95 315 135 335 195" fill={lighten(hairColor, 15)} opacity={0.3} />
      </g>
    ),
    2: ( // Messy Top
      <g>
        <path d="M55 220C55 118 108 62 200 60C292 62 345 118 345 220" fill={hairColor} />
        <path d="M140 60C150 30 170 18 185 22C195 14 205 14 215 22C225 16 245 30 250 65" fill={hairColor} />
        <path d="M160 58C165 42 175 34 185 38" fill={hairDark} opacity={0.6} />
        <path d="M200 56C205 38 215 32 225 36" fill={hairDark} opacity={0.6} />
        <path d="M55 220C55 118 108 62 200 60" fill="none" stroke={hairDark} strokeWidth={2} opacity={0.3} />
        {hl !== hairColor && (
          <path d="M170 68C180 44 195 32 205 36" fill={hl} opacity={0.5} />
        )}
      </g>
    ),
    3: ( // Side Part
      <g>
        <path d="M56 215C56 115 106 60 200 58C292 60 344 115 344 215" fill={hairColor} />
        <path d="M158 58C148 90 140 130 145 180" fill="none" stroke={hairDark} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
        <path d="M56 215C110 90 158 60 200 58" fill={lighten(hairColor, 10)} opacity={0.35} />
      </g>
    ),
    4: ( // Quiff
      <g>
        <path d="M56 220C56 120 106 64 200 62C292 64 344 120 344 220" fill={hairColor} />
        <path d="M155 65C165 28 185 14 200 18C215 14 235 28 245 65" fill={hairColor} />
        <path d="M168 62C172 36 182 22 190 24C196 18 204 18 210 24C218 22 228 36 232 62" fill={lighten(hairColor, 20)} opacity={0.5} />
        <path d="M178 60C182 40 190 28 196 30" fill={hl} opacity={0.4} />
      </g>
    ),
    5: ( // Slick Back
      <g>
        <path d="M58 218C58 118 108 62 200 60C292 62 342 118 342 218" fill={hairColor} />
        <path d="M70 200C90 130 130 90 200 75C270 90 310 130 330 200" fill={lighten(hairColor, 12)} opacity={0.4} />
        <path d="M80 180C100 120 140 85 200 72" fill="none" stroke={hl} strokeWidth={3} opacity={0.3} strokeLinecap="round" />
      </g>
    ),
    6: ( // Curly Short
      <g>
        <path d="M58 225C58 125 108 70 200 68C292 70 342 125 342 225" fill={hairColor} />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = 200 + Math.cos(angle) * 65;
          const cy = 145 + Math.sin(angle) * 55;
          return <circle key={i} cx={cx} cy={cy} r={16} fill={hairColor} stroke={hairDark} strokeWidth={1} opacity={0.9} />;
        })}
        <path d="M60 225C60 125 108 70 200 68" fill={lighten(hairColor, 10)} opacity={0.25} />
      </g>
    ),
    7: ( // Wavy Medium
      <g>
        <path d="M56 232C56 132 106 72 200 68C294 72 344 132 344 232" fill={hairColor} />
        <path d="M56 232C56 200 58 170 62 145" stroke={hairColor} strokeWidth={40} fill="none" strokeLinecap="round" />
        <path d="M344 232C344 200 342 170 338 145" stroke={hairColor} strokeWidth={40} fill="none" strokeLinecap="round" />
        <path d="M58 200C70 185 80 195 90 180C100 165 110 175 118 160" fill="none" stroke={hl} strokeWidth={2.5} opacity={0.4} strokeLinecap="round" />
        <path d="M342 200C330 185 320 195 310 180C300 165 290 175 282 160" fill="none" stroke={hl} strokeWidth={2.5} opacity={0.4} strokeLinecap="round" />
      </g>
    ),
    8: ( // Long Straight
      <g>
        <path d="M56 232C56 132 106 72 200 68C294 72 344 132 344 232" fill={hairColor} />
        <path d="M56 232L50 380C50 390 62 396 70 390L72 340C72 330 60 330 60 320L60 232" fill={hairColor} />
        <path d="M344 232L350 380C350 390 338 396 330 390L328 340C328 330 340 330 340 320L340 232" fill={hairColor} />
        <path d="M62 200L56 370" stroke={hl} strokeWidth={3} opacity={0.35} strokeLinecap="round" />
        <path d="M338 200L344 370" stroke={hl} strokeWidth={3} opacity={0.35} strokeLinecap="round" />
      </g>
    ),
    9: ( // Braids
      <g>
        <path d="M56 228C56 128 106 72 200 68C294 72 344 128 344 228" fill={hairColor} />
        {/* Left braid */}
        <path d="M60 230L55 280C53 290 65 295 67 285L62 240" fill={hairDark} />
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={60} cy={248 + i * 14} rx={6} ry={8} fill={i % 2 ? hairColor : hairDark} opacity={0.9} />
        ))}
        {/* Right braid */}
        <path d="M340 230L345 280C347 290 335 295 333 285L338 240" fill={hairDark} />
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={340} cy={248 + i * 14} rx={6} ry={8} fill={i % 2 ? hairColor : hairDark} opacity={0.9} />
        ))}
      </g>
    ),
    10: ( // Bun
      <g>
        <path d="M58 228C58 128 108 72 200 68C292 72 342 128 342 228" fill={hairColor} />
        {/* Bun */}
        <circle cx={200} cy={62} r={32} fill={hairColor} />
        <circle cx={200} cy={62} r={28} fill={lighten(hairColor, 10)} opacity={0.4} />
        <path d="M178 80C190 70 210 70 222 80" fill="none" stroke={hairDark} strokeWidth={2} opacity={0.4} />
      </g>
    ),
    11: ( // Ponytail
      <g>
        <path d="M58 228C58 128 108 72 200 68C292 72 342 128 342 228" fill={hairColor} />
        {/* Ponytail holder */}
        <ellipse cx={200} cy={92} rx={12} ry={8} fill={hairDark} opacity={0.8} />
        {/* Tail */}
        <path d="M192 96C188 130 186 180 188 230C190 250 200 260 200 260C200 260 210 250 212 230C214 180 212 130 208 96Z" fill={hairColor} />
        <path d="M196 100C193 134 192 185 194 228" fill="none" stroke={hl} strokeWidth={2.5} opacity={0.4} />
      </g>
    ),
    12: ( // Bob
      <g>
        <path d="M56 228C56 128 106 72 200 68C294 72 344 128 344 228" fill={hairColor} />
        {/* Bob sides */}
        <path d="M60 228C58 270 60 310 68 340C75 360 85 368 92 360L88 300C88 290 72 285 72 270L68 228" fill={hairColor} />
        <path d="M340 228C342 270 340 310 332 340C325 360 315 368 308 360L312 300C312 290 328 285 328 270L332 228" fill={hairColor} />
        {/* Ends */}
        <path d="M68 340C76 360 88 370 92 362" fill="none" stroke={hairDark} strokeWidth={2} opacity={0.3} />
        <path d="M332 340C324 360 312 370 308 362" fill="none" stroke={hairDark} strokeWidth={2} opacity={0.3} />
      </g>
    ),
    13: ( // Dreadlocks
      <g>
        <path d="M56 228C56 128 106 72 200 68C294 72 344 128 344 228" fill={hairColor} />
        {Array.from({ length: 7 }, (_, i) => {
          const x = 72 + i * 38;
          const len = 180 + (i % 3) * 40;
          return (
            <g key={i}>
              <path d={`M${x} 200L${x - 3} ${200 + len}`} stroke={hairColor} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.9} />
              {Array.from({ length: Math.floor(len / 20) }, (_, j) => (
                <ellipse key={j} cx={x - 1} cy={215 + j * 20} rx={5} ry={3} fill={hairDark} opacity={0.5} />
              ))}
            </g>
          );
        })}
      </g>
    ),
    14: ( // Afro
      <g>
        {/* Big fluffy afro */}
        <ellipse cx={200} cy={148} rx={105} ry={95} fill={hairColor} />
        {/* Texture bumps */}
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i * 18 * Math.PI) / 180;
          const r = 55 + (i % 3) * 20;
          const cx = 200 + r * Math.cos(angle);
          const cy = 148 + r * 0.7 * Math.sin(angle);
          return <circle key={i} cx={cx} cy={cy} r={20 + (i % 3) * 8} fill={i % 2 ? hairColor : hairDark} opacity={0.5} />;
        })}
        <ellipse cx={200} cy={148} rx={85} ry={75} fill={lighten(hairColor, 12)} opacity={0.2} />
      </g>
    ),
  };

  const facialHairEl = facialHair !== 'none' ? (
    <FacialHair style={facialHair} color={facialHairColor} density={facialHairDensity} />
  ) : null;

  return (
    <>
      {styles[hairStyle] || styles[2]}
      {facialHairEl}
    </>
  );
}

function FacialHair({ style, color, density }: { style: string; color: string; density: number }) {
  const opacity = 0.5 + (density / 100) * 0.5;
  const dark = darken(color, 20);

  const variants: Record<string, JSX.Element> = {
    stubble: (
      <g opacity={opacity * 0.6}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = 145 + (i % 8) * 13 + Math.sin(i) * 4;
          const y = 315 + Math.floor(i / 8) * 12 + Math.cos(i) * 3;
          return <circle key={i} cx={x} cy={y} r={1.5} fill={color} opacity={0.6} />;
        })}
      </g>
    ),
    mustache: (
      <g opacity={opacity}>
        <path d="M168 294C178 286 190 284 200 286C210 284 222 286 232 294C225 304 212 308 200 306C188 308 175 304 168 294Z" fill={color} />
        <path d="M168 294C178 286 190 284 200 286" fill="none" stroke={dark} strokeWidth={1} opacity={0.4} />
        <path d="M232 294C222 286 210 284 200 286" fill="none" stroke={dark} strokeWidth={1} opacity={0.4} />
      </g>
    ),
    goatee: (
      <g opacity={opacity}>
        <path d="M168 294C178 286 190 284 200 286C210 284 222 286 232 294C225 304 212 308 200 306C188 308 175 304 168 294Z" fill={color} />
        <path d="M186 306C184 322 188 346 196 358C198 364 202 364 204 358C212 346 216 322 214 306" fill={color} />
      </g>
    ),
    beard: (
      <g opacity={opacity}>
        <path d="M120 290C115 310 118 340 130 360C148 386 170 396 200 398C230 396 252 386 270 360C282 340 285 310 280 290C265 300 242 308 200 308C158 308 135 300 120 290Z" fill={color} />
        <path d="M120 290C135 298 158 305 200 305C242 305 265 298 280 290" fill="none" stroke={dark} strokeWidth={1.5} opacity={0.4} />
        <path d="M140 340C150 360 168 380 200 388" fill="none" stroke={dark} strokeWidth={1.5} opacity={0.3} strokeLinecap="round" />
        <path d="M260 340C250 360 232 380 200 388" fill="none" stroke={dark} strokeWidth={1.5} opacity={0.3} strokeLinecap="round" />
      </g>
    ),
  };

  return variants[style] || null;
}

// ─── Ears ────────────────────────────────────────────────────────────────────
function Ears({ skinTone }: { skinTone: string }) {
  const earShade = darken(skinTone, 12);
  const earInner = darken(skinTone, 6);
  return (
    <g>
      {/* Left ear */}
      <ellipse cx={62} cy={238} rx={18} ry={24} fill={skinTone} stroke={earShade} strokeWidth={1.5} />
      <path d="M66 222C70 228 72 244 68 254" fill="none" stroke={earInner} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
      {/* Right ear */}
      <ellipse cx={338} cy={238} rx={18} ry={24} fill={skinTone} stroke={earShade} strokeWidth={1.5} />
      <path d="M334 222C330 228 328 244 332 254" fill="none" stroke={earInner} strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}

// ─── Glasses ────────────────────────────────────────────────────────────────
function Glasses({ index }: { index: number }) {
  if (index < 0) return null;

  const frameColors = ['#1a1a1a', '#8B4513', '#2E4A8B', '#8B1A1A', '#1A6B1A', '#4A4A4A', '#8B4A8B', '#2E2E8B', '#8B6B1A', '#555'];
  const color = frameColors[index % frameColors.length];

  const styles: Record<number, JSX.Element> = {
    0: ( // Round classic
      <g fill="none" stroke={color} strokeWidth={3}>
        <circle cx={150} cy={218} r={30} />
        <circle cx={250} cy={218} r={30} />
        <path d="M180 218H220" strokeWidth={2.5} />
        <path d="M68 210L120 214" strokeWidth={2} />
        <path d="M332 210L280 214" strokeWidth={2} />
      </g>
    ),
    1: ( // Rectangle
      <g fill="none" stroke={color} strokeWidth={3}>
        <rect x={116} y={200} width={72} height={38} rx={6} />
        <rect x={212} y={200} width={72} height={38} rx={6} />
        <path d="M188 219H212" strokeWidth={2.5} />
        <path d="M68 208L116 210" strokeWidth={2} />
        <path d="M332 208L284 210" strokeWidth={2} />
      </g>
    ),
    2: ( // Cat-eye
      <g fill="none" stroke={color} strokeWidth={3}>
        <path d="M120 230C120 210 130 198 152 196C170 196 182 206 182 218C182 232 172 240 152 240C130 240 120 232 120 230Z" />
        <path d="M218 218C218 206 230 196 248 196C270 196 280 208 280 228C280 232 272 240 250 240C228 240 218 232 218 218Z" />
        <path d="M182 216H218" strokeWidth={2.5} />
        <path d="M68 206L120 212" strokeWidth={2} />
        <path d="M332 206L280 212" strokeWidth={2} />
      </g>
    ),
    3: ( // Aviator
      <g fill="none" stroke={color} strokeWidth={2.5}>
        <path d="M118 205C118 205 130 195 152 198C174 200 182 215 182 225C182 235 172 242 154 242C132 242 118 232 118 218Z" />
        <path d="M218 225C218 215 226 200 248 198C270 195 282 205 282 218C282 232 268 242 246 242C228 242 218 235 218 225Z" />
        <path d="M182 215H218" strokeWidth={2} />
        <path d="M66 202L118 208" strokeWidth={2} />
        <path d="M334 202L282 208" strokeWidth={2} />
      </g>
    ),
  };

  return styles[index % 4] || styles[0];
}

// ─── Hat ────────────────────────────────────────────────────────────────────
function Hat({ index, hairColor }: { index: number; hairColor: string }) {
  if (index < 0) return null;

  const styles: Record<number, JSX.Element> = {
    0: ( // Baseball cap
      <g>
        <path d="M68 155C68 110 118 68 200 68C282 68 332 110 332 155" fill="#2E4A8B" />
        <path d="M50 162H262C270 162 280 168 280 176H50C48 170 48 164 50 162Z" fill="#2E4A8B" />
        <path d="M58 148H342C342 148 340 162 334 162H66C60 162 58 152 58 148Z" fill="#1E3A7B" opacity={0.6} />
      </g>
    ),
    1: ( // Beanie
      <g>
        <path d="M65 190C65 140 118 80 200 80C282 80 335 140 335 190C335 195 330 200 200 200C70 200 65 195 65 190Z" fill={hairColor} />
        <path d="M65 192H335" stroke={darken(hairColor, 20)} strokeWidth={6} />
        <path d="M65 180H335" stroke={darken(hairColor, 15)} strokeWidth={5} />
        <circle cx={200} cy={80} r={16} fill={lighten(hairColor, 10)} />
      </g>
    ),
    2: ( // Snapback
      <g>
        <path d="M68 160C68 115 118 70 200 70C282 70 332 115 332 160" fill="#1a1a1a" />
        <path d="M44 168H268C272 168 278 173 278 180H44C42 174 42 168 44 168Z" fill="#1a1a1a" />
        <path d="M60 138H340" stroke="#333" strokeWidth={3} opacity={0.6} />
        <text x={172} y={120} fontSize={14} fill="white" fontWeight="bold" opacity={0.7}>NY</text>
      </g>
    ),
    3: ( // Crown
      <g>
        <path d="M130 155L110 90L160 130L200 80L240 130L290 90L270 155Z" fill="#F5C518" stroke="#D4A017" strokeWidth={2} />
        <circle cx={200} cy={82} r={8} fill="#E53935" />
        <circle cx={112} cy={91} r={6} fill="#E53935" />
        <circle cx={288} cy={91} r={6} fill="#E53935" />
        <path d="M130 155H270" fill="#F5C518" stroke="#D4A017" strokeWidth={2} />
      </g>
    ),
  };

  return styles[index % 4] || styles[0];
}

// ─── Fantasy Accessories ─────────────────────────────────────────────────────
function FantasyAcc({ type }: { type: string }) {
  if (type === 'none') return null;

  const accs: Record<string, JSX.Element> = {
    halo: (
      <g>
        <ellipse cx={200} cy={55} rx={55} ry={14} fill="none" stroke="#FFD700" strokeWidth={7} opacity={0.9} />
        <ellipse cx={200} cy={55} rx={55} ry={14} fill="none" stroke="#FFF8DC" strokeWidth={3} opacity={0.6} />
      </g>
    ),
    horns: (
      <g>
        <path d="M148 100C142 70 138 40 148 20C158 42 160 70 155 100Z" fill="#8B1A1A" />
        <path d="M252 100C258 70 262 40 252 20C242 42 240 70 245 100Z" fill="#8B1A1A" />
        <path d="M148 100C142 70 138 40 148 20" fill="#A52020" opacity={0.4} />
        <path d="M252 100C258 70 262 40 252 20" fill="#A52020" opacity={0.4} />
      </g>
    ),
    wings: (
      <g opacity={0.9}>
        {/* Left wing */}
        <path d="M70 240C20 200 -10 160 10 120C30 100 60 120 80 140C60 130 40 140 50 160C70 180 80 200 70 240Z" fill="white" stroke="#DDD" strokeWidth={1.5} />
        {/* Right wing */}
        <path d="M330 240C380 200 410 160 390 120C370 100 340 120 320 140C340 130 360 140 350 160C330 180 320 200 330 240Z" fill="white" stroke="#DDD" strokeWidth={1.5} />
      </g>
    ),
    crown: (
      <g>
        <path d="M140 135L125 80L168 110L200 65L232 110L275 80L260 135Z" fill="#FFD700" stroke="#C5A000" strokeWidth={2} />
        <circle cx={200} cy={67} r={9} fill="#E53935" />
        <circle cx={127} cy={82} r={7} fill="#3B82F6" />
        <circle cx={273} cy={82} r={7} fill="#22C55E" />
        <rect x={140} y={135} width={120} height={12} rx={4} fill="#FFD700" stroke="#C5A000" strokeWidth={1.5} />
      </g>
    ),
  };

  return accs[type] || null;
}

// ─── Body / Clothing ─────────────────────────────────────────────────────────
function Body({ avatar }: { avatar: AvatarState }) {
  const { clothingColor, clothingTop, bodyType } = avatar;
  const bodyScale = bodyType === 'slim' ? 0.85 : bodyType === 'heavy' ? 1.15 : bodyType === 'athletic' ? 0.95 : 1;
  const clothingDark = darken(clothingColor, 20);
  const clothingLight = lighten(clothingColor, 25);

  const tops: Record<number, JSX.Element> = {
    0: ( // T-shirt
      <g transform={`scale(${bodyScale},1)`} style={{ transformOrigin: '200px 430px' }}>
        <path d="M148 395C120 395 80 408 62 428L52 490H348L338 428C320 408 280 395 252 395C240 410 220 420 200 420C180 420 160 410 148 395Z" fill={clothingColor} />
        <path d="M148 395C160 412 180 422 200 422C220 422 240 412 252 395" fill="none" stroke={clothingDark} strokeWidth={2} opacity={0.5} />
        <path d="M62 428L52 490" fill="none" stroke={clothingDark} strokeWidth={1.5} opacity={0.3} />
        <path d="M338 428L348 490" fill="none" stroke={clothingDark} strokeWidth={1.5} opacity={0.3} />
        {/* Collar */}
        <path d="M168 396C175 404 185 409 200 409C215 409 225 404 232 396" fill="none" stroke={clothingDark} strokeWidth={2.5} opacity={0.7} />
        {/* Sleeve hint */}
        <path d="M52 448C58 438 70 430 82 428" fill={clothingLight} opacity={0.4} />
        <path d="M348 448C342 438 330 430 318 428" fill={clothingLight} opacity={0.4} />
      </g>
    ),
    1: ( // Hoodie
      <g transform={`scale(${bodyScale},1)`} style={{ transformOrigin: '200px 430px' }}>
        <path d="M148 392C118 392 75 408 55 432L45 492H355L345 432C325 408 282 392 252 392C240 408 222 418 200 418C178 418 160 408 148 392Z" fill={clothingColor} />
        {/* Hood */}
        <path d="M155 392C148 380 145 368 148 358C155 345 168 340 180 342C185 338 192 336 200 336C208 336 215 338 220 342C232 340 245 345 252 358C255 368 252 380 245 392" fill={clothingColor} stroke={clothingDark} strokeWidth={1.5} />
        <path d="M155 392C162 380 175 370 200 366C225 370 238 380 245 392" fill={clothingDark} opacity={0.2} />
        {/* Pocket */}
        <rect x={172} y={445} width={56} height={30} rx={8} fill={clothingDark} opacity={0.3} />
        {/* Seams */}
        <path d="M148 392C152 405 165 416 200 420" fill="none" stroke={clothingDark} strokeWidth={1.5} opacity={0.4} />
        <path d="M252 392C248 405 235 416 200 420" fill="none" stroke={clothingDark} strokeWidth={1.5} opacity={0.4} />
      </g>
    ),
    2: ( // Tank Top
      <g transform={`scale(${bodyScale},1)`} style={{ transformOrigin: '200px 430px' }}>
        <path d="M162 395C145 395 108 410 90 432L78 492H322L310 432C292 410 255 395 238 395C226 410 214 418 200 418C186 418 174 410 162 395Z" fill={clothingColor} />
        <path d="M162 395C170 408 184 416 200 416C216 416 230 408 238 395" fill="none" stroke={clothingDark} strokeWidth={2} opacity={0.5} />
        {/* Straps */}
        <path d="M170 395C168 385 170 376 174 370" fill="none" stroke={clothingColor} strokeWidth={8} strokeLinecap="round" />
        <path d="M230 395C232 385 230 376 226 370" fill="none" stroke={clothingColor} strokeWidth={8} strokeLinecap="round" />
      </g>
    ),
    3: ( // Blazer
      <g transform={`scale(${bodyScale},1)`} style={{ transformOrigin: '200px 430px' }}>
        <path d="M148 392C120 392 80 408 62 430L52 492H348L338 430C320 408 280 392 252 392C242 408 224 416 200 416C176 416 158 408 148 392Z" fill={clothingColor} />
        {/* Lapels */}
        <path d="M148 392C155 400 162 410 168 422L200 432L232 422C238 410 245 400 252 392" fill={clothingDark} opacity={0.3} />
        <path d="M200 432L200 490" fill="none" stroke={clothingDark} strokeWidth={2} opacity={0.5} />
        {/* Buttons */}
        <circle cx={200} cy={445} r={4} fill={clothingDark} opacity={0.6} />
        <circle cx={200} cy={460} r={4} fill={clothingDark} opacity={0.6} />
        <circle cx={200} cy={475} r={4} fill={clothingDark} opacity={0.6} />
        {/* Collar */}
        <path d="M174 394C178 402 186 410 200 414C214 410 222 402 226 394" fill="white" opacity={0.8} />
      </g>
    ),
    4: ( // Turtleneck
      <g transform={`scale(${bodyScale},1)`} style={{ transformOrigin: '200px 430px' }}>
        <path d="M148 392C118 392 78 408 60 430L50 492H350L340 430C322 408 282 392 252 392C244 405 226 416 200 416C174 416 156 405 148 392Z" fill={clothingColor} />
        {/* Turtleneck */}
        <path d="M166 360C166 345 180 335 200 335C220 335 234 345 234 360L234 392C222 400 212 406 200 406C188 406 178 400 166 392Z" fill={clothingColor} stroke={clothingDark} strokeWidth={1.5} />
        <path d="M174 368C182 362 218 362 226 368" fill="none" stroke={clothingDark} strokeWidth={2} opacity={0.4} />
      </g>
    ),
  };

  return (
    <g>
      {/* Neck */}
      <path d="M178 368C176 382 174 394 174 400L226 400C226 394 224 382 222 368" fill={avatar.skinTone} />
      <path d="M178 368C176 382 174 394 174 400" fill="none" stroke={darken(avatar.skinTone, 12)} strokeWidth={1} opacity={0.5} />
      {/* Shoulders hint */}
      <path d="M62 450C62 440 72 430 84 428C72 432 64 440 64 450" fill={darken(avatar.skinTone, 8)} opacity={0.3} />
      <path d="M338 450C338 440 328 430 316 428C328 432 336 440 336 450" fill={darken(avatar.skinTone, 8)} opacity={0.3} />
      {tops[clothingTop % 5] || tops[0]}
    </g>
  );
}

// ─── Face gradient / skin shading ────────────────────────────────────────────
function FaceShading({ skinTone, faceShape }: { skinTone: string; faceShape: string }) {
  const facePath = FACE_PATHS[faceShape];
  const highlight = lighten(skinTone, 28);
  const shadow = darken(skinTone, 14);

  return (
    <defs>
      <radialGradient id="faceGrad" cx="42%" cy="30%" r="65%">
        <stop offset="0%"   stopColor={highlight} stopOpacity={0.7} />
        <stop offset="50%"  stopColor={skinTone} stopOpacity={0} />
        <stop offset="100%" stopColor={shadow} stopOpacity={0.4} />
      </radialGradient>
      <radialGradient id="foreheadGrad" cx="50%" cy="0%" r="60%">
        <stop offset="0%" stopColor={highlight} stopOpacity={0.3} />
        <stop offset="100%" stopColor={skinTone} stopOpacity={0} />
      </radialGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="rgba(0,0,0,0.25)" />
      </filter>
      <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="faceClip">
        <path d={facePath} />
      </clipPath>
    </defs>
  );
}

// ─── Colour helpers ──────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function darken(hex: string, amount: number): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r - amount, g - amount, b - amount);
  } catch { return hex; }
}

function lighten(hex: string, amount: number): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  } catch { return hex; }
}

// ─── Background ──────────────────────────────────────────────────────────────
function AvatarBackground({ background, size }: { background: string; size: number }) {
  const option = BACKGROUND_OPTIONS.find((b) => b.id === background);
  if (!option) return <rect width={size} height={size} fill="#667eea" />;

  const [c1, c2] = option.colors;

  if (background === 'space') {
    return (
      <>
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width={size} height={size} fill="url(#bgGrad)" rx={20} />
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 137) % size} cy={(i * 89) % size} r={1 + (i % 3)} fill="white" opacity={0.4 + (i % 5) * 0.1} />
        ))}
      </>
    );
  }

  if (background === 'fantasy') {
    return (
      <>
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width={size} height={size} fill="url(#bgGrad)" rx={20} />
        <circle cx={size * 0.2} cy={size * 0.1} r={size * 0.15} fill="#e94560" opacity={0.15} />
        <circle cx={size * 0.8} cy={size * 0.85} r={size * 0.2} fill="#7b2d8b" opacity={0.2} />
      </>
    );
  }

  return (
    <>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width={size} height={size} fill="url(#bgGrad)" rx={20} />
    </>
  );
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export default function AvatarRenderer({ avatar, size = 400, animated = true, className = '', id }: AvatarRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { skinTone, faceShape } = avatar;
  const facePath = FACE_PATHS[faceShape];
  const skinShade = darken(skinTone, 16);

  // Blink animation
  useEffect(() => {
    if (!animated) return;
    let timer: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 3000;
      timer = setTimeout(() => {
        const eyes = svgRef.current?.querySelectorAll('.eye-group');
        eyes?.forEach((eye) => {
          (eye as SVGGElement).style.transition = 'transform 80ms ease-in-out';
          (eye as SVGGElement).style.transform = 'scaleY(0.05)';
          setTimeout(() => {
            (eye as SVGGElement).style.transform = 'scaleY(1)';
          }, 120);
        });
        scheduleBlink();
      }, delay);
    }
    scheduleBlink();
    return () => clearTimeout(timer);
  }, [animated]);

  const scale = size / 400;

  return (
    <motion.svg
      ref={svgRef}
      id={id}
      viewBox="0 0 400 520"
      width={size}
      height={size * 1.3}
      className={`select-none ${className}`}
      animate={animated ? { y: [0, -6, 0] } : {}}
      transition={animated ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
    >
      {/* Background */}
      <AvatarBackground background={avatar.background} size={400} />

      {/* Defs / gradients */}
      <FaceShading skinTone={skinTone} faceShape={faceShape} />

      {/* Wings (behind body) */}
      {avatar.fantasyAcc === 'wings' && <FantasyAcc type="wings" />}

      {/* Body / clothing */}
      <Body avatar={avatar} />

      {/* Ears (behind face) */}
      <Ears skinTone={skinTone} />

      {/* Face base */}
      <path d={facePath} fill={skinTone} filter="url(#softShadow)" />
      <path d={facePath} fill="url(#faceGrad)" />
      <path d={facePath} fill="url(#foreheadGrad)" />
      <path d={facePath} fill="none" stroke={skinShade} strokeWidth={1.5} opacity={0.4} />

      {/* Hair (below hat, above face) */}
      <Hair avatar={avatar} />

      {/* Eyes, brows */}
      <g className="eye-group" style={{ transformOrigin: '200px 220px' }}>
        <EyePair avatar={avatar} scale={scale} />
      </g>

      {/* Nose */}
      <Nose avatar={avatar} />

      {/* Mouth */}
      <Mouth avatar={avatar} />

      {/* Accessories */}
      {avatar.glasses >= 0 && <Glasses index={avatar.glasses} />}
      {avatar.hat >= 0 && <Hat index={avatar.hat} hairColor={avatar.hairColor} />}

      {/* Fantasy accessories (except wings) */}
      {avatar.fantasyAcc !== 'wings' && avatar.fantasyAcc !== 'none' && (
        <FantasyAcc type={avatar.fantasyAcc} />
      )}
    </motion.svg>
  );
}
