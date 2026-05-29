import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuestStore } from '../../src/store/questStore';
import { TaskItem } from '../../src/components/quests/TaskItem';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { XPToast } from '../../src/components/ui/XPToast';
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

  const handleCompleteTask = (taskId: string) => {
    const task = quest.tasks.find((t) => t.id === taskId);
    if (!task) return;
    completeTask(quest.id, taskId);
    setToast({ xp: task.xpReward, key: Date.now() });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
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

        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.desc}>{quest.description}</Text>

        {quest.aiNarrative != null && (
          <GlowCard glowColor={color} style={styles.narrativeCard}>
            <Text style={styles.narrativeIcon}>📜</Text>
            <Text style={styles.narrative}>{quest.aiNarrative}</Text>
          </GlowCard>
        )}

        <View style={styles.xpBlock}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Progress</Text>
            <Text style={[styles.xpValue, { color }]}>
              {quest.earnedXP} / {quest.totalXP} XP
            </Text>
          </View>
          <XPBar progress={progress} color={color} height={8} />
        </View>

        <Text style={styles.tasksHeading}>Tasks</Text>
        {quest.tasks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
          ))}

        {quest.status === 'completed' && (
          <View style={styles.completedBanner}>
            <Text style={styles.completedText}>
              🏆 Quest Complete — Your identity grows stronger.
            </Text>
          </View>
        )}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  error: { color: COLORS.textMuted, textAlign: 'center', marginTop: 80 },
  back: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  backText: { color: COLORS.accent, fontSize: FONTS.sizes.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  catEmoji: { fontSize: 36 },
  diffBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  diffText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  desc: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.lg,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  narrativeCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, gap: SPACING.sm },
  narrativeIcon: { fontSize: 20 },
  narrative: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 22, fontStyle: 'italic' },
  xpBlock: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg, gap: SPACING.sm },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  xpValue: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  tasksHeading: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  completedBanner: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: '#10B98122',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  completedText: {
    color: '#10B981',
    textAlign: 'center',
    fontWeight: FONTS.weights.semibold,
  },
});
