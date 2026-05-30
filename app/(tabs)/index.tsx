import React, { useState, useEffect } from 'react';
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
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useHabitStore } from '../../src/store/habitStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { useAchievementStore } from '../../src/store/achievementStore';
import { CharacterHeader } from '../../src/components/character/CharacterHeader';
import { CategoryGrid } from '../../src/components/character/CategoryGrid';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { DisciplineCard } from '../../src/components/disciplines/DisciplineCard';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { XPToast } from '../../src/components/ui/XPToast';
import { AchievementToast } from '../../src/components/ui/AchievementToast';
import { MissionCard } from '../../src/components/ui/MissionCard';
import { StatRingRow } from '../../src/components/ui/StatRingRow';
import { LifeMap } from '../../src/components/ui/LifeMap';
import { MomentumCard } from '../../src/components/ui/MomentumCard';
import { FocusCard } from '../../src/components/ui/FocusCard';
import { DailyReflectionCard } from '../../src/components/ui/DailyReflectionCard';
import { useQuestStore } from '../../src/store/questStore';
import { CATEGORY_META } from '../../src/constants/categories';
import { AscendIcon } from '../../src/components/icons/AscendIcon';
import { CATEGORY_COLORS, COLORS, DURATION, FONTS, RADIUS, SPACING, SPRING, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { LifeRankBar } from '../../src/components/ui/LifeRankBar';

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: DURATION.standard }));
    translateY.value = withDelay(delay, withSpring(0, SPRING.gentle));
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

/** Derive mission title from current hour */
function getMissionTitle(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Master Your Day';
  if (hour < 17) return 'Stay the Course';
  return 'Finish Strong';
}

/** Pick primary category id based on highest activity proxy (level) */
function getPrimaryCategory(
  categories: Array<{ id: string; level: number }>
): string {
  if (!categories.length) return 'discipline';
  const sorted = [...categories].sort((a, b) => b.level - a.level);
  return sorted[0].id;
}

