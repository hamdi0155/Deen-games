// ============================================================
// DailyReflectionCard — philosophical daily prompt card
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DailyReflectionCardProps {
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Prompts — cycles based on day of month
// ---------------------------------------------------------------------------
const PROMPTS: string[] = [
  'How will you be better than yesterday?',
  'What one action today moves you forward?',
  'What are you committed to becoming?',
  'Who must you be to achieve your goals?',
  'What would your best self do right now?',
];

// ---------------------------------------------------------------------------
// Stoic figure SVG — abstract silhouette (circle head + shoulder rect)
// ---------------------------------------------------------------------------
function StoicFigure() {
  return (
    <Svg width={64} height={90} viewBox="0 0 64 90">
      {/* Neck */}
      <Rect
        x={27}
        y={28}
        width={10}
        height={10}
        rx={2}
        fill="rgba(201,168,76,0.07)"
        stroke="rgba(201,168,76,0.15)"
        strokeWidth={1}
      />
      {/* Head */}
      <Circle
        cx={32}
        cy={20}
        r={14}
        fill="rgba(201,168,76,0.06)"
        stroke="rgba(201,168,76,0.18)"
        strokeWidth={1}
      />
      {/* Bust / shoulder block */}
      <Path
        d="M8 90 C8 60 12 45 32 38 C52 45 56 60 56 90 Z"
        fill="rgba(201,168,76,0.08)"
        stroke="rgba(201,168,76,0.2)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      {/* Draped fabric hint */}
      <Path
        d="M14 70 C18 55 24 48 32 45 C40 48 46 55 50 70"
        fill="none"
        stroke="rgba(201,168,76,0.1)"
        strokeWidth={1}
        strokeLinecap="round"
      />
      {/* Laurel leaf suggestion — two small arcs on head */}
      <Path
        d="M18 16 C16 12 20 9 22 13"
        fill="none"
        stroke="rgba(201,168,76,0.22)"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <Path
        d="M46 16 C48 12 44 9 42 13"
        fill="none"
        stroke="rgba(201,168,76,0.22)"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DailyReflectionCard({ onPress }: DailyReflectionCardProps) {
  const dayIndex = new Date().getDate() % 5;
  const prompt = PROMPTS[dayIndex];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touchable}>
      <LinearGradient
        colors={['rgba(201,168,76,0.08)', 'rgba(7,9,15,0.95)']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {/* Border overlay */}
        <View style={styles.border} pointerEvents="none" />

        <View style={styles.inner}>
          {/* Left content */}
          <View style={styles.leftContent}>
            {/* Label */}
            <Text style={styles.label}>DAILY REFLECTION</Text>

            {/* Prompt */}
            <Text style={styles.prompt}>{prompt}</Text>

            {/* CTA pill */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.ctaPill}>
              <Text style={styles.ctaText}>Reflect Now →</Text>
            </TouchableOpacity>
          </View>

          {/* Right: Stoic figure */}
          <View style={styles.figureContainer}>
            <StoicFigure />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  touchable: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  container: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.18)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: SPACING.md,
    paddingRight: 0,
  },
  leftContent: {
    flex: 1,
    paddingRight: SPACING.sm,
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.gold,
    textTransform: 'uppercase',
  },
  prompt: {
    fontFamily: FONTS.families.display,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    letterSpacing: -0.2,
    flex: 1,
  },
  ctaPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  ctaText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: 11,
    color: COLORS.gold,
    letterSpacing: 0.3,
  },
  figureContainer: {
    width: 64,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    opacity: 0.85,
  },
});
