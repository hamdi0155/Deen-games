import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useQuestStore } from '../../src/store/questStore';
import { GoalInput } from '../../src/components/goals/GoalInput';
import { CategoryId } from '../../src/types';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { Shimmer } from '../../src/components/ui/Shimmer';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { FadeInView } from '../../src/components/ui/FadeInView';

function PulsingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const cfg = { duration: 600, easing: Easing.inOut(Easing.ease) };
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, cfg),
          withTiming(0.3, cfg),
        ),
        -1,
        false,
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, animStyle]} />;
}

function SkeletonCard() {
  return (
    <GlowCard style={styles.skeletonCard}>
      <View style={styles.skeletonBars}>
        <Shimmer width={240} height={14} borderRadius={7} />
        <Shimmer width={180} height={10} borderRadius={5} />
        <Shimmer width={90} height={10} borderRadius={5} />
      </View>
    </GlowCard>
  );
}

function ForgingTitle() {
  const [ellipsis, setEllipsis] = useState('.');

  useEffect(() => {
    const steps = ['.', '..', '...'];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % steps.length;
      setEllipsis(steps[idx]);
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <Text style={styles.forgingTitle}>{`Forging Your Quest${ellipsis}`}</Text>
  );
}

function SuccessBadge() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(1500, withTiming(0, { duration: 300 })),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.successBadge, animStyle]}>
      <Text style={styles.successBadgeText}>✓</Text>
    </Animated.View>
  );
}

export default function GoalsScreen() {
  const router = useRouter();
  const isGenerating = useQuestStore((s) => s.isGenerating);
  const generationError = useQuestStore((s) => s.generationError);
  const generateAndAddQuest = useQuestStore((s) => s.generateAndAddQuest);
  const clearError = useQuestStore((s) => s.clearError);

  const prevGenerating = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (prevGenerating.current && !isGenerating && !generationError) {
      setShowSuccess(true);
      const t = setTimeout(() => {
        setShowSuccess(false);
        router.push('/(tabs)/quests' as any);
      }, 2200);
      return () => clearTimeout(t);
    }
    prevGenerating.current = isGenerating;
    return undefined;
  }, [isGenerating, generationError]);

  const handleSubmit = async (goal: string, categoryId: CategoryId) => {
    clearError();
    prevGenerating.current = true;
    await generateAndAddQuest(goal, categoryId);
  };

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.safe}>
        <AuroraBackground />
        <View style={styles.skeletonContent}>
          <ForgingTitle />

          <View style={styles.cardsContainer}>
            <FadeInView delay={0}>
              <SkeletonCard />
            </FadeInView>
            <FadeInView delay={100}>
              <SkeletonCard />
            </FadeInView>
            <FadeInView delay={200}>
              <SkeletonCard />
            </FadeInView>
          </View>

          <View style={styles.dotsRow}>
            <PulsingDot delay={0} />
            <PulsingDot delay={200} />
            <PulsingDot delay={400} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (generationError) {
    return (
      <SafeAreaView style={styles.safe}>
        <AuroraBackground />
        <View style={styles.errorContent}>
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Quest Forging Failed</Text>
            <Text style={styles.errorMessage}>{generationError}</Text>
            <TouchableOpacity
              onPress={clearError}
              activeOpacity={0.8}
              style={styles.tryAgainBtn}
            >
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {showSuccess && <SuccessBadge />}
      <GoalInput onSubmit={handleSubmit} isLoading={isGenerating} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  skeletonContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  forgingTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.accent,
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: SPACING.md,
  },
  skeletonCard: {
    // GlowCard wraps children, no extra styling needed
  },
  skeletonBars: {
    gap: SPACING.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  // Error state
  errorContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorCard: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderColor: 'rgba(239,68,68,0.35)',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    width: '100%',
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.danger,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  tryAgainBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  tryAgainText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyBold,
  },
  // Success badge
  successBadge: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    zIndex: 99,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success,
    shadowOpacity: 0.7,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
  successBadgeText: {
    color: '#fff',
    fontSize: 32,
    fontFamily: FONTS.families.displayBold,
  },
});
