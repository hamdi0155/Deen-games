import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon, CATEGORY_ASCEND_ICONS, AscendIconName } from '../icons/AscendIcon';
import { useRouter } from 'expo-router';
import { Quest } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, DIFFICULTY_COLORS, CATEGORY_COLORS } from '../../constants/theme';
import { CATEGORY_META } from '../../constants/categories';

interface Props {
  quest: Quest;
  compact?: boolean;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getUrgencyLevel(quest: Quest): 'stale' | 'urgent' | 'none' {
  if (quest.status !== 'active') return 'none';
  const ageMs = Date.now() - new Date(quest.createdAt).getTime();
  const ageDays = ageMs / MS_PER_DAY;
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;

  if (ageDays > 14 && progress < 0.25) return 'stale';
  if (ageDays > 7 && progress < 0.5) return 'urgent';
  return 'none';
}

function getDifficultyIcon(difficulty: string): AscendIconName {
  switch (difficulty) {
    case 'easy':   return 'sparkle';
    case 'medium': return 'flash';
    case 'hard':   return 'flame';
    default:       return 'diamond';
  }
}

export function QuestCard({ quest, compact = false }: Props) {
  const router = useRouter();
  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;
  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;
  const isCompleted = quest.status === 'completed';
  const diffColor = DIFFICULTY_COLORS[quest.difficulty] ?? COLORS.accent;

  const urgency = getUrgencyLevel(quest);
  const isUrgent = urgency === 'urgent';
  const isStale = urgency === 'stale';

  // Border color: stale > urgent > category
  const borderColor = isCompleted
    ? COLORS.success + '35'
    : isStale
    ? '#EF4444' + '55'
    : isUrgent
    ? '#F59E0B' + '55'
    : color + '25';

  const shadowColor = isCompleted ? COLORS.success : isStale ? '#EF4444' : isUrgent ? '#F59E0B' : color;

  // Colored glow shadow when quest.xp > 100
  const hasGlow = quest.totalXP > 100;

  // Top accent bar color
  const topBarColor = isCompleted ? COLORS.success : isStale ? '#EF4444' : isUrgent ? '#F59E0B' : color;

  // Progress bar fill color
  const barFillColor = isCompleted ? COLORS.success : isStale ? '#EF4444' : isUrgent ? '#F59E0B' : color;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/quest/${quest.id}`)}
      activeOpacity={0.8}
      style={[styles.wrapper, isCompleted && styles.completedWrapper]}
    >
      <View
        style={[
          styles.card,
          { borderColor },
          SHADOWS.sm,
          hasGlow && {
            shadowColor,
            shadowOpacity: 0.2,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 4 },
          },
        ]}
      >
        {/* 3px top accent bar — solid category color */}
        <View style={[styles.topBar, { backgroundColor: topBarColor }]} />

        {/* Completed overlay tint */}
        {isCompleted && (
          <LinearGradient
            colors={[COLORS.success + '08', 'transparent']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}

        {/* Stale overlay tint */}
        {isStale && !isCompleted && (
          <LinearGradient
            colors={['#EF444408', 'transparent']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}

        {/* Urgent overlay tint */}
        {isUrgent && !isCompleted && (
          <LinearGradient
            colors={['#F59E0B06', 'transparent']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}

        <View style={styles.body}>
          {/* Top row: completed badge (left) + XP reward chip (right) */}
          <View style={styles.topRow}>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <View style={{ marginRight: 3 }}>
                  <AscendIcon name="check-circle" filled size={11} color={COLORS.success} />
                </View>
                <Text style={styles.completedBadgeText}>COMPLETE</Text>
              </View>
            ) : (
              <View />
            )}
            {/* XP reward chip — gold, right-aligned */}
            <View style={styles.xpChip}>
              <View style={{ marginRight: 3 }}>
                <AscendIcon name="flash" size={10} color={COLORS.gold} />
              </View>
              <Text style={styles.xpChipText}>{quest.totalXP} pts</Text>
            </View>
          </View>

          <View style={styles.header}>
            {/* Category icon with colored circular background */}
            <View style={[styles.emojiCircle, { backgroundColor: (isCompleted ? COLORS.success : color) + '18' }]}>
              <AscendIcon
                name={CATEGORY_ASCEND_ICONS[quest.categoryId] ?? 'goals'}
                size={26}
                color={isCompleted ? COLORS.success : color}
              />
            </View>

            <View style={styles.titleBlock}>
              <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={compact ? 1 : 2}>
                {quest.title}
              </Text>
              <View style={styles.badges}>
                {/* Difficulty badge: icon + label */}
                <View style={[styles.badge, {
                  backgroundColor: diffColor + '20',
                  borderRadius: RADIUS.xs,
                }]}>
                  <View style={{ marginRight: 3 }}>
                    <AscendIcon
                      name={getDifficultyIcon(quest.difficulty)}
                      size={10}
                      color={diffColor}
                    />
                  </View>
                  <Text style={[styles.badgeText, { color: diffColor }]}>
                    {quest.difficulty}
                  </Text>
                </View>
                <Text style={styles.catLabel}>{catMeta?.label ?? ''}</Text>

                {/* Urgency indicators */}
                {isStale && (
                  <View style={styles.staleBadge}>
                    <View style={{ marginRight: 3 }}>
                      <AscendIcon name="warning" size={10} color="#EF4444" />
                    </View>
                    <Text style={styles.staleBadgeText}>Stale</Text>
                  </View>
                )}
                {isUrgent && !isStale && (
                  <AscendIcon name="warning" size={14} color="#F59E0B" />
                )}
              </View>
            </View>
          </View>

          {/* Description preview (non-compact only) */}
          {!compact && quest.description ? (
            <Text style={styles.description} numberOfLines={2}>{quest.description}</Text>
          ) : null}

          {/* Progress section (non-compact only) */}
          {!compact && (
            <View style={styles.progressSection}>
              {/* Thin 3px progress bar with gradient fill */}
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={[barFillColor, barFillColor + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(isCompleted ? 100 : progress * 100, 100)}%` },
                  ]}
                />
              </View>
              {/* Tasks + XP earned label */}
              <Text style={styles.progressLabel}>
                {completedTasks}/{quest.tasks.length} tasks · {quest.earnedXP} pts earned
              </Text>
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
    borderRadius: RADIUS.lg,
  },
  completedWrapper: {
    opacity: 0.85,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  // Gold XP chip
  xpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold + '18',
    borderRadius: RADIUS.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  xpChipText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.display,
    color: COLORS.gold,
    letterSpacing: 0.5,
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
  titleBlock: { flex: 1, gap: 4 },
  title: {
    fontSize: 16,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
  },
  titleCompleted: {
    color: COLORS.textMuted,
  },
  badges: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  staleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#EF444460',
    backgroundColor: '#EF444415',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  staleBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyBold,
    color: '#EF4444',
  },
  description: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 17,
    marginBottom: SPACING.sm,
  },
  progressSection: {
    marginTop: SPACING.xs,
    gap: 4,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.textSecondary,
  },
});
