// ============================================================
// MissionCard — Cinematic hero card for Today's Mission
// Replaces TodayCard as the dashboard centerpiece.
// ============================================================
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MomentumRing } from './MomentumRing';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

// ── Unsplash CDN photos keyed to primary category ─────────────
const CATEGORY_IMAGES: Record<string, string> = {
  discipline:    'https://images.unsplash.com/photo-1464822759023-fed107cd4b61?w=700&q=85&auto=format&fit=crop',
  physical:      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=85&auto=format&fit=crop',
  education:     'https://images.unsplash.com/photo-1507842217343-583bb2b9b4b8?w=700&q=85&auto=format&fit=crop',
  career:        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=85&auto=format&fit=crop',
  mental:        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=85&auto=format&fit=crop',
  spiritual:     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85&auto=format&fit=crop',
  finance:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=85&auto=format&fit=crop',
  social:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=85&auto=format&fit=crop',
  creativity:    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=85&auto=format&fit=crop',
  leadership:    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=85&auto=format&fit=crop',
  relationships: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=85&auto=format&fit=crop',
  appearance:    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85&auto=format&fit=crop',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed107cd4b61?w=700&q=85&auto=format&fit=crop';

// ── Category accent colors for border + chip tint ─────────────
const CATEGORY_ACCENT: Record<string, string> = {
  discipline: '#F97316',
  physical:   '#E8941A',
  education:  '#5B6CF5',
  career:     '#3B82F6',
  mental:     '#8B5CF6',
};
const DEFAULT_ACCENT = COLORS.accent;

// ── Mission description helper ────────────────────────────────
const MISSION_DESCRIPTIONS: Record<string, string> = {
  'Master Your Day':  'Complete your priorities. Protect your focus.\nBuild the future you committed to.',
  'Stay the Course':  "Momentum is built one action at a time.\nDon't stop now.",
  'Finish Strong':    'The day isn\'t over. Push to completion.\nYour future self will thank you.',
};
function getMissionDescription(title?: string): string {
  return MISSION_DESCRIPTIONS[title ?? ''] ?? "Every action shapes who you're becoming.";
}

// ── Props ─────────────────────────────────────────────────────
export interface MissionCardProps {
  habitsTotal: number;
  habitsDone: number;
  disciplinesTotal: number;
  disciplinesDone: number;
  streakDays: number;
  primaryCategoryId?: string;
  missionTitle?: string;
  onPress?: () => void;
}

export function MissionCard({
  habitsTotal,
  habitsDone,
  disciplinesTotal,
  disciplinesDone,
  streakDays,
  primaryCategoryId = 'default',
  missionTitle = 'Master Your Day',
  onPress,
}: MissionCardProps) {
  const total = habitsTotal + disciplinesTotal;
  const done = habitsDone + disciplinesDone;
  const progress = total > 0 ? done / total : 0;

  const totalXP = done * 25;
  const momentumGain = Math.round(progress * 20);

  const accentColor = CATEGORY_ACCENT[primaryCategoryId] ?? DEFAULT_ACCENT;
  const imageUri = CATEGORY_IMAGES[primaryCategoryId ?? ''] ?? DEFAULT_IMAGE;

  // ── Shimmer sweep — single pass on mount ────────────────────
  const shimmerX = useSharedValue(-200);
  useEffect(() => {
    shimmerX.value = withTiming(400, {
      duration: 2000,
      easing: Easing.out(Easing.quad),
    });
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const ringColor = done === total && total > 0 ? COLORS.success : accentColor;

  return (
    <View style={[styles.cardWrapper, { borderColor: accentColor + '30' }]}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.imageBg}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Dark gradient overlay — horizontal: dark left, fades to transparent right */}
        <LinearGradient
          colors={['rgba(7,9,15,0.97)', 'rgba(7,9,15,0.88)', 'rgba(7,9,15,0.55)', 'rgba(7,9,15,0.15)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Shimmer sweep line */}
        <Animated.View style={[styles.shimmerWrap, shimmerStyle]} pointerEvents="none">
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.07)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerLine}
          />
        </Animated.View>

        {/* Card content — positioned on left 72% */}
        <View style={styles.content}>
          {/* HEADER LABEL */}
          <Text style={styles.missionLabel}>TODAY'S MISSION</Text>

          {/* HUD ROW */}
          <View style={styles.hudRow}>
            {/* Momentum ring */}
            <MomentumRing
              progress={progress}
              size={88}
              strokeWidth={6}
              color={ringColor}
              centerValue={total === 0 ? '—' : `${Math.round(progress * 100)}%`}
              centerLabel="done"
              delay={300}
            />

            {/* Mission text column */}
            <View style={styles.textCol}>
              <Text style={styles.missionTitle} numberOfLines={2}>
                {missionTitle}
              </Text>
              <Text style={styles.description} numberOfLines={3}>
                {getMissionDescription(missionTitle)}
              </Text>

              {/* Streak badge */}
              {streakDays > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {streakDays}d streak</Text>
                </View>
              )}
            </View>
          </View>

          {/* BOTTOM ROW */}
          <View style={styles.bottomRow}>
            {/* XP + Momentum chips */}
            <View style={styles.chips}>
              <View style={[styles.chip, { borderColor: COLORS.gold + '40' }]}>
                <Text style={styles.chipTextGold}>⚡ +{totalXP} XP</Text>
              </View>
              <View style={[styles.chip, { borderColor: accentColor + '40' }]}>
                <Text style={[styles.chipTextAccent, { color: accentColor }]}>
                  ↑ +{momentumGain} Momentum
                </Text>
              </View>
            </View>

            {/* View Mission button */}
            {onPress && (
              <TouchableOpacity
                onPress={onPress}
                style={[styles.viewBtn, { borderColor: accentColor + '60' }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.viewBtnText, { color: accentColor }]}>
                  View Mission →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 14,
  },
  imageBg: {
    width: '100%',
    minHeight: 170,
    justifyContent: 'center',
  },
  imageStyle: {
    borderRadius: RADIUS.xl,
  },
  shimmerWrap: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  shimmerLine: {
    width: 160,
    height: '100%',
  },
  content: {
    padding: SPACING.lg,
    width: '72%',
    gap: SPACING.sm,
  },
  missionLabel: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  missionTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  description: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.28)',
    marginTop: 2,
  },
  streakText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    color: '#F97316',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  chips: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipTextGold: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    color: COLORS.gold,
  },
  chipTextAccent: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
  },
  viewBtn: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  viewBtnText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 0.2,
  },
});
