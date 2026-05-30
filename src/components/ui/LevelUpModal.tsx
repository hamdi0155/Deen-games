import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS, SPRING, DURATION } from '../../constants/theme';
import { ParticleBurst } from './ParticleBurst';
import { haptic } from '../../services/haptics';

interface Props {
  visible: boolean;
  level: number;
  categoryName: string;
  categoryEmoji: string;
  color: string;
  rankUp?: boolean;
  newRank?: string;
  onDismiss: () => void;
}

function getRankUpPhrase(rank: string) {
  return `You have ascended to ${rank}.`;
}

function getLevelPhrase(categoryName: string, level: number) {
  if (level <= 3) return `Your ${categoryName} journey deepens.`;
  if (level <= 7) return `The path of ${categoryName} reveals itself.`;
  if (level <= 15) return `${categoryName} mastery flows through you.`;
  return `You are a ${categoryName} legend.`;
}

export function LevelUpModal({
  visible,
  level,
  categoryName,
  categoryEmoji,
  color,
  rankUp,
  newRank,
  onDismiss,
}: Props) {
  const bgOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.2);
  const ringOpacity = useSharedValue(0);
  const levelScale = useSharedValue(0.3);
  const levelOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const emojiScale = useSharedValue(0.5);

  useEffect(() => {
    if (!visible) return;

    haptic.heavy();

    const ease = Easing.out(Easing.cubic);

    bgOpacity.value = withTiming(1, { duration: DURATION.standard });

    emojiScale.value = withDelay(200,
      withSpring(1, SPRING.luxe)
    );

    ringScale.value = withDelay(300,
      withSequence(
        withTiming(1, { duration: DURATION.scene, easing: ease }),
        withTiming(0.92, { duration: DURATION.fast }),
        withTiming(1, { duration: DURATION.fast }),
      )
    );
    ringOpacity.value = withDelay(300, withTiming(1, { duration: DURATION.standard }));

    levelScale.value = withDelay(500,
      withSpring(1, SPRING.luxe)
    );
    levelOpacity.value = withDelay(500, withTiming(1, { duration: DURATION.standard }));

    textOpacity.value = withDelay(800, withTiming(1, { duration: DURATION.standard }));
    btnOpacity.value = withDelay(1100, withTiming(1, { duration: DURATION.standard }));
  }, [visible]);

  const handleDismiss = () => {
    bgOpacity.value = withTiming(0, { duration: 250 });
    setTimeout(onDismiss, 260);
  };

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const levelStyle = useAnimatedStyle(() => ({
    opacity: levelOpacity.value,
    transform: [{ scale: levelScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));
  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      <Animated.View style={[styles.overlay, bgStyle]}>
        <LinearGradient
          colors={[color + '30', color + '12', 'rgba(5,5,8,0.97)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Particle burst at center */}
        <View style={styles.particleAnchor}>
          {visible && <ParticleBurst color={color} count={20} />}
        </View>

        <View style={styles.content}>
          {/* Tag */}
          <Animated.View style={[styles.tagWrap, textStyle]}>
            <Text style={[styles.tag, { color: COLORS.gold }]}>✦ LEVEL UP ✦</Text>
          </Animated.View>

          {/* Emoji in ring */}
          <View style={styles.ringWrap}>
            <Animated.View
              style={[
                styles.outerRing,
                { borderColor: COLORS.gold + '30' },
                ringStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.innerRing,
                { borderColor: COLORS.gold + '60' },
                ringStyle,
              ]}
            />
            <LinearGradient
              colors={[color + '28', color + '0A']}
              style={styles.emojiContainer}
            >
              <Animated.Text style={[styles.emoji, emojiStyle]}>
                {categoryEmoji}
              </Animated.Text>
            </LinearGradient>
          </View>

          {/* Level number */}
          <Animated.View style={[styles.levelWrap, levelStyle]}>
            <Text style={[styles.levelNum, { color: COLORS.gold, shadowColor: COLORS.gold }]}>{level}</Text>
            <Text style={styles.levelLabel}>Level {level}</Text>
          </Animated.View>

          {/* Category + phrase */}
          <Animated.View style={[styles.textBlock, textStyle]}>
            <Text style={styles.catName}>{categoryName}</Text>
            <Text style={styles.phrase}>
              {rankUp && newRank
                ? 'You are becoming'
                : getLevelPhrase(categoryName, level)}
            </Text>
            {rankUp && newRank && (
              <View style={[styles.rankPill, { borderColor: COLORS.gold + '60', backgroundColor: COLORS.goldDim }]}>
                <Ionicons name="star" size={16} color={COLORS.gold} />
                <Text style={[styles.rankText, { color: COLORS.gold }]}>{newRank}</Text>
                <Ionicons name="star" size={16} color={COLORS.gold} />
              </View>
            )}
          </Animated.View>

          {/* Dismiss */}
          <Animated.View style={btnStyle}>
            <TouchableOpacity onPress={handleDismiss} activeOpacity={0.8}>
              <LinearGradient
                colors={[color, color + 'BB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Continue the Path</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,5,8,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particleAnchor: {
    position: 'absolute',
    top: '42%',
    left: '50%',
    width: 0,
    height: 0,
  },
  content: {
    alignItems: 'center',
    gap: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
  },
  tagWrap: {},
  tag: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 4,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
  },
  outerRing: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 87.5,
    borderWidth: 1,
  },
  innerRing: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1.5,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 52 },
  levelWrap: { alignItems: 'center', gap: 4 },
  levelNum: {
    fontSize: 42,
    fontFamily: FONTS.families.displayBold,
    lineHeight: 50,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  levelLabel: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  textBlock: { alignItems: 'center', gap: SPACING.sm },
  catName: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.8,
  },
  phrase: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  rankText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.display,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  btn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.display,
    letterSpacing: 1,
  },
});
