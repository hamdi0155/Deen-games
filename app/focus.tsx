import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../src/store/habitStore';
import { useDisciplineStore } from '../src/store/disciplineStore';
import { useAchievementStore } from '../src/store/achievementStore';
import { HabitCard } from '../src/components/habits/HabitCard';
import { DisciplineCard } from '../src/components/disciplines/DisciplineCard';
import { PomodoroTimer } from '../src/components/focus/PomodoroTimer';
import { XPToast } from '../src/components/ui/XPToast';
import { FadeInView } from '../src/components/ui/FadeInView';
import { LevelUpModal } from '../src/components/ui/LevelUpModal';
import { StreakMilestoneModal } from '../src/components/ui/StreakMilestoneModal';
import { CATEGORY_COLORS, COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';
import { CATEGORY_META } from '../src/constants/categories';

const RING_SIZE = 160;
const RING_STROKE = 10;

interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const progress = total > 0 ? done / total : 0;
  const allDone = total > 0 && done === total;
  const ringColor = allDone ? COLORS.success : progress > 0.5 ? '#A78BFA' : COLORS.accent;
  const pct = Math.round(progress * 100);

  return (
    <View style={ringStyles.container}>
      {/* Track ring */}
      <View style={[ringStyles.trackRing]} />
      {/* Fill indicator — a simple pie using absolute positioned indicator */}
      <View
        style={[
          ringStyles.fillRing,
          {
            borderColor: ringColor,
            shadowColor: ringColor,
            shadowOpacity: allDone ? 0.8 : 0.4,
            shadowRadius: allDone ? 20 : 12,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />
      {/* Center text */}
      <View style={ringStyles.center}>
        {allDone ? (
          <AscendIcon name="check" size={40} color={COLORS.success} />
        ) : (
          <>
            <Text style={[ringStyles.pct, { color: ringColor }]}>{pct}%</Text>
            <Text style={ringStyles.fraction}>{done}/{total}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  trackRing: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  fillRing: {
    position: 'absolute',
    width: RING_SIZE - 4,
    height: RING_SIZE - 4,
    borderRadius: (RING_SIZE - 4) / 2,
    borderWidth: RING_STROKE,
    borderColor: COLORS.accent,
  },
  center: { alignItems: 'center', gap: 2 },
  pct: {
    fontSize: 32,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.5,
  },
  fraction: {
    fontSize: 13,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
});

// Sparkle dot component for "all done" celebration
function Sparkle({ style }: { style: object }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
        Animated.delay(200),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text style={[{ transform: [{ scale }], opacity }, style]}>✦</Animated.Text>
  );
}

export default function FocusScreen() {
  const router = useRouter();
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const getTodaysDisciplines = useDisciplineStore((s) => s.getTodaysDisciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);

  const todaysHabits = getTodaysHabits();
  const todaysDisciplines = getTodaysDisciplines();

  const [toast, setToast] = useState<{ xp: number; color: string; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<{ days: number; title: string } | null>(null);
  const [streakMilestoneColor] = useState('#F97316');
  const [totalXPEarned, setTotalXPEarned] = useState(0);

  const habitsDone = todaysHabits.filter((h) => h.isCompletedToday).length;
  const disciplinesDone = todaysDisciplines.filter((d) => d.isCompletedToday).length;
  const total = todaysHabits.length + todaysDisciplines.length;
  const done = habitsDone + disciplinesDone;
  const allDone = total > 0 && done === total;

  // Incomplete items only
  const incompleteHabits = todaysHabits.filter((h) => !h.isCompletedToday);
  const incompleteDisciplines = todaysDisciplines.filter((d) => !d.isCompletedToday);
  const completedHabits = todaysHabits.filter((h) => h.isCompletedToday);
  const completedDisciplines = todaysDisciplines.filter((d) => d.isCompletedToday);

  const missionAccomplishedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (allDone) {
      Animated.spring(missionAccomplishedAnim, {
        toValue: 1,
        damping: 12,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
      checkAndUnlock('focus_mode');
    } else {
      missionAccomplishedAnim.setValue(0);
    }
  }, [allDone]);

  const handleCompleteHabit = (habitId: string) => {
    const result = completeHabit(habitId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    setTotalXPEarned((prev) => prev + result.xpGained);
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
  };

  const handleCompleteDiscipline = (disciplineId: string) => {
    const result = completeDiscipline(disciplineId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId as keyof typeof CATEGORY_COLORS] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    setTotalXPEarned((prev) => prev + result.xpGained);
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
  };

  const levelUpMeta = levelUp
    ? CATEGORY_META.find((m) => m.id === levelUp.categoryId)
    : null;

  return (
    <LinearGradient colors={['#07041A', '#050508']} style={styles.root}>
      <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]}>
        {/* Header */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <AscendIcon name="chevron-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Focus Mode</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Pomodoro Timer */}
          <FadeInView delay={0}>
            <PomodoroTimer
              onSessionComplete={(xp, label) => {
                setTotalXPEarned((prev) => prev + xp);
                setToast({ xp, color: COLORS.accent, key: Date.now() });
              }}
            />
          </FadeInView>

          {/* Progress Ring */}
          <FadeInView delay={0}>
            <View style={styles.ringSection}>
              <ProgressRing done={done} total={total} />
              <Text style={styles.ringLabel}>
                {total === 0
                  ? 'No tasks today'
                  : allDone
                  ? 'All missions complete!'
                  : `${total - done} remaining`}
              </Text>
            </View>
          </FadeInView>

          {/* Mission Accomplished Banner */}
          {allDone && (
            <Animated.View
              style={[styles.missionBanner, { transform: [{ scale: missionAccomplishedAnim }], opacity: missionAccomplishedAnim }]}
            >
              <LinearGradient
                colors={['rgba(14,168,117,0.18)', 'rgba(14,168,117,0.06)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <AscendIcon name="discipline" size={32} color={COLORS.success} />
              <Text style={styles.missionTitle}>Mission Complete</Text>
              <Text style={styles.missionSub}>+{totalXPEarned} XP earned today</Text>
            </Animated.View>
          )}

          {/* No tasks state */}
          {total === 0 && (
            <FadeInView delay={100}>
              <View style={styles.emptyState}>
                <AscendIcon name="moon" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>Nothing scheduled today</Text>
                <Text style={styles.emptyDesc}>
                  Add habits or disciplines from the main screen to see them here.
                </Text>
              </View>
            </FadeInView>
          )}

          {/* Incomplete Habits */}
          {incompleteHabits.length > 0 && (
            <FadeInView delay={80}>
              <Text style={styles.sectionLabel}>Habits</Text>
              {incompleteHabits.map((h) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  onComplete={handleCompleteHabit}
                  onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
                />
              ))}
            </FadeInView>
          )}

          {/* Incomplete Disciplines */}
          {incompleteDisciplines.length > 0 && (
            <FadeInView delay={120}>
              <Text style={styles.sectionLabel}>Practices</Text>
              {incompleteDisciplines.map((disc, index) => {
                const customCat = customCategories.find((c) => c.id === disc.categoryId);
                const color = CATEGORY_COLORS[disc.categoryId] ?? customCat?.color ?? COLORS.accent;
                return (
                  <FadeInView key={disc.id} delay={index * 50}>
                    <DisciplineCard
                      discipline={disc}
                      categoryColor={color}
                      onComplete={handleCompleteDiscipline}
                    />
                  </FadeInView>
                );
              })}
            </FadeInView>
          )}

          {/* Completed items (collapsed section) */}
          {done > 0 && (
            <FadeInView delay={160}>
              <Text style={[styles.sectionLabel, styles.sectionLabelDone]}>
                Completed ({done})
              </Text>

              {completedHabits.map((h) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  onComplete={handleCompleteHabit}
                  onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
                />
              ))}

              {completedDisciplines.map((disc) => {
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
            </FadeInView>
          )}

          {/* Bottom Stats */}
          {total > 0 && (
            <FadeInView delay={200}>
              <View style={styles.statsCard}>
                <LinearGradient
                  colors={['rgba(99,102,241,0.08)', 'rgba(99,102,241,0.02)']}
                  style={styles.statsGradient}
                >
                  <Text style={styles.statsTitle}>Session Stats</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{habitsDone}</Text>
                      <View style={styles.statLabelRow}>
                        <AscendIcon name="flame" size={12} color={COLORS.textMuted} />
                        <Text style={styles.statLabel}> Habits</Text>
                      </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{disciplinesDone}</Text>
                      <View style={styles.statLabelRow}>
                        <AscendIcon name="flash" size={12} color={COLORS.textMuted} />
                        <Text style={styles.statLabel}> Disciplines</Text>
                      </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: COLORS.accent }]}>
                        +{totalXPEarned}
                      </Text>
                      <View style={styles.statLabelRow}>
                        <AscendIcon name="sparkle" size={12} color={COLORS.textMuted} />
                        <Text style={styles.statLabel}> Points Earned</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </FadeInView>
          )}
        </ScrollView>

        {/* XP Toast */}
        {toast !== null && (
          <XPToast
            key={toast.key}
            xp={toast.xp}
            color={toast.color}
            onDone={() => setToast(null)}
          />
        )}

        <LevelUpModal
          visible={levelUp !== null}
          level={levelUp?.level ?? 0}
          categoryName={levelUpMeta?.label ?? 'Unknown'}
          categoryId={levelUp?.categoryId ?? ''}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
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
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  ringSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  },
  ringLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  missionBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(14,168,117,0.3)',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.success,
    letterSpacing: 1,
    textAlign: 'center',
  },
  missionSub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  sectionLabelDone: {
    color: COLORS.success + '99',
  },
  statsCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.15)',
  },
  statsGradient: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  statsTitle: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    letterSpacing: 1,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
});
