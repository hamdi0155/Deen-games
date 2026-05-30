// ============================================================
// LifeMap — Orbital galaxy-style life category visualization
// ============================================================
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SPRING } from '../../constants/theme';
import { AscendIcon, CATEGORY_ASCEND_ICONS } from '../icons/AscendIcon';

// Animated SVG primitives
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ── Types ────────────────────────────────────────────────────

interface CategoryNode {
  id: string;
  label: string;
  level: number;
  xp: number;
  color: string;
}

interface LifeMapProps {
  categories: CategoryNode[];
  size?: number;
  onNodePress?: (categoryId: string) => void;
}

// ── Constants ────────────────────────────────────────────────

const RADIAL_LINES = 8;
const NODE_RADIUS = 18;
const PROGRESS_RING_RADIUS = 22; // slightly larger than node for the arc ring

// ── Helpers ──────────────────────────────────────────────────

function getNodeAngle(index: number, total: number): number {
  return (index * 2 * Math.PI) / total - Math.PI / 2;
}

function getNodePosition(
  angle: number,
  orbitR: number,
  cx: number,
  cy: number
): { x: number; y: number } {
  return {
    x: cx + Math.cos(angle) * orbitR,
    y: cy + Math.sin(angle) * orbitR,
  };
}

// ── Sub-component: single category node (SVG portion) ────────

interface NodeSVGProps {
  cx: number;
  cy: number;
  color: string;
  level: number;
  opacityAnim: Animated.SharedValue<number>;
  scaleAnim: Animated.SharedValue<number>;
}

