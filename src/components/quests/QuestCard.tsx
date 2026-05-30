import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Quest } from '../../types';
import { XPBar } from '../ui/XPBar';
import { COLORS, FONTS, SPACING, RADIUS, DIFFICULTY_COLORS, CATEGORY_COLORS } from '../../constants/theme';
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

export function QuestCard({ quest, compact = false }: Props) {
  const router = useRouter();
  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;
  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;
  const isCompleted = quest.status === 'completed';

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

  return (
    <TouchableOpacity
      onPress={() => router.push(`/quest/${quest.id}`)}
      activeOpacity={0.8}
      style={[styles.wrapper, isCompleted && styles.completedWrapper]}
    >
      <View style={[styles.card, { borderColor, shadowColor }]}>
        {/* 3px top gradient bar */}
        <LinearGradient
          colors={
            isCompleted
              ? [COLORS.success, COLORS.success + '00']
              : isStale
              ? ['#EF4444', '#EF444400']
              : isUrgent
              ? ['#F59E0B', '#F59E0B00']
              : [color, 'transparent']
          }
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
          {/* Top row: XP pill + completed badge */}
          <View style={styles.topRow}>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={11} color={COLORS.success} style={{ marginRight: 3 }} />
                <Text style={styles.completedBadgeText}>COMPLETE</Text>
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
                  <Ionicons
                    name={
                      quest.difficulty === 'easy' ? 'leaf-outline' :
                      quest.difficulty === 'medium' ? 'flash-outline' :
                      quest.difficulty === 'hard' ? 'skull-outline' :
                      'planet-outline'
                    }
                    size={10}
                    color={DIFFICULTY_COLORS[quest.difficulty]}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={[styles.badgeText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                    {quest.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.catLabel}>{catMeta?.label ?? ''}</Text>

                {/* Urgency indicators */}
                {isStale && (
                  <View style={styles.staleBadge}>
                    <Ionicons name="warning-outline" size={10} color="#EF4444" style={{ marginRight: 3 }} />
                    <Text style={styles.staleBadgeText}>Stale</Text>
                  </View>
                )}
                {isUrgent && !isStale && (
                  <Ionicons name="warning-outline" size={14} color="#F59E0B" />
                )}
              </View>
            </View>
          </View>

          {/* Description preview (non-compact only) */}
          {!compact && quest.description ? (
            <Text style={styles.description} numberOfLines={2}>{quest.description}</Text>
          ) : null}

          {/* Task count + XP bar */}
          {!compact && (
            <View style={styles.progressSection}>
              <Text style={styles.taskCount}>{completedTasks} / {quest.tasks.length} Tasks</Text>
              <XPBar
                progress={isCompleted ? 1 : progress}
                color={isCompleted ? COLORS.success : isStale ? '#EF4444' : isUrgent ? '#F59E0B' : color}
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
  badges: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  urgentIcon: {
    fontSize: FONTS.sizes.sm,
    color: '#F59E0B',
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
  },
  taskCount: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
});
