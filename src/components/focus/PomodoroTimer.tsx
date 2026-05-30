import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MODES = [
  { label: 'Focus', duration: 25 * 60, color: '#5B6CF5', xpReward: 50 },
  { label: 'Short Break', duration: 5 * 60, color: '#0EA875', xpReward: 10 },
  { label: 'Long Break', duration: 15 * 60, color: '#C9A84C', xpReward: 20 },
] as const;

type ModeType = 0 | 1 | 2;

const AMBIENT_ROOMS = [
  { id: 'library',    label: 'Library',       emoji: '📚', gradient: ['#1a1f3a', '#0d1021'] as const },
  { id: 'rain',       label: 'Rain',          emoji: '🌧️', gradient: ['#0f1e2e', '#071318'] as const },
  { id: 'cyber',      label: 'Cyber',         emoji: '⚡', gradient: ['#0a0a2e', '#1a0050'] as const },
  { id: 'monk',       label: 'Monastery',     emoji: '🕌', gradient: ['#1a1208', '#0d0b05'] as const },
  { id: 'night',      label: 'Night Study',   emoji: '🌙', gradient: ['#080e24', '#020308'] as const },
  { id: 'athlete',    label: 'Training Room', emoji: '🏋️', gradient: ['#1a0a0a', '#0d0505'] as const },
] as const;

interface PomodoroTimerProps {
  onSessionComplete?: (xpEarned: number, modeLabel: string) => void;
}

const SIZE = 200;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [modeIdx, setModeIdx] = useState<ModeType>(0);
  const [ambientIdx, setAmbientIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [running, setRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progress = useSharedValue(1);
  const pulseAnim = useSharedValue(1);

  const mode = MODES[modeIdx];
  const ambient = AMBIENT_ROOMS[ambientIdx];

  // Arc progress animation
  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  // Pulse when running
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    opacity: 0.6 + pulseAnim.value * 0.4,
  }));

  useEffect(() => {
    if (running) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.98, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseAnim);
      pulseAnim.value = withTiming(1, { duration: 300 });
    }
  }, [running]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setSessionsCompleted((c) => c + 1);
            onSessionComplete?.(mode.xpReward, mode.label);
            // Auto-advance to next mode
            const next = modeIdx === 0 ? 1 : 0;
            setModeIdx(next as ModeType);
            return MODES[next].duration;
          }
          const next = prev - 1;
          progress.value = withTiming(next / mode.duration, { duration: 900 });
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, modeIdx]);

  const handleModeChange = (idx: ModeType) => {
    setModeIdx(idx);
    setRunning(false);
    setTimeLeft(MODES[idx].duration);
    progress.value = withTiming(1, { duration: 400 });
  };

  const handleToggle = () => {
    if (!running && timeLeft === mode.duration) {
      progress.value = 1;
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setTimeLeft(mode.duration);
    progress.value = withTiming(1, { duration: 400 });
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Mode tabs */}
      <View style={styles.modeTabs}>
        {MODES.map((m, i) => (
          <TouchableOpacity
            key={m.label}
            onPress={() => handleModeChange(i as ModeType)}
            style={[
              styles.modeTab,
              modeIdx === i && { borderColor: m.color, backgroundColor: m.color + '18' },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, modeIdx === i && { color: m.color }]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ambient room selector */}
      <View style={styles.ambientRow}>
        {AMBIENT_ROOMS.map((room, i) => (
          <TouchableOpacity
            key={room.id}
            onPress={() => setAmbientIdx(i)}
            style={[
              styles.ambientBtn,
              ambientIdx === i && { borderColor: mode.color, backgroundColor: mode.color + '20' },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.ambientEmoji}>{room.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ambientLabel}>{ambient.label} Mode</Text>

      {/* Timer ring */}
      <Animated.View style={[styles.ringWrap, glowStyle]}>
        <LinearGradient
          colors={ambient.gradient}
          style={styles.ringBackground}
        >
          <Svg width={SIZE} height={SIZE}>
            {/* Track */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={STROKE}
              fill="none"
            />
            {/* Glow */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={mode.color}
              strokeWidth={STROKE * 2.5}
              strokeOpacity={0.12}
              fill="none"
            />
            {/* Progress arc */}
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={mode.color}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={arcProps}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </Svg>

          {/* Center display */}
          <View style={styles.center}>
            <Text style={[styles.timerText, { color: mode.color }]}>
              {mins}:{secs}
            </Text>
            <Text style={styles.modeLabel}>{mode.label.toUpperCase()}</Text>
            {sessionsCompleted > 0 && (
              <Text style={styles.sessionsText}>🍅 {sessionsCompleted}</Text>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleReset} style={styles.controlBtn} activeOpacity={0.7}>
          <AscendIcon name="refresh" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggle} activeOpacity={0.85} style={styles.playBtn}>
          <LinearGradient
            colors={running ? ['#E84545', '#C53030'] : [mode.color, mode.color + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playBtnGrad}
          >
            <AscendIcon
              name={running ? 'pause' : 'play'}
              size={28}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.controlBtn}>
          <Text style={[styles.xpBadge, { color: mode.color }]}>+{mode.xpReward} XP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  modeTab: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeTabText: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  ambientRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  ambientBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ambientEmoji: { fontSize: 16 },
  ambientLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: -SPACING.xs,
  },
  ringWrap: {
    borderRadius: SIZE / 2,
    shadowColor: '#5B6CF5',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  ringBackground: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  timerText: {
    fontSize: 42,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: -1,
    lineHeight: 50,
  },
  modeLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 3,
  },
  sessionsText: {
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  controlBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#5B6CF5',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  playBtnGrad: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpBadge: {
    fontSize: 12,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.5,
  },
});
