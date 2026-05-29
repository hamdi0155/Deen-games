import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Quest } from '../../types';
import { XPBar } from '../ui/XPBar';
import { COLORS, FONTS, SPACING, RADIUS, DIFFICULTY_COLORS, CATEGORY_COLORS } from '../../constants/theme';
import { CATEGORY_META } from '../../constants/categories';

interface Props {
  quest: Quest;
  compact?: boolean;
}

export function QuestCard({ quest, compact = false }: Props) {
  const router = useRouter();
  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;
  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;
  const isCompleted = quest.status === 'completed';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/quest/${quest.id}`)}
      activeOpacity={0.8}
      style={[styles.wrapper, isCompleted && styles.completedWrapper]}
    >
      <View style={[styles.card, { borderColor: isCompleted ? COLORS.success + '35' : color + '25', shadowColor: isCompleted ? COLORS.success : color }]}>
        {/* 3px top gradient bar */}
        <LinearGradient
          colors={isCompleted ? [COLORS.success, COLORS.success + '00'] : [color, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        />

        {/* Completed overlay tint */}
        {isCompleted && (
          <LinearGradient
            colors={[COLORS.success + '08', 'transparent']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}

        <View style={styles.body}>
          {/* Top row: XP pill + completed badge */}
          <View style={styles.topRow}>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓ COMPLETE</Text>
              </View>
            ) : (
              <View />
            )}
            <View style={styles.xpPill}>
              <LinearGradient
                colors={isCompleted ? [COLORS.success, '#059669'] : [COLORS.accent, '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.xpPillGradient}
              >
                <Text style={styles.xpPillText}>⚡ {quest.totalXP} XP</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.header}>
            {/* Category emoji with colored circular background */}
            <View style={[styles.emojiCircle, { backgroundColor: (isCompleted ? COLORS.success : color) + '18' }]}>
              <Text style={styles.emoji}>{catMeta?.emoji ?? '⚔️'}</Text>
            </View>

            <View style={styles.titleBlock}>
              <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={compact ? 1 : 2}>{quest.title}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, {
                  backgroundColor: DIFFICULTY_COLORS[quest.difficulty] + '22',
                  borderColor: DIFFICULTY_COLORS[quest.difficulty],
                }]}>
                  <Text style={[styles.badgeText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                    {quest.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.catLabel}>{catMeta?.label ?? ''}</Text>
              </View>
            </View>
          </View>

          {/* Task count + XP bar */}
          {!compact && (
            <View style={styles.progressSection}>
              <Text style={styles.taskCount}>{completedTasks} / {quest.tasks.length} Tasks</Text>
              <XPBar
                progress={isCompleted ? 1 : progress}
                color={isCompleted ? COLORS.success : color}
                height={5}
                style={{ marginTop: SPACING.xs }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  completedWrapper: {
    opacity: 0.85,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  topBar: {
    height: 3,
    width: '100%',
  },
  body: {
    padding: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  completedBadge: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.success + '50',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  completedBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.success,
    letterSpacing: 1,
  },
  xpPill: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpPillGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  xpPillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyBold,
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  emojiCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 32 },
  titleBlock: { flex: 1, gap: 4 },
  title: {
    fontSize: 16,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
  },
  titleCompleted: {
    color: COLORS.textMuted,
  },
  badges: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  badge: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 0.5,
  },
  catLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textDim,
  },
  progressSection: {
    marginTop: SPACING.xs,
  },
  taskCount: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
});
