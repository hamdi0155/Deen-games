import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../src/store/questStore';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET, CATEGORY_COLORS } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';
import { CategoryId, Quest } from '../../src/types';

type SortBy = 'newest' | 'oldest' | 'progress' | 'xp';

const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'progress', label: 'Progress' },
  { key: 'xp', label: 'XP Reward' },
  { key: 'oldest', label: 'Oldest' },
];

function sortQuests(quests: Quest[], sortBy: SortBy): Quest[] {
  const sorted = [...quests];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'progress':
      return sorted.sort((a, b) => {
        const pa = a.totalXP > 0 ? a.earnedXP / a.totalXP : 0;
        const pb = b.totalXP > 0 ? b.earnedXP / b.totalXP : 0;
        return pb - pa;
      });
    case 'xp':
      return sorted.sort((a, b) => b.totalXP - a.totalXP);
    default:
      return sorted;
  }
}

export default function QuestsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const getCompletedQuests = useQuestStore((s) => s.getCompletedQuests);

  const activeQuests = getActiveQuests();
  const allTabQuests = tab === 'active' ? activeQuests : getCompletedQuests();

  // Determine which categories have quests in the current tab
  const activeCategories = useMemo(() => {
    const ids = new Set(allTabQuests.map((q) => q.categoryId));
    return CATEGORY_META.filter((m) => ids.has(m.id));
  }, [allTabQuests]);

  // Apply category filter + sorting
  const quests = useMemo(() => {
    const filtered = categoryFilter === 'all'
      ? allTabQuests
      : allTabQuests.filter((q) => q.categoryId === categoryFilter);
    return tab === 'active' ? sortQuests(filtered, sortBy) : filtered;
  }, [allTabQuests, categoryFilter, sortBy, tab]);

  // When switching tabs, reset category filter if it no longer applies
  const handleTabChange = (t: 'active' | 'completed') => {
    setTab(t);
    setCategoryFilter('all');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header with subtle gradient ─────────────────────────── */}
      <LinearGradient
        colors={['rgba(91,108,245,0.10)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Quest Board</Text>
          {/* Active quests pill badge */}
          <View style={styles.activePill}>
            <Ionicons name="shield" size={12} color={COLORS.accent} style={{ marginRight: 4 }} />
            <Text style={styles.activePillText}>{activeQuests.length} Active</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabs}>
        {(['active', 'completed'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => handleTabChange(t)}
            activeOpacity={0.7}
          >
            {tab === t && (
              <LinearGradient
                colors={[COLORS.accent + '22', COLORS.accent + '08']}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'active' ? 'Active' : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category filter pills */}
      {allTabQuests.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContainer}
        >
          {/* "All" pill */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setCategoryFilter('all')}
            style={[
              styles.pill,
              categoryFilter === 'all'
                ? { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '20' }
                : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: categoryFilter === 'all' ? COLORS.accent : COLORS.textMuted },
              ]}
            >
              {'⚔️ All'}
            </Text>
          </TouchableOpacity>

          {/* Category pills — only those with quests in this tab */}
          {activeCategories.map((meta) => {
            const color = CATEGORY_COLORS[meta.id] ?? COLORS.accent;
            const isActive = categoryFilter === meta.id;
            return (
              <TouchableOpacity
                key={meta.id}
                activeOpacity={0.75}
                onPress={() => setCategoryFilter(meta.id)}
                style={[
                  styles.pill,
                  isActive
                    ? { borderColor: color, backgroundColor: color + '20' }
                    : styles.pillInactive,
                ]}
              >
                <Text
                  style={[styles.pillText, { color: isActive ? color : COLORS.textMuted }]}
                >
                  {`${meta.emoji} ${meta.label}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Sort chips — active tab only — premium pills with accent gradient fill */}
      {tab === 'active' && allTabQuests.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContainer}
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.75}
                onPress={() => setSortBy(opt.key)}
                style={[styles.sortChip, isActive ? styles.sortChipActive : styles.sortChipInactive]}
              >
                {isActive ? (
                  <LinearGradient
                    colors={[COLORS.accent, '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
                <Text style={[styles.sortChipText, isActive ? styles.sortChipTextActive : styles.sortChipTextInactive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_OFFSET }]}
      >
        {quests.length === 0 ? (
          tab === 'active' ? (
            <LinearGradient
              colors={['rgba(91,108,245,0.08)', 'transparent']}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyRing}>
                <Ionicons name="shield-outline" size={36} color={COLORS.accent} />
              </View>
              <Text style={styles.emptyTitle}>Your Legend Awaits</Text>
              <Text style={styles.emptySub}>
                Forge a quest to begin your transformation.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/goals' as any)}
                activeOpacity={0.85}
                style={styles.emptyBtn}
              >
                <LinearGradient
                  colors={['#5B6CF5', '#4550D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.emptyBtnGradient}
                >
                  <Text style={styles.emptyBtnText}>Begin a Quest</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['rgba(91,108,245,0.08)', 'transparent']}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyRing}>
                <Ionicons name="shield-outline" size={36} color={COLORS.accent} />
              </View>
              <Text style={styles.emptyTitle}>No Quests Completed Yet</Text>
              <Text style={styles.emptySub}>
                Complete quests to see them here.
              </Text>
            </LinearGradient>
          )
        ) : (
          <>
            {/* Section divider */}
            <View style={styles.sectionDivider}>
              <View style={styles.sectionDividerLine} />
              <Text style={styles.sectionDividerLabel}>
                {tab === 'active' ? 'ACTIVE' : 'COMPLETED'}
              </Text>
              <View style={styles.sectionDividerLine} />
            </View>
            {quests.map((q, index) => (
              <FadeInView key={q.id} delay={index * 60}>
                <QuestCard quest={q} />
              </FadeInView>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerGradient: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 1,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  activePillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  },
  tabBtnActive: { borderColor: COLORS.accent + '60' },
  tabText: {
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tabTextActive: { fontFamily: FONTS.families.display, color: COLORS.accent },
  pillsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  pill: {
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  pillInactive: {
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  pillText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 1,
  },
  sortContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  sortChip: {
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  sortChipActive: {
    borderColor: COLORS.accent,
  },
  sortChipInactive: {
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  sortChipText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 1,
  },
  sortChipTextActive: {
    color: '#fff',
  },
  sortChipTextInactive: {
    color: COLORS.textMuted,
  },
  list: { paddingTop: SPACING.sm },
  // Section dividers
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
  },
  sectionDividerLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textDim,
    letterSpacing: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: 24,
    padding: SPACING.xl,
    margin: SPACING.lg,
    marginTop: 40,
  },
  emptyRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent + '15',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    alignSelf: 'stretch',
  },
  emptyBtnGradient: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyBtnText: {
    color: '#fff',
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.8,
  },
});
