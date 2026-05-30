import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
import { StatIconCard } from '../../src/components/ui/StatIconCard';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { StreakHeatmap } from '../../src/components/habits/StreakHeatmap';
import { ActivityFeed } from '../../src/components/ui/ActivityFeed';
import { Achievement } from '../../src/types';

export default function ProfileScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const resetCharacter = useCharacterStore((s) => s.resetCharacter);
  const activityLog = useCharacterStore((s) => s.activityLog);
  const quests = useQuestStore((s) => s.quests);
  const habits = useHabitStore((s) => s.habits);
  const allAchievements = useAchievementStore((s) => s.getAll)();
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);

  if (!character) return null;

  const activeQuestsCount = quests.filter((q) => q.status === 'active').length;
  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;
  const habitsCount = habits.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const allCompletions = habits.flatMap((h) => h.completions);
  const daysActive = Math.floor(
    (Date.now() - new Date(character.createdAt).getTime()) / 86400000
  );
  const memberSince = new Date(character.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const unlockedAchievements = allAchievements.filter((a: Achievement) => unlockedIds.includes(a.id));
  const unlockedCount = unlockedAchievements.length;

  const handleReset = () => {
    Alert.alert(
      'Reset Character',
      'This will permanently delete all your progress, quests, habits, and disciplines. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetCharacter();
            router.replace('/onboarding' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        {/* Header */}
        <LinearGradient
          colors={['rgba(99,102,241,0.15)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Your Codex</Text>
              <Text style={styles.subtitle}>Identity · Progress · History</Text>
            </View>
            <PressableScale onPress={() => router.push('/settings' as any)} style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </PressableScale>
          </View>
        </LinearGradient>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={['rgba(99,102,241,0.3)', 'rgba(124,58,237,0.15)']}
            style={styles.avatarRing}
          >
            <Text style={styles.avatarEmoji}>{character.avatarEmoji}</Text>
          </LinearGradient>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={styles.characterRank}>{character.lifeRank}</Text>
          <Text style={styles.memberSince}>Member since {memberSince}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <GlowCard glowColor={COLORS.accent} style={styles.statCard}>
            <Text style={styles.statLabel}>Total XP</Text>
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
            <Text style={styles.statLabel}>Active Quests</Text>
            <AnimatedCounter
              value={activeQuestsCount}
              style={styles.statValue}
            />
          </GlowCard>

          <GlowCard style={styles.statCard}>
            <Text style={styles.statLabel}>Habits Forged</Text>
            <AnimatedCounter
              value={habitsCount}
              style={styles.statValue}
            />
          </GlowCard>

          <GlowCard glowColor={COLORS.success} style={styles.statCard}>
            <Text style={styles.statLabel}>Completed Quests</Text>
            <AnimatedCounter
              value={completedQuestsCount}
              style={styles.statValueSuccess}
            />
          </GlowCard>

          <GlowCard style={styles.statCard}>
            <Text style={styles.statLabel}>Days Active</Text>
            <AnimatedCounter
              value={daysActive}
              style={styles.statValue}
            />
          </GlowCard>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <GlowCard style={styles.activityCard}>
            <Text style={styles.sectionLabel}>Recent Activity</Text>
            <View style={styles.activityFeedWrap}>
              <ActivityFeed entries={activityLog} maxItems={10} />
            </View>
          </GlowCard>
        </View>

        {/* Life Story */}
        <View style={styles.lifeStorySection}>
          <GlowCard glowColor={COLORS.accent} style={styles.lifeStoryCard}>
            <Text style={styles.sectionLabel}>Life Story</Text>
            <Text style={styles.lifeStorySub}>Your journey, by the numbers</Text>
            <View style={styles.lifeStoryGrid}>
              <StatIconCard
                icon="checkmark-done"
                iconColor="#10B981"
                label="Quests Completed"
                value={completedQuestsCount}
                style={styles.lifeStatCard}
              />
              <StatIconCard
                icon="flame"
                iconColor="#F97316"
                label="Best Streak"
                value={`${longestStreak}d`}
                style={styles.lifeStatCard}
              />
              <StatIconCard
                icon="star"
                iconColor="#F59E0B"
                label="Domains Lv5+"
                value={Object.values(character.categories).filter((c) => c.level >= 5).length}
                style={styles.lifeStatCard}
              />
              <StatIconCard
                icon="trophy"
                iconColor="#6366F1"
                label="Life Level"
                value={character.overallLevel}
                style={styles.lifeStatCard}
              />
            </View>
          </GlowCard>
        </View>

        {/* Trophies section */}
        <View style={styles.trophiesSection}>
          <GlowCard glowColor={COLORS.gold} style={styles.trophiesCard}>
            <View style={styles.trophiesHeader}>
              <Ionicons name="trophy-outline" size={14} color={COLORS.gold} />
              <Text style={styles.trophiesLabel}>TROPHIES</Text>
              <Text style={styles.trophiesCount}>{unlockedCount}/{allAchievements.length}</Text>
            </View>

            {unlockedCount === 0 ? (
              <Text style={styles.trophiesEmpty}>
                Complete habits, quests, and disciplines to unlock trophies.
              </Text>
            ) : (
              <View style={styles.trophiesGrid}>
                {unlockedAchievements.map((ach: Achievement) => (
                  <FadeInView key={ach.id}>
                    <View style={styles.trophyPill}>
                      <Text style={styles.trophyEmoji}>{ach.emoji}</Text>
                      <Text style={styles.trophyTitle} numberOfLines={1}>{ach.title}</Text>
                    </View>
                  </FadeInView>
                ))}
              </View>
            )}
          </GlowCard>
        </View>

        {/* Habit Activity Heatmap */}
        <View style={styles.heatmapSection}>
          <GlowCard glowColor="#F97316" style={styles.heatmapCard}>
            <Text style={styles.sectionLabel}>Habit Activity</Text>
            <Text style={styles.heatmapSub}>Last 12 weeks</Text>
            <View style={styles.heatmapWrap}>
              <StreakHeatmap completions={allCompletions} color="#F97316" weeks={12} />
            </View>
          </GlowCard>
        </View>

        {/* Reset button */}
        <TouchableOpacity onPress={handleReset} activeOpacity={0.8} style={styles.resetWrap}>
          <GlowCard glowColor={COLORS.danger} style={styles.resetCard}>
            <Text style={styles.resetText}>Reset Character</Text>
            <Text style={styles.resetSub}>Clears all data and returns to onboarding</Text>
          </GlowCard>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  settingsIcon: {
    fontSize: 18,
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(99,102,241,0.5)',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  avatarEmoji: { fontSize: 48 },
  characterName: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
    letterSpacing: 0.8,
    marginTop: SPACING.xs,
  },
  characterRank: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  memberSince: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
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
  lifeStorySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  lifeStoryCard: {
    gap: SPACING.sm,
  },
  lifeStorySub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  lifeStoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  lifeStatCard: {
    width: '47%',
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
  trophyEmoji: {
    fontSize: 14,
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
  resetWrap: {
    marginHorizontal: SPACING.lg,
  },
  resetCard: {
    gap: SPACING.xs,
  },
  resetText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.md,
    color: COLORS.danger,
    letterSpacing: 0.5,
  },
  resetSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});
