import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../icons/AscendIcon';
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

const ROHN_QUOTES = [
  "Success is nothing more than a few simple disciplines, practiced every day.",
  "Don't wish it was easier, wish you were better.",
  "You cannot change your destination overnight, but you can change your direction overnight.",
  "Discipline is the bridge between goals and accomplishment.",
  "We must all suffer one of two things: the pain of discipline or the pain of regret.",
  "The few who do are the envy of the many who only watch.",
  "Work harder on yourself than you do on your job.",
];

function getMilestoneQuote(level: number): string | null {
  if (level === 5 || level === 10 || level === 20 || level % 25 === 0) {
    return ROHN_QUOTES[level % ROHN_QUOTES.length];
  }
  return null;
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
  const shockwaveScale = useSharedValue(0.5);
  const shockwaveOpacity = useSharedValue(0);

  const milestoneQuote = getMilestoneQuote(level);

  useEffect(() => {
    if (!visible) return;

    haptic.heavy();

    const ease = Easing.out(Easing.cubic);

    bgOpacity.value = withTiming(1, { duration: DURATION.standard });

    // Shockwave pulse
    shockwaveOpacity.value = withTiming(0.6, { duration: 100 });
    shockwaveScale.value = withTiming(2.5, { duration: 700, easing: Easing.out(Easing.quad) });
    shockwaveOpacity.value = withDelay(200, withTiming(0, { duration: 500 }));

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
  const shockwaveStyle = useAnimatedStyle(() => ({
    opacity: shockwaveOpacity.value,
    transform: [{ scale: shockwaveScale.value }],
  }));
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

        {/* Shockwave ring */}
        <View style={styles.particleAnchor}>
          <Animated.View
            style={[
              styles.shockwave,
              { borderColor: color },
              shockwaveStyle,
            ]}
          />
        </View>

        {/* Particle burst at center */}
        <View style={styles.particleAnchor}>
          {visible && <ParticleBurst color={color} count={24} />}
        </View>

        <View style={styles.content}>
          {/* Tag */}
          <Animated.View style={[styles.tagWrap, textStyle]}>
            <Text style={[styles.tag, { color: COLORS.gold }]}>Level Up</Text>
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
                <AscendIcon name="star" size={16} color={COLORS.gold} filled />
                <Text style={[styles.rankText, { color: COLORS.gold }]}>{newRank}</Text>
                <AscendIcon name="star" size={16} color={COLORS.gold} filled />
              </View>
            )}
            {milestoneQuote && (
              <View style={styles.quoteBox}>
                <Text style={styles.quoteMark}>"</Text>
                <Text style={styles.quoteText}>{milestoneQuote}</Text>
                <Text style={styles.quoteSig}>— Jim Rohn</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  shockwave: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    marginLeft: -80,
    marginTop: -80,
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
    letterSpacing: 1,
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
  quoteBox: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.lg,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.gold,
    gap: 4,
    maxWidth: 280,
  },
  quoteMark: {
    fontSize: 24,
    color: COLORS.gold,
    fontFamily: FONTS.families.displayBold,
    lineHeight: 20,
    marginBottom: -4,
  },
  quoteText: {
    fontSize: 12,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  quoteSig: {
    fontSize: 10,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.gold,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
