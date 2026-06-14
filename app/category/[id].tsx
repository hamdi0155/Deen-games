import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon, CATEGORY_ASCEND_ICONS } from '../../src/components/icons/AscendIcon';
import type { AscendIconName } from '../../src/components/icons/AscendIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useQuestStore } from '../../src/store/questStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { DisciplineGroup } from '../../src/components/disciplines/DisciplineGroup';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { XPBar } from '../../src/components/ui/XPBar';
import { LevelBadge } from '../../src/components/ui/LevelBadge';

import { StreakHeatmap } from '../../src/components/habits/StreakHeatmap';
import { xpProgress } from '../../src/services/xpService';
import { CategoryId, Discipline, DisciplineFrequency } from '../../src/types';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';
import { CategorySuggestionsSheet } from '../../src/components/ui/CategorySuggestionsSheet';

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

const BUILT_IN_IDS: CategoryId[] = [
  'education', 'career', 'finance', 'physical', 'appearance',
  'mental', 'social', 'relationships', 'discipline', 'spiritual',
  'creativity', 'leadership',
];

const DISC_FREQ_ORDER: DisciplineFrequency[] = ['daily', 'weekdays', 'weekly', 'monthly'];

export default function CategoryDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const quests = useQuestStore((s) => s.quests);

  const getDisciplinesForCategory = useDisciplineStore((s) => s.getDisciplinesForCategory);
  const getProfileForCategory = useDisciplineStore((s) => s.getProfileForCategory);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const deleteDiscipline = useDisciplineStore((s) => s.deleteDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const handleDeleteDiscipline = (disciplineId: string) => {
    const disc = getDisciplinesForCategory(id ?? '').find((d) => d.id === disciplineId);
    Alert.alert(
      'Remove Discipline',
      `Remove "${disc?.title ?? 'this discipline'}" from your practice?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deleteDiscipline(disciplineId) },
      ]
    );
  };

  if (!character || !id) return null;

  const isBuiltIn = BUILT_IN_IDS.includes(id as CategoryId);

  // Valid AscendIconNames for custom category lookup
  const VALID_ICON_NAMES: AscendIconName[] = [
    'build', 'star', 'flash', 'diamond', 'flame', 'shield', 'trophy',
    'sun', 'moon', 'sparkle', 'goals', 'focus', 'education', 'career',
    'finance', 'physical', 'appearance', 'mental', 'social', 'relationships',
    'discipline', 'spiritual', 'creativity', 'leadership',
  ];

  let iconName: AscendIconName = 'goals';
  let label = id;
  let color: string = COLORS.accent;
  let xpData = { xp: 0, level: 0 };

  if (isBuiltIn) {
    const catId = id as CategoryId;
    const cat = character.categories[catId];
    iconName = CATEGORY_ASCEND_ICONS[catId] ?? 'goals';
    label = CATEGORY_META.find((c) => c.id === catId)?.label ?? catId;
    color = CATEGORY_COLORS[catId] ?? COLORS.accent;
    xpData = { xp: cat.xp, level: cat.level };
  } else {
    const customCat = customCategories.find((c) => c.id === id);
    if (customCat) {
      // emoji field may store an AscendIconName (new flow) or legacy emoji string
      const stored = customCat.emoji as string;
      if (VALID_ICON_NAMES.includes(stored as AscendIconName)) {
        iconName = stored as AscendIconName;
      } else {
        iconName = 'goals'; // fallback for legacy emoji strings
      }
      label = customCat.label;
      color = customCat.color;
    }
    const xpEntry = customCategoryXP[id];
    if (xpEntry) {
      xpData = xpEntry;
    }
  }

  const { level, progress, xpToNext } = xpProgress(xpData.xp);
  const catQuests = quests.filter(
    (q) => q.categoryId === (id as CategoryId) && q.status === 'active'
  );

  const disciplines = getDisciplinesForCategory(id);
  const profile = getProfileForCategory(id);

  // Merge all completions from all disciplines in this category
  const allCompletions = React.useMemo(
    () => disciplines.flatMap((d) => d.completions),
    [disciplines]
  );

  // Total tasks done across all disciplines
  const totalTasksDone = disciplines.reduce((sum, d) => sum + d.completions.length, 0);

  // Top 3 disciplines sorted by currentStreak descending
  const topStreakDisciplines = React.useMemo(
    () =>
      [...disciplines]
        .sort((a, b) => b.currentStreak - a.currentStreak)
        .slice(0, 3),
    [disciplines]
  );

  const heroAnim = useEntranceAnimation(0);
  const statsAnim = useEntranceAnimation(80);
  const philosophyAnim = useEntranceAnimation(140);
  const contentAnim = useEntranceAnimation(200);

  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const handleForgeDisciplines = () =>
    router.push({
      pathname: '/category/create',
      params: {
        builtinId: id,
        builtinLabel: label,
        builtinEmoji: iconName,
        builtinColor: color,
      },
    } as any);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <AuroraBackground />

      {/* Standard navBar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <AscendIcon name="chevron-left" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{label}</Text>
        <TouchableOpacity
          onPress={() => setSuggestionsOpen(true)}
          style={[styles.suggestNavBtn, { borderColor: color + '50', backgroundColor: color + '15' }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.suggestNavBtnText, { color }]}>✦ Suggest</Text>
        </TouchableOpacity>
      </View>

      {/* Hero section */}
      <Animated.View style={heroAnim}>
        <LinearGradient
          colors={[color + '40', color + '10', 'transparent']}
          style={styles.hero}
        >
          {/* Large category icon in glowing ring */}
          <View style={styles.emojiWrap}>
            <View
              style={[
                styles.emojiGlow,
                {
                  shadowColor: color,
                },
              ]}
            >
              <LinearGradient
                colors={[color + '50', color + '20']}
                style={styles.emojiCircle}
              >
                <AscendIcon name={iconName} size={48} color={color} />
              </LinearGradient>
            </View>
          </View>

          {/* Category name */}
          <Text style={styles.title}>{label}</Text>

          {/* Level indicator — LevelBadge + text */}
          <View style={styles.levelRow}>
            <LevelBadge level={level} color={color} size={44} active />
            <Text style={[styles.levelText, { color }]}>Level {level}</Text>
          </View>

          {/* Full-width XP bar + label */}
          <View style={styles.xpBarWrap}>
            <XPBar progress={progress} color={color} height={8} glowing style={styles.xpBarFull} />
            <Text style={styles.xpBarLabel}>
              <AnimatedCounter
                value={xpData.xp}
                style={{ color, fontFamily: FONTS.families.body, fontSize: FONTS.sizes.xs } as any}
                formatter={(n) => `${n.toLocaleString()} pts`}
              />{' '}· {xpToNext} pts to Level {level + 1}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom }}>

        {/* Quick stats row */}
        <Animated.View style={statsAnim}>
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{xpData.xp.toLocaleString()}</Text>
              <Text style={styles.quickStatLabel}>Points</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color }]}>{level}</Text>
              <Text style={styles.quickStatLabel}>Level</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{catQuests.length}</Text>
              <Text style={styles.quickStatLabel}>Active Goals</Text>
            </View>
          </View>
        </Animated.View>

        {/* Philosophy card */}
        {profile && (
          <Animated.View style={philosophyAnim}>
            <View style={[styles.philosophyCard, { backgroundColor: color + '08', borderColor: color + '18' }]}>
              <View style={[styles.philosophyAccent, { backgroundColor: color }]} />
              <Text style={styles.philosophyLabel}>Philosophy</Text>
              <Text style={styles.philosophyText}>{profile.philosophyStatement}</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={contentAnim}>
          {/* Activity heatmap */}
          {disciplines.length > 0 && (
            <GlowCard glowColor={color} style={styles.heatmapCard}>
              <View style={styles.heatmapHeader}>
                <Text style={styles.heatmapLabel}>Activity</Text>
                <Text style={styles.heatmapSub}>Last 12 weeks</Text>
              </View>
              <StreakHeatmap completions={allCompletions} color={color} weeks={12} />
            </GlowCard>
          )}

          {/* Streak leaderboard */}
          {disciplines.length > 0 && (
            <View style={styles.leaderboardSection}>
              <Text style={styles.sectionTitle}>Top Streaks</Text>
              <FlatList<Discipline>
                data={topStreakDisciplines}
                keyExtractor={(item) => item.id}
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.leaderboardList}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.streakItem,
                      { borderColor: color + '30', backgroundColor: color + '10' },
                    ]}
                  >
                    <AscendIcon name="flame" size={22} color="#F97316" />
                    <Text style={styles.streakTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.streakCount, { color }]}>
                      {item.currentStreak}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* Disciplines grouped by frequency */}
          {disciplines.length > 0 && (
            <View style={styles.disciplinesSection}>
              <Text style={styles.sectionTitle}>Disciplines</Text>
              {DISC_FREQ_ORDER.map((freq) => {
                const group = disciplines.filter((d) => d.frequency === freq);
                return (
                  <DisciplineGroup
                    key={freq}
                    frequency={freq}
                    disciplines={group}
                    categoryColor={color}
                    onComplete={completeDiscipline}
                    onDelete={handleDeleteDiscipline}
                  />
                );
              })}
            </View>
          )}

          {/* Goals list section */}
          {catQuests.length > 0 && (
            <>
              <Text style={styles.questsSectionHeader}>Goals in this Area</Text>
              {catQuests.map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </>
          )}

          {/* Empty state — no quests */}
          {catQuests.length === 0 && disciplines.length > 0 && (
            <View style={styles.emptyQuestsCard}>
              <AscendIcon name={iconName} size={40} color={color} />
              <Text style={styles.emptyQuestsText}>No goals in this area yet.</Text>
              <TouchableOpacity
                style={[styles.emptyQuestsBtn, { borderColor: color + '60', backgroundColor: color + '15' }]}
                onPress={() => router.push('/(tabs)/goals' as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.emptyQuestsBtnText, { color }]}>Create a Goal</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty state — no disciplines and no profile (unstarted built-in) */}
          {disciplines.length === 0 && !profile && isBuiltIn && (
            <View style={styles.emptyState}>
              <AscendIcon name={iconName} size={72} color={color} />
              <Text style={styles.emptyTitle}>No disciplines yet</Text>
              <Text style={styles.emptySub}>
                Add your first practice to begin your journey
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { borderColor: color + '60', backgroundColor: color + '15' }]}
                onPress={handleForgeDisciplines}
                activeOpacity={0.8}
              >
                <Text style={[styles.emptyBtnText, { color }]}>Build Practices</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Forge Disciplines CTA — shown only for built-in categories with no disciplines but has profile */}
          {isBuiltIn && disciplines.length === 0 && profile && (
            <TouchableOpacity
              style={styles.forgeDisciplinesBtn}
              onPress={handleForgeDisciplines}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[color + '30', color + '10']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.forgeDisciplinesGradient}
              >
                <AscendIcon name="sparkle" size={28} color={color} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.forgeDisciplinesTitle, { color }]}>
                    Build Your Practices
                  </Text>
                  <Text style={styles.forgeDisciplinesSub}>
                    AI generates Jim Rohn-inspired practices for {label}
                  </Text>
                </View>
                <Text style={[styles.newQuestArrow, { color }]}>›</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Jim Rohn Suggestions CTA */}
          <TouchableOpacity
            style={[styles.suggestBtn, { borderColor: color + '40' }]}
            onPress={() => setSuggestionsOpen(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[color + '25', color + '0A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.suggestBtnGrad}
            >
              <View style={[styles.suggestBtnIconWrap, { backgroundColor: color + '20' }]}>
                <Text style={styles.suggestBtnIcon}>✦</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.suggestBtnTitle, { color }]}>Jim Rohn Suggestions</Text>
                <Text style={styles.suggestBtnSub}>
                  AI picks the best {label.toLowerCase()} practices from his teachings
                </Text>
              </View>
              <AscendIcon name="chevron-right" size={18} color={color} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Quest CTA */}
          <TouchableOpacity
            style={styles.newQuestBtn}
            onPress={() => router.push('/(tabs)/goals' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[color + '30', color + '10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newQuestGradient}
            >
              <AscendIcon name="goals" size={28} color={color} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.newQuestTitle, { color }]}>Create a Goal</Text>
                <Text style={styles.newQuestSub}>Use AI to create a {label} goal</Text>
              </View>
              <Text style={[styles.newQuestArrow, { color }]}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <CategorySuggestionsSheet
        visible={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        categoryId={id}
        categoryLabel={label}
        categoryIconName={iconName}
        categoryColor={color}
        currentLevel={level}
        currentXP={xpData.xp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  screenTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayMedium,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  hero: {
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  emojiWrap: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  emojiGlow: {
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
  emojiCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 26,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  levelText: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.lg,
    letterSpacing: 1,
  },
  xpBarWrap: {
    width: '85%',
    gap: SPACING.xs,
    alignItems: 'center',
  },
  xpBarFull: {
    width: '100%',
  },
  xpBarLabel: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },

  // Quick stats row
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  quickStat: { flex: 1, alignItems: 'center', gap: 3 },
  quickStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)' },
  quickStatValue: {
    fontSize: 22,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  quickStatLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },

  philosophyCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    paddingLeft: SPACING.xl,
    overflow: 'hidden',
  },
  philosophyAccent: {
    position: 'absolute',
    left: 0,
    top: SPACING.md,
    bottom: SPACING.md,
    width: 3,
    borderRadius: 2,
  },
  philosophyLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  philosophyText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Heatmap
  heatmapCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
    overflow: 'hidden',
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  heatmapLabel: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heatmapSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },

  // Streak leaderboard
  leaderboardSection: {
    marginBottom: SPACING.xl,
  },
  leaderboardList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  streakItem: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.xs,
    minWidth: 90,
    maxWidth: 120,
    flex: 1,
  },
  streakTitle: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  streakCount: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xl,
    lineHeight: 28,
  },

  disciplinesSection: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // Quests section header
  questsSectionHeader: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  // Empty quests card
  emptyQuestsCard: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    padding: SPACING.xl,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyQuestsText: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyQuestsBtn: {
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  emptyQuestsBtnText: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 1,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emptySub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  emptyBtnText: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 1,
  },

  suggestNavBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  suggestNavBtnText: {
    fontSize: 11,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.5,
  },
  suggestBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  suggestBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  suggestBtnIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestBtnIcon: {
    fontSize: 20,
    color: '#fff',
  },
  suggestBtnTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.3,
  },
  suggestBtnSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  newQuestBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  newQuestGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  newQuestTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  newQuestSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  newQuestArrow: {
    fontSize: 28,
    fontFamily: FONTS.families.displayLight,
    lineHeight: 30,
  },

  // Forge Disciplines CTA
  forgeDisciplinesBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  forgeDisciplinesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  forgeDisciplinesTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  forgeDisciplinesSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