function NodeSVG({ cx, cy, color, level }: NodeSVGProps) {
  const circumference = 2 * Math.PI * PROGRESS_RING_RADIUS;
  const progress = Math.min(Math.max(level, 0), 10) / 10;
  const strokeDash = progress * circumference;

  return (
    <G>
      {/* Node background circle */}
      <Circle
        cx={cx}
        cy={cy}
        r={NODE_RADIUS}
        fill={`${color}25`}
        stroke={`${color}80`}
        strokeWidth={1}
      />
      {/* Progress arc ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={PROGRESS_RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.7}
        strokeDasharray={`${strokeDash} ${circumference}`}
        strokeLinecap="round"
        // Rotate so progress starts at top (–90°)
        transform={`rotate(-90, ${cx}, ${cy})`}
      />
    </G>
  );
}

// ── Main component ────────────────────────────────────────────

export function LifeMap({ categories, size = 200, onNodePress }: LifeMapProps) {
  const visibleCats = categories.slice(0, 8);
  const cx = size / 2;
  const cy = size / 2;
  const orbitR = size * 0.35;

  // ── Animation: rotating orbital ring ─────────────────────
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedOrbitalProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${rotation.value}deg` }] as any,
  }));

  // ── Animation: node entrance (fixed 8 slots to obey Rules of Hooks) ─
  const op0 = useSharedValue(0); const sc0 = useSharedValue(0.6);
  const op1 = useSharedValue(0); const sc1 = useSharedValue(0.6);
  const op2 = useSharedValue(0); const sc2 = useSharedValue(0.6);
  const op3 = useSharedValue(0); const sc3 = useSharedValue(0.6);
  const op4 = useSharedValue(0); const sc4 = useSharedValue(0.6);
  const op5 = useSharedValue(0); const sc5 = useSharedValue(0.6);
  const op6 = useSharedValue(0); const sc6 = useSharedValue(0.6);
  const op7 = useSharedValue(0); const sc7 = useSharedValue(0.6);

  const nodeOpacities = [op0, op1, op2, op3, op4, op5, op6, op7];
  const nodeScales    = [sc0, sc1, sc2, sc3, sc4, sc5, sc6, sc7];

  useEffect(() => {
    visibleCats.forEach((_, i) => {
      nodeOpacities[i].value = withDelay(i * 100, withSpring(1, SPRING.gentle));
      nodeScales[i].value    = withDelay(i * 100, withSpring(1, SPRING.gentle));
    });
  }, []);

  // ── Grid helpers ─────────────────────────────────────────
  const maxR = size * 0.5;
  const gridCircles = [0.33, 0.66, 1.0];
  const radialAngles = Array.from({ length: RADIAL_LINES }, (_, i) =>
    (i * Math.PI * 2) / RADIAL_LINES
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Life Map</Text>

      {/* ── Orbital visualization ────────────────────────── */}
      <View style={{ width: size, height: size, position: 'relative' }}>
        <Svg width={size} height={size}>
          {/* Background grid: concentric circles */}
          {gridCircles.map((ratio, i) => (
            <Circle
              key={`grid-circle-${i}`}
              cx={cx}
              cy={cy}
              r={maxR * ratio}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              strokeOpacity={0.06}
            />
          ))}

          {/* Background grid: radial lines */}
          {radialAngles.map((angle, i) => (
            <Line
              key={`radial-${i}`}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * maxR}
              y2={cy + Math.sin(angle) * maxR}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              strokeOpacity={0.04}
            />
          ))}

          {/* Connection lines: center → each node */}
          {visibleCats.map((cat, i) => {
            const angle = getNodeAngle(i, visibleCats.length);
            const pos = getNodePosition(angle, orbitR, cx, cy);
            return (
              <Line
                key={`conn-${cat.id}`}
                x1={cx}
                y1={cy}
                x2={pos.x}
                y2={pos.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1}
                strokeOpacity={0.06}
              />
            );
          })}

          {/* Orbital ring (animated rotation via wrapper G) */}
          <AnimatedCircle
            animatedProps={animatedOrbitalProps}
            cx={cx}
            cy={cy}
            r={orbitR}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={1}
            strokeOpacity={0.15}
            strokeDasharray="3,8"
          />

          {/* Category node SVG circles + progress arcs */}
          {visibleCats.map((cat, i) => {
            const angle = getNodeAngle(i, visibleCats.length);
            const pos = getNodePosition(angle, orbitR, cx, cy);
            return (
              <NodeSVG
                key={`node-svg-${cat.id}`}
                cx={pos.x}
                cy={pos.y}
                color={cat.color}
                level={cat.level}
                opacityAnim={nodeOpacities[i]}
                scaleAnim={nodeScales[i]}
              />
            );
          })}

          {/* Center node: outer glow */}
          <Circle
            cx={cx}
            cy={cy}
            r={24}
            fill={`${COLORS.accent}15`}
            stroke={`${COLORS.accent}50`}
            strokeWidth={1.5}
          />
          {/* Center node: inner */}
          <Circle
            cx={cx}
            cy={cy}
            r={16}
            fill={COLORS.accentDim}
            stroke={COLORS.accent}
            strokeWidth={1}
          />
        </Svg>

        {/* Center icon overlay */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: cx - 7,
            top: cy - 7,
          }}
        >
          <AscendIcon name="goals" size={14} color={COLORS.accent} />
        </View>

        {/* Category icon overlays — absolutely positioned over SVG */}
        {visibleCats.map((cat, i) => {
          const angle = getNodeAngle(i, visibleCats.length);
          const pos = getNodePosition(angle, orbitR, cx, cy);
          const iconName = CATEGORY_ASCEND_ICONS[cat.id] ?? 'circle';
          // 9 = half of icon container (18px icon)
          const left = pos.x - 9;
          const top = pos.y - 9;

          return (
            <Animated.View
              key={`node-icon-${cat.id}`}
              style={[
                {
                  position: 'absolute',
                  left,
                  top,
                  opacity: nodeOpacities[i],
                  transform: [{ scale: nodeScales[i] }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => onNodePress?.(cat.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AscendIcon name={iconName} size={18} color={cat.color} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* ── Footer ───────────────────────────────────────── */}
      <Text style={styles.subtitle}>You are here</Text>
      <Text style={styles.subtitleSub}>Keep building your legacy.</Text>

      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={() => onNodePress?.('')}
        activeOpacity={0.75}
      >
        <Text style={styles.exploreBtnText}>Explore Map →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    letterSpacing: 0.4,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  subtitleSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  exploreBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: `${COLORS.accent}60`,
    backgroundColor: `${COLORS.accent}10`,
  },
  exploreBtnText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    letterSpacing: 0.2,
  },
});
