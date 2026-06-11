import React, { useState, useEffect } from 'react';
import Groq from 'groq-sdk';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useCharacterStore } from '../src/store/characterStore';
import { useHabitStore } from '../src/store/habitStore';
import { useQuestStore } from '../src/store/questStore';
import { calcLevel, calcOverallLevel, getLifeRank, xpForLevel } from '../src/services/xpService';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../src/constants/theme';

const HORIZONS = [
  { label: '30 Days', days: 30, color: '#0EA875' },
  { label: '90 Days', days: 90, color: '#5B6CF5' },
  { label: '1 Year', days: 365, color: '#C9A84C' },
] as const;

function projectXP(currentXP: number, dailyRate: number, days: number): number {
  return currentXP + dailyRate * days;
}

function estimateDailyXPRate(activityLog: any[], habits: any[]): number {
  const last7Days = activityLog.filter((e: any) => {
    const daysDiff = (Date.now() - new Date(e.timestamp ?? e.createdAt ?? Date.now()).getTime()) / 86400000;
    return daysDiff <= 7;
  });
  const fromLog = last7Days.reduce((sum: number, e: any) => sum + (e.xp ?? 0), 0) / 7;
  const fromHabits = habits.filter((h: any) => h.currentStreak > 0).reduce((sum: number, h: any) => sum + h.xpReward, 0) * 0.7;
  return Math.max(fromLog + fromHabits, 5);
}

