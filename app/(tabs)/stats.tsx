import React from 'react';
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
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { xpProgress } from '../../src/services/xpService';
import { COLORS, FONTS, SPACING, CATEGORY_COLORS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function StatsScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const customCategories = useDisciplineStore((s) => s.customCategories);

  if (!character) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.heading}>Life Map</Text>
            <Text style={styles.sub}>Your journey across all domains</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/category/create' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Level — dramatic hero section */}
        <LinearGradient
          colors={['rgba(99,102,241,0.16)', 'rgba(124,58,237,0.08)', 'transparent']}
          style={styles.overall}
        >
          <Text style={styles.overallLabel}>Overall Level</Text>
          <AnimatedCounter
            value={character.overallLevel}
            style={styles.overallLevel}
            duration={1200}
          />
          <Text style={styles.rank}>{character.lifeRank}</Text>
          <View style={styles.xpPill}>
            <AnimatedCounter
              value={character.totalXP}
              style={styles.totalXP}
              formatter={(n) => `${n.toLocaleString()} XP`}
            />
          </View>
        </LinearGradient>

        {/* Built-in categories */}
        <Text style={styles.gridLabel}>Core Domains</Text>
        <View style={styles.grid}>
          {CATEGORY_META.map((meta) => {
            const cat = character.categories[meta.id];
            const { level, progress, xpToNext } = xpProgress(cat.xp);
            const color = CATEGORY_COLORS[meta.id];

            return (
              <TouchableOpacity
                key={meta.id}
                onPress={() => router.push(`/category/${meta.id}` as any)}
                activeOpacity={0.8}
              >
                <GlowCard glowColor={cat.xp > 0 ? color : undefined} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.catEmoji}>{meta.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catLabel}>{meta.label}</Text>
                      <Text style={styles.catXP}>{cat.xp.toLocaleString()} XP · {xpToNext} to next</Text>
                    </View>
                    <Text style={[styles.catLevel, { color }]}>Lv {level}</Text>
                  </View>
                  <XPBar progress={progress} color={color} height={4} />
                </GlowCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom categories */}
        {customCategories.length > 0 && (
          <>
            <Text style={[styles.gridLabel, { marginTop: SPACING.xl }]}>
              Custom Domains
            </Text>
            <View style={styles.grid}>
              {customCategories.map((cat) => {
                const xpEntry = customCategoryXP[cat.id] ?? { xp: 0, level: 0 };
                const { level, progress, xpToNext } = xpProgress(xpEntry.xp);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => router.push(`/category/${cat.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <GlowCard
                      glowColor={xpEntry.xp > 0 ? cat.color : undefined}
                      style={styles.card}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={styles.catEmoji}>{cat.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.catLabel}>{cat.label}</Text>
                          <Text style={styles.catXP}>
                            {xpEntry.xp.toLocaleString()} XP · {xpToNext} to next
                          </Text>
                        </View>
                        <Text style={[styles.catLevel, { color: cat.color }]}>
                          Lv {level}
                        </Text>
                      </View>
                      <XPBar progress={progress} color={cat.color} height={4} />
                    </GlowCard>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* CTA if no custom categories */}
        {customCategories.length === 0 && (
          <TouchableOpacity
            style={styles.addCatCta}
            onPress={() => router.push('/category/create' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.addCtaEmoji}>✦</Text>
            <Text style={styles.addCtaTitle}>Create a Custom Domain</Text>
            <Text style={styles.addCtaDesc}>
              Add any area of life and let AI generate Jim Rohn-inspired
              disciplines tailored to your vision.
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    marginTop: SPACING.xs,
  },
  addBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodySemibold,
    color: COLORS.accent,
  },
  overall: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: SPACING.lg,
  },
  overallLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  overallLevel: {
    fontSize: 88,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
    lineHeight: 96,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  rank: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 1,
  },
  xpPill: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    marginTop: SPACING.xs,
  },
  totalXP: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyBold,
    color: COLORS.accent,
  },
  gridLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  card: { gap: SPACING.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  catEmoji: { fontSize: 24 },
  catLabel: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  catXP: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  catLevel: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
  addCatCta: {
    margin: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: 'rgba(99,102,241,0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  addCtaEmoji: { fontSize: 32, color: COLORS.accent },
  addCtaTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  addCtaDesc: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
