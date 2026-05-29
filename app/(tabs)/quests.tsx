import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../src/store/questStore';
import { QuestCard } from '../../src/components/quests/QuestCard';
import { FadeInView } from '../../src/components/ui/FadeInView';
import { COLORS, FONTS, SPACING, RADIUS, TAB_BAR_OFFSET } from '../../src/constants/theme';

export default function QuestsScreen() {
  const router = useRouter();
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
          tab === 'active' ? (
            <LinearGradient
              colors={['rgba(99,102,241,0.08)', 'transparent']}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyRing}>
                <Text style={styles.emptyIcon}>⚔️</Text>
              </View>
              <Text style={styles.emptyTitle}>The Quest Board Awaits</Text>
              <Text style={styles.emptySub}>
                Every legend begins with a single quest. What is your goal?
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/goals' as any)}
                activeOpacity={0.85}
                style={styles.emptyBtn}
              >
                <LinearGradient
                  colors={[COLORS.accent, '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.emptyBtnGradient}
                >
                  <Text style={styles.emptyBtnText}>Forge Your First Quest</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['rgba(99,102,241,0.08)', 'transparent']}
              style={styles.emptyContainer}
            >
              <View style={styles.emptyRing}>
                <Text style={styles.emptyIcon}>🏆</Text>
              </View>
              <Text style={styles.emptyTitle}>No Quests Completed Yet</Text>
              <Text style={styles.emptySub}>
                Complete quests to see them here.
              </Text>
            </LinearGradient>
          )
        ) : (
          quests.map((q, index) => (
            <FadeInView key={q.id} delay={index * 60}>
              <QuestCard quest={q} />
            </FadeInView>
          ))
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
  emptyContainer: {
    alignItems: 'center',
    gap: SPACING.md,
    borderRadius: 24,
    padding: SPACING.xl,
    margin: SPACING.lg,
    marginTop: 40,
  },
  emptyRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(99,102,241,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99,102,241,0.08)',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  emptyIcon: { fontSize: 48 },
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
    lineHeight: 20,
  },
  emptyBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyBtnGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  emptyBtnText: {
    color: '#fff',
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.8,
  },
});
