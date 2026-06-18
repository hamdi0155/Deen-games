/**
 * Progress — the anti-shame screen. (ADHD spec §6.4)
 * Framed entirely as accumulation, never as deficit.
 * Gold = active days. Grey = neutral. Never red.
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useQuestStore } from '../../src/store/questStore';
import { useHabitStore } from '../../src/store/habitStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { StreakHeatmap } from '../../src/components/habits/StreakHeatmap';
import { AscendIcon, CATEGORY_ASCEND_ICONS } from '../../src/components/icons/AscendIcon';
import { LevelBadge } from '../../src/components/ui/LevelBadge';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { xpProgress } from '../../src/services/xpService';
import {
  COLORS, FONTS, SPACING, RADIUS,
  CATEGORY_COLORS, TAB_BAR_OFFSET,
} from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 280 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 28, stiffness: 150 }));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

function xpForLevel(l: number) { return l * l * 500; }

export default function ProgressScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const quests = useQuestStore((s) => s.quests);
  const habits = useHabitStore((s) => s.habits);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const heroAnim = useEntranceAnimation(0);
  const heatmapAnim = useEntranceAnimation(100);
  const domainsAnim = useEntranceAnimation(200);

  if (!character) return null;

  const ovLvl = character.overallLevel;
  const xpCurr = xpForLevel(ovLvl);
  const xpNext = xpForLevel(ovLvl + 1);
  const lvlProgress = ovLvl === 0
    ? Math.min(character.totalXP / 500, 1)
    : (character.totalXP - xpCurr) / (xpNext - xpCurr);

  // Quests completed this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const questsThisMonth = quests.filter(
    (q) => q.status === 'completed' && q.completedAt && q.completedAt >= monthStart,
  ).length;
  const totalCompleted = quests.filter((q) => q.status === 'completed').length;

  // All habit completions for heatmap
  const allCompletions = habits.flatMap((h) => h.completions ?? []);

  // Streak state — find longest active habit streak
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const hasActiveStreak = longestStreak > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET + 20 }}
      >
        {/* ── Hero summary ─────────────────────────────────────────── */}
        <Animated.View style={heroAnim}>
          <LinearGradient
            colors={['rgba(255,178,62,0.10)', 'transparent']}
            style={styles.heroGrad}
          >
            <Text style={styles.heroEyebrow}>Progress</Text>

            <View style={styles.heroRow}>
              {/* Level ring */}
              <View style={styles.levelRing}>
                <Text style={styles.levelNum}>{ovLvl}</Text>
                <Text style={styles.levelWord}>Level</Text>
              </View>

              {/* XP + stats */}
              <View style={styles.heroStats}>
                <Text style={styles.xpHero}>
                  {character.totalXP.toLocaleString()}
                  <Text style={styles.xpLabel}> XP</Text>
                </Text>
                <View style={styles.xpBarRow}>
                  <View style={styles.xpTrack}>
                    <View style={[styles.xpFill, { width: `${Math.round(lvlProgress * 100)}%` as any }]} />
                  </View>
                  <Text style={styles.xpNext}>→ Lv {ovLvl + 1}</Text>
                </View>
                <Text style={styles.heroSummaryText}>
                  {questsThisMonth > 0
                    ? `${questsThisMonth} quest${questsThisMonth > 1 ? 's' : ''} done this month · ${totalCompleted} total`
                    : `${totalCompleted} quest${totalCompleted !== 1 ? 's' : ''} completed`}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Streak state (no shame) ───────────────────────────────── */}
        <View style={styles.streakWrap}>
          {hasActiveStreak ? (
            <View style={styles.streakPill}>
              <AscendIcon name="flame" size={14} color={COLORS.gold} filled />
              <Text style={styles.streakPillText}>{longestStreak}-day streak</Text>
            </View>
          ) : (
            <View style={styles.streakPausedPill}>
              <Text style={styles.streakPausedText}>
                Streak paused — pick it back up today
              </Text>
              <TouchableOpacity
                style={styles.resumeBtn}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/habits' as any)}
              >
                <Text style={styles.resumeBtnText}>Resume</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── Heatmap ──────────────────────────────────────────────── */}
        <Animated.View style={heatmapAnim}>
          <GlowCard glowColor={COLORS.gold} style={styles.heatmapCard}>
            <Text style={styles.sectionLabel}>Activity</Text>
            <Text style={styles.heatmapSub}>Last 12 weeks — gold means you showed up</Text>
            <StreakHeatmap completions={allCompletions} color={COLORS.gold} weeks={12} />
          </GlowCard>
        </Animated.View>

        {/* ── Domains ───────────────────────────────────────────────── */}
        <Animated.View style={domainsAnim}>
          <Text style={styles.sectionLabel2}>Domains</Text>
          <View style={styles.domainList}>
            {CATEGORY_META.map((meta, index) => {
              const cat = character.categories[meta.id];
              const { level, progress } = xpProgress(cat.xp);
              const color = CATEGORY_COLORS[meta.id];
              const isLast = index === CATEGORY_META.length - 1;
              return (
                <PressableScale
                  key={meta.id}
                  onPress={() => router.push(`/category/${meta.id}` as any)}
                >
                  <View style={[styles.domainRow, isLast && styles.domainRowLast]}>
                    <AscendIcon
                      name={CATEGORY_ASCEND_ICONS[meta.id] ?? 'star'}
                      size={16}
                      color={color}
                    />
                    <Text style={styles.domainName}>{meta.label}</Text>
                    <View style={styles.domainProgress}>
                      <View style={styles.domainBar}>
                        <View style={[styles.domainBarFill, {
                          width: `${Math.round(progress * 100)}%` as any,
                          backgroundColor: color,
                        }]} />
                      </View>
                      <Text style={[styles.domainLevel, { color }]}>Lv {level}</Text>
                    </View>
                  </View>
                </PressableScale>
              );
            })}

            {customCategories.map((cat, index) => {
              const xpEntry = customCategoryXP[cat.id] ?? { xp: 0, level: 0 };
              const { level, progress } = xpProgress(xpEntry.xp);
              const isLast = index === customCategories.length - 1;
              return (
                <PressableScale
                  key={cat.id}
                  onPress={() => router.push(`/category/${cat.id}` as any)}
                >
                  <View style={[styles.domainRow, isLast && styles.domainRowLast]}>
                    <Text style={{ fontSize: 15 }}>{cat.emoji}</Text>
                    <Text style={styles.domainName}>{cat.label}</Text>
                    <View style={styles.domainProgress}>
                      <View style={styles.domainBar}>
                        <View style={[styles.domainBarFill, {
                          width: `${Math.round(progress * 100)}%` as any,
                          backgroundColor: cat.color,
                        }]} />
                      </View>
                      <Text style={[styles.domainLevel, { color: cat.color }]}>Lv {level}</Text>
                    </View>
                  </View>
                </PressableScale>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.addDomainBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/category/create' as any)}
          >
            <AscendIcon name="sparkle" size={14} color={COLORS.accent} />
            <Text style={styles.addDomainText}>Add custom domain</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Hero
  heroGrad: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  heroEyebrow: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 26,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  levelRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: COLORS.gold + '70',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,178,62,0.08)',
    flexShrink: 0,
  },
  levelNum: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 28,
    color: COLORS.gold,
    letterSpacing: -0.5,
  },
  levelWord: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  heroStats: { flex: 1, gap: 6 },
  xpHero: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 30,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  xpLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  xpBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  xpTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,178,62,0.18)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  xpNext: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  heroSummaryText: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Streak
  streakWrap: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,178,62,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,178,62,0.25)',
  },
  streakPillText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.gold,
  },
  streakPausedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  streakPausedText: {
    flex: 1,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  resumeBtn: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.accentDim,
  },
  resumeBtnText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
  },

  // Heatmap
  heatmapCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: 6,
  },
  sectionLabel: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  heatmapSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  // Domains
  sectionLabel2: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    letterSpacing: 0.3,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  domainList: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  domainRowLast: {
    borderBottomWidth: 0,
  },
  domainName: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    flex: 1,
  },
  domainProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  domainBar: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  domainBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  domainLevel: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 0.2,
    minWidth: 30,
    textAlign: 'right',
  },

  addDomainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(139,124,246,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,124,246,0.18)',
  },
  addDomainText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
  },
});
