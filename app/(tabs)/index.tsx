import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { useHabitStore } from '../../src/store/habitStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { CharacterHeader } from '../../src/components/character/CharacterHeader';
import { CategoryGrid } from '../../src/components/character/CategoryGrid';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { DisciplineCard } from '../../src/components/disciplines/DisciplineCard';
import { COLORS, FONTS, SPACING, TAB_BAR_OFFSET } from '../../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);

  const getTodaysDisciplines = useDisciplineStore((s) => s.getTodaysDisciplines);
  const completeDiscipline = useDisciplineStore((s) => s.completeDiscipline);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const todaysHabits = getTodaysHabits();
  const todaysDisciplines = getTodaysDisciplines();

  if (!character) return null;

  const categories = Object.values(character.categories);

  return (
    <SafeAreaView style={styles.safe}>
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
                          borderColor: `${cat.color}30`,
                        },
                      ]}
                    >
                      <View
                        style={[styles.customCatAccent, { backgroundColor: cat.color }]}
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

        {/* Today's Habits */}
        {todaysHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
              Today's Habits
            </Text>
            {todaysHabits.map((h) => (
              <HabitCard key={h.id} habit={h} onComplete={completeHabit} />
            ))}
          </>
        )}

        {/* Today's Disciplines */}
        {todaysDisciplines.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
              Today's Disciplines
            </Text>
            {todaysDisciplines.map((disc) => {
              // Resolve color for discipline
              const customCat = customCategories.find((c) => c.id === disc.categoryId);
              const color = customCat?.color ?? COLORS.accent;
              return (
                <DisciplineCard
                  key={disc.id}
                  discipline={disc}
                  categoryColor={color}
                  onComplete={completeDiscipline}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  sectionTitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // Custom categories mini-grid
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
  customCatInner: {
    padding: SPACING.sm,
    gap: 4,
  },
  customCatEmoji: { fontSize: 26 },
  customCatLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.semibold,
  },
  customCatLevel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },

  // Add Category button
  addCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    borderStyle: 'dashed',
  },
  addCatPlus: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.accent,
    fontWeight: FONTS.weights.bold,
    lineHeight: 24,
  },
  addCatText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.accent,
    fontWeight: FONTS.weights.semibold,
  },
});
