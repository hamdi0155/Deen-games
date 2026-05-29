import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';

interface Props {
  task: Task;
  onComplete: (taskId: string) => void;
}

export function TaskItem({ task, onComplete }: Props) {
  const [pressed, setPressed] = useState(false);
  const color = CATEGORY_COLORS[task.categoryId] ?? COLORS.accent;

  const handlePress = () => {
    if (task.completed || pressed) return;
    setPressed(true);
    onComplete(task.id);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} disabled={task.completed}>
      <View style={[styles.row, task.completed && styles.rowDone]}>
        <View style={[styles.checkbox, task.completed && { backgroundColor: color, borderColor: color }]}>
          {task.completed && <Text style={styles.check}>✓</Text>}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={2}>
            {task.title}
          </Text>
          {task.description && !task.completed && (
            <Text style={styles.desc} numberOfLines={2}>{task.description}</Text>
          )}
        </View>
        <View style={[styles.xpBadge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.xpText, { color }]}>+{task.xpReward}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  rowDone: { opacity: 0.5 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  check: { color: '#000', fontSize: 12, fontWeight: FONTS.weights.bold },
  content: { flex: 1, gap: 3 },
  title: { fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: FONTS.weights.medium },
  titleDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  desc: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  xpBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  xpText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
});
