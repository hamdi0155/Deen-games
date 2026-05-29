import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Quest } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { XPBar } from '../ui/XPBar';
import { COLORS, FONTS, SPACING, RADIUS, DIFFICULTY_COLORS, CATEGORY_COLORS } from '../../constants/theme';
import { CATEGORY_META } from '../../constants/categories';

interface Props {
  quest: Quest;
}

export function QuestCard({ quest }: Props) {
  const router = useRouter();
  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;
  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;

  return (
    <TouchableOpacity onPress={() => router.push(`/quest/${quest.id}`)} activeOpacity={0.8}>
      <GlowCard glowColor={color} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{catMeta?.emoji ?? '⚔️'}</Text>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={2}>{quest.title}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLORS[quest.difficulty] + '22', borderColor: DIFFICULTY_COLORS[quest.difficulty] }]}>
                <Text style={[styles.badgeText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>{quest.difficulty.toUpperCase()}</Text>
              </View>
              <Text style={styles.meta}>{completedTasks}/{quest.tasks.length} tasks</Text>
            </View>
          </View>
          <Text style={styles.xp}>{quest.totalXP} XP</Text>
        </View>
        <XPBar progress={progress} color={color} height={5} style={{ marginTop: SPACING.sm }} />
      </GlowCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  emoji: { fontSize: 28, marginTop: 2 },
  titleBlock: { flex: 1, gap: 4 },
  title: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  badges: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  badge: { borderWidth: 1, borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  xp: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.accent },
});
