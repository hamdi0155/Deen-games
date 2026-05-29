import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuestStore } from '../../src/store/questStore';
import { TaskItem } from '../../src/components/quests/TaskItem';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { XPToast } from '../../src/components/ui/XPToast';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { ParticleBurst } from '../../src/components/ui/ParticleBurst';
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
  const quest = getQuestById(id ?? '');

  const [toast, setToast] = useState<{ xp: number; key: number } | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number; rankUp: boolean; newRank: string } | null>(null);

  if (!quest) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Quest not found</Text>
      </SafeAreaView>
    );
  }

  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;
  const narrativePreview = quest.aiNarrative
    ? quest.aiNarrative.slice(0, 120) + (quest.aiNarrative.length > 120 ? '…' : '')
    : null;

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
        {/* ── Quest Completed Hero ───────────────────────────────── */}
        {quest.status === 'completed' && (
          <LinearGradient
            colors={['#10B98140', '#10B98115', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.completedHero}
          >
            {/* Particle burst */}
            <View style={styles.completedParticleAnchor}>
              <ParticleBurst color="#10B981" count={20} />
            </View>

            {/* Trophy in golden ring */}
            <View style={styles.completedRingWrap}>
              <View style={[styles.completedOuterRing, { borderColor: '#D9770640' }]} />
              <View style={[styles.completedInnerRing, { borderColor: '#D9770680' }]} />
              <LinearGradient
                colors={['#D9770628', '#D9770608']}
                style={styles.completedEmojiContainer}
              >
                <Text style={styles.completedTrophy}>🏆</Text>
              </LinearGradient>
            </View>

            <Text style={styles.completedLabel}>QUEST COMPLETE</Text>
            <Text style={styles.completedQuestTitle}>{quest.title}</Text>
            <Text style={[styles.completedXP, { color: COLORS.accent }]}>
              +{quest.earnedXP} XP
            </Text>
            <Text style={styles.completedPhrase}>
              "{catMeta?.label ?? ''} mastery grows within you."
            </Text>
          </LinearGradient>
        )}

        {/* ── Hero Section ──────────────────────────────────────── */}
        <LinearGradient
          colors={[color + '30', color + '08', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.hero}
        >
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Emoji + difficulty row */}
          <View style={styles.heroMeta}>
            <Text style={styles.catEmoji}>{catMeta?.emoji ?? '⚔️'}</Text>
            <View style={[styles.diffBadge, {
              borderColor: DIFFICULTY_COLORS[quest.difficulty],
              backgroundColor: DIFFICULTY_COLORS[quest.difficulty] + '22',
            }]}>
              <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                {quest.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Quest title */}
          <Text style={styles.heroTitle}>{quest.title}</Text>

          {/* AI Narrative preview */}
          {narrativePreview != null && (
            <Text style={styles.heroPeek}>{narrativePreview}</Text>
          )}
        </LinearGradient>

        {/* ── Full AI Narrative Card ─────────────────────────────── */}
        {quest.aiNarrative != null && (
          <View style={styles.narrativeWrapper}>
            <GlowCard glowColor="#D97706" style={styles.narrativeCard}>
              {/* Gold top accent bar */}
              <View style={styles.narrativeAccentBar} />
              <View style={styles.narrativeInner}>
                <Text style={styles.narrativeIcon}>📜</Text>
                <Text style={styles.narrative}>{quest.aiNarrative}</Text>
              </View>
            </GlowCard>
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

        {/* ── Tasks ─────────────────────────────────────────────── */}
        <Text style={styles.tasksHeading}>Tasks</Text>
        {quest.tasks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} color={color} />
          ))}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

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
  back: {
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.accent,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayLight,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  catEmoji: { fontSize: 48 },
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
  heroPeek: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.lg,
    lineHeight: 20,
  },

  // ── Narrative Card ─────────────────────────────────────────
  narrativeWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  narrativeCard: {
    overflow: 'hidden',
    padding: 0,
  },
  narrativeAccentBar: {
    height: 3,
    backgroundColor: '#D97706',
    width: '100%',
  },
  narrativeInner: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  narrativeIcon: { fontSize: 20 },
  narrative: {
    fontSize: FONTS.sizes.sm,
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
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'right',
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

  // ── Quest Completed Hero ────────────────────────────────────
  completedHero: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  completedParticleAnchor: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 0,
    height: 0,
  },
  completedRingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
  },
  completedOuterRing: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 77.5,
    borderWidth: 1,
  },
  completedInnerRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 1.5,
  },
  completedEmojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTrophy: {
    fontSize: 56,
  },
  completedLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.success,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  completedQuestTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  completedXP: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    letterSpacing: 1,
  },
  completedPhrase: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});
