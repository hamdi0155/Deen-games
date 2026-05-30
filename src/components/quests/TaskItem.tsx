import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../../types';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';
import { haptic } from '../../services/haptics';

interface Props {
  task: Task;
  onComplete: (taskId: string) => void;
  color?: string;
}

export function TaskItem({ task, onComplete, color: colorProp }: Props) {
  const color = colorProp ?? CATEGORY_COLORS[task.categoryId] ?? COLORS.accent;
  const checkScale = useSharedValue(1);
  const rowOpacity = useSharedValue(1);
  const tipMaxHeight = useSharedValue(0);

  const [showTip, setShowTip] = useState(false);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const rowAnimStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
  }));

  const tipAnimStyle = useAnimatedStyle(() => ({
    maxHeight: tipMaxHeight.value,
    overflow: 'hidden',
  }));

  const handlePress = () => {
    if (task.completed) return;
    haptic.medium();
    checkScale.value = withSpring(1.35, { damping: 6, stiffness: 400 }, () => {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
    rowOpacity.value = withTiming(0.5, { duration: 400 });
    onComplete(task.id);
  };

  const toggleTip = () => {
    const next = !showTip;
    setShowTip(next);
    tipMaxHeight.value = withTiming(next ? 120 : 0, { duration: 250 });
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
              <Ionicons name="checkmark-circle" size={26} color={color} />
            ) : (
              <Ionicons name="ellipse-outline" size={26} color={color} />
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
          {task.description && !task.completed && !task.tip && (
            <Text style={styles.desc} numberOfLines={2}>{task.description}</Text>
          )}
          {task.tip && !task.completed && (
            <View>
              <TouchableOpacity
                onPress={toggleTip}
                activeOpacity={0.7}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <View style={styles.tipToggleRow}>
                  <Ionicons name="bulb-outline" size={13} color="#F59E0B" />
                  <Text style={styles.tipToggle}> Tip</Text>
                </View>
              </TouchableOpacity>
              <Animated.View style={tipAnimStyle}>
                <Text style={styles.tipText}>{task.tip}</Text>
              </Animated.View>
            </View>
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
  tipToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tipToggle: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  tipText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
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
