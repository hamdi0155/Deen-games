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
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { xpProgress } from '../../src/services/xpService';
import { CategoryId } from '../../src/types';
import { COLORS, FONTS, SPACING, CATEGORY_COLORS } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const quests = useQuestStore((s) => s.quests);

  if (!character || !id) return null;

  const catId = id as CategoryId;
  const cat = character.categories[catId];
  const meta = CATEGORY_META.find((c) => c.id === catId);
  const color = CATEGORY_COLORS[catId] ?? COLORS.accent;
  const { level, progress, xpToNext } = xpProgress(cat.xp);
  const catQuests = quests.filter((q) => q.categoryId === catId && q.status === 'active');

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{meta?.emoji ?? '⚔️'}</Text>
          <Text style={[styles.levelText, { color }]}>Lv {level}</Text>
        </View>
        <Text style={styles.title}>{meta?.label ?? catId}</Text>

        <GlowCard glowColor={color} style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Experience</Text>
            <Text style={[styles.xpVal, { color }]}>{cat.xp} XP</Text>
          </View>
          <XPBar progress={progress} color={color} height={10} />
          <Text style={styles.xpNext}>
            {xpToNext} XP to level {level + 1}
          </Text>
        </GlowCard>

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
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
});
