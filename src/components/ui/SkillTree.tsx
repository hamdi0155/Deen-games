import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Category } from '../../types';
import { COLORS, CATEGORY_COLORS, FONTS } from '../../constants/theme';

interface SkillTreeProps {
  categories: Category[] | Record<string, Category>;
  overallLevel: number;
}

// Tree layout: central hub with radiating branches
const NODE_RADIUS = 28;
const HUB_RADIUS = 36;
const CANVAS_SIZE = 340;
const CENTER = CANVAS_SIZE / 2;

// Arrange categories in a radial pattern
const POSITIONS: { angle: number; radius: number }[] = [
  { angle: -90, radius: 120 },  // Top
  { angle: -30, radius: 120 },  // Upper right
  { angle: 30, radius: 120 },   // Right
  { angle: 90, radius: 120 },   // Bottom
  { angle: 150, radius: 120 },  // Lower left
  { angle: 210, radius: 120 },  // Left
  { angle: -150, radius: 120 }, // Upper left
  { angle: -60, radius: 80 },   // Inner ring
  { angle: 60, radius: 80 },
  { angle: 180, radius: 80 },
  { angle: 0, radius: 80 },
  { angle: 120, radius: 80 },
];

function angleToXY(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function levelToOpacity(level: number): number {
  if (level === 0) return 0.2;
  if (level < 3) return 0.5;
  if (level < 7) return 0.8;
  return 1;
}

function levelToRadius(level: number): number {
  const base = NODE_RADIUS;
  const bonus = Math.min(level * 1.5, 14);
  return base + bonus;
}

export function SkillTree({ categories, overallLevel }: SkillTreeProps) {
  const catList = (Array.isArray(categories) ? categories : Object.values(categories)).slice(0, 12);

  return (
    <View style={styles.container}>
      <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}>
        <Defs>
          <RadialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#5B6CF5" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
          </RadialGradient>
        </Defs>

        {/* Connection lines */}
        {catList.map((cat, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          const { x, y } = angleToXY(pos.angle, pos.radius);
          const opacity = levelToOpacity(cat.level);
          const catColor = CATEGORY_COLORS[cat.id] ?? COLORS.accent;
          return (
            <Line
              key={`line-${cat.id}`}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke={catColor}
              strokeWidth={cat.level > 0 ? 1.5 : 0.8}
              strokeOpacity={opacity * 0.6}
              strokeDasharray={cat.level === 0 ? '4,4' : undefined}
            />
          );
        })}

        {/* Category nodes */}
        {catList.map((cat, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          const { x, y } = angleToXY(pos.angle, pos.radius);
          const opacity = levelToOpacity(cat.level);
          const r = levelToRadius(cat.level);
          const catColor = CATEGORY_COLORS[cat.id] ?? COLORS.accent;

          return (
            <React.Fragment key={cat.id}>
              {/* Glow ring for active nodes */}
              {cat.level > 0 && (
                <Circle
                  cx={x}
                  cy={y}
                  r={r + 6}
                  fill={catColor}
                  fillOpacity={0.08}
                />
              )}
              {/* Node circle */}
              <Circle
                cx={x}
                cy={y}
                r={r}
                fill={cat.level > 0 ? catColor : '#1a1a2e'}
                fillOpacity={opacity}
                stroke={catColor}
                strokeWidth={1.5}
                strokeOpacity={opacity}
              />
              {/* Emoji */}
              <SvgText
                x={x}
                y={y - 4}
                fontSize="14"
                textAnchor="middle"
                alignmentBaseline="middle"
                opacity={opacity}
              >
                {cat.emoji}
              </SvgText>
              {/* Level number */}
              <SvgText
                x={x}
                y={y + 13}
                fontSize="9"
                fontWeight="bold"
                fill={cat.level > 0 ? '#fff' : '#666'}
                textAnchor="middle"
                alignmentBaseline="middle"
                opacity={opacity}
              >
                {cat.level > 0 ? `L${cat.level}` : '–'}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Central hub */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={HUB_RADIUS + 8}
          fill={COLORS.accent}
          fillOpacity={0.08}
        />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={HUB_RADIUS}
          fill="url(#hubGrad)"
        />
        <SvgText
          x={CENTER}
          y={CENTER - 8}
          fontSize="18"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          ⚡
        </SvgText>
        <SvgText
          x={CENTER}
          y={CENTER + 10}
          fontSize="10"
          fontWeight="bold"
          fill="#fff"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          Lv {overallLevel}
        </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.accent, opacity: 0.25 }]} />
          <Text style={styles.legendText}>Locked</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.gold }]} />
          <Text style={styles.legendText}>Mastered (Lv10+)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
  },
});
