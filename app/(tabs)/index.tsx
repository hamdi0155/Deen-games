import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useCharacterStore } from '../../src/store/characterStore';
import { useHabitStore } from '../../src/store/habitStore';
import { CharacterHeader } from '../../src/components/character/CharacterHeader';
import { CategoryGrid } from '../../src/components/character/CategoryGrid';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

export default function HomeScreen() {
  const character = useCharacterStore((s) => s.character);
  const getTodaysHabits = useHabitStore((s) => s.getTodaysHabits);
  const completeHabit = useHabitStore((s) => s.completeHabit);

  const todaysHabits = getTodaysHabits();

  if (!character) return null;

  const categories = Object.values(character.categories);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CharacterHeader
          name={character.name}
          avatarEmoji={character.avatarEmoji}
          overallLevel={character.overallLevel}
          totalXP={character.totalXP}
          lifeRank={character.lifeRank}
        />

        <Text style={styles.sectionTitle}>Life Categories</Text>
        <CategoryGrid categories={categories} />

        {todaysHabits.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Today's Habits</Text>
            {todaysHabits.map((h) => (
              <HabitCard key={h.id} habit={h} onComplete={completeHabit} />
            ))}
          </>
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
});
