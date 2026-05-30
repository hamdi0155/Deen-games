import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getDailyWisdom } from '../../services/wisdomService';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

const CATEGORY_ACCENT: Record<string, string> = {
  discipline: '#F97316',
  growth:     '#5B6CF5',
  habits:     '#0EA875',
  identity:   '#C9A84C',
  philosophy: '#8B5CF6',
};

export function DailyWisdomCard() {
  const wisdom = getDailyWisdom();
  const accent = CATEGORY_ACCENT[wisdom.category] ?? COLORS.accent;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(300, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={style}>
      <LinearGradient
        colors={[accent + '18', accent + '06', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Top accent line */}
        <View style={[styles.accentLine, { backgroundColor: accent }]} />

        <View style={styles.inner}>
          <Text style={styles.eyebrow}>TODAY'S WISDOM</Text>
          <Text style={[styles.quote, { color: COLORS.text }]}>
            "{wisdom.text}"
          </Text>
          <Text style={styles.attribution}>— Jim Rohn</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  accentLine: {
    height: 1.5,
    opacity: 0.6,
  },
  inner: {
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  eyebrow: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  quote: {
    fontSize: 14,
    fontFamily: FONTS.families.body,
    lineHeight: 22,
    letterSpacing: 0.1,
    fontStyle: 'italic',
  },
  attribution: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
});
