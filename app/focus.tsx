import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../src/store/habitStore';
import { useDisciplineStore } from '../src/store/disciplineStore';
import { HabitCard } from '../src/components/habits/HabitCard';
import { DisciplineCard } from '../src/components/disciplines/DisciplineCard';
import { XPToast } from '../src/components/ui/XPToast';
import { FadeInView } from '../src/components/ui/FadeInView';
import { LevelUpModal } from '../src/components/ui/LevelUpModal';
import { StreakMilestoneModal } from '../src/components/ui/StreakMilestoneModal';
import { CATEGORY_COLORS, COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';
import { CATEGORY_META } from '../src/constants/categories';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = 160;
const RING_STROKE = 10;

interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

// A simple SVG-free progress ring drawn with a rotated arc via border tricks
function ProgressRing({ done, total }: { done: number; total: number }) {
  const progress = total > 0 ? done / total : 0;
  const allDone = total > 0 && done === total;
  const ringColor = allDone ? COLORS.success : progress > 0.5 ? '#A78BFA' : COLORS.accent;

  // Animate ring rotation
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // We'll render a circular border with a clip approach:
  // Use two half-circle overlays to create the arc
  const degrees = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={ringStyles.container}>
      {/* Background ring */}
      <View style={[ringStyles.ringBg, { borderColor: 'rgba(255,255,255,0.06)' }]} />

      {/* Foreground ring - simulated with a colored border and clip */}
      {/* We layer two semicircle masks to create arc effect */}
      <View style={ringStyles.ringMaskWrapper}>
        {/* Left half */}
        <View style={[ringStyles.halfCircle, ringStyles.leftHalf, { borderColor: ringColor }]}>
          <Animated.View
            style={[
              ringStyles.halfCircleInner,
              {
                transform: [
                  { rotate: progress > 0.5 ? '0deg' : degrees },
                ],
                borderColor: progress > 0.5 ? ringColor : 'transparent',
              },
            ]}
          />
        </View>
        {/* Right half */}
        <View style={[ringStyles.halfCircle, ringStyles.rightHalf]}>
          <Animated.View
            style={[
              ringStyles.halfCircleInner,
              {
                transform: [{ rotate: progress > 0.5 ? degrees : '-180deg' }],
                borderColor: progress > 0 ? ringColor : 'transparent',
              },
            ]}
          />
        </View>
      </View>

      {/* Center text */}
      <View style={ringStyles.centerText}>
        {allDone ? (
          <>
            <Text style={[ringStyles.checkmark, { color: COLORS.success }]}>✓</Text>
            <Text style={[ringStyles.doneLabel, { color: COLORS.success }]}>DONE</Text>
          </>
        ) : (
          <>
            <Text style={[ringStyles.countText, { color: ringColor }]}>{done}</Text>
            <View style={ringStyles.divider} />
            <Text style={ringStyles.totalText}>{total}</Text>
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
    position: 'relative',
  },
  ringBg: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
  },
  ringMaskWrapper: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
  },
  halfCircle: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE / 2,
    overflow: 'hidden',
  },
  leftHalf: {
    top: 0,
    borderTopLeftRadius: RING_SIZE / 2,
    borderTopRightRadius: RING_SIZE / 2,
  },
  rightHalf: {
    bottom: 0,
  },
  halfCircleInner: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    position: 'absolute',
    top: 0,
  },
  centerText: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  countText: {
    fontSize: FONTS.sizes.xxxl,
    fontFamily: FONTS.families.displayBold,
    lineHeight: 44,
  },
  divider: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  totalText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  checkmark: {
    fontSize: FONTS.sizes.xxxl,
    fontFamily: FONTS.families.displayBold,
    lineHeight: 44,
  },
  doneLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.display,
    letterSpacing: 2,
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

  const missionScale = missionAccomplishedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <LinearGradient colors={['#07041A', '#050508']} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>⚔️ Focus Mode</Text>
            <Text style={styles.headerSubtitle}>Complete your daily missions</Text>
          </View>

          {/* Spacer to balance the back button */}
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
              style={[
                styles.missionBanner,
                { transform: [{ scale: missionScale }], opacity: missionAccomplishedAnim },
              ]}
            >
              <LinearGradient
                colors={['rgba(16,185,129,0.18)', 'rgba(16,185,129,0.06)']}
                style={styles.missionBannerGradient}
              >
                <View style={styles.missionBannerTop}>
                  <Sparkle style={[styles.sparkle, { top: -4, left: 16, fontSize: 18, color: '#F59E0B' }]} />
                  <Text style={styles.missionBannerEmoji}>✅</Text>
                  <Sparkle style={[styles.sparkle, { top: -4, right: 16, fontSize: 14, color: '#A78BFA' }]} />
                </View>
                <Text style={styles.missionTitle}>MISSION ACCOMPLISHED</Text>
                <Text style={styles.missionSub}>
                  Jim Rohn would be proud. You showed up today.
                </Text>
                <View style={styles.missionSparkleRow}>
                  <Sparkle style={[styles.sparkleInline, { color: '#F59E0B', fontSize: 16 }]} />
                  <Sparkle style={[styles.sparkleInline, { color: COLORS.accent, fontSize: 12 }]} />
                  <Sparkle style={[styles.sparkleInline, { color: COLORS.success, fontSize: 20 }]} />
                  <Sparkle style={[styles.sparkleInline, { color: '#EC4899', fontSize: 14 }]} />
                  <Sparkle style={[styles.sparkleInline, { color: '#F59E0B', fontSize: 10 }]} />
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* No tasks state */}
          {total === 0 && (
            <FadeInView delay={100}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌙</Text>
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
              <Text style={styles.sectionLabel}>HABITS</Text>
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
              <Text style={styles.sectionLabel}>DISCIPLINES</Text>
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
                COMPLETED ({done})
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
                  <Text style={styles.statsTitle}>SESSION STATS</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{habitsDone}</Text>
                      <Text style={styles.statLabel}>🔥 Habits</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{disciplinesDone}</Text>
                      <Text style={styles.statLabel}>⚡ Disciplines</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: COLORS.accent }]}>
                        +{totalXPEarned}
                      </Text>
                      <Text style={styles.statLabel}>✨ XP Earned</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: COLORS.text,
    lineHeight: 32,
    fontFamily: FONTS.families.body,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 36,
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
    borderColor: 'rgba(16,185,129,0.3)',
  },
  missionBannerGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  missionBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    position: 'relative',
  },
  missionBannerEmoji: {
    fontSize: 48,
  },
  sparkle: {
    position: 'absolute',
    fontFamily: FONTS.families.body,
  },
  sparkleInline: {
    fontFamily: FONTS.families.body,
  },
  missionSparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  missionTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.success,
    letterSpacing: 2,
    textAlign: 'center',
  },
  missionSub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  emptyEmoji: {
    fontSize: 48,
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
    textTransform: 'uppercase',
    letterSpacing: 3,
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
    letterSpacing: 3,
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
