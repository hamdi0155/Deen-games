import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useCharacterStore } from '../../src/store/characterStore';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { xpProgress } from '../../src/services/xpService';
import { COLORS, FONTS, SPACING, CATEGORY_COLORS } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function StatsScreen() {
  const character = useCharacterStore((s) => s.character);

  if (!character) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Life Map</Text>
        <Text style={styles.sub}>Your journey across all 12 domains</Text>

        <View style={styles.overall}>
          <Text style={styles.overallLabel}>Overall Level</Text>
          <Text style={styles.overallLevel}>{character.overallLevel}</Text>
          <Text style={styles.rank}>{character.lifeRank}</Text>
          <Text style={styles.totalXP}>{character.totalXP.toLocaleString()} Total XP</Text>
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
                    <Text style={styles.catXP}>{cat.xp} XP · {xpToNext} to next level</Text>
                  </View>
                  <Text style={[styles.catLevel, { color }]}>Lv {level}</Text>
                </View>
                <XPBar progress={progress} color={color} height={6} />
              </GlowCard>
            );
          })}
        </View>
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  heading: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.bold, color: COLORS.text, padding: SPACING.lg, paddingBottom: SPACING.xs },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  overall: { alignItems: 'center', padding: SPACING.xl, gap: SPACING.xs, borderBottomWidth: 1, borderBottomColor: '#111', marginBottom: SPACING.lg },
  overallLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 },
  overallLevel: { fontSize: 64, fontWeight: FONTS.weights.bold, color: COLORS.accent },
  rank: { fontSize: FONTS.sizes.lg, color: COLORS.text, fontWeight: FONTS.weights.semibold },
  totalXP: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  card: { gap: SPACING.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  catEmoji: { fontSize: 24 },
  catLabel: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.semibold, color: COLORS.text },
  catXP: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  catLevel: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
});
