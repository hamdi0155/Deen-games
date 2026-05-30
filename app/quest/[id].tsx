import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useQuestStore } from '../../src/store/questStore';
import { TaskItem } from '../../src/components/quests/TaskItem';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { XPToast } from '../../src/components/ui/XPToast';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { AchievementToast } from '../../src/components/ui/AchievementToast';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { ParticleBurst } from '../../src/components/ui/ParticleBurst';
import { useAchievementStore } from '../../src/store/achievementStore';
import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  DIFFICULTY_COLORS,
  CATEGORY_COLORS,
} from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function QuestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const getQuestById = useQuestStore((s) => s.getQuestById);
  const completeTask = useQuestStore((s) => s.completeTask);
  const abandonQuest = useQuestStore((s) => s.abandonQuest);
  const quest = getQuestById(id ?? '');

  const pendingAchievement = useAchievementStore((s) => s.pendingToast);
  const clearPendingToast = useAchievementStore((s) => s.clearPendingToast);

  const [toast, setToast] = useState<{ xp: number; key: number } | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number; rankUp: boolean; newRank: string } | null>(null);

  // Completion overlay animation
  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(0.8);

  const overlayAnimStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  const isCompleted = quest?.status === 'completed';

  useEffect(() => {
    if (isCompleted) {
      overlayOpacity.value = withTiming(1, { duration: 400 });
      overlayScale.value = withSpring(1, { damping: 14, stiffness: 120 });
    } else {
      overlayOpacity.value = 0;
      overlayScale.value = 0.8;
    }
  }, [isCompleted]);

  if (!quest) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Quest not found</Text>
      </SafeAreaView>
    );
  }

  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;
  const diffColor = DIFFICULTY_COLORS[quest.difficulty] ?? COLORS.accent;
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;

  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const totalTasks = quest.tasks.length;
  const isAllTasksDone = completedTasks === totalTasks && totalTasks > 0;

  const handleCompleteTask = (taskId: string) => {
    const task = quest.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const result = completeTask(quest.id, taskId);
    setToast({ xp: task.xpReward, key: Date.now() });
    if (result?.leveledUp) {
      setTimeout(() => setLevelUpData({ level: result.newLevel, rankUp: result.rankUp, newRank: result.newRank }), 900);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Section ──────────────────────────────────────── */}
        <LinearGradient
          colors={[color + '30', color + '08', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.hero}
        >
          {/* Standard navBar */}
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>{quest.title}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Category badge + difficulty badge row */}
          <View style={styles.heroMeta}>
            {/* Category pill: emoji + label */}
            <View style={[styles.categoryBadge, { backgroundColor: color + '20' }]}>
              <Text style={styles.categoryBadgeEmoji}>{catMeta?.emoji ?? '⚔️'}</Text>
              <Text style={[styles.categoryBadgeLabel, { color }]}>{catMeta?.label ?? ''}</Text>
            </View>

            {/* Difficulty badge inline */}
            <View style={[styles.diffBadge, {
              borderColor: diffColor,
              backgroundColor: diffColor + '22',
            }]}>
              <Text style={[styles.diffText, { color: diffColor }]}>
                {quest.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Quest title */}
          <Text style={styles.heroTitle}>{quest.title}</Text>
        </LinearGradient>

        {/* ── AI Narrative Block ─────────────────────────────────── */}
        {quest.aiNarrative != null && (
          <View style={styles.narrativeWrapper}>
            {/* Quest Lore label */}
            <View style={styles.narrativeLabelRow}>
              <Ionicons name="sparkles-outline" size={12} color={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={styles.narrativeLabel}>Quest Lore</Text>
            </View>
            <View style={[styles.narrativeAccentContainer, { backgroundColor: color + '08' }]}>
              <View style={[styles.narrativeLeftBorder, { backgroundColor: color }]} />
              <Text style={styles.narrative}>{quest.aiNarrative}</Text>
            </View>
          </View>
        )}

        {/* ── XP Progress ───────────────────────────────────────── */}
        <View style={styles.xpBlock}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Progress</Text>
            <Text style={styles.xpFraction}>
              <Text style={[styles.xpNumber, { color }]}>{quest.earnedXP}</Text>
              <Text style={styles.xpSep}> / </Text>
              <Text style={[styles.xpNumber, { color }]}>{quest.totalXP}</Text>
              <Text style={styles.xpUnit}> XP</Text>
            </Text>
          </View>
          <XPBar progress={progress} color={color} height={8} />
          <Text style={styles.xpPercent}>{Math.round(progress * 100)}% complete</Text>
        </View>

        {/* ── Task Progress Ring ─────────────────────────────────── */}
        <View style={styles.progressRingBlock}>
          <View style={[
            styles.progressRing,
            { borderColor: isAllTasksDone ? COLORS.gold : color },
          ]}>
            {isAllTasksDone ? (
              <Ionicons name="checkmark" size={32} color={COLORS.gold} />
            ) : (
              <>
                <Text style={[styles.progressRingFraction, { color: isAllTasksDone ? COLORS.gold : color }]}>
                  {completedTasks}/{totalTasks}
                </Text>
                <Text style={styles.progressRingLabel}>tasks</Text>
              </>
            )}
          </View>
        </View>

        {/* ── Tasks ─────────────────────────────────────────────── */}
        <Text style={styles.tasksHeading}>Tasks</Text>
        {quest.tasks.length === 0 ? (
          <View style={styles.emptyTasksContainer}>
            <Ionicons name="list-outline" size={28} color={COLORS.textSecondary} />
            <Text style={styles.emptyTasksText}>No tasks defined for this quest.</Text>
          </View>
        ) : (
          quest.tasks
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} color={color} />
            ))
        )}

        {quest.status === 'active' && (
          <TouchableOpacity
            style={styles.abandonBtn}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Abandon Quest',
                'Are you sure? All progress on this quest will be lost.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Abandon',
                    style: 'destructive',
                    onPress: () => { abandonQuest(quest.id); router.back(); },
                  },
                ]
              )
            }
          >
            <Ionicons name="trash-outline" size={14} color={COLORS.danger} style={{ marginRight: 6 }} />
            <Text style={styles.abandonBtnText}>Abandon Quest</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* ── Quest Completion Overlay ───────────────────────────── */}
      {isCompleted && (
        <Animated.View style={[styles.completionOverlay, overlayAnimStyle]} pointerEvents="box-none">
          <LinearGradient
            colors={['rgba(14,168,117,0.15)', 'rgba(7,9,15,0.98)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="shield-checkmark" size={52} color={COLORS.gold} />
          {/* QUEST COMPLETE in displayBold 28px letterSpacing 4 */}
          <Text style={styles.completionTitle}>QUEST COMPLETE</Text>
          <Text style={styles.completionQuestTitle}>{quest.title}</Text>
          {/* Gold XP number with flash icon */}
          <View style={styles.completionXPRow}>
            <Ionicons name="flash" size={20} color={COLORS.gold} style={{ marginRight: 4 }} />
            <Text style={styles.completionXP}>+{quest.earnedXP} XP</Text>
          </View>
          <TouchableOpacity
            style={styles.completionBtn}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Text style={styles.completionBtnText}>Return to Board</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {toast != null && (
        <XPToast
          key={toast.key}
          xp={toast.xp}
          color={color}
          onDone={() => setToast(null)}
        />
      )}

      <LevelUpModal
        visible={levelUpData !== null}
        level={levelUpData?.level ?? 0}
        categoryName={catMeta?.label ?? 'Unknown'}
        categoryEmoji={catMeta?.emoji ?? '⚔️'}
        color={color}
        rankUp={levelUpData?.rankUp}
        newRank={levelUpData?.newRank}
        onDismiss={() => setLevelUpData(null)}
      />

      {pendingAchievement && (
        <AchievementToast
          title={pendingAchievement.title}
          emoji={pendingAchievement.emoji}
          visible={!!pendingAchievement}
          onDone={clearPendingToast}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  error: { color: COLORS.textMuted, textAlign: 'center', marginTop: 80 },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingBottom: SPACING.xl,
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
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayMedium,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  // Category pill badge
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    gap: 4,
  },
  categoryBadgeEmoji: {
    fontSize: 14,
  },
  categoryBadgeLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyMedium,
  },
  diffBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  diffText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    lineHeight: 38,
  },

  // ── AI Narrative Block ─────────────────────────────────────
  narrativeWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  narrativeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  narrativeLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  narrativeAccentContainer: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  narrativeLeftBorder: {
    width: 3,
    borderRadius: 2,
    flexShrink: 0,
  },
  narrative: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // ── XP Block ───────────────────────────────────────────────
  xpBlock: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  xpLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  xpFraction: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  xpNumber: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
  },
  xpSep: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  xpUnit: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.textMuted,
  },
  xpPercent: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'right',
    letterSpacing: 0.5,
  },

  // ── Task Progress Ring — 88×88 ──────────────────────────────
  progressRingBlock: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  progressRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingFraction: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.display,
    lineHeight: 20,
  },
  progressRingLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    lineHeight: 14,
    letterSpacing: 0.5,
  },

  // ── Tasks ──────────────────────────────────────────────────
  tasksHeading: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // ── Empty Tasks ────────────────────────────────────────
  emptyTasksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    opacity: 0.7,
  },
  emptyTasksText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
  },

  // ── Abandon Button ─────────────────────────────────────────
  abandonBtn: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger + '40',
    borderRadius: RADIUS.lg,
  },
  abandonBtnText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.sm,
    color: COLORS.danger,
    letterSpacing: 0.5,
  },

  // ── Quest Completion Overlay ────────────────────────────────
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  completionTitle: {
    fontSize: 28,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 4,
    textAlign: 'center',
  },
  completionQuestTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  completionXPRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionXP: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  completionBtn: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accent + '80',
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accent + '18',
  },
  completionBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    letterSpacing: 1,
  },
});
