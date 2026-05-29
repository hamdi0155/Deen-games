import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useCharacterStore } from '../../src/store/characterStore';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { xpProgress } from '../../src/services/xpService';
import { COLORS, FONTS, SPACING, CATEGORY_COLORS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function StatsScreen() {
  const character = useCharacterStore((s) => s.character);

  if (!character) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        <Text style={styles.heading}>Life Map</Text>
        <Text style={styles.sub}>Your journey across all 12 domains</Text>

        <View style={styles.overall}>
          <Text style={styles.overallLabel}>Overall Level</Text>
          <Text style={styles.overallLevel}>{character.overallLevel}</Text>
          <Text style={styles.rank}>{character.lifeRank}</Text>
          <View style={styles.xpPill}>
            <Text style={styles.totalXP}>{character.totalXP.toLocaleString()} XP</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {CATEGORY_META.map((meta) => {
            const cat = character.categories[meta.id];
            const { level, progress, xpToNext } = xpProgress(cat.xp);
            const color = CATEGORY_COLORS[meta.id];

            return (
              <GlowCard key={meta.id} glowColor={cat.xp > 0 ? color : undefined} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.catEmoji}>{meta.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.catLabel}>{meta.label}</Text>
                    <Text style={styles.catXP}>{cat.xp} XP · {xpToNext} to next</Text>
                  </View>
                  <Text style={[styles.catLevel, { color }]}>Lv {level}</Text>
                </View>
                <XPBar progress={progress} color={color} height={4} />
              </GlowCard>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    padding: SPACING.lg,
    paddingBottom: SPACING.xs,
    letterSpacing: -0.3,
  },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  overall: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: SPACING.lg,
  },
  overallLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: FONTS.weights.bold,
  },
  overallLevel: {
    fontSize: 80,
    fontWeight: FONTS.weights.bold,
    color: COLORS.accent,
    lineHeight: 88,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  rank: { fontSize: FONTS.sizes.lg, color: COLORS.text, fontWeight: FONTS.weights.semibold, letterSpacing: 0.5 },
  xpPill: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    marginTop: SPACING.xs,
  },
  totalXP: { fontSize: FONTS.sizes.sm, color: COLORS.accent, fontWeight: FONTS.weights.semibold },
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  card: { gap: SPACING.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  catEmoji: { fontSize: 24 },
  catLabel: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  catXP: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  catLevel: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
});
