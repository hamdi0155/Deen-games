import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

const QUOTES = [
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'Your life does not get better by chance. It gets better by change.', author: 'Jim Rohn' },
  { text: 'The secret of your future is hidden in your daily routine.', author: 'Jim Rohn' },
  { text: 'Success is nothing more than a few simple disciplines, practiced every day.', author: 'Jim Rohn' },
  { text: 'Don\'t wish it were easier. Wish you were better.', author: 'Jim Rohn' },
  { text: 'We must all suffer one of two things: the pain of discipline or the pain of regret.', author: 'Jim Rohn' },
  { text: 'Motivation is what gets you started. Habit is what keeps you going.', author: 'Jim Rohn' },
  { text: 'For things to change, you must change.', author: 'Jim Rohn' },
  { text: 'Take care of your body. It\'s the only place you have to live.', author: 'Jim Rohn' },
  { text: 'Formal education will make you a living; self-education will make you a fortune.', author: 'Jim Rohn' },
  { text: 'The biggest room in the world is the room for self-improvement.', author: 'Jim Rohn' },
  { text: 'Either you run the day or the day runs you.', author: 'Jim Rohn' },
  { text: 'If you don\'t design your own life plan, chances are you\'ll fall into someone else\'s plan.', author: 'Jim Rohn' },
  { text: 'Reasons come first, answers come second.', author: 'Jim Rohn' },
  { text: 'Work harder on yourself than you do on your job.', author: 'Jim Rohn' },
  { text: 'You are the average of the five people you spend the most time with.', author: 'Jim Rohn' },
  { text: 'Small disciplines repeated with consistency every day lead to great achievement.', author: 'Jim Rohn' },
  { text: 'Don\'t major in minor things.', author: 'Jim Rohn' },
  { text: 'A life best lived is a life by design.', author: 'Jim Rohn' },
  { text: 'Time is more valuable than money. You can get more money, but you cannot get more time.', author: 'Jim Rohn' },
  { text: 'If you really want to do something, you\'ll find a way. If you don\'t, you\'ll find an excuse.', author: 'Jim Rohn' },
];

export function DailyWisdom() {
  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const quote = QUOTES[dayIndex];

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
        <Text style={styles.quote}>"{quote.text}"</Text>
        <Text style={styles.author}>— {quote.author}</Text>
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
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 2,
  },
  quote: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  author: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
