import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
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
      <Text style={styles.heading}>Quest Board</Text>

      <View style={styles.tabs}>
        {(['active', 'completed'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.7}
          >
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
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
    letterSpacing: -0.3,
  },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.md },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  tabBtnActive: { backgroundColor: COLORS.accent + '22', borderColor: COLORS.accent },
  tabText: { color: COLORS.textMuted, fontWeight: FONTS.weights.semibold, fontSize: FONTS.sizes.sm },
  tabTextActive: { color: COLORS.accent },
  list: { paddingTop: SPACING.sm },
  empty: { alignItems: 'center', gap: SPACING.md, paddingTop: 80, paddingHorizontal: SPACING.xl },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.semibold, color: COLORS.text, textAlign: 'center' },
  emptySub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, textAlign: 'center' },
});
