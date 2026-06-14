import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AscendIcon } from '../../src/components/icons/AscendIcon';
import type { AscendIconName } from '../../src/components/icons/AscendIcon';
import { useCharacterStore } from '../../src/store/characterStore';
import { useQuestStore } from '../../src/store/questStore';
import { useHabitStore } from '../../src/store/habitStore';
import { useAchievementStore } from '../../src/store/achievementStore';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { LevelBadge } from '../../src/components/ui/LevelBadge';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { StreakHeatmap } from '../../src/components/habits/StreakHeatmap';
import { ActivityFeed } from '../../src/components/ui/ActivityFeed';
import { Achievement } from '../../src/types';

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 28, stiffness: 150 }));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const activityLog = useCharacterStore((s) => s.activityLog);
  const quests = useQuestStore((s) => s.quests);
  const habits = useHabitStore((s) => s.habits);
  const allAchievements = useAchievementStore((s) => s.getAll)();
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);

  const identityAnim = useEntranceAnimation(0);
  const statsAnim = useEntranceAnimation(100);
  const achievementsAnim = useEntranceAnimation(180);
  const heatmapAnim = useEntranceAnimation(260);
  const activityAnim = useEntranceAnimation(340);

  if (!character) return null;

  const activeQuestsCount = quests.filter((q) => q.status === 'active').length;
  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;
  const allCompletions = habits.flatMap((h) => h.completions ?? []);
  const memberSince = new Date(character.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const unlockedAchievements = allAchievements.filter((a: Achievement) => unlockedIds.includes(a.id));
  const unlockedCount = unlockedAchievements.length;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET + insets.bottom }}
      >
        {/* Header */}
        <LinearGradient
          colors={['rgba(99,102,241,0.15)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Identity · Progress · History</Text>
            </View>
            <PressableScale onPress={() => router.push('/settings' as any)} style={styles.settingsBtn}>
              <AscendIcon name="settings" size={20} color={COLORS.textSecondary} />
            </PressableScale>
          </View>
        </LinearGradient>

        {/* Identity Card */}
        <Animated.View style={[styles.idCardWrap, identityAnim]}>
          <LinearGradient
            colors={['rgba(91,108,245,0.15)', 'rgba(91,108,245,0.04)', 'transparent']}
            style={styles.idCard}
          >
            <View style={styles.idCardInner}>
              {/* Name initial badge */}
              <View style={styles.initialBadge}>
                <Text style={styles.initialText}>{character.name[0]?.toUpperCase() ?? '?'}</Text>
              </View>

              {/* Right side info */}
              <View style={styles.idInfo}>
                <Text style={styles.idName}>{character.name}</Text>
                {/* Gold rank pill */}
                <View style={styles.idRankPill}>
                  <View style={{ marginRight: 4 }}>
                    <AscendIcon name="star" size={10} color={COLORS.gold} filled={true} />
                  </View>
                  <Text style={styles.idRankText}>{character.lifeRank}</Text>
                </View>
                <Text style={styles.idMemberSince}>Member since {memberSince}</Text>
              </View>

              {/* Level badge */}
              <View style={styles.idLevelWrap}>
                <LevelBadge level={character.overallLevel} size={40} color={COLORS.accent} />
                <Text style={styles.idLevelLabel}>Level</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View style={[styles.statsGrid, statsAnim]}>
          <GlowCard glowColor={COLORS.accent} style={styles.statCard}>
            <Text style={styles.statLabel}>Total Points</Text>
            <AnimatedCounter
              value={character.totalXP}
              style={styles.statValue}
              formatter={(n) => n.toLocaleString()}
            />
          </GlowCard>

          <GlowCard glowColor={COLORS.accent} style={styles.statCard}>
            <Text style={styles.statLabel}>Overall Level</Text>
            <Text style={[styles.statValue, styles.statValueBold]}>
              {character.overallLevel}
            </Text>
          </GlowCard>

          <GlowCard style={styles.statCard}>
            <Text style={styles.statLabel}>Active Goals</Text>
            <AnimatedCounter
              value={activeQuestsCount}
              style={styles.statValue}
            />
          </GlowCard>

          <GlowCard glowColor={COLORS.success} style={styles.statCard}>
            <Text style={styles.statLabel}>Goals Done</Text>
            <AnimatedCounter
              value={completedQuestsCount}
              style={styles.statValueSuccess}
            />
          </GlowCard>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View style={[styles.activitySection, activityAnim]}>
          <GlowCard style={styles.activityCard}>
            <Text style={styles.sectionLabel}>Recent Activity</Text>
            <View style={styles.activityFeedWrap}>
              <ActivityFeed entries={activityLog} maxItems={10} />
            </View>
          </GlowCard>
        </Animated.View>

        {/* Trophies section */}
        <Animated.View style={[styles.trophiesSection, achievementsAnim]}>
          <GlowCard glowColor={COLORS.gold} style={styles.trophiesCard}>
            <View style={styles.trophiesHeader}>
              <AscendIcon name="trophy" size={14} color={COLORS.gold} />
              <Text style={styles.trophiesLabel}>Achievements</Text>
              <Text style={styles.trophiesCount}>{unlockedCount}/{allAchievements.length}</Text>
            </View>

            {unlockedCount === 0 ? (
              <Text style={styles.trophiesEmpty}>
                Complete habits, goals, and disciplines to unlock milestones.
              </Text>
            ) : (
              <View style={styles.trophiesGrid}>
                {unlockedAchievements.map((ach: Achievement) => (
                  <FadeInView key={ach.id}>
                    <View style={styles.trophyPill}>
                      <AscendIcon name={ach.iconName} size={16} color={COLORS.gold} />
                      <Text style={styles.trophyTitle} numberOfLines={1}>{ach.title}</Text>
                    </View>
                  </FadeInView>
                ))}
              </View>
            )}
          </GlowCard>
        </Animated.View>

        {/* Habit Activity Heatmap */}
        <Animated.View style={[styles.heatmapSection, heatmapAnim]}>
          <GlowCard glowColor="#F97316" style={styles.heatmapCard}>
            <Text style={styles.sectionLabel}>Habit Activity</Text>
            <Text style={styles.heatmapSub}>Last 12 weeks</Text>
            <View style={styles.heatmapWrap}>
              <StreakHeatmap completions={allCompletions} color="#F97316" weeks={12} />
            </View>
          </GlowCard>
        </Animated.View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerGradient: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  title: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginTop: SPACING.xs,
  },
  idCardWrap: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  idCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(91,108,245,0.18)',
    overflow: 'hidden',
  },
  idCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  initialBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91,108,245,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(91,108,245,0.4)',
  },
  initialText: {
    fontSize: 28,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
  },
  idInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  idName: {
    fontFamily: FONTS.families.display,
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  idRankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldDim,
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  idRankText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  idMemberSince: {
    fontFamily: FONTS.families.body,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  idLevelWrap: {
    alignItems: 'center',
    gap: 4,
  },
  idLevelLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: '47%',
    gap: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statValue: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
  },
  statValueBold: {
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
  },
  statValueSuccess: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.success,
  },
  activitySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  activityCard: {
    gap: SPACING.sm,
  },
  activityFeedWrap: {
    marginTop: SPACING.xs,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  trophiesSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  trophiesCard: {
    gap: SPACING.sm,
  },
  trophiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  trophiesLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 3,
    flex: 1,
  },
  trophiesCount: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  trophiesEmpty: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  trophiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  trophyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.goldDim,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    borderRadius: RADIUS.sm,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
  },
  trophyTitle: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.text,
    maxWidth: 100,
  },
  heatmapSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  heatmapCard: {
    gap: SPACING.xs,
  },
  heatmapSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  heatmapWrap: {
    // contains the heatmap grid
  },
});
