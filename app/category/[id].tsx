import React from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useQuestStore } from '../../src/store/questStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { DisciplineGroup } from '../../src/components/disciplines/DisciplineGroup';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { PressableScale } from '../../src/components/ui/PressableScale';
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
  const deleteDiscipline = useDisciplineStore((s) => s.deleteDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const handleDeleteDiscipline = (disciplineId: string) => {
    const disc = getDisciplinesForCategory(id ?? '').find((d) => d.id === disciplineId);
    Alert.alert(
      'Remove Discipline',
      `Remove "${disc?.title ?? 'this discipline'}" from your practice?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deleteDiscipline(disciplineId) },
      ]
    );
  };

  if (!character || !id) return null;

  const isBuiltIn = BUILT_IN_IDS.includes(id as CategoryId);

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
      <AuroraBackground />

      {/* Hero section */}
      <LinearGradient
        colors={[color + '40', color + '10', 'transparent']}
        style={styles.hero}
      >
        <PressableScale onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color }]}>← Back</Text>
        </PressableScale>

        <View style={styles.emojiWrap}>
          <LinearGradient
            colors={[color + '50', color + '20']}
            style={styles.emojiCircle}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </LinearGradient>
        </View>

        <Text style={styles.title}>{label}</Text>

        <View style={[styles.levelPill, { backgroundColor: color + '25', borderColor: color + '50' }]}>
          <Text style={[styles.levelPillText, { color }]}>Lv {level}</Text>
        </View>

        <View style={styles.xpBarWrap}>
          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, { width: `${progress * 100}%` as any, backgroundColor: color }]} />
          </View>
          <Text style={styles.xpBarLabel}>
            <AnimatedCounter value={xpData.xp} style={{ color, fontFamily: FONTS.families.body, fontSize: FONTS.sizes.xs }} formatter={(n) => `${n.toLocaleString()} XP`} />{' '}· {xpToNext} to next
          </Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Philosophy card */}
        {profile && (
          <FadeInView delay={100}>
            <GlowCard glowColor={color} style={styles.philosophyCard}>
              <LinearGradient
                colors={[color + '15', 'transparent']}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Text style={styles.philosophyLabel}>Your Philosophy</Text>
              <Text style={styles.philosophyText}>{profile.philosophyStatement}</Text>
              <View style={styles.quoteRow}>
                <View style={[styles.quoteBar, { backgroundColor: color }]} />
                <Text style={styles.quoteText}>{profile.jimRohnQuote}</Text>
              </View>
              <View style={styles.visionRow}>
                <Text style={styles.visionLabel}>Vision</Text>
                <Text style={styles.visionText}>{profile.vision}</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Starting Score</Text>
                <View style={[styles.scoreChip, { backgroundColor: color + '20', borderColor: color + '40' }]}>
                  <Text style={[styles.scoreVal, { color }]}>{profile.currentScore}/10</Text>
                </View>
              </View>
            </GlowCard>
          </FadeInView>
        )}

        {/* Disciplines grouped by frequency */}
        {disciplines.length > 0 && (
          <FadeInView delay={200}>
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
                    onDelete={handleDeleteDiscipline}
                  />
                );
              })}
            </View>
          </FadeInView>
        )}

        {catQuests.length > 0 && (
          <FadeInView delay={300}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            {catQuests.map((q) => (
              <QuestCard key={q.id} quest={q} />
            ))}
          </FadeInView>
        )}

        {/* Forge Disciplines CTA — shown only for built-in categories with no disciplines */}
        {isBuiltIn && disciplines.length === 0 && (
          <FadeInView delay={400}>
            <TouchableOpacity
              style={styles.forgeDisciplinesBtn}
              onPress={() =>
                router.push({
                  pathname: '/category/create',
                  params: {
                    builtinId: id,
                    builtinLabel: label,
                    builtinEmoji: emoji,
                    builtinColor: color,
                  },
                } as any)
              }
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[color + '30', color + '10']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.forgeDisciplinesGradient}
              >
                <Text style={styles.forgeDisciplinesIcon}>✦</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.forgeDisciplinesTitle, { color }]}>
                    Forge Your Disciplines
                  </Text>
                  <Text style={styles.forgeDisciplinesSub}>
                    AI generates Jim Rohn-inspired practices for {label}
                  </Text>
                </View>
                <Text style={[styles.newQuestArrow, { color }]}>›</Text>
              </LinearGradient>
            </TouchableOpacity>
          </FadeInView>
        )}

        {/* Quick Quest CTA */}
        <FadeInView delay={400}>
          <TouchableOpacity
            style={styles.newQuestBtn}
            onPress={() => router.push('/(tabs)/goals' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[color + '30', color + '10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newQuestGradient}
            >
              <Text style={styles.newQuestIcon}>⚔️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.newQuestTitle, { color }]}>Forge a Quest</Text>
                <Text style={styles.newQuestSub}>Use AI to create a {label} quest</Text>
              </View>
              <Text style={[styles.newQuestArrow, { color }]}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        </FadeInView>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  hero: {
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  emojiWrap: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64 },
  title: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  levelPill: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  levelPillText: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 1,
  },
  xpBarWrap: {
    width: '80%',
    gap: SPACING.xs,
    alignItems: 'center',
  },
  xpBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  xpBarLabel: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },

  philosophyCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
    overflow: 'hidden',
  },
  philosophyLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  philosophyText: {
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  quoteBar: {
    width: 3,
    borderRadius: 2,
    minHeight: 40,
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontFamily: FONTS.families.body,
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
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  visionText: {
    fontFamily: FONTS.families.body,
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
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreChip: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  scoreVal: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
  },

  disciplinesSection: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontFamily: FONTS.families.displayMedium,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  newQuestBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  newQuestGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  newQuestIcon: { fontSize: 28 },
  newQuestTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  newQuestSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  newQuestArrow: {
    fontSize: 28,
    fontFamily: FONTS.families.displayLight,
    lineHeight: 30,
  },

  // Forge Disciplines CTA
  forgeDisciplinesBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  forgeDisciplinesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  forgeDisciplinesIcon: {
    fontSize: 28,
    color: '#fff',
  },
  forgeDisciplinesTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  forgeDisciplinesSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
