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
}

export function QuestCard({ quest }: Props) {
  const router = useRouter();
  const catMeta = CATEGORY_META.find((c) => c.id === quest.categoryId);
  const progress = quest.totalXP > 0 ? quest.earnedXP / quest.totalXP : 0;
  const completedTasks = quest.tasks.filter((t) => t.completed).length;
  const color = CATEGORY_COLORS[quest.categoryId] ?? COLORS.accent;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/quest/${quest.id}`)}
      activeOpacity={0.8}
      style={styles.wrapper}
    >
      <View style={[styles.card, { borderColor: color + '25', shadowColor: color }]}>
        {/* 3px top gradient bar */}
        <LinearGradient
          colors={[color, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        />

        <View style={styles.body}>
          {/* XP pill badge top-right */}
          <View style={styles.xpPill}>
            <LinearGradient
              colors={[COLORS.accent, '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.xpPillGradient}
            >
              <Text style={styles.xpPillText}>⚡ {quest.totalXP} XP</Text>
            </LinearGradient>
          </View>

          <View style={styles.header}>
            {/* Category emoji with colored circular background */}
            <View style={[styles.emojiCircle, { backgroundColor: color + '18' }]}>
              <Text style={styles.emoji}>{catMeta?.emoji ?? '⚔️'}</Text>
            </View>

            <View style={styles.titleBlock}>
              <Text style={styles.title} numberOfLines={2}>{quest.title}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, {
                  backgroundColor: DIFFICULTY_COLORS[quest.difficulty] + '22',
                  borderColor: DIFFICULTY_COLORS[quest.difficulty],
                }]}>
                  <Text style={[styles.badgeText, { color: DIFFICULTY_COLORS[quest.difficulty] }]}>
                    {quest.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Task count + XP bar */}
          <View style={styles.progressSection}>
            <Text style={styles.taskCount}>{completedTasks} / {quest.tasks.length} Tasks</Text>
            <XPBar progress={progress} color={color} height={5} style={{ marginTop: SPACING.xs }} />
          </View>
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
  xpPill: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.sm,
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
