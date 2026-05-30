import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useDisciplineStore } from '../src/store/disciplineStore';
import { DisciplineCard } from '../src/components/disciplines/DisciplineCard';
import { AddDisciplineSheet } from '../src/components/disciplines/AddDisciplineSheet';
import { FadeInView } from '../src/components/ui/FadeInView';
import { XPToast } from '../src/components/ui/XPToast';
import { LevelUpModal } from '../src/components/ui/LevelUpModal';
import { CATEGORY_COLORS, COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';
import { CATEGORY_META } from '../src/constants/categories';
import { DisciplineFrequency } from '../src/types';

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

interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

const FREQUENCY_ORDER: DisciplineFrequency[] = ['daily', 'weekdays', 'weekly', 'monthly'];

const FREQ_LABELS: Record<DisciplineFrequency, string> = {
  daily: 'Daily',
  weekdays: 'Weekdays',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const FREQ_COLORS: Record<DisciplineFrequency, string> = {
  daily: '#10B981',
  weekdays: '#10B981',
  weekly: '#3B82F6',
  monthly: '#8B5CF6',
};

export default function DisciplinesScreen() {
  const router = useRouter();

  const disciplines = useDisciplineStore((s) => s.disciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const deleteDiscipline = useDisciplineStore((s) => s.deleteDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const [toast, setToast] = useState<{ xp: number; color: string; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const headerAnim = useEntranceAnimation(0);
  const statsAnim = useEntranceAnimation(80);
  const listAnim = useEntranceAnimation(160);

  // Stats
  const totalCompletions = disciplines.reduce((sum, d) => sum + d.completions.length, 0);
  const bestStreak = disciplines.reduce((max, d) => Math.max(max, d.longestStreak), 0);

  // Group by frequency
  const grouped = FREQUENCY_ORDER.reduce<Record<DisciplineFrequency, typeof disciplines>>(
    (acc, freq) => {
      acc[freq] = disciplines.filter((d) => d.frequency === freq);
      return acc;
    },
    { daily: [], weekdays: [], weekly: [], monthly: [] }
  );

  const handleComplete = (disciplineId: string) => {
    const result = completeDiscipline(disciplineId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId as keyof typeof CATEGORY_COLORS] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        setLevelUp({
          level: result.newLevel,
          categoryId: result.categoryId,
          rankUp: result.rankUp,
          newRank: result.newRank,
          color: catColor,
        });
      }, 900);
    }
  };

  const handleDelete = (disciplineId: string) => {
    const disc = disciplines.find((d) => d.id === disciplineId);
    if (!disc) return;
    Alert.alert(
      'Delete Discipline',
      `Are you sure you want to delete "${disc.title}"? Your streak will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDiscipline(disciplineId),
        },
      ]
    );
  };

  const handleAdd = (discipline: {
    title: string;
    categoryId: string;
    frequency: DisciplineFrequency;
    xpReward: number;
  }) => {
    useDisciplineStore.getState().addSingleDiscipline({
      title: discipline.title,
      categoryId: discipline.categoryId,
      frequency: discipline.frequency,
      xpReward: discipline.xpReward,
      description: '',
      estimatedMinutes: 15,
    });
  };

  const levelUpMeta = levelUp
    ? CATEGORY_META.find((m) => m.id === levelUp.categoryId)
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header gradient */}
      <Animated.View style={headerAnim}>
      <LinearGradient
        colors={['rgba(249,115,22,0.12)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <AscendIcon name="chevron-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Disciplines</Text>
          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newBtn}
            >
              <AscendIcon name="plus" size={14} color="#fff" />
              <Text style={styles.newBtnText}>New</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={styles.subheading}>All disciplines across your life domains.</Text>
        </View>
      </LinearGradient>
      </Animated.View>

      {/* Quick Stats */}
      {disciplines.length > 0 && (
        <Animated.View style={statsAnim}>
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{totalCompletions}</Text>
            <Text style={styles.quickStatLabel}>Completions</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: COLORS.warning }]}>{bestStreak}</Text>
            <Text style={styles.quickStatLabel}>Best Streak</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{disciplines.filter(d => d.isCompletedToday).length}/{disciplines.length}</Text>
            <Text style={styles.quickStatLabel}>Today</Text>
          </View>
        </View>
        </Animated.View>
      )}

      <Animated.View style={[listAnim, { flex: 1 }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {disciplines.length === 0 ? (
          <LinearGradient
            colors={['rgba(249,115,22,0.08)', 'transparent']}
            style={styles.emptyContainer}
          >
            <View style={styles.emptyRing}>
              <AscendIcon name="build" size={36} color="#F97316" />
            </View>
            <Text style={styles.emptyTitle}>No Practices Yet</Text>
            <Text style={styles.emptySub}>
              Disciplines are the pillars of who you are becoming.
            </Text>
            <TouchableOpacity
              onPress={() => setShowAdd(true)}
              activeOpacity={0.8}
              style={styles.emptyAddBtn}
            >
              <LinearGradient
                colors={['#F97316', '#EA580C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyAddGradient}
              >
                <AscendIcon name="build" size={16} color="#fff" />
                <Text style={styles.emptyAddText}>Add Manually</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          FREQUENCY_ORDER.map((freq) => {
            const group = grouped[freq];
            if (group.length === 0) return null;
            return (
              <View key={freq} style={styles.section}>
                {/* Frequency header */}
                <View style={styles.freqHeader}>
                  <View style={[styles.freqDot, { backgroundColor: FREQ_COLORS[freq] }]} />
                  <Text style={[styles.freqLabel, { color: FREQ_COLORS[freq] }]}>{FREQ_LABELS[freq]}</Text>
                  <Text style={styles.freqCount}>{group.length}</Text>
                </View>

                {/* Cards */}
                {group.map((disc, index) => {
                  const customCat = customCategories.find((c) => c.id === disc.categoryId);
                  const color = CATEGORY_COLORS[disc.categoryId] ?? customCat?.color ?? COLORS.accent;
                  return (
                    <FadeInView key={disc.id} delay={index * 50}>
                      <DisciplineCard
                        discipline={disc}
                        categoryColor={color}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                      />
                    </FadeInView>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>

      {toast !== null && (
        <XPToast
          key={toast.key}
          xp={toast.xp}
          color={toast.color}
          onDone={() => setToast(null)}
        />
      )}

      <LevelUpModal
        visible={levelUp !== null}
        level={levelUp?.level ?? 0}
        categoryName={levelUpMeta?.label ?? 'Unknown'}
        categoryId={levelUp?.categoryId ?? ''}
        color={levelUp?.color ?? COLORS.accent}
        rankUp={levelUp?.rankUp}
        newRank={levelUp?.newRank}
        onDismiss={() => setLevelUp(null)}
      />

      <AddDisciplineSheet
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerGradient: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  screenTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 1,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  newBtnText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.sm,
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerTextBlock: {
    gap: 4,
    paddingHorizontal: SPACING.lg,
  },
  subheading: {
    fontSize: 13,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  quickStat: { flex: 1, alignItems: 'center', gap: 3 },
  quickStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)' },
  quickStatValue: {
    fontSize: 22,
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
  scrollContent: { paddingTop: SPACING.sm, paddingBottom: 100 },
  section: { marginBottom: SPACING.xl },
  freqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  freqDot: { width: 6, height: 6, borderRadius: 3 },
  freqLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 1,
    flex: 1,
  },
  freqCount: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textDim,
  },
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
    fontFamily: FONTS.families.display,
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
  emptyAddBtn: {
    marginTop: SPACING.sm,
    alignSelf: 'stretch',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#F97316',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyAddGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 48,
    paddingHorizontal: SPACING.xl,
  },
  emptyAddText: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.md,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
