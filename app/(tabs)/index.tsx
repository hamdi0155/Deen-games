import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { HabitCard } from '../../src/components/habits/HabitCard';
import { DisciplineCard } from '../../src/components/disciplines/DisciplineCard';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { XPToast } from '../../src/components/ui/XPToast';
import { AchievementToast } from '../../src/components/ui/AchievementToast';
import { useQuestStore } from '../../src/store/questStore';
import { CATEGORY_META } from '../../src/constants/categories';
import { AscendIcon } from '../../src/components/icons/AscendIcon';
import { CATEGORY_COLORS, COLORS, DURATION, FONTS, RADIUS, SPACING, SPRING, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { SuggestionsSheet } from '../../src/components/ui/SuggestionsSheet';
import { xpProgress } from '../../src/services/xpService';
import { DailyWisdomCard } from '../../src/components/ui/DailyWisdomCard';
import { XPBar } from '../../src/components/ui/XPBar';

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still awake';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getTodayFocus(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Start strong today.';
  if (hour < 17) return 'Stay the course.';
  return 'Finish what you started.';
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);

  // Staggered entrance animations
  const headerAnim    = useEntranceAnimation(0);
  const summaryAnim   = useEntranceAnimation(80);
  const todayAnim     = useEntranceAnimation(160);
  const goalsAnim     = useEntranceAnimation(240);
  const wisdomAnim    = useEntranceAnimation(320);

  if (!character) return null;

  const categories = Object.values(character.categories);
  const habitsDone = todaysHabits.filter((h) => h.isCompletedToday).length;
  const disciplinesDone = todaysDisciplines.filter((d) => d.isCompletedToday).length;
  const totalTasks = todaysHabits.length + todaysDisciplines.length;
  const tasksDone = habitsDone + disciplinesDone;
  const todayProgress = totalTasks > 0 ? tasksDone / totalTasks : 0;
  const longestStreak = todaysHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const isAllDone = totalTasks > 0 && tasksDone === totalTasks;

  const handleCompleteHabit = (habitId: string) => {
    const result = completeHabit(habitId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
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

  const handleCompleteDiscipline = (disciplineId: string) => {
    const result = completeDiscipline(disciplineId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId as keyof typeof CATEGORY_COLORS] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
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
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET + insets.bottom }}
      >
        {/* ── Command Header ──────────────────────────────────── */}
        <Animated.View style={headerAnim}>
          <View style={styles.header}>
            {/* Greeting + Focus */}
            <View style={styles.headerCenter}>
              <Text style={styles.greeting}>
                {getGreeting()}, <Text style={styles.greetingName}>{character.name.split(' ')[0]}</Text>
              </Text>
              <Text style={styles.todayFocus}>{getTodayFocus()}</Text>
            </View>

            {/* Quick actions */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => router.push('/mentor' as any)}
                activeOpacity={0.8}
                style={styles.headerActionBtn}
              >
                <AscendIcon name="sparkle" size={16} color={COLORS.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/focus' as any)}
                activeOpacity={0.8}
                style={[styles.headerActionBtn, styles.focusBtn]}
              >
                <AscendIcon name="focus" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Today's Summary Row ─────────────────────────────── */}
        <Animated.View style={[summaryAnim, styles.summaryRow]}>
          {/* Today's Progress card */}
          <TouchableOpacity
            style={[styles.summaryCard, styles.summaryCardPrimary]}
            activeOpacity={0.85}
            onPress={() => router.push('/focus' as any)}
          >
            <LinearGradient
              colors={isAllDone
                ? ['rgba(14,168,117,0.18)', 'rgba(14,168,117,0.06)']
                : ['rgba(91,108,245,0.16)', 'rgba(91,108,245,0.04)']}
              style={styles.summaryCardGrad}
            >
              {/* Progress ring */}
              <View style={styles.progressRingWrap}>
                <View style={[styles.progressRingOuter, {
                  borderColor: isAllDone ? COLORS.success : COLORS.accent,
                }]}>
                  {isAllDone
                    ? <AscendIcon name="check" size={18} color={COLORS.success} />
                    : <Text style={[styles.progressFraction, { color: COLORS.accent }]}>
                        {tasksDone}/{totalTasks}
                      </Text>
                  }
                </View>
              </View>
              <Text style={styles.summaryCardLabel}>
                {isAllDone ? 'All done!' : 'Today'}
              </Text>
              <Text style={[styles.summaryCardValue, {
                color: isAllDone ? COLORS.success : COLORS.text,
              }]}>
                {isAllDone ? 'Perfect day' : `${Math.round(todayProgress * 100)}%`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Habit streak card */}
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/habits' as any)}
          >
            <LinearGradient
              colors={['rgba(249,115,22,0.14)', 'rgba(249,115,22,0.04)']}
              style={styles.summaryCardGrad}
            >
              <AscendIcon name="flame" size={20} color={COLORS.warning} filled={longestStreak > 0} />
              <Text style={styles.summaryCardLabel}>Streak</Text>
              <Text style={[styles.summaryCardValue, { color: COLORS.warning }]}>
                {longestStreak}d
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Goals card */}
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/quests' as any)}
          >
            <LinearGradient
              colors={['rgba(59,130,246,0.14)', 'rgba(59,130,246,0.04)']}
              style={styles.summaryCardGrad}
            >
              <AscendIcon name="goals" size={20} color="#3B82F6" />
              <Text style={styles.summaryCardLabel}>Goals</Text>
              <Text style={[styles.summaryCardValue, { color: '#3B82F6' }]}>
                {recentQuests.length}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Points card */}
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/stats' as any)}
          >
            <LinearGradient
              colors={['rgba(201,168,76,0.14)', 'rgba(201,168,76,0.04)']}
              style={styles.summaryCardGrad}
            >
              <AscendIcon name="star" size={20} color={COLORS.gold} />
              <Text style={styles.summaryCardLabel}>Points</Text>
              <Text style={[styles.summaryCardValue, { color: COLORS.gold }]}>
                {character.totalXP >= 1000
                  ? `${(character.totalXP / 1000).toFixed(1)}k`
                  : character.totalXP}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Today's Priorities ──────────────────────────────── */}
        <Animated.View style={todayAnim}>
          {totalTasks > 0 ? (() => {
            // Unified sorted list: incomplete first (highest XP first), then completed
            const allTaskItems = [
              ...todaysHabits.map((h) => ({ type: 'habit' as const, id: h.id, xp: h.xpReward, done: h.isCompletedToday, habit: h })),
              ...todaysDisciplines.map((d) => {
                const customCat = customCategories.find((c) => c.id === d.categoryId);
                const color = CATEGORY_COLORS[d.categoryId] ?? customCat?.color ?? COLORS.accent;
                return { type: 'discipline' as const, id: d.id, xp: d.xpReward, done: d.isCompletedToday, discipline: d, color };
              }),
            ].sort((a, b) => {
              if (a.done !== b.done) return a.done ? 1 : -1;
              return b.xp - a.xp;
            });
            const TASK_LIMIT = 4;
            const visibleItems = tasksExpanded ? allTaskItems : allTaskItems.slice(0, TASK_LIMIT);
            const hiddenCount = Math.max(0, allTaskItems.length - TASK_LIMIT);

            return (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Today's Priorities</Text>
                  <View style={styles.progressPill}>
                    <View style={[styles.progressPillFill, {
                      width: `${Math.round(todayProgress * 100)}%` as any,
                      backgroundColor: isAllDone ? COLORS.success : COLORS.accent,
                    }]} />
                    <Text style={styles.progressPillText}>{tasksDone}/{totalTasks}</Text>
                  </View>
                </View>

                <View style={styles.priorityGroup}>
                  {visibleItems.map((item) =>
                    item.type === 'habit' ? (
                      <HabitCard
                        key={item.id}
                        habit={item.habit}
                        onComplete={handleCompleteHabit}
                        onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
                      />
                    ) : (
                      <DisciplineCard
                        key={item.id}
                        discipline={item.discipline}
                        categoryColor={item.color}
                        onComplete={handleCompleteDiscipline}
                      />
                    )
                  )}
                </View>

                {!tasksExpanded && hiddenCount > 0 && (
                  <TouchableOpacity
                    onPress={() => setTasksExpanded(true)}
                    activeOpacity={0.75}
                    style={styles.expandBtn}
                  >
                    <AscendIcon name="chevron-down" size={13} color={COLORS.textMuted} />
                    <Text style={styles.expandBtnText}>{hiddenCount} more task{hiddenCount > 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                )}
                {tasksExpanded && allTaskItems.length > TASK_LIMIT && (
                  <TouchableOpacity
                    onPress={() => setTasksExpanded(false)}
                    activeOpacity={0.75}
                    style={styles.expandBtn}
                  >
                    <AscendIcon name="arrow-up" size={13} color={COLORS.textMuted} />
                    <Text style={styles.expandBtnText}>Show less</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })() : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Priorities</Text>
              <TouchableOpacity
                style={styles.emptyCard}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/habits' as any)}
              >
                <AscendIcon name="habits" size={22} color={COLORS.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.emptyCardTitle}>No tasks today</Text>
                  <Text style={styles.emptyCardSub}>Add habits or disciplines to see them here.</Text>
                </View>
                <AscendIcon name="chevron-right" size={16} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* ── AI Quick Actions ────────────────────────────────── */}
        <View style={styles.aiRow}>
          <TouchableOpacity
            onPress={() => setSuggestionsOpen(true)}
            activeOpacity={0.85}
            style={[styles.aiBtn, styles.aiBtnSuggestions]}
          >
            <LinearGradient
              colors={['rgba(201,168,76,0.18)', 'rgba(201,168,76,0.06)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiBtnGrad}
            >
              <Text style={styles.aiBtnEmoji}>✦</Text>
              <Text style={[styles.aiBtnTitle, { color: COLORS.gold }]}>Suggestions</Text>
              <Text style={styles.aiBtnSub}>AI · Groq</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/mentor' as any)}
            activeOpacity={0.85}
            style={[styles.aiBtn, styles.aiBtnMentor]}
          >
            <LinearGradient
              colors={['rgba(91,108,245,0.18)', 'rgba(124,58,237,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiBtnGrad}
            >
              <Text style={styles.aiBtnEmoji}>🧠</Text>
              <Text style={[styles.aiBtnTitle, { color: COLORS.accent }]}>Life Mentor</Text>
              <Text style={styles.aiBtnSub}>AI · Groq</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── Active Goals ────────────────────────────────────── */}
        <Animated.View style={goalsAnim}>
          {recentQuests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Goals</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/quests' as any)}
                  activeOpacity={0.7}
                  style={styles.seeAllBtn}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                  <AscendIcon name="chevron-right" size={12} color={COLORS.accent} />
                </TouchableOpacity>
              </View>
              {recentQuests.map((q) => (
                <QuestCard key={q.id} quest={q} compact />
              ))}
            </View>
          )}

          {recentQuests.length === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Goals</Text>
              <TouchableOpacity
                style={styles.emptyCard}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/goals' as any)}
              >
                <AscendIcon name="goals" size={22} color="#3B82F6" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.emptyCardTitle}>Set your first goal</Text>
                  <Text style={styles.emptyCardSub}>Let AI break it into actionable steps.</Text>
                </View>
                <AscendIcon name="chevron-right" size={16} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* ── Daily Wisdom ─────────────────────────────────────── */}
        <Animated.View style={wisdomAnim}>
          <DailyWisdomCard />
        </Animated.View>

        {/* ── Domain Progress ──────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Domain Progress</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/stats' as any)}
              activeOpacity={0.7}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>Full view</Text>
              <AscendIcon name="chevron-right" size={12} color={COLORS.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.domainGrid}>
            {categories.slice(0, 6).map((cat) => {
              const { progress } = xpProgress(cat.xp);
              const color = CATEGORY_COLORS[cat.id] ?? COLORS.accent;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.domainCell}
                  onPress={() => router.push(`/category/${cat.id}` as any)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.domainCard, { borderColor: color + '20' }]}>
                    <View style={styles.domainCardTop}>
                      <Text style={styles.domainEmoji}>{cat.emoji}</Text>
                      <View style={[styles.domainLevelPill, { backgroundColor: color + '22' }]}>
                        <Text style={[styles.domainLevelText, { color }]}>Lv {cat.level}</Text>
                      </View>
                    </View>
                    <Text style={styles.domainLabel} numberOfLines={1}>{cat.label}</Text>
                    <XPBar progress={progress} color={color} height={3} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {categories.length > 6 && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/stats' as any)}
              activeOpacity={0.7}
              style={styles.moreDomainsBtn}
            >
              <Text style={styles.moreDomainsText}>+{categories.length - 6} more domains</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Quick Navigation Cards ─────────────────────────── */}
        <View style={[styles.section, { paddingBottom: SPACING.md }]}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessRow}>
            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => router.push('/reflect' as any)}
            >
              <LinearGradient
                colors={['rgba(139,92,246,0.15)', 'transparent']}
                style={styles.quickCardGrad}
              >
                <Text style={styles.quickCardEmoji}>📝</Text>
                <Text style={styles.quickCardTitle}>Reflect</Text>
                <Text style={styles.quickCardSub}>Daily journal</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => router.push('/focus' as any)}
            >
              <LinearGradient
                colors={['rgba(91,108,245,0.15)', 'transparent']}
                style={styles.quickCardGrad}
              >
                <Text style={styles.quickCardEmoji}>⏱</Text>
                <Text style={styles.quickCardTitle}>Focus</Text>
                <Text style={styles.quickCardSub}>Pomodoro timer</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => router.push('/future-self' as any)}
            >
              <LinearGradient
                colors={['rgba(201,168,76,0.15)', 'transparent']}
                style={styles.quickCardGrad}
              >
                <Text style={styles.quickCardEmoji}>🔮</Text>
                <Text style={styles.quickCardTitle}>Future</Text>
                <Text style={styles.quickCardSub}>Visualize</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Floating Feedback ──────────────────────────────────── */}
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
          iconName={pendingAchievement.iconName}
          visible={!!pendingAchievement}
          onDone={clearPendingToast}
        />
      )}

      <LevelUpModal
        visible={levelUp !== null}
        level={levelUp?.level ?? 0}
        categoryName={levelUpMeta?.label ?? 'Unknown'}
        categoryId={levelUp?.categoryId ?? 'discipline'}
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

      <SuggestionsSheet
        visible={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        character={character}
        habits={todaysHabits}
        quests={recentQuests}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  headerCenter: { flex: 1, gap: 1 },
  greeting: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
  },
  greetingName: {
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  todayFocus: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textDim,
    letterSpacing: 0.2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexShrink: 0,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusBtn: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },

  // ── Summary Row ─────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    minHeight: 80,
  },
  summaryCardPrimary: {
    flex: 1.3,
  },
  summaryCardGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    gap: 4,
    minHeight: 80,
  },
  progressRingWrap: { alignItems: 'center', justifyContent: 'center' },
  progressRingOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressFraction: {
    fontSize: 11,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: -0.5,
  },
  summaryCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  summaryCardValue: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: -0.3,
  },

  // ── Section ─────────────────────────────────────────────────
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  progressPill: {
    height: 18,
    width: 64,
    borderRadius: 9,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPillFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 9,
    opacity: 0.5,
  },
  progressPillText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: SPACING.xs,
  },
  seeAllText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodySemibold,
    color: COLORS.accent,
  },

  // ── Priority Group ───────────────────────────────────────────
  priorityGroup: {
    gap: SPACING.xs,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    backgroundColor: COLORS.bgCard,
  },
  expandBtnText: {
    fontSize: 12,
    fontFamily: FONTS.families.bodySemibold,
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },

  // ── Empty Card ──────────────────────────────────────────────
  emptyCard: {
    marginHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    padding: SPACING.md,
    minHeight: 60,
  },
  emptyCardTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  emptyCardSub: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // ── AI Row ───────────────────────────────────────────────────
  aiRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  aiBtn: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  aiBtnSuggestions: {
    borderColor: 'rgba(201,168,76,0.3)',
  },
  aiBtnMentor: {
    borderColor: 'rgba(91,108,245,0.3)',
  },
  aiBtnGrad: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: 2,
    alignItems: 'flex-start',
  },
  aiBtnEmoji: { fontSize: 20, marginBottom: 2 },
  aiBtnTitle: {
    fontSize: 13,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.2,
  },
  aiBtnSub: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },

  // ── Domain Grid ──────────────────────────────────────────────
  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  domainCell: { width: '30.5%' },
  domainCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm,
    gap: 4,
  },
  domainCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  domainEmoji: { fontSize: 20 },
  domainLevelPill: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  domainLevelText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.3,
  },
  domainLabel: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  moreDomainsBtn: {
    alignSelf: 'center',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  moreDomainsText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },

  // ── Quick Access ─────────────────────────────────────────────
  quickAccessRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  quickCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  quickCardGrad: {
    padding: SPACING.md,
    gap: 2,
    alignItems: 'flex-start',
  },
  quickCardEmoji: { fontSize: 22, marginBottom: 4 },
  quickCardTitle: {
    fontSize: 13,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  quickCardSub: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
  },
});
