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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCharacterStore } from '../../src/store/characterStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { useQuestStore } from '../../src/store/questStore';
import { useHabitStore } from '../../src/store/habitStore';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { LevelBadge } from '../../src/components/ui/LevelBadge';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { LifeRadar } from '../../src/components/ui/LifeRadar';
import { xpProgress } from '../../src/services/xpService';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function StatsScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const customCategories = useDisciplineStore((s) => s.customCategories);
  const deleteCustomCategory = useDisciplineStore((s) => s.deleteCustomCategory);

  if (!character) return null;

  const totalXP = character.totalXP;
  const lifeRank = character.lifeRank;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        {/* Header gradient — title + XP + rank */}
        <LinearGradient
          colors={['rgba(91,108,245,0.10)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.topRow}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.heading}>Life Stats</Text>
              <Text style={styles.sub}>Your domain mastery at a glance.</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/category/create' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Add Domain</Text>
            </TouchableOpacity>
          </View>

          {/* Large XP number */}
          <View style={styles.xpHero}>
            <Text style={styles.xpHeroNumber}>{totalXP.toLocaleString()} XP</Text>
            {/* Life rank pill */}
            <View style={styles.rankPill}>
              <Ionicons name="star" size={12} color={COLORS.gold} style={{ marginRight: 5 }} />
              <Text style={styles.rankPillText}>{lifeRank}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Zero-XP motivational banner */}
        {totalXP === 0 && (
          <GlowCard
            glowColor={COLORS.accent}
            style={styles.zeroBanner}
          >
            <Text style={styles.zeroBannerText}>
              Every journey begins with a single step. Complete your first habit or quest.
            </Text>
          </GlowCard>
        )}

        {/* Life Architecture Radar */}
        <View style={styles.radarSection}>
          <GlowCard glowColor={COLORS.accent} style={styles.radarCard} noPadding>
            <View style={styles.radarInner}>
              <Text style={styles.radarTitle}>Life Architecture</Text>
              <LifeRadar
                categories={CATEGORY_META.map((meta) => {
                  const cat = character.categories[meta.id];
                  const { level } = xpProgress(cat.xp);
                  return {
                    id: meta.id,
                    label: meta.label,
                    emoji: meta.emoji,
                    color: CATEGORY_COLORS[meta.id],
                    level,
                  };
                })}
                size={280}
              />
            </View>
          </GlowCard>
        </View>

        {/* Built-in categories */}
        <Text style={styles.gridLabel}>Core Domains</Text>
        <View style={styles.categoryList}>
          {CATEGORY_META.map((meta, index) => {
            const cat = character.categories[meta.id];
            const { level, progress } = xpProgress(cat.xp);
            const color = CATEGORY_COLORS[meta.id];
            const isLast = index === CATEGORY_META.length - 1;

            return (
              <PressableScale
                key={meta.id}
                onPress={() => router.push(`/category/${meta.id}` as any)}
              >
                <View style={[styles.categoryRow, !isLast && styles.categoryRowBorder]}>
                  <View style={styles.categoryLeft}>
                    <Text style={styles.catEmoji}>{meta.emoji}</Text>
                    <Text style={styles.catLabel}>{meta.label}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <LevelBadge level={level} color={color} size={28} />
                    <Text style={[styles.catLevelText, { color }]}>Lv {level}</Text>
                  </View>
                </View>
                <XPBar progress={progress} color={color} height={2} />
                {!isLast && <View style={styles.rowSeparator} />}
              </PressableScale>
            );
          })}
        </View>

        {/* Custom categories */}
        {customCategories.length > 0 && (
          <>
            <Text style={[styles.gridLabel, { marginTop: SPACING.xl }]}>
              Custom Domains
            </Text>
            <View style={styles.categoryList}>
              {customCategories.map((cat, index) => {
                const xpEntry = customCategoryXP[cat.id] ?? { xp: 0, level: 0 };
                const { level, progress } = xpProgress(xpEntry.xp);
                const isLast = index === customCategories.length - 1;
                return (
                  <PressableScale
                    key={cat.id}
                    onPress={() => router.push(`/category/${cat.id}` as any)}
                    onLongPress={() => Alert.alert(
                      'Delete Custom Domain',
                      `Remove "${cat.label}"? All its disciplines and XP will be lost.`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteCustomCategory(cat.id) },
                      ]
                    )}
                  >
                    <View style={[styles.categoryRow, !isLast && styles.categoryRowBorder]}>
                      <View style={styles.categoryLeft}>
                        <Text style={styles.catEmoji}>{cat.emoji}</Text>
                        <Text style={styles.catLabel}>{cat.label}</Text>
                      </View>
                      <View style={styles.categoryRight}>
                        <LevelBadge level={level} color={cat.color} size={28} />
                        <Text style={[styles.catLevelText, { color: cat.color }]}>Lv {level}</Text>
                      </View>
                    </View>
                    <XPBar progress={progress} color={cat.color} height={2} />
                    {!isLast && <View style={styles.rowSeparator} />}
                  </PressableScale>
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
  headerGradient: {
    paddingBottom: SPACING.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  headerTextBlock: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderRadius: RADIUS.full,
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

  xpHero: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  xpHeroNumber: {
    fontSize: 32,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldDim,
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  rankPillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.gold,
    letterSpacing: 1,
  },

  zeroBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.accentDim,
  },
  zeroBannerText: {
    fontSize: 13,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  radarSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  radarCard: {
    alignItems: 'center',
  },
  radarInner: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
  },
  radarTitle: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },

  gridLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  categoryList: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: SPACING.md,
  },
  categoryRowBorder: {
    // separator is rendered separately as a thin line
  },
  rowSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginHorizontal: SPACING.md,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  catEmoji: { fontSize: 18 },
  catLabel: {
    fontSize: 14,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  catLevelText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodySemibold,
    letterSpacing: 0.3,
  },

  addCatCta: {
    margin: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: 'rgba(99,102,241,0.06)',
    borderRadius: RADIUS.lg,
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