export default function FutureSelfScreen() {
  const character = useCharacterStore((s) => s.character);
  const activityLog = useCharacterStore((s) => s.activityLog);
  const habits = useHabitStore((s) => s.habits);
  const quests = useQuestStore((s) => s.quests);
  const [selectedHorizon, setSelectedHorizon] = useState(0);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterLoading, setLetterLoading] = useState(false);

  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(24);
  const animStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  useEffect(() => {
    fadeIn.value = withDelay(100, withTiming(1, { duration: 500 }));
    slideUp.value = withDelay(100, withTiming(0, { duration: 500 }));
  }, []);

  if (!character) return null;

  const dailyRate = estimateDailyXPRate(activityLog, habits);
  const horizon = HORIZONS[selectedHorizon];
  const projectedTotalXP = projectXP(character.totalXP, dailyRate, horizon.days);
  const projectedOverallLevel = calcOverallLevel(projectedTotalXP);
  const projectedRank = getLifeRank(projectedOverallLevel);

  const topCategories = Object.values(character.categories)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 4);

  const activeHabitsCount = habits.filter((h) => h.currentStreak > 0).length;
  const completedQuests = quests.filter((q) => q.status === 'completed').length;

  const generateLetter = async () => {
    if (letterLoading) return;
    setLetterLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
      if (!apiKey) throw new Error('No API key');
      const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const prompt = `Write a powerful, personal letter from ${character.name}'s future self — ${horizon.days} days from now.

Current state:
- Rank: ${character.lifeRank}, Level ${character.overallLevel}
- Total progress points: ${character.totalXP.toLocaleString()}
- Active habits maintained: ${activeHabitsCount}
- Goals completed: ${completedQuests}
- Daily rate: ~${Math.round(dailyRate)} pts/day

Future projected state:
- Rank: ${projectedRank}, Level ${projectedOverallLevel}
- Total progress points: ${Math.round(projectedTotalXP).toLocaleString()}

Write in first person ("I remember when..."). Inspired by Jim Rohn's philosophy. Be specific, emotional, and motivating. Reference the actual numbers. 3-4 short paragraphs. No headers.`;

      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.choices[0]?.message?.content?.trim() ?? '';
      setLetter(text);
    } catch (err) {
      setLetter("The future awaits — but first, you have to show up today. Every day you invest in yourself compounds. Keep going.");
    } finally {
      setLetterLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AscendIcon name="chevron-left" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Future Self</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={animStyle}>
          {/* Horizon tabs */}
          <View style={styles.horizonRow}>
            {HORIZONS.map((h, i) => (
              <TouchableOpacity
                key={h.label}
                onPress={() => { setSelectedHorizon(i); setLetter(null); }}
                style={[styles.horizonTab, selectedHorizon === i && { borderColor: h.color, backgroundColor: h.color + '18' }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.horizonTabText, selectedHorizon === i && { color: h.color }]}>
                  {h.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hero projection card */}
          <LinearGradient
            colors={[horizon.color + '22', 'transparent']}
            style={styles.heroCard}
          >
            <View style={styles.heroRow}>
              <View>
                <Text style={styles.heroLabel}>PROJECTED RANK</Text>
                <Text style={[styles.heroRank, { color: horizon.color }]}>{projectedRank}</Text>
                <Text style={styles.heroLevel}>Level {projectedOverallLevel}</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroRight}>
                <Text style={styles.heroXPLabel}>TOTAL POINTS</Text>
                <Text style={[styles.heroXP, { color: horizon.color }]}>
                  {Math.round(projectedTotalXP).toLocaleString()}
                </Text>
                <Text style={styles.heroGain}>
                  +{Math.round(projectedTotalXP - character.totalXP).toLocaleString()} gained
                </Text>
              </View>
            </View>
            <View style={styles.rateRow}>
              <AscendIcon name="flash" size={14} color={horizon.color} />
              <Text style={[styles.rateText, { color: horizon.color }]}>
                ~{Math.round(dailyRate)} pts/day based on your current pace
              </Text>
            </View>
          </LinearGradient>

          {/* Category projections */}
          <Text style={styles.sectionTitle}>Category Projections</Text>
          <View style={styles.catGrid}>
            {topCategories.map((cat) => {
              const projXP = projectXP(cat.xp, (dailyRate * cat.xp) / Math.max(character.totalXP, 1), horizon.days);
              const projLevel = calcLevel(projXP);
              const gain = projLevel - cat.level;
              const catColor = CATEGORY_COLORS[cat.id] ?? COLORS.accent;
              return (
                <View key={cat.id} style={[styles.catCard, { borderColor: catColor + '30' }]}>
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={[styles.catLevel, { color: catColor }]}>Lv {projLevel}</Text>
                  {gain > 0 && (
                    <Text style={[styles.catGain, { color: catColor }]}>+{gain} lvl</Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Habit projection */}
          <View style={styles.statRow}>
            <View style={[styles.statCard, { borderColor: COLORS.warning + '30' }]}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statVal}>{activeHabitsCount} habits</Text>
              <Text style={styles.statSub}>maintained today</Text>
            </View>
            <View style={[styles.statCard, { borderColor: COLORS.accent + '30' }]}>
              <Text style={styles.statEmoji}>⚔️</Text>
              <Text style={styles.statVal}>{completedQuests} quests</Text>
              <Text style={styles.statSub}>completed total</Text>
            </View>
          </View>

          {/* Letter from future self */}
          <Text style={styles.sectionTitle}>Letter from Your Future Self</Text>
          {letter ? (
            <View style={styles.letterCard}>
              <Text style={styles.letterText}>{letter}</Text>
              <Text style={styles.letterSig}>— {character.name}, {horizon.days} days from now</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={generateLetter}
              disabled={letterLoading}
              activeOpacity={0.8}
              style={styles.generateBtn}
            >
              <LinearGradient
                colors={[horizon.color, horizon.color + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.generateBtnGrad}
              >
                {letterLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.generateBtnText}>Writing your letter...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.generateEmoji}>✉️</Text>
                    <Text style={styles.generateBtnText}>Generate Letter from Future Self</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgCardBorder,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, gap: SPACING.md },
  horizonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  horizonTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  horizonTabText: {
    fontSize: 13,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.textMuted,
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    gap: SPACING.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  heroLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroRank: {
    fontSize: 28,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroLevel: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
  },
  heroDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.bgCardBorder,
  },
  heroRight: { flex: 1 },
  heroXPLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroXP: {
    fontSize: 24,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroGain: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rateText: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  catCard: {
    width: '47%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    gap: 2,
  },
  catEmoji: { fontSize: 20 },
  catLabel: {
    fontSize: 12,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    marginTop: 4,
  },
  catLevel: {
    fontSize: 18,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: -0.5,
  },
  catGain: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
  },
  statRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 2,
  },
  statEmoji: { fontSize: 24 },
  statVal: {
    fontSize: 14,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  statSub: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
  },
  letterCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  letterText: {
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  letterSig: {
    fontSize: 12,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  generateBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  generateBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  generateEmoji: { fontSize: 18 },
  generateBtnText: {
    fontSize: 14,
    fontFamily: FONTS.families.displayBold,
    color: '#fff',
    letterSpacing: 0.3,
  },
});
