import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../../src/components/icons/AscendIcon';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { AddHabitSheet } from '../../src/components/habits/AddHabitSheet';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { useHabitsScreen } from '../../src/hooks/useHabitsScreen';

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 28, stiffness: 150 }));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();

  const {
    habits,
    todayHabits,
    todayDone,
    longestActiveStreak,
    totalCompletions,
    showAdd,
    editingHabit,
    streakMilestone,
    handleLongPressHabit,
    handleAdd,
    handleUpdate,
    handleSheetClose,
    setShowAdd,
    setStreakMilestone,
    completeHabit,
  } = useHabitsScreen();

  const headerAnim = useEntranceAnimation(0);
  const statsAnim = useEntranceAnimation(80);
  const listAnim = useEntranceAnimation(160);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <AuroraBackground />

      <Animated.View style={headerAnim}>
        {/* Flame gradient strip at very top */}
        <LinearGradient
          colors={['rgba(249,115,22,0.18)', 'rgba(249,115,22,0.06)', 'transparent']}
          style={styles.flameStrip}
          pointerEvents="none"
        />
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>DAILY</Text>
            <Text style={styles.heading}>Rituals</Text>
          </View>
          {habits.length > 0 && (
            <View style={styles.completionPill}>
              <AscendIcon name="flame" size={11} color="#F97316" filled={true} />
              <Text style={styles.completionPillText}>{todayDone}/{todayHabits.length} today</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {habits.length > 0 && (
        <Animated.View style={statsAnim}>
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <AscendIcon name="flame" size={14} color="#F97316" filled={true} />
              <Text style={styles.quickStatValue}>{longestActiveStreak}</Text>
              <Text style={styles.quickStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <AscendIcon name="flash" size={14} color={COLORS.accent} />
              <Text style={styles.quickStatValue}>{totalCompletions}</Text>
              <Text style={styles.quickStatLabel}>Total Reps</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <AscendIcon name="check-circle" size={14} color={COLORS.success} filled={true} />
              <Text style={styles.quickStatValue}>{todayDone}/{todayHabits.length}</Text>
              <Text style={styles.quickStatLabel}>Today</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[{ flex: 1 }, listAnim]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_OFFSET + insets.bottom }]}
      >
        {habits.length === 0 ? (
          <LinearGradient
            colors={['rgba(249,115,22,0.08)', 'transparent']}
            style={styles.emptyContainer}
          >
            <View style={styles.emptyRing}>
              <AscendIcon name="habits" size={36} color="#F97316" />
            </View>
            <Text style={styles.emptyTitle}>No Rituals Yet</Text>
            <Text style={styles.emptySub}>
              Build daily rituals that compound into mastery.
            </Text>
            <TouchableOpacity
              onPress={() => setShowAdd(true)}
              activeOpacity={0.85}
              style={styles.emptyBtn}
            >
              <LinearGradient
                colors={['#F97316', '#EA580C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyBtnGradient}
              >
                <Text style={styles.emptyBtnText}>Forge First Habit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          habits.map((h, index) => (
            <FadeInView key={h.id} delay={index * 60}>
              <HabitCard
                habit={h}
                onComplete={completeHabit}
                onLongPress={() => handleLongPressHabit(h)}
                onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
              />
            </FadeInView>
          ))
        )}
      </ScrollView>
      </Animated.View>

      {/* FAB — bottom-right orange gradient circle */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAdd(true)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#F97316', '#EA580C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      <AddHabitSheet
        visible={showAdd}
        onClose={handleSheetClose}
        onAdd={handleAdd}
        editHabit={editingHabit ?? undefined}
        onUpdate={handleUpdate}
      />

      <StreakMilestoneModal
        visible={streakMilestone !== null}
        streakDays={streakMilestone?.days ?? 0}
        habitTitle={streakMilestone?.title ?? ''}
        color="#F97316"
        onDismiss={() => setStreakMilestone(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flameStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  eyebrow: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: '#F97316',
    letterSpacing: 3,
    marginBottom: 2,
  },
  heading: {
    fontSize: 28,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  completionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.25)',
  },
  completionPillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: '#F97316',
    letterSpacing: 0.5,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: TAB_BAR_OFFSET - 10,
    right: SPACING.lg,
    zIndex: 50,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    shadowColor: '#F97316',
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  fabGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    fontFamily: FONTS.families.displayLight,
    lineHeight: 32,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  quickStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  quickStatValue: {
    fontSize: 18,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  quickStatLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  list: { paddingTop: SPACING.sm },
  emptyContainer: {
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: 24,
    padding: SPACING.xl,
    margin: SPACING.lg,
    marginTop: 40,
  },
  emptyRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#F97316' + '30',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316' + '15',
    shadowColor: '#F97316',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    shadowColor: '#F97316',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    alignSelf: 'stretch',
  },
  emptyBtnGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyBtnText: {
    color: '#fff',
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.8,
  },
});
