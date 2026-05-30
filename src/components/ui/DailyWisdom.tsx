import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { useAchievementStore } from '../../store/achievementStore';

const QUOTES = [
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { text: 'The secret of your future is hidden in your daily routine.', author: 'Jim Rohn' },
  { text: 'First say to yourself what you would be; and then do what you have to do.', author: 'Epictetus' },
  { text: 'Don\'t wish it were easier. Wish you were better.', author: 'Jim Rohn' },
  { text: 'The quality of a person\'s life is in direct proportion to their commitment to excellence.', author: 'Vince Lombardi' },
  { text: 'It is not death that a man should fear, but he should fear never beginning to live.', author: 'Marcus Aurelius' },
  { text: 'For things to change, you must change.', author: 'Jim Rohn' },
  { text: 'You have power over your mind, not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' },
  { text: 'Waste no more time arguing about what a good person should be. Be one.', author: 'Marcus Aurelius' },
  { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'Either you run the day or the day runs you.', author: 'Jim Rohn' },
  { text: 'We must all suffer one of two things: the pain of discipline or the pain of regret.', author: 'Jim Rohn' },
  { text: 'Mastery is not a function of genius or talent. It is a function of time and intense focus.', author: 'Robert Greene' },
  { text: 'Work harder on yourself than you do on your job.', author: 'Jim Rohn' },
  { text: 'The successful warrior is the average man, with laser-like focus.', author: 'Bruce Lee' },
  { text: 'Small disciplines repeated with consistency every day lead to great achievement.', author: 'Jim Rohn' },
  { text: 'Do not wait to strike till the iron is hot, but make it hot by striking.', author: 'William Butler Yeats' },
  { text: 'A life best lived is a life by design.', author: 'Jim Rohn' },
  { text: 'He who conquers himself is the mightiest warrior.', author: 'Confucius' },
  { text: 'If you really want to do something, you\'ll find a way. If you don\'t, you\'ll find an excuse.', author: 'Jim Rohn' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates' },
  { text: 'No man is free who is not master of himself.', author: 'Epictetus' },
  { text: 'Time is more valuable than money. You can get more money, but you cannot get more time.', author: 'Jim Rohn' },
  { text: 'Knowing is not enough; we must apply. Willing is not enough; we must do.', author: 'Goethe' },
  { text: 'A year from now you will wish you had started today.', author: 'Karen Lamb' },
  { text: 'Man\'s mind, once stretched by a new idea, never regains its original dimensions.', author: 'Oliver Wendell Holmes' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'What you do every day matters more than what you do once in a while.', author: 'Gretchen Rubin' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'You are the average of the five people you spend the most time with.', author: 'Jim Rohn' },
];

export function DailyWisdom() {
  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const quote = QUOTES[dayIndex];
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    checkAndUnlock('first_wisdom');
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(99,102,241,0.10)', 'rgba(124,58,237,0.05)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.accentLine} />
        <Text style={styles.label}>Daily Wisdom</Text>
        <Animated.View style={animStyle}>
          <Text style={styles.quote}>"{quote.text}"</Text>
          <Text style={styles.author}>— {quote.author}</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.18)',
    padding: SPACING.md,
    paddingLeft: SPACING.lg,
    gap: SPACING.xs,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: SPACING.md,
    bottom: SPACING.md,
    width: 3,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 2,
  },
  quote: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  author: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
