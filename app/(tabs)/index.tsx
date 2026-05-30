import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useHabitStore } from '../../src/store/habitStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { CharacterHeader } from '../../src/components/character/CharacterHeader';
import { CategoryGrid } from '../../src/components/character/CategoryGrid';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { DisciplineCard } from '../../src/components/disciplines/DisciplineCard';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { TodayCard } from '../../src/components/ui/TodayCard';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { LevelUpModal } from '../../src/components/ui/LevelUpModal';
import { StreakMilestoneModal } from '../../src/components/ui/StreakMilestoneModal';
import { XPToast } from '../../src/components/ui/XPToast';
import { useQuestStore } from '../../src/store/questStore';
import { CATEGORY_META } from '../../src/constants/categories';
import { CATEGORY_COLORS, COLORS, FONTS, SPACING, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { DailyWisdom } from '../../src/components/ui/DailyWisdom';

interface LevelUpState {
  level: number;
  categoryId: string;
  rankUp: boolean;
  newRank: string;
  color: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);

  const getTodaysDisciplines = useDisciplineStore((s) => s.getTodaysDisciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);

  const todaysHabits = getTodaysHabits();
  const todaysDisciplines = getTodaysDisciplines();
  const recentQuests = getActiveQuests().slice(0, 3);

  const [toast, setToast] = useState<{ xp: number; color: string; key: number } | null>(null);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [streakMilestone, setStreakMilestone] = useState<{ days: number; title: string } | null>(null);
  const [streakMilestoneColor] = useState('#F97316');

  if (!character) return null;

  const categories = Object.values(character.categories);

  // Compute longest active streak across all habits
  const longestStreak = todaysHabits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const habitsDone = todaysHabits.filter((h) => h.isCompletedToday).length;
  const disciplinesDone = todaysDisciplines.filter((d) => d.isCompletedToday).length;

  const handleCompleteHabit = (habitId: string) => {
    const result = completeHabit(habitId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        const meta = CATEGORY_META.find((m) => m.id === result.categoryId);
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

  const handleCompleteDiscipline = (disciplineId: string) => {
    const result = completeDiscipline(disciplineId);
    if (!result) return;
    const catColor = CATEGORY_COLORS[result.categoryId as keyof typeof CATEGORY_COLORS] ?? COLORS.accent;
    setToast({ xp: result.xpGained, color: catColor, key: Date.now() });
    if (result.leveledUp) {
      setTimeout(() => {
        const meta = CATEGORY_META.find((m) => m.id === result.categoryId);
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

  const levelUpMeta = levelUp
    ? CATEGORY_META.find((m) => m.id === levelUp.categoryId)
    : null;

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        <CharacterHeader
          name={character.name}
          avatarEmoji={character.avatarEmoji}
          overallLevel={character.overallLevel}
          totalXP={character.totalXP}
          lifeRank={character.lifeRank}
        />

        {/* Daily Wisdom */}
        <DailyWisdom />

        {/* Today's Mission card */}
        <TodayCard
          habitsTotal={todaysHabits.length}
          habitsDone={habitsDone}
          disciplinesTotal={todaysDisciplines.length}
          disciplinesDone={disciplinesDone}
          streakDays={longestStreak}
        />

        {/* Legend Status Banner — shown when all today's tasks are done */}
        {(todaysHabits.length + todaysDisciplines.length) > 0 &&
          habitsDone + disciplinesDone === todaysHabits.length + todaysDisciplines.length && (
          <FadeInView delay={0}>
            <LinearGradient
              colors={['rgba(16,185,129,0.18)', 'rgba(16,185,129,0.06)', 'transparent']}
              style={styles.missionBanner}
            >
              <Text style={styles.missionBannerEmoji}>🏆</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.missionBannerTitle}>Legend Status</Text>
                <Text style={styles.missionBannerSub}>All missions complete. Jim Rohn would be proud.</Text>
              </View>
            </LinearGradient>
          </FadeInView>
        )}

        {/* Life Categories */}
        <Text style={styles.sectionTitle}>Life Categories</Text>
        <CategoryGrid categories={categories} />

        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>
              Custom Domains
            </Text>
            <View style={styles.customCatRow}>
              {customCategories.map((cat) => {
                const xpEntry = customCategoryXP[cat.id] ?? { xp: 0, level: 0 };
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.customCatCell}
                    onPress={() => router.push(`/category/${cat.id}` as any)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.customCatCard,
                        {
                          shadowColor: cat.color,
                          shadowOpacity: 0.3,
                          shadowRadius: 16,
                          shadowOffset: { width: 0, height: 4 },
                          elevation: 8,
                          borderColor: `${cat.color}28`,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={[cat.color, cat.color + '00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.customCatAccent}
                      />
                      <View style={styles.customCatInner}>
                        <Text style={styles.customCatEmoji}>{cat.emoji}</Text>
                        <Text style={styles.customCatLabel} numberOfLines={1}>
                          {cat.label}
                        </Text>
                        <Text style={[styles.customCatLevel, { color: cat.color }]}>
                          Lv {xpEntry.level}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Add Category button */}
        <TouchableOpacity
          style={styles.addCatBtn}
          onPress={() => router.push('/category/create' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.addCatPlus}>+</Text>
          <Text style={styles.addCatText}>Add Category</Text>
        </TouchableOpacity>

        {/* Active Quests preview */}
        {recentQuests.length > 0 && (
          <FadeInView delay={100}>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
              Active Quests
            </Text>
            {recentQuests.map((q) => (
              <QuestCard key={q.id} quest={q} compact />
            ))}
          </FadeInView>
        )}

        {/* Today's Habits */}
        {todaysHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
              Today's Habits
            </Text>
            {todaysHabits.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                onComplete={handleCompleteHabit}
                onStreakMilestone={(days, title) => setStreakMilestone({ days, title })}
              />
            ))}
          </>
        )}

        {/* Today's Disciplines */}
        {todaysDisciplines.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
              Today's Disciplines
            </Text>
            {todaysDisciplines.map((disc, index) => {
              const customCat = customCategories.find((c) => c.id === disc.categoryId);
              const color = CATEGORY_COLORS[disc.categoryId] ?? customCat?.color ?? COLORS.accent;
              return (
                <FadeInView key={disc.id} delay={index * 60}>
                  <DisciplineCard
                    discipline={disc}
                    categoryColor={color}
                    onComplete={handleCompleteDiscipline}
                  />
                </FadeInView>
              );
            })}
          </>
        )}

        {/* Stats quick bar */}
        {(todaysHabits.length + todaysDisciplines.length) > 0 && (
          <View style={styles.statsBar}>
            <Text style={styles.statsItem}>
              🔥 {todaysHabits.filter((h) => h.isCompletedToday).length}/{todaysHabits.length} habits
            </Text>
            <Text style={styles.statsItem}>
              ⚡ {todaysDisciplines.filter((d) => d.isCompletedToday).length}/{todaysDisciplines.length} disciplines
            </Text>
            <Text style={styles.statsItem}>
              🗡️ {recentQuests.length} active quests
            </Text>
          </View>
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

      <StreakMilestoneModal
        visible={streakMilestone !== null}
        streakDays={streakMilestone?.days ?? 0}
        habitTitle={streakMilestone?.title ?? ''}
        color={streakMilestoneColor}
        onDismiss={() => setStreakMilestone(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  missionBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  missionBannerEmoji: { fontSize: 28 },
  missionBannerTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  missionBannerSub: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  customCatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  customCatCell: { width: '47%' },
  customCatCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  customCatAccent: { height: 3, width: '100%' },
  customCatInner: { padding: SPACING.sm, gap: 4 },
  customCatEmoji: { fontSize: 26 },
  customCatLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  customCatLevel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
  addCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(99,102,241,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.22)',
    borderStyle: 'dashed',
  },
  addCatPlus: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.accent,
    fontFamily: FONTS.families.bodyBold,
    lineHeight: 24,
  },
  addCatText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.accent,
    fontFamily: FONTS.families.bodySemibold,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  statsItem: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.body,
  },
});
