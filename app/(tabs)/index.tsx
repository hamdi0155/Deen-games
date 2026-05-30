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
import { TodayCard } from '../../src/components/ui/TodayCard';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { XPToast } from '../../src/components/ui/XPToast';
import { AchievementToast } from '../../src/components/ui/AchievementToast';
import { useQuestStore } from '../../src/store/questStore';
import { CATEGORY_META } from '../../src/constants/categories';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_COLORS, COLORS, DURATION, FONTS, RADIUS, SPACING, SPRING, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { DailyWisdom } from '../../src/components/ui/DailyWisdom';

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

  const headerAnim = useEntranceAnimation(0);
  const wisdomAnim = useEntranceAnimation(100);
  const vitalsAnim = useEntranceAnimation(180);
  const todayCardAnim = useEntranceAnimation(260);
  const categoriesAnim = useEntranceAnimation(340);
  const questsHabitsAnim = useEntranceAnimation(420);

  if (!character) return null;

  const categories = Object.values(character.categories);

  // Compute longest active streak across all habits
  const longestStreak = todaysHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const habitsDone = todaysHabits.filter((h) => h.isCompletedToday).length;
  const disciplinesDone = todaysDisciplines.filter((d) => d.isCompletedToday).length;

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

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        {/* Character header */}
        <Animated.View style={headerAnim}>
          <CharacterHeader
            name={character.name}
            avatarEmoji={character.avatarEmoji}
            overallLevel={character.overallLevel}
            totalXP={character.totalXP}
            lifeRank={character.lifeRank}
          />
        </Animated.View>

        {/* Daily Wisdom */}
        <Animated.View style={wisdomAnim}>
          <DailyWisdom />
        </Animated.View>

        {/* Dashboard Vitals Row */}
        <Animated.View style={vitalsAnim}>
          <View style={styles.vitalsRow}>
            <View style={styles.vitalPill}>
              <Ionicons name="flash-outline" size={12} color={COLORS.accent} style={styles.vitalIconEl} />
              <Text style={styles.vitalValue}>{character.totalXP.toLocaleString()}</Text>
              <Text style={styles.vitalLabel}>XP</Text>
            </View>
            <View style={[styles.vitalPill, styles.vitalPillCenter]}>
              <Ionicons name="flame-outline" size={12} color={COLORS.warning} style={styles.vitalIconEl} />
              <Text style={[styles.vitalValue, { color: COLORS.warning }]}>{longestStreak}d</Text>
              <Text style={styles.vitalLabel}>Streak</Text>
            </View>
            <View style={styles.vitalPill}>
              <Ionicons name="trophy-outline" size={12} color={COLORS.gold} style={styles.vitalIconEl} />
              <Text style={[styles.vitalValue, { color: COLORS.gold }]}>Lv {character.overallLevel}</Text>
              <Text style={styles.vitalLabel}>Level</Text>
            </View>
          </View>
        </Animated.View>

        {/* Today's Mission card */}
        <Animated.View style={todayCardAnim}>
          <TodayCard
            habitsTotal={todaysHabits.length}
            habitsDone={habitsDone}
            disciplinesTotal={todaysDisciplines.length}
            disciplinesDone={disciplinesDone}
            streakDays={longestStreak}
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
              <Text style={styles.missionBannerEmoji}>🏆</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.missionBannerTitle}>Legend Status</Text>
                <Text style={styles.missionBannerSub}>All missions complete. Jim Rohn would be proud.</Text>
              </View>
            </LinearGradient>
          </FadeInView>
        )}

        {/* Life Categories */}
        <Animated.View style={categoriesAnim}>
          <Text style={styles.sectionTitle}>Life Categories</Text>
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
        </Animated.View>

        {/* Active Quests + Today's Habits + Today's Disciplines */}
        <Animated.View style={questsHabitsAnim}>
          {/* Active Quests preview */}
          {recentQuests.length > 0 && (
            <FadeInView delay={100}>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
                  Active Quests
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

          {/* Today's Habits */}
          {todaysHabits.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
                Today's Habits
              </Text>
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

          {/* Today's Disciplines */}
          {todaysDisciplines.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
                  Today's Disciplines
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/disciplines' as any)}
                  activeOpacity={0.7}
                  style={styles.viewAllBtn}
                >
                  <Text style={styles.viewAllText}>View All →</Text>
                </TouchableOpacity>
              </View>
              {todaysDisciplines.map((disc, index) => {
                const customCat = customCategories.find((c) => c.id === disc.categoryId);
                const color = CATEGORY_COLORS[disc.categoryId] ?? customCat?.color ?? COLORS.accent;
                return (
                  <FadeInView key={disc.id} delay={index * 60}>
                    <DisciplineCard
                      discipline={disc}
                      categoryColor={color}
                      onComplete={handleCompleteDiscipline}
                    />
                  </FadeInView>
                );
              })}
            </>
          )}

          {/* Stats quick bar */}
          {(todaysHabits.length + todaysDisciplines.length) > 0 && (
            <View style={styles.statsBar}>
              <View style={styles.statsItem}>
                <Ionicons name="flame" size={11} color={COLORS.warning} />
                <Text style={styles.statsItemText}>{todaysHabits.filter((h) => h.isCompletedToday).length}/{todaysHabits.length} habits</Text>
              </View>
              <View style={styles.statsItem}>
                <Ionicons name="flash" size={11} color={COLORS.accent} />
                <Text style={styles.statsItemText}>{todaysDisciplines.filter((d) => d.isCompletedToday).length}/{todaysDisciplines.length} disciplines</Text>
              </View>
              <View style={styles.statsItem}>
                <Ionicons name="shield-outline" size={11} color={COLORS.textMuted} />
                <Text style={styles.statsItemText}>{recentQuests.length} quests</Text>
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

  // Dashboard Vitals Row
  vitalsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  vitalPill: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.xs,
  },
  vitalPillCenter: {
    borderColor: `${COLORS.warning}20`,
  },
  vitalIconEl: {},
  vitalValue: {
    fontSize: 14,
    fontFamily: FONTS.families.display,
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  vitalLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
  missionBannerEmoji: { fontSize: 28 },
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