export default function HomeScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);

  const getTodaysDisciplines = useDisciplineStore((s) => s.getTodaysDisciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);

  const pendingAchievement = useAchievementStore((s) => s.pendingToast);
  const clearPendingToast = useAchievementStore((s) => s.clearPendingToast);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);

  const todaysHabits = getTodaysHabits();
  const todaysDisciplines = getTodaysDisciplines();
  const recentQuests = getActiveQuests().slice(0, 3);

  const [toast, setToast] = useState<{ xp: number; color: string; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<{ days: number; title: string } | null>(null);
  const [streakMilestoneColor] = useState('#F97316');

  // Staggered entrance animations
  const headerAnim        = useEntranceAnimation(0);
  const ringsAnim         = useEntranceAnimation(80);
  const todayCardAnim     = useEntranceAnimation(160);
  const prioritiesMapAnim = useEntranceAnimation(240);
  const focusReflectAnim  = useEntranceAnimation(320);
  const questsHabitsAnim  = useEntranceAnimation(400);

  if (!character) return null;

  const categories = Object.values(character.categories);

  // Compute longest active streak across all habits
  const longestStreak = todaysHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const habitsDone = todaysHabits.filter((h) => h.isCompletedToday).length;
  const disciplinesDone = todaysDisciplines.filter((d) => d.isCompletedToday).length;

  const primaryCategoryId = getPrimaryCategory(categories);
  const missionTitle = getMissionTitle();

  const handleCompleteHabit = (habitId: string) => {
    const result = completeHabit(habitId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        const meta = CATEGORY_META.find((m) => m.id === result.categoryId);
        setLevelUp({
          level: result.newLevel,
          categoryId: result.categoryId,
          rankUp: result.rankUp,
          newRank: result.newRank,
          color: catColor,
        });
      }, 900);
    }
    // Check perfect day after state updates settle
    setTimeout(() => {
      const latestHabits = useHabitStore.getState().getTodaysHabits();
      const latestDiscs = useDisciplineStore.getState().getTodaysDisciplines();
      const allHabitsDone = latestHabits.every((h) => h.isCompletedToday);
      const allDiscsDone = latestDiscs.every((d) => d.isCompletedToday);
      if (latestHabits.length + latestDiscs.length > 0 && allHabitsDone && allDiscsDone) {
        checkAndUnlock('perfect_day');
      }
    }, 100);
  };

  const handleCompleteDiscipline = (disciplineId: string) => {
    const result = completeDiscipline(disciplineId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId as keyof typeof CATEGORY_COLORS] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        const meta = CATEGORY_META.find((m) => m.id === result.categoryId);
        setLevelUp({
          level: result.newLevel,
          categoryId: result.categoryId,
          rankUp: result.rankUp,
          newRank: result.newRank,
          color: catColor,
        });
      }, 900);
    }
    setTimeout(() => {
      const latestHabits = useHabitStore.getState().getTodaysHabits();
      const latestDiscs = useDisciplineStore.getState().getTodaysDisciplines();
      const allHabitsDone = latestHabits.every((h) => h.isCompletedToday);
      const allDiscsDone = latestDiscs.every((d) => d.isCompletedToday);
      if (latestHabits.length + latestDiscs.length > 0 && allHabitsDone && allDiscsDone) {
        checkAndUnlock('perfect_day');
      }
    }, 100);
  };

  const levelUpMeta = levelUp
    ? CATEGORY_META.find((m) => m.id === levelUp.categoryId)
    : null;

  const focusMinutes = habitsDone * 15 + disciplinesDone * 20;

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        {/* [Section 1] Top nav bar + Character Header with inline MomentumCard */}
        <Animated.View style={headerAnim}>
          {/* Top nav bar */}
          <View style={styles.topNav}>
            <View style={styles.topNavIcon}>
              <AscendIcon name="shield" size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.topNavBrand}>ASCEND</Text>
            <TouchableOpacity style={styles.topNavBell}>
              <AscendIcon name="bell" size={18} color={COLORS.textSecondary} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          <CharacterHeader
            name={character.name}
            avatarId={character.avatarEmoji}
            overallLevel={character.overallLevel}
            totalXP={character.totalXP}
            lifeRank={character.lifeRank}
            rightSlot={
              <MomentumCard
                score={Math.min(Math.round(character.totalXP / 10), 9999)}
                weeklyXP={Math.round(character.totalXP * 0.15)}
                streak={longestStreak}
                trend={longestStreak > 0 ? 'up' : 'flat'}
              />
            }
          />
        </Animated.View>

        {/* Life Rank XP bar */}
        <LifeRankBar
          lifeRank={character.lifeRank}
          totalXP={character.totalXP}
          overallLevel={character.overallLevel}
        />

        {/* [Section 2] StatRingRow — 4 category rings */}
        <Animated.View style={ringsAnim}>
          <StatRingRow categories={categories} />
        </Animated.View>

        {/* [Section 3] MissionCard — cinematic hero card */}
        <Animated.View style={todayCardAnim}>
          <MissionCard
            habitsTotal={todaysHabits.length}
            habitsDone={habitsDone}
            disciplinesTotal={todaysDisciplines.length}
            disciplinesDone={disciplinesDone}
            streakDays={longestStreak}
            primaryCategoryId={primaryCategoryId}
            missionTitle={missionTitle}
            onPress={() => router.push('/focus' as any)}
          />
        </Animated.View>

        {/* Legend Status Banner — shown when all today's tasks are done */}
        {(todaysHabits.length + todaysDisciplines.length) > 0 &&
          habitsDone + disciplinesDone === todaysHabits.length + todaysDisciplines.length && (
          <FadeInView delay={0}>
            <LinearGradient
              colors={['rgba(16,185,129,0.18)', 'rgba(16,185,129,0.06)', 'transparent']}
              style={styles.missionBanner}
            >
              <View style={styles.missionBannerIcon}>
                <AscendIcon name="trophy" size={22} color={COLORS.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.missionBannerTitle}>Your Status</Text>
                <Text style={styles.missionBannerSub}>All missions complete. Jim Rohn would be proud.</Text>
              </View>
            </LinearGradient>
          </FadeInView>
        )}

        {/* [Section 4] Two-column: Today's Priorities + LifeMap */}
        <Animated.View style={[prioritiesMapAnim, styles.twoColRow]}>
          {/* Left column: Today's Priorities */}
          <View style={styles.twoColLeft}>
            <Text style={styles.sectionTitle}>TODAY'S PRIORITIES</Text>

            {todaysHabits.length > 0 && (
              <>
                <Text style={styles.colSubTitle}>Habits</Text>
                {todaysHabits.map((h) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    onComplete={handleCompleteHabit}
                    onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
                  />
                ))}
              </>
            )}

            {todaysDisciplines.length > 0 && (
              <>
                <Text style={[styles.colSubTitle, { marginTop: SPACING.sm }]}>Disciplines</Text>
                {todaysDisciplines.map((disc) => {
                  const customCat = customCategories.find((c) => c.id === disc.categoryId);
                  const color = CATEGORY_COLORS[disc.categoryId] ?? customCat?.color ?? COLORS.accent;
                  return (
                    <DisciplineCard
                      key={disc.id}
                      discipline={disc}
                      categoryColor={color}
                      onComplete={handleCompleteDiscipline}
                    />
                  );
                })}
              </>
            )}

            {todaysHabits.length === 0 && todaysDisciplines.length === 0 && (
              <View style={styles.emptyPriorities}>
                <Text style={styles.emptyPrioritiesText}>No tasks scheduled today.</Text>
              </View>
            )}
          </View>

          {/* Right column: LifeMap */}
          <View style={styles.twoColRight}>
            <LifeMap
              categories={Object.values(character.categories).map((cat) => ({
                id: cat.id,
                label: cat.label,
                level: cat.level,
                xp: cat.xp,
                color: CATEGORY_COLORS[cat.id] ?? COLORS.accent,
              }))}
              size={160}
              onNodePress={(id) => {
                if (!id) {
                  router.push('/(tabs)/stats' as any);
                } else {
                  router.push(`/category/${id}` as any);
                }
              }}
            />
          </View>
        </Animated.View>

        {/* [Section 5] Two-column: FocusCard + DailyReflectionCard */}
        <Animated.View style={[focusReflectAnim, styles.twoColRow]}>
          {/* Left column: FocusCard */}
          <View style={styles.twoColLeft}>
            <FocusCard
              todayFocusMinutes={focusMinutes}
              streak={longestStreak}
              onPress={() => router.push('/focus' as any)}
            />
          </View>

          {/* Right column: DailyReflectionCard */}
          <View style={styles.twoColRight}>
            <DailyReflectionCard onPress={() => router.push('/reflect' as any)} />
          </View>
        </Animated.View>

        {/* [Section 6] Active Quests + Full Habit/Discipline list */}
        <Animated.View style={questsHabitsAnim}>
          {/* Active Quests preview */}
          {recentQuests.length > 0 && (
            <FadeInView delay={100}>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
                  Active Goals
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/quests' as any)}
                  activeOpacity={0.7}
                  style={styles.viewAllBtn}
                >
                  <Text style={[styles.viewAllText, { color: COLORS.accent }]}>View All →</Text>
                </TouchableOpacity>
              </View>
              {recentQuests.map((q) => (
                <QuestCard key={q.id} quest={q} compact />
              ))}
            </FadeInView>
          )}

          {/* Life Categories */}
          <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Life Categories</Text>
          <CategoryGrid categories={categories} />

          {/* Custom Categories */}
          {customCategories.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>
                Custom Domains
              </Text>
              <View style={styles.customCatRow}>
                {customCategories.map((cat) => {
                  const xpEntry = customCategoryXP[cat.id] ?? { xp: 0, level: 0 };
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.customCatCell}
                      onPress={() => router.push(`/category/${cat.id}` as any)}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          styles.customCatCard,
                          {
                            shadowColor: cat.color,
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                            shadowOffset: { width: 0, height: 4 },
                            elevation: 8,
                            borderColor: `${cat.color}28`,
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={[cat.color, cat.color + '00']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.customCatAccent}
                        />
                        <View style={styles.customCatInner}>
                          <Text style={styles.customCatEmoji}>{cat.emoji}</Text>
                          <Text style={styles.customCatLabel} numberOfLines={1}>
                            {cat.label}
                          </Text>
                          <Text style={[styles.customCatLevel, { color: cat.color }]}>
                            Lv {xpEntry.level}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Stats quick bar */}
          {(todaysHabits.length + todaysDisciplines.length) > 0 && (
            <View style={styles.statsBar}>
              <View style={styles.statsItem}>
                <AscendIcon name="flame" size={11} color={COLORS.warning} filled={true} />
                <Text style={styles.statsItemText}>{todaysHabits.filter((h) => h.isCompletedToday).length}/{todaysHabits.length} habits</Text>
              </View>
              <View style={styles.statsItem}>
                <AscendIcon name="flash" size={11} color={COLORS.accent} />
                <Text style={styles.statsItemText}>{todaysDisciplines.filter((d) => d.isCompletedToday).length}/{todaysDisciplines.length} disciplines</Text>
              </View>
              <View style={styles.statsItem}>
                <AscendIcon name="shield" size={11} color={COLORS.textMuted} />
                <Text style={styles.statsItemText}>{recentQuests.length} goals</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {toast !== null && (
        <XPToast
          key={toast.key}
          xp={toast.xp}
          color={toast.color}
          onDone={() => setToast(null)}
        />
      )}

      {pendingAchievement && (
        <AchievementToast
          title={pendingAchievement.title}
          emoji={pendingAchievement.emoji}
          visible={!!pendingAchievement}
          onDone={clearPendingToast}
        />
      )}

      <LevelUpModal
        visible={levelUp !== null}
        level={levelUp?.level ?? 0}
        categoryName={levelUpMeta?.label ?? 'Unknown'}
        categoryEmoji={levelUpMeta?.emoji ?? '⭐'}
        color={levelUp?.color ?? COLORS.accent}
        rankUp={levelUp?.rankUp}
        newRank={levelUp?.newRank}
        onDismiss={() => setLevelUp(null)}
      />

      <StreakMilestoneModal
        visible={streakMilestone !== null}
        streakDays={streakMilestone?.days ?? 0}
        habitTitle={streakMilestone?.title ?? ''}
        color={streakMilestoneColor}
        onDismiss={() => setStreakMilestone(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Top nav bar
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.sm,
  },
  topNavIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavBrand: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 13,
    color: COLORS.text,
    letterSpacing: 6,
  },
  topNavBell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    borderWidth: 1,
    borderColor: COLORS.bg,
  },

  // Two-column grid rows
  twoColRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  twoColLeft: { flex: 55 },
  twoColRight: { flex: 45 },

  // Empty priorities placeholder
  emptyPriorities: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  emptyPrioritiesText: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },

  // Column sub-title (Habits / Disciplines in priorities column)
  colSubTitle: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },

  missionBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  missionBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,185,129,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.35)',
  },
  missionBannerTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  missionBannerSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingHorizontal: SPACING.lg,
    marginBottom: 8,
  },
  customCatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  customCatCell: { width: '47%' },
  customCatCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  customCatAccent: { height: 3, width: '100%' },
  customCatInner: { padding: SPACING.sm, gap: 4 },
  customCatEmoji: { fontSize: 26 },
  customCatLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  customCatLevel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  viewAllBtn: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
  },
  viewAllText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodySemibold,
    color: '#F97316',
    letterSpacing: 0.3,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsItemText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.body,
  },
});
