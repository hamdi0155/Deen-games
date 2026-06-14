import React, { useState, useMemo, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../../src/components/icons/AscendIcon';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../src/store/questStore';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET, CATEGORY_COLORS } from '../../src/constants/theme';
import { CATEGORY_META } from '../../src/constants/categories';
import { CategoryId, Quest } from '../../src/types';

type SortBy = 'newest' | 'oldest' | 'progress' | 'xp';

const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'progress', label: 'Progress' },
  { key: 'xp', label: 'Reward' },
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

function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 28, stiffness: 150 }));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export default function QuestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const getCompletedQuests = useQuestStore((s) => s.getCompletedQuests);

  const headerAnim = useEntranceAnimation(0);
  const tabsAnim = useEntranceAnimation(80);
  const filtersAnim = useEntranceAnimation(150);
  const listAnim = useEntranceAnimation(220);

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
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <AuroraBackground />

      {/* ── Header with subtle gradient ─────────────────────────── */}
      <Animated.View style={headerAnim}>
        <LinearGradient
          colors={['rgba(91,108,245,0.14)', 'rgba(91,108,245,0.04)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>GOALS</Text>
              <Text style={styles.heading}>Goals</Text>
            </View>
            <View style={styles.headerRight}>
              {/* Active count pill */}
              {activeQuests.length > 0 && (
                <View style={styles.activePill}>
                  <AscendIcon name="shield" size={12} color={COLORS.accent} filled={true} />
                  <Text style={styles.activePillText}>{activeQuests.length} Active</Text>
                </View>
              )}
              {/* New Goal button */}
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/goals' as any)}
                activeOpacity={0.8}
                style={styles.newGoalBtn}
              >
                <LinearGradient
                  colors={['#5B6CF5', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.newGoalBtnGrad}
                >
                  <Text style={styles.newGoalBtnText}>+ New Goal</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.tabsContainer, tabsAnim]}>
        <View style={styles.tabPillTrack}>
          {(['active', 'completed'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => handleTabChange(t)}
              activeOpacity={0.7}
            >
              {tab === t ? (
                <LinearGradient
                  colors={[COLORS.accent, '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'active' ? 'Active' : '✓  Completed'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Category filter pills + sort chips */}
      <Animated.View style={filtersAnim}>
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
                {'All'}
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
      </Animated.View>

      <Animated.View style={[{ flex: 1 }, listAnim]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_OFFSET + insets.bottom }]}
      >
        {quests.length === 0 ? (
          tab === 'active' ? (
            <LinearGradient
              colors={['rgba(91,108,245,0.08)', 'transparent']}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyRing}>
                <AscendIcon name="shield" size={36} color={COLORS.accent} />
              </View>
              <Text style={styles.emptyTitle}>Your Story Awaits</Text>
              <Text style={styles.emptySub}>
                Create a goal to begin your transformation.
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
                  <Text style={styles.emptyBtnText}>Set a Goal</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['rgba(91,108,245,0.08)', 'transparent']}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyRing}>
                <AscendIcon name="shield" size={36} color={COLORS.accent} />
              </View>
              <Text style={styles.emptyTitle}>No Goals Completed Yet</Text>
              <Text style={styles.emptySub}>
                Complete goals to see them here.
              </Text>
            </LinearGradient>
          )
        ) : (
          <>
            {/* Section divider */}
            <View style={styles.sectionDivider}>
              <View style={styles.sectionDividerLine} />
              <Text style={styles.sectionDividerLabel}>
                {tab === 'active' ? 'Active' : 'Completed'}
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerGradient: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  eyebrow: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    letterSpacing: 3,
    marginBottom: 2,
  },
  heading: {
    fontSize: 28,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
  },
  activePillText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  newGoalBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#5B6CF5',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  newGoalBtnGrad: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  newGoalBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayBold,
    color: '#fff',
    letterSpacing: 0.3,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tabPillTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 3,
    gap: 3,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
  },
  tabBtnActive: {},
  tabText: {
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 0.5,
  },
  tabTextActive: { fontFamily: FONTS.families.display, color: '#fff' },
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
