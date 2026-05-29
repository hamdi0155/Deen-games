import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
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

export default function GoalsScreen() {
  const router = useRouter();
  const isGenerating = useQuestStore((s) => s.isGenerating);
  const generationError = useQuestStore((s) => s.generationError);
  const generateAndAddQuest = useQuestStore((s) => s.generateAndAddQuest);
  const clearError = useQuestStore((s) => s.clearError);

  const handleSubmit = async (goal: string, categoryId: CategoryId) => {
    clearError();
    await generateAndAddQuest(goal, categoryId);
    const error = useQuestStore.getState().generationError;
    if (!error) {
      router.push('/(tabs)/quests' as any);
    } else {
      Alert.alert('Quest Forging Failed', error ?? 'Unknown error. Please try again.');
    }
  };

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.safe}>
        <AuroraBackground />
        <View style={styles.skeletonContent}>
          <Text style={styles.forgingTitle}>Forging Your Quest…</Text>

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

  return (
    <SafeAreaView style={styles.safe}>
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
});
