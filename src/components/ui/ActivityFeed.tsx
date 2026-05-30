import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityEntry } from '../../types';
import { FadeInView } from './FadeInView';
import { CATEGORY_COLORS } from '../../constants/theme';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface Props {
  entries: ActivityEntry[];
  maxItems?: number;
}

const TYPE_LABEL: Record<ActivityEntry['type'], string> = {
  habit: 'HABIT',
  discipline: 'DISCIPLINE',
  quest_task: 'TASK',
  level_up: 'LEVEL UP',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function ActivityFeed({ entries, maxItems = 10 }: Props) {
  const visible = entries.slice(0, maxItems);

  if (visible.length === 0) {
    return (
      <Text style={styles.empty}>
        Complete habits and disciplines to see your activity.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {visible.map((entry, index) => {
        const color = CATEGORY_COLORS[entry.categoryId] ?? COLORS.accent;
        return (
          <FadeInView key={entry.id} delay={index * 40}>
            <View style={styles.row}>
              {/* Left: color dot */}
              <View style={[styles.dot, { backgroundColor: color }]} />

              {/* Center: title + type label */}
              <View style={styles.center}>
                <Text style={styles.title} numberOfLines={1}>
                  {entry.title}
                </Text>
                <Text style={styles.typeLabel}>{TYPE_LABEL[entry.type]}</Text>
              </View>

              {/* Right: xp + time */}
              <View style={styles.right}>
                <Text style={[styles.xp, { color }]}>+{entry.xpGained} XP</Text>
                <Text style={styles.time}>{timeAgo(entry.timestamp)}</Text>
              </View>
            </View>
          </FadeInView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  empty: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  center: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  typeLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  xp: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 0.3,
  },
  time: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
  },
});
