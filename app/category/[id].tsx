import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useQuestStore } from '../../src/store/questStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { DisciplineGroup } from '../../src/components/disciplines/DisciplineGroup';
import { xpProgress } from '../../src/services/xpService';
import { CategoryId, DisciplineFrequency } from '../../src/types';
import { COLORS, FONTS, SPACING, CATEGORY_COLORS } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

const BUILT_IN_IDS: CategoryId[] = [
  'education', 'career', 'finance', 'physical', 'appearance',
  'mental', 'social', 'relationships', 'discipline', 'spiritual',
  'creativity', 'leadership',
];

const DISC_FREQ_ORDER: DisciplineFrequency[] = ['daily', 'weekdays', 'weekly', 'monthly'];

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const quests = useQuestStore((s) => s.quests);

  const getDisciplinesForCategory = useDisciplineStore((s) => s.getDisciplinesForCategory);
  const getProfileForCategory = useDisciplineStore((s) => s.getProfileForCategory);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  if (!character || !id) return null;

  const isBuiltIn = BUILT_IN_IDS.includes(id as CategoryId);

  // Resolve category display info
  let emoji = '⚔️';
  let label = id;
  let color: string = COLORS.accent;
  let xpData = { xp: 0, level: 0 };

  if (isBuiltIn) {
    const catId = id as CategoryId;
    const cat = character.categories[catId];
    const meta = CATEGORY_META.find((c) => c.id === catId);
    emoji = meta?.emoji ?? '⚔️';
    label = meta?.label ?? catId;
    color = CATEGORY_COLORS[catId] ?? COLORS.accent;
    xpData = { xp: cat.xp, level: cat.level };
  } else {
    const customCat = customCategories.find((c) => c.id === id);
    if (customCat) {
      emoji = customCat.emoji;
      label = customCat.label;
      color = customCat.color;
    }
    const xpEntry = customCategoryXP[id];
    if (xpEntry) {
      xpData = xpEntry;
    }
  }

  const { level, progress, xpToNext } = xpProgress(xpData.xp);
  const catQuests = quests.filter(
    (q) => q.categoryId === (id as CategoryId) && q.status === 'active'
  );

  const disciplines = getDisciplinesForCategory(id);
  const profile = getProfileForCategory(id);

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={[styles.levelText, { color }]}>Lv {level}</Text>
        </View>
        <Text style={styles.title}>{label}</Text>

        <GlowCard glowColor={color} style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Experience</Text>
            <Text style={[styles.xpVal, { color }]}>{xpData.xp} XP</Text>
          </View>
          <XPBar progress={progress} color={color} height={10} />
          <Text style={styles.xpNext}>
            {xpToNext} XP to level {level + 1}
          </Text>
        </GlowCard>

        {/* Philosophy + Quote from AI */}
        {profile && (
          <GlowCard glowColor={color} style={styles.philosophyCard}>
            <Text style={styles.philosophyLabel}>Your Philosophy</Text>
            <Text style={styles.philosophyText}>{profile.philosophyStatement}</Text>
            <View style={styles.quoteRow}>
              <Text style={[styles.quoteBar, { color }]}>|</Text>
              <Text style={styles.quoteText}>{profile.jimRohnQuote}</Text>
            </View>
            <View style={styles.visionRow}>
              <Text style={styles.visionLabel}>Vision</Text>
              <Text style={styles.visionText}>{profile.vision}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Starting Score</Text>
              <Text style={[styles.scoreVal, { color }]}>
                {profile.currentScore}/10
              </Text>
            </View>
          </GlowCard>
        )}

        {/* Disciplines grouped by frequency */}
        {disciplines.length > 0 && (
          <View style={styles.disciplinesSection}>
            <Text style={styles.sectionTitle}>Disciplines</Text>
            {DISC_FREQ_ORDER.map((freq) => {
              const group = disciplines.filter((d) => d.frequency === freq);
              return (
                <DisciplineGroup
                  key={freq}
                  frequency={freq}
                  disciplines={group}
                  categoryColor={color}
                  onComplete={completeDiscipline}
                />
              );
            })}
          </View>
        )}

        {catQuests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            {catQuests.map((q) => (
              <QuestCard key={q.id} quest={q} />
            ))}
          </>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  back: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  backText: { color: COLORS.accent, fontSize: FONTS.sizes.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  emoji: { fontSize: 48 },
  levelText: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.bold },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  xpCard: { marginHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.xl },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  xpVal: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  xpNext: { fontSize: FONTS.sizes.xs, color: COLORS.textDim },

  philosophyCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  philosophyLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: FONTS.weights.bold,
  },
  philosophyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
    fontWeight: FONTS.weights.semibold,
  },
  quoteRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  quoteBar: { fontSize: FONTS.sizes.xl },
  quoteText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textDim,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  visionRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: SPACING.md,
    gap: SPACING.xs,
  },
  visionLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: FONTS.weights.bold,
  },
  visionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreVal: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },

  disciplinesSection: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    fontWeight: FONTS.weights.bold,
  },
});
