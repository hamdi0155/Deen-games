import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useQuestStore } from '../../src/store/questStore';
import { useHabitStore } from '../../src/store/habitStore';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { AchievementBadge } from '../../src/components/ui/AchievementBadge';
import { ACHIEVEMENTS } from '../../src/constants/achievements';
import { COLORS, FONTS, SPACING, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { StreakHeatmap } from '../../src/components/habits/StreakHeatmap';
import { ActivityFeed } from '../../src/components/ui/ActivityFeed';

export default function ProfileScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const resetCharacter = useCharacterStore((s) => s.resetCharacter);
  const activityLog = useCharacterStore((s) => s.activityLog);
  const quests = useQuestStore((s) => s.quests);
  const habits = useHabitStore((s) => s.habits);

  if (!character) return null;

  const activeQuestsCount = quests.filter((q) => q.status === 'active').length;
  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;
  const habitsCount = habits.length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  const allCompletions = habits.flatMap((h) => h.completions);
  const categoriesWithXP = Object.values(character.categories).filter((c) => c.xp > 0).length;
  const daysActive = Math.floor(
    (Date.now() - new Date(character.createdAt).getTime()) / 86400000
  );
  const memberSince = new Date(character.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const achievementStats = {
    totalXP: character.totalXP,
    overallLevel: character.overallLevel,
    questsCompleted: completedQuestsCount,
    habitsCount,
    longestStreak,
    categoriesWithXP,
  };
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.condition(achievementStats)).length;

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

        {/* Life Story */}
        <View style={styles.lifeStorySection}>
          <GlowCard glowColor={COLORS.accent} style={styles.lifeStoryCard}>
            <Text style={styles.sectionLabel}>Life Story</Text>
            <Text style={styles.lifeStorySub}>Your journey, by the numbers</Text>
            <View style={styles.lifeStoryGrid}>
              <View style={styles.lifeStatItem}>
                <Text style={styles.lifeStatValue}>
                  {Math.round((completedQuestsCount / Math.max(1, quests.length)) * 100)}%
                </Text>
                <Text style={styles.lifeStatLabel}>Quest Completion Rate</Text>
              </View>
              <View style={styles.lifeStatItem}>
                <Text style={styles.lifeStatValue}>{longestStreak}</Text>
                <Text style={styles.lifeStatLabel}>Best Habit Streak (days)</Text>
              </View>
              <View style={styles.lifeStatItem}>
                <Text style={[styles.lifeStatValue, { color: COLORS.success }]}>
                  {Object.values(character.categories).filter((c) => c.level >= 5).length}
                </Text>
                <Text style={styles.lifeStatLabel}>Domains at Level 5+</Text>
              </View>
              <View style={styles.lifeStatItem}>
                <Text style={[styles.lifeStatValue, { color: COLORS.accent }]}>
                  {character.overallLevel}
                </Text>
                <Text style={styles.lifeStatLabel}>Life Level</Text>
              </View>
            </View>
          </GlowCard>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsHeader}>
          <Text style={styles.sectionLabel}>Achievements</Text>
          <Text style={styles.achievementsSub}>
            {unlockedCount}/{ACHIEVEMENTS.length} Unlocked
          </Text>
        </View>
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((ach, index) => (
            <FadeInView key={ach.id} delay={index * 60}>
              <AchievementBadge
                achievement={ach}
                unlocked={ach.condition(achievementStats)}
              />
            </FadeInView>
          ))}
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
  lifeStatItem: {
    width: '47%',
    gap: SPACING.xs,
  },
  lifeStatValue: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  lifeStatLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  achievementsHeader: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  achievementsSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
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
