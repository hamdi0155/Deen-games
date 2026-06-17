/**
 * Today — the home screen. One active quest, one tap, one burst.
 * 90% of usage lives here. Everything else is dimmed so attention
 * has nowhere else to go. (ADHD spec §6.1)
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useHabitStore } from '../../src/store/habitStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { useQuestStore } from '../../src/store/questStore';
import { useAchievementStore } from '../../src/store/achievementStore';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { XPToast } from '../../src/components/ui/XPToast';
import { AchievementToast } from '../../src/components/ui/AchievementToast';
import { RewardBurst } from '../../src/components/ui/RewardBurst';
import { AscendIcon } from '../../src/components/icons/AscendIcon';
import {
  COLORS, FONTS, RADIUS, SPACING, SPRING, DURATION,
  CATEGORY_COLORS, TAB_BAR_OFFSET,
} from '../../src/constants/theme';
import { haptic } from '../../src/services/haptics';
import { CATEGORY_META } from '../../src/constants/categories';
import { Quest, Task, Habit, Discipline } from '../../src/types';

// ─── Types ───────────────────────────────────────────────────────────────────

type QueueItemType = 'habit' | 'discipline' | 'quest_task';

interface QueueItem {
  id: string;
  title: string;
  xpReward: number;
  type: QueueItemType;
  categoryId: string;
  // source references for completion
  habitRef?: Habit;
  disciplineRef?: Discipline;
  questId?: string;
  taskId?: string;
  // quest context
  questTitle?: string;
  estimatedMinutes?: number;
  questTasks?: Task[];
}

interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function xpForLevel(l: number) { return l * l * 500; }

function buildQueue(
  todaysHabits: Habit[],
  todaysDisciplines: Discipline[],
  activeQuests: Quest[],
): QueueItem[] {
  const items: QueueItem[] = [];

  // First, add incomplete quest tasks (first incomplete task per quest)
  for (const quest of activeQuests) {
    const firstTask = quest.tasks.find((t) => !t.completed);
    if (firstTask) {
      items.push({
        id: `quest-${quest.id}`,
        title: quest.title,
        xpReward: quest.tasks.filter((t) => !t.completed).reduce((s, t) => s + t.xpReward, 0),
        type: 'quest_task',
        categoryId: quest.categoryId,
        questId: quest.id,
        taskId: firstTask.id,
        questTitle: quest.title,
        questTasks: quest.tasks,
      });
    }
  }

  // Then habits not yet done
  for (const h of todaysHabits) {
    if (!h.isCompletedToday) {
      items.push({
        id: h.id,
        title: h.title,
        xpReward: h.xpReward,
        type: 'habit',
        categoryId: h.categoryId,
        habitRef: h,
      });
    }
  }

  // Then disciplines not yet done
  for (const d of todaysDisciplines) {
    if (!d.isCompletedToday) {
      items.push({
        id: d.id,
        title: d.title,
        xpReward: d.xpReward,
        type: 'discipline',
        categoryId: d.categoryId,
        disciplineRef: d,
        estimatedMinutes: d.estimatedMinutes,
      });
    }
  }

  return items;
}

// ─── Time shrink bar ─────────────────────────────────────────────────────────

function TimeShrinkBar({ minutes }: { minutes: number }) {
  const label = minutes >= 60
    ? `${Math.round(minutes / 60)}h`
    : `${minutes} min`;

  // bar starts full and shrinks over the session — static decoration for now
  return (
    <View style={styles.timerRow}>
      <View style={styles.timerBarTrack}>
        <LinearGradient
          colors={[COLORS.accent, COLORS.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.timerBarFill, { width: '70%' }]}
        />
      </View>
      <Text style={styles.timerLabel}>{label}</Text>
    </View>
  );
}

// ─── Active quest card ───────────────────────────────────────────────────────

interface ActiveCardProps {
  item: QueueItem;
  brokenDown: boolean;
  onBreakDown: () => void;
  onComplete: () => void;
  onCompleteSubTask: (taskId: string) => void;
  burstPos: { x: number; y: number } | null;
  setBurstPos: (pos: { x: number; y: number }) => void;
}

function ActiveQuestCard({
  item, brokenDown, onBreakDown, onComplete,
  onCompleteSubTask, burstPos, setBurstPos,
}: ActiveCardProps) {
  const cardRef = useRef<View>(null);
  const lift = useSharedValue(0);
  const cardOpacity = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
    opacity: cardOpacity.value,
  }));

  const accentColor = CATEGORY_COLORS[item.categoryId] ?? COLORS.accent;
  const completedTasks = item.questTasks?.filter((t) => t.completed).length ?? 0;
  const totalTasks = item.questTasks?.length ?? 0;

  const handleComplete = useCallback(() => {
    haptic.medium();
    // 0–150ms: card lifts
    lift.value = withTiming(-8, { duration: 150, easing: Easing.out(Easing.quad) });
    // 150ms: measure position for burst, then trigger completion
    cardRef.current?.measure((_x, _y, _w, _h, px, py) => {
      setBurstPos({ x: px + _w / 2, y: py + _h / 2 });
    });
    setTimeout(() => {
      cardOpacity.value = withTiming(0.4, { duration: 100 });
    }, 100);
    setTimeout(() => {
      onComplete();
    }, 160);
  }, [onComplete]);

  return (
    <Animated.View ref={cardRef} style={[styles.activeCard, cardStyle]}>
      <LinearGradient
        colors={['rgba(139,124,246,0.12)', 'rgba(139,124,246,0.04)']}
        style={styles.activeCardGrad}
      >
        {/* Time bar */}
        {(item.estimatedMinutes || item.type === 'quest_task') && (
          <TimeShrinkBar minutes={item.estimatedMinutes ?? 20} />
        )}

        {/* Quest title */}
        <Text style={styles.activeQuestTitle} numberOfLines={3}>
          {item.title}
        </Text>

        {/* Quest task progress if broken down */}
        {brokenDown && item.questTasks && (
          <View style={styles.microSteps}>
            {item.questTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.microStep}
                activeOpacity={0.7}
                onPress={() => !task.completed && onCompleteSubTask(task.id)}
              >
                <View style={[
                  styles.microCheck,
                  task.completed && styles.microCheckDone,
                  { borderColor: task.completed ? COLORS.success : accentColor + '60' },
                ]}>
                  {task.completed && (
                    <AscendIcon name="check" size={10} color={COLORS.success} />
                  )}
                </View>
                <Text style={[
                  styles.microStepText,
                  task.completed && styles.microStepTextDone,
                ]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom row: break-down + complete */}
        <View style={styles.activeCardActions}>
          {item.type === 'quest_task' && !brokenDown && (
            <TouchableOpacity
              style={styles.breakDownBtn}
              activeOpacity={0.75}
              onPress={onBreakDown}
            >
              <AscendIcon name="circle" size={13} color={COLORS.accent} />
              <Text style={styles.breakDownText}>break this down</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.completeBtn, { flex: item.type === 'quest_task' && !brokenDown ? 0 : 1 }]}
            activeOpacity={0.85}
            onPress={handleComplete}
          >
            <LinearGradient
              colors={[COLORS.accent, '#6B5CE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeBtnGrad}
            >
              <Text style={styles.completeBtnText}>Complete</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Queue item row ───────────────────────────────────────────────────────────

function QueueRow({ item }: { item: QueueItem }) {
  const color = CATEGORY_COLORS[item.categoryId] ?? COLORS.accent;
  return (
    <View style={styles.queueRow}>
      <View style={[styles.queueDot, { backgroundColor: color + '80' }]} />
      <Text style={styles.queueTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.queueXP}>+{item.xpReward}</Text>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const character = useCharacterStore((s) => s.character);
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);
  const getTodaysDisciplines = useDisciplineStore((s) => s.getTodaysDisciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const completeTask = useQuestStore((s) => s.completeTask);
  const pendingAchievement = useAchievementStore((s) => s.pendingToast);
  const clearPendingToast = useAchievementStore((s) => s.clearPendingToast);

  const [brokenDown, setBrokenDown] = useState(false);
  const [toast, setToast] = useState<{ xp: number; color: string; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const [burstXP, setBurstXP] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Screen entrance
  const screenOpacity = useSharedValue(0);
  const screenY = useSharedValue(16);
  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateY: screenY.value }],
  }));

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: DURATION.fast });
    screenY.value = withSpring(0, SPRING.gentle);
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
  }, []);

  if (!character) return null;

  const todaysHabits = getTodaysHabits();
  const todaysDisciplines = getTodaysDisciplines();
  const activeQuests = getActiveQuests();

  const queue = buildQueue(todaysHabits, todaysDisciplines, activeQuests);
  const current = queue[0] ?? null;
  const upNext = queue.slice(1, 4);

  const ovLvl = character.overallLevel;
  const xpCurr = xpForLevel(ovLvl);
  const xpNext = xpForLevel(ovLvl + 1);
  const lvlProgress = ovLvl === 0
    ? Math.min(character.totalXP / 500, 1)
    : (character.totalXP - xpCurr) / (xpNext - xpCurr);
  const xpToNext = Math.max(0, xpNext - character.totalXP);

  const handleComplete = useCallback(() => {
    if (!current) return;
    setBrokenDown(false);

    let result: { xpGained: number; categoryId: string; leveledUp: boolean; newLevel: number; rankUp: boolean; newRank: string } | null = null;

    if (current.type === 'habit' && current.habitRef) {
      result = completeHabit(current.habitRef.id);
    } else if (current.type === 'discipline' && current.disciplineRef) {
      const r = completeDiscipline(current.disciplineRef.id);
      if (r) result = { xpGained: r.xpGained, categoryId: r.categoryId, leveledUp: r.leveledUp, newLevel: r.newLevel, rankUp: r.rankUp, newRank: r.newRank };
    } else if (current.type === 'quest_task' && current.questId && current.taskId) {
      const r = completeTask(current.questId, current.taskId);
      if (r) {
        const quest = activeQuests.find((q) => q.id === current.questId);
        const task = quest?.tasks.find((t) => t.id === current.taskId);
        result = {
          xpGained: task?.xpReward ?? 0,
          categoryId: current.categoryId,
          leveledUp: r.leveledUp,
          newLevel: r.newLevel,
          rankUp: r.rankUp,
          newRank: r.newRank,
        };
      }
    }

    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId] ?? COLORS.accent;
    setBurstXP(result.xpGained);
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });

    if (result.leveledUp) {
      setTimeout(() => {
        setLevelUp({
          level: result!.newLevel,
          categoryId: result!.categoryId,
          rankUp: result!.rankUp,
          newRank: result!.newRank,
          color: catColor,
        });
        setBurstPos(null);
      }, 700);
    } else {
      setTimeout(() => setBurstPos(null), 700);
    }
  }, [current, completeHabit, completeDiscipline, completeTask, activeQuests]);

  const handleCompleteSubTask = useCallback((taskId: string) => {
    if (!current?.questId) return;
    haptic.light();
    const r = completeTask(current.questId, taskId);
    if (!r) return;
    const quest = getActiveQuests().find((q) => q.id === current.questId) ??
      activeQuests.find((q) => q.id === current.questId);
    const task = quest?.tasks.find((t) => t.id === taskId);
    const catColor = CATEGORY_COLORS[current.categoryId] ?? COLORS.accent;
    setToast({ xp: task?.xpReward ?? 0, color: catColor, key: Date.now() });
  }, [current, completeTask, getActiveQuests, activeQuests]);

  const levelUpMeta = levelUp ? CATEGORY_META.find((m) => m.id === levelUp.categoryId) : null;
  const isAllClear = queue.length === 0;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <AuroraBackground />

      <Animated.View style={[{ flex: 1 }, screenStyle]}>
        {/* ── Status strip (dimmed, non-tappable focus) ──────────── */}
        <View style={styles.statusStrip}>
          <View style={styles.statusLeft}>
            <View style={styles.levelRingSmall}>
              <Text style={styles.levelRingText}>{character.overallLevel}</Text>
            </View>
            <Text style={styles.statusLevel}>Lvl {character.overallLevel}</Text>
          </View>

          <View style={styles.xpBarWrap}>
            <View style={styles.xpBarTrack}>
              <View style={[styles.xpBarFill, { width: `${Math.round(lvlProgress * 100)}%` as any }]} />
            </View>
          </View>

          <Text style={styles.statusXP}>
            {character.totalXP >= 1000
              ? `${(character.totalXP / 1000).toFixed(1)}k`
              : character.totalXP} XP
          </Text>
          <AscendIcon name="flash" size={12} color={COLORS.gold} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: TAB_BAR_OFFSET + insets.bottom + 20 },
          ]}
        >
          {/* ── Active quest card ──────────────────────────────────── */}
          {current ? (
            <View style={styles.cardWrap}>
              <ActiveQuestCard
                item={current}
                brokenDown={brokenDown}
                onBreakDown={() => setBrokenDown(true)}
                onComplete={handleComplete}
                onCompleteSubTask={handleCompleteSubTask}
                burstPos={burstPos}
                setBurstPos={setBurstPos}
              />

              {/* RewardBurst overlay — positioned absolutely at card center */}
              {burstPos && (
                <View
                  pointerEvents="none"
                  style={[styles.burstAnchor, { top: 120, left: '50%' }]}
                >
                  <RewardBurst
                    xpDelta={burstXP}
                    baseXP={character.totalXP - burstXP}
                    leveledUp={!!levelUp}
                    reducedMotion={reducedMotion}
                    onDone={() => setBurstPos(null)}
                  />
                </View>
              )}
            </View>
          ) : (
            /* All clear empty state */
            <View style={styles.allClearCard}>
              <LinearGradient
                colors={['rgba(107,203,139,0.12)', 'rgba(107,203,139,0.04)']}
                style={styles.allClearGrad}
              >
                <AscendIcon name="check" size={32} color={COLORS.success} />
                <Text style={styles.allClearTitle}>All clear.</Text>
                <Text style={styles.allClearSub}>Add one thing?</Text>
                <TouchableOpacity
                  style={styles.addOneBtn}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/habits' as any)}
                >
                  <AscendIcon name="habits" size={14} color={COLORS.text} />
                  <Text style={styles.addOneBtnText}>Add a task</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {/* ── Up next queue (dimmed, not competing) ────────────── */}
          {upNext.length > 0 && (
            <View style={styles.queueSection}>
              <Text style={styles.queueLabel}>Up next</Text>
              {upNext.map((item) => (
                <QueueRow key={item.id} item={item} />
              ))}
              {queue.length > 4 && (
                <Text style={styles.queueMore}>+{queue.length - 4} more</Text>
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* ── Floating feedback ──────────────────────────────────────── */}
      {toast !== null && (
        <XPToast key={toast.key} xp={toast.xp} color={toast.color} onDone={() => setToast(null)} />
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
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Status strip
  statusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    opacity: 0.65,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  levelRingSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRingText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
    lineHeight: 12,
  },
  statusLevel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  xpBarWrap: { flex: 1, paddingHorizontal: SPACING.xs },
  xpBarTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(139,124,246,0.20)',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.accent,
  },
  statusXP: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  // Active card
  cardWrap: { position: 'relative', marginBottom: SPACING.xl },
  activeCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,124,246,0.20)',
  },
  activeCardGrad: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },

  // Timer bar
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  timerBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },

  // Quest title
  activeQuestTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: -0.3,
    lineHeight: 28,
  },

  // Micro-steps (break this down)
  microSteps: {
    gap: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  microStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 6,
  },
  microCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microCheckDone: {
    backgroundColor: 'rgba(107,203,139,0.15)',
  },
  microStepText: {
    flex: 1,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  microStepTextDone: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },

  // Action row
  activeCardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  breakDownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(139,124,246,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(139,124,246,0.20)',
  },
  breakDownText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
  },
  completeBtn: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    minHeight: 44,
  },
  completeBtnGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  completeBtnText: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.md,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Burst anchor
  burstAnchor: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // All clear
  allClearCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(107,203,139,0.20)',
    marginBottom: SPACING.xl,
  },
  allClearGrad: {
    alignItems: 'center',
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  allClearTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 26,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  allClearSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  addOneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  addOneBtnText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },

  // Up next queue
  queueSection: {
    gap: SPACING.xs,
  },
  queueLabel: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    letterSpacing: 0.4,
    marginBottom: 4,
    opacity: 0.7,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 10,
    opacity: 0.55,
  },
  queueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  queueTitle: {
    flex: 1,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  queueXP: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textDim,
  },
  queueMore: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textDim,
    textAlign: 'center',
    paddingTop: SPACING.xs,
    opacity: 0.5,
  },
});
