import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDisciplineStore } from '../src/store/disciplineStore';
import { DisciplineCard } from '../src/components/disciplines/DisciplineCard';
import { AddDisciplineSheet } from '../src/components/disciplines/AddDisciplineSheet';
import { FadeInView } from '../src/components/ui/FadeInView';
import { XPToast } from '../src/components/ui/XPToast';
import { LevelUpModal } from '../src/components/ui/LevelUpModal';
import { CATEGORY_COLORS, COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';
import { CATEGORY_META } from '../src/constants/categories';
import { DisciplineFrequency } from '../src/types';

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
      <LinearGradient
        colors={['rgba(249,115,22,0.12)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
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
              <Ionicons name="add" size={14} color="#fff" />
              <Text style={styles.newBtnText}>New</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={styles.heading}>All Disciplines</Text>
          <Text style={styles.subheading}>Your forge of discipline</Text>
        </View>
      </LinearGradient>

      {/* Stats bar */}
      {disciplines.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statsCell}>
            <Text style={styles.statsValue}>{disciplines.length}</Text>
            <Text style={styles.statsLabel}>Total</Text>
          </View>
          <View style={styles.statsSep} />
          <View style={styles.statsCell}>
            <Text style={styles.statsValue}>{totalCompletions}</Text>
            <Text style={styles.statsLabel}>Completions</Text>
          </View>
          <View style={styles.statsSep} />
          <View style={styles.statsCell}>
            <Text style={[styles.statsValue, { color: '#F97316' }]}>🔥 {bestStreak}</Text>
            <Text style={styles.statsLabel}>Best Streak</Text>
          </View>
        </View>
      )}

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
              <Ionicons name="hammer-outline" size={36} color="#F97316" />
            </View>
            <Text style={styles.emptyTitle}>No Disciplines Forged</Text>
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
                <Ionicons name="hammer-outline" size={16} color="#fff" />
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
                {/* Section header */}
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: FREQ_COLORS[freq] }]}>
                    {FREQ_LABELS[freq]}
                  </Text>
                  <View style={[styles.countBadge, { backgroundColor: `${FREQ_COLORS[freq]}22`, borderColor: `${FREQ_COLORS[freq]}44` }]}>
                    <Text style={[styles.countText, { color: FREQ_COLORS[freq] }]}>
                      {group.length}
                    </Text>
                  </View>
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
        categoryEmoji={levelUpMeta?.emoji ?? '⭐'}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerGradient: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
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
  backArrow: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.bodyBold,
    lineHeight: 22,
  },
  backText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.body,
  },
  headerTextBlock: {
    gap: 4,
    marginTop: SPACING.xs,
  },
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(249,115,22,0.06)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.15)',
    paddingVertical: SPACING.md,
  },
  statsCell: { flex: 1, alignItems: 'center', gap: 2 },
  statsSep: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 4 },
  statsValue: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  statsLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scrollContent: { paddingTop: SPACING.sm, paddingBottom: 100 },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.families.display,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  countBadge: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyBold,
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
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(249,115,22,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249,115,22,0.08)',
    shadowColor: '#F97316',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyAddBtn: { marginTop: SPACING.sm },
  emptyAddGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  emptyAddText: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
