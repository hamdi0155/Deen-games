import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  visible: boolean;
  message: string;
  subtext?: string;
  color: string;
  icon?: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function NotificationBanner({
  visible,
  message,
  subtext,
  color,
  icon,
  onDismiss,
  autoDismissMs = 3000,
}: Props) {
  const translateY = useSharedValue(-80);

  const animateIn = () => {
    translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
  };

  const animateOut = (callback?: () => void) => {
    translateY.value = withTiming(-80, { duration: 280 });
    setTimeout(() => callback?.(), 290);
  };

  useEffect(() => {
    if (!visible) return;

    animateIn();

    const timer = setTimeout(() => {
      animateOut(onDismiss);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [visible]);

  const handleClose = () => {
    animateOut(onDismiss);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { borderColor: color + '50', shadowColor: color }, animStyle]}>
      <View style={styles.row}>
        {icon ? (
          <Text style={styles.icon}>{icon}</Text>
        ) : null}
        <View style={styles.textBlock}>
          <Text style={styles.message} numberOfLines={1}>{message}</Text>
          {subtext ? (
            <Text style={styles.subtext} numberOfLines={1}>{subtext}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  icon: {
    fontSize: 22,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  subtext: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
});
