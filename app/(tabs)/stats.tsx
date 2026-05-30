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
import { useCharacterStore } from '../../src/store/characterStore';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { useQuestStore } from '../../src/store/questStore';
import { useHabitStore } from '../../src/store/habitStore';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { XPBar } from '../../src/components/ui/XPBar';
import { LevelBadge } from '../../src/components/ui/LevelBadge';
import { StatIconCard } from '../../src/components/ui/StatIconCard';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { LifeRadar } from '../../src/components/ui/LifeRadar';
import { xpProgress } from '../../src/services/xpService';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CATEGORY_COLORS, TAB_BAR_OFFSET } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';

export default function StatsScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const customCategories = useDisciplineStore((s) => s.customCategories);
  const deleteCustomCategory = useDisciplineStore((s) => s.deleteCustomCategory);
  const disciplines = useDisciplineStore((s) => s.disciplines);
  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const habits = useHabitStore((s) => s.habits);

  if (!character) return null;

  const activeQuestCount = getActiveQuests().length;
  const habitsDoneToday = habits.filter((h) => h.isCompletedToday).length;

  const totalDisciplineCompletions = disciplines.reduce((sum, d) => sum + d.completions.length, 0);
  const daysActive = character
    ? Math.max(1, Math.floor((Date.now() - new Date(character.createdAt).getTime()) / 86400000))
    : 1;
  const avgDailyXP = Math.round(character.totalXP / daysActive);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_OFFSET }}
      >
        {/* Header with gradient strip */}
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
        </LinearGradient>

        {/* Overall Life Stats — StatIconCard row */}
        <View style={styles.overallRow}>
          <StatIconCard
            icon="flash"
            iconColor={COLORS.gold}
            label="Total XP"
            value={character.totalXP.toLocaleString()}
            style={styles.overallCard}
          />
          <StatIconCard
            icon="trophy"
            iconColor={COLORS.accent}
            label="Overall Level"
            value={character.overallLevel}
            style={styles.overallCard}
          />
          <StatIconCard
            icon="star"
            iconColor={COLORS.warning}
            label="Life Rank"
            value={character.lifeRank}
            style={styles.overallCard}
          />
        </View>

        {/* Overall Level hero section */}
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

        {/* Quick Stats strip */}
        <View style={styles.quickStatsRow}>
          <GlowCard glowColor={COLORS.accent} style={styles.quickChip}>
            <View style={styles.quickChipInner}>
              <AnimatedCounter value={activeQuestCount} style={styles.quickChipNumber} />
              <Text style={styles.quickChipLabel}>Quests</Text>
            </View>
          </GlowCard>

          <GlowCard glowColor={COLORS.success} style={styles.quickChip}>
            <View style={styles.quickChipInner}>
              <AnimatedCounter value={habitsDoneToday} style={[styles.quickChipNumber, { color: COLORS.success }] as any} />
              <Text style={styles.quickChipLabel}>Habits Done</Text>
            </View>
          </GlowCard>

          <GlowCard glowColor={COLORS.accent} style={styles.quickChip}>
            <View style={styles.quickChipInner}>
              <AnimatedCounter
                value={character.totalXP}
                style={styles.quickChipNumber}
                formatter={(n) => n.toLocaleString()}
              />
              <Text style={styles.quickChipLabel}>Total XP</Text>
            </View>
          </GlowCard>
        </View>

        {/* Total Activity Summary */}
        <View style={styles.activitySection}>
          <GlowCard glowColor={COLORS.accent} style={styles.activityCard}>
            <Text style={styles.activityTitle}>Total Activity</Text>
            <View style={styles.activityRow}>
              <View style={styles.activityStat}>
                <Text style={styles.activityValue}>{totalDisciplineCompletions.toLocaleString()}</Text>
                <Text style={styles.activityLabel}>Disciplines{'\n'}Completed</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityStat}>
                <Text style={styles.activityValue}>{avgDailyXP.toLocaleString()}</Text>
                <Text style={styles.activityLabel}>Avg Daily{'\n'}XP</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityStat}>
                <Text style={styles.activityValue}>{daysActive}</Text>
                <Text style={styles.activityLabel}>Days{'\n'}Since Joining</Text>
              </View>
            </View>
          </GlowCard>
        </View>

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
        <View style={styles.grid}>
          {CATEGORY_META.map((meta) => {
            const cat = character.categories[meta.id];
            const { level, progress, xpToNext } = xpProgress(cat.xp);
            const color = CATEGORY_COLORS[meta.id];

            const dotSize = cat.xp === 0 ? 0 : cat.xp < 500 ? 8 : cat.xp < 2000 ? 10 : 12;
            const dotOpacity = cat.xp > 0 && cat.xp < 500 ? '80' : '';
            const dotColor = dotOpacity ? color + dotOpacity : color;
            const dotShadow = cat.xp >= 500
              ? {
                  shadowColor: color,
                  shadowOpacity: cat.xp >= 2000 ? 0.9 : 0.6,
                  shadowRadius: cat.xp >= 2000 ? 6 : 4,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: cat.xp >= 2000 ? 8 : 4,
                }
              : {};

            return (
              <PressableScale
                key={meta.id}
                onPress={() => router.push(`/category/${meta.id}` as any)}
              >
                <GlowCard glowColor={cat.xp > 0 ? color : undefined} style={styles.card}>
                  {dotSize > 0 && (
                    <View
                      style={[
                        styles.heatDot,
                        {
                          width: dotSize,
                          height: dotSize,
                          borderRadius: dotSize / 2,
                          backgroundColor: dotColor,
                        },
                        dotShadow,
                      ]}
                    />
                  )}
                  <View style={styles.cardHeader}>
                    <Text style={styles.catEmoji}>{meta.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.catLabel}>{meta.label}</Text>
                      <Text style={[styles.catXP, { color }]}>
                        {cat.xp.toLocaleString()} XP · Lv{level}
                      </Text>
                    </View>
                    <LevelBadge level={level} color={color} size={36} />
                  </View>
                  <XPBar progress={progress} color={color} height={4} />
                </GlowCard>
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
            <View style={styles.grid}>
              {customCategories.map((cat) => {
                const xpEntry = customCategoryXP[cat.id] ?? { xp: 0, level: 0 };
                const { level, progress, xpToNext } = xpProgress(xpEntry.xp);
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
                    <GlowCard
                      glowColor={xpEntry.xp > 0 ? cat.color : undefined}
                      style={{ ...styles.card, position: 'relative' }}
                    >
                      {(() => {
                        const xp = xpEntry.xp;
                        const dotSize = xp === 0 ? 0 : xp < 500 ? 8 : xp < 2000 ? 10 : 12;
                        if (dotSize === 0) return null;
                        const dotColor = xp < 500 ? cat.color + '80' : cat.color;
                        const ds = xp >= 500 ? {
                          shadowColor: cat.color,
                          shadowOpacity: xp >= 2000 ? 0.9 : 0.6,
                          shadowRadius: xp >= 2000 ? 6 : 4,
                          shadowOffset: { width: 0 as number, height: 0 as number },
                          elevation: xp >= 2000 ? 8 : 4,
                        } : {};
                        return (
                          <View
                            style={[
                              styles.heatDot,
                              { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: dotColor },
                              ds,
                            ]}
                          />
                        );
                      })()}
                      <View style={styles.cardHeader}>
                        <Text style={styles.catEmoji}>{cat.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.catLabel}>{cat.label}</Text>
                          <Text style={[styles.catXP, { color: cat.color }]}>
                            {xpEntry.xp.toLocaleString()} XP · Lv{level}
                          </Text>
                        </View>
                        <LevelBadge level={level} color={cat.color} size={36} />
                      </View>
                      <XPBar progress={progress} color={cat.color} height={4} />
                    </GlowCard>
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
    paddingBottom: SPACING.md,
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

  // Overall life stats row
  overallRow: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  overallCard: {
    width: '100%',
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
    borderRadius: RADIUS.full,
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
  quickStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickChip: {
    flex: 1,
  },
  quickChipInner: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  quickChipNumber: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  quickChipLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  activitySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  activityCard: {
    gap: SPACING.md,
  },
  activityTitle: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityStat: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  activityValue: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  activityLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activityDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
  grid: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  card: { gap: SPACING.sm },
  heatDot: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
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
