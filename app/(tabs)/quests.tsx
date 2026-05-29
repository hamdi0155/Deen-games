import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuestStore } from '../../src/store/questStore';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';

export default function QuestsScreen() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const getActiveQuests = useQuestStore((s) => s.getActiveQuests);
  const getCompletedQuests = useQuestStore((s) => s.getCompletedQuests);

  const quests = tab === 'active' ? getActiveQuests() : getCompletedQuests();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['rgba(99,102,241,0.10)', 'transparent']}
        style={styles.headerGradient}
      >
        <Text style={styles.heading}>Quest Board</Text>
      </LinearGradient>

      <View style={styles.tabs}>
        {(['active', 'completed'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_OFFSET }]}
      >
        {quests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{tab === 'active' ? '⚔️' : '🏆'}</Text>
            <Text style={styles.emptyTitle}>
              {tab === 'active' ? 'No active quests' : 'No completed quests yet'}
            </Text>
            <Text style={styles.emptySub}>
              {tab === 'active' ? 'Go to New Quest to forge your path.' : 'Complete quests to see them here.'}
            </Text>
          </View>
        ) : (
          quests.map((q) => <QuestCard key={q.id} quest={q} />)
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
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    letterSpacing: 0.5,
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
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  },
  tabBtnActive: { borderColor: COLORS.accent + '60' },
  tabText: {
    fontFamily: FONTS.families.bodyBold,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 0.3,
  },
  tabTextActive: { color: COLORS.accent },
  list: { paddingTop: SPACING.sm },
  empty: { alignItems: 'center', gap: SPACING.md, paddingTop: 80, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emptySub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
