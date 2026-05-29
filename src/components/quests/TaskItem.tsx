import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';

interface Props {
  task: Task;
  onComplete: (taskId: string) => void;
  color?: string;
}

export function TaskItem({ task, onComplete, color: colorProp }: Props) {
  const color = colorProp ?? CATEGORY_COLORS[task.categoryId] ?? COLORS.accent;
  const checkScale = useSharedValue(1);
  const rowOpacity = useSharedValue(1);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const rowAnimStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
  }));

  const handlePress = () => {
    if (task.completed) return;
    checkScale.value = withSpring(1.35, { damping: 6, stiffness: 400 }, () => {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    rowOpacity.value = withTiming(0.5, { duration: 400 });
    onComplete(task.id);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} disabled={task.completed}>
      <Animated.View style={[styles.row, rowAnimStyle]}>
        {/* Checkbox */}
        <Animated.View style={[styles.checkboxWrapper, checkAnimStyle]}>
          <TouchableOpacity
            onPress={handlePress}
            disabled={task.completed}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {task.completed ? (
              <LinearGradient
                colors={[color, color + 'AA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkboxFilled}
              >
                <Text style={styles.check}>✓</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.checkboxEmpty, { borderColor: color }]} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.title, task.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {task.tip && !task.completed && (
            <Text style={styles.tip} numberOfLines={2}>{task.tip}</Text>
          )}
          {task.description && !task.completed && !task.tip && (
            <Text style={styles.desc} numberOfLines={2}>{task.description}</Text>
          )}
        </View>

        {/* XP badge */}
        <View style={[styles.xpBadge, { backgroundColor: color + '22', borderColor: color + '66' }]}>
          <Text style={[styles.xpText, { color }]}>+{task.xpReward} XP</Text>
        </View>
      </Animated.View>
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
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  checkboxWrapper: {
    width: 26,
    height: 26,
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxFilled: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 13,
    fontFamily: FONTS.families.bodyBold,
  },
  content: { flex: 1, gap: 3 },
  title: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.text,
    lineHeight: 22,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  tip: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  desc: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  xpBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  xpText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyBold,
  },
});
