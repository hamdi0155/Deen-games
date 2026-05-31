import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { useMorningStore } from '../src/store/morningStore';
import { getDailyWisdom } from '../src/services/wisdomService';
import { useCharacterStore } from '../src/store/characterStore';
import { AuroraBackground } from '../src/components/ui/AuroraBackground';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';

const STEPS = ['intro', 'mood', 'sleep', 'intention', 'priorities', 'energy', 'launch'] as const;
type Step = typeof STEPS[number];

const MOOD_OPTIONS = [
  { value: 1, emoji: '😔', label: 'Rough' },
  { value: 2, emoji: '😐', label: 'Okay' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😊', label: 'Great' },
  { value: 5, emoji: '🔥', label: 'Epic' },
];

const SLEEP_OPTIONS = [
  { value: 1, emoji: '😴', label: '< 5h' },
  { value: 2, emoji: '🥱', label: '5-6h' },
  { value: 3, emoji: '😌', label: '6-7h' },
  { value: 4, emoji: '😄', label: '7-8h' },
  { value: 5, emoji: '⚡', label: '8h+' },
];

const ENERGY_OPTIONS = [
  { value: 1, label: 'Depleted', color: '#E84545' },
  { value: 2, label: 'Low', color: '#E8941A' },
  { value: 3, label: 'Moderate', color: '#C9A84C' },
  { value: 4, label: 'High', color: '#0EA875' },
  { value: 5, label: 'Peak', color: '#5B6CF5' },
];

const MORNING_WISDOM = [
  'Discipline is the bridge between goals and accomplishment.',
  'Every morning is a new beginning. Your choices today shape your destiny.',
  'Success is the result of small daily improvements compounding over time.',
  'The way you start your morning sets the tone for your entire day.',
  'Focus on progress, not perfection. One step forward is still forward.',
];

function getMorningQuote(): string {
  const wisdom = getDailyWisdom();
  return wisdom.text;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Still awake,';
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function MorningActivationScreen() {
  const router = useRouter();
  const setMorningData = useMorningStore((s) => s.setMorningData);
  const character = useCharacterStore((s) => s.character);

  const [step, setStep] = useState<Step>('intro');
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [intention, setIntention] = useState('');
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const [energy, setEnergy] = useState<number | null>(null);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  const progressAnim = useSharedValue(0);

  const stepIndex = STEPS.indexOf(step);
  const totalSteps = STEPS.length - 1; // exclude intro

  useEffect(() => {
    fadeAnim.value = 0;
    slideAnim.value = 30;
    fadeAnim.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    slideAnim.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    progressAnim.value = withTiming(stepIndex / totalSteps, { duration: 600 });
  }, [step]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%` as any,
  }));

  const advance = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const finish = () => {
    if (mood && sleep && energy) {
      setMorningData({
        mood,
        sleepQuality: sleep,
        intention: intention || 'Make today count.',
        priorities: priorities.filter(Boolean),
        energyLevel: energy,
      });
    }
    router.replace('/(tabs)' as any);
  };

  const canAdvance = () => {
    if (step === 'intro') return true;
    if (step === 'mood') return mood !== null;
    if (step === 'sleep') return sleep !== null;
    if (step === 'intention') return true; // optional
    if (step === 'priorities') return true; // optional
    if (step === 'energy') return energy !== null;
    return true;
  };

  const updatePriority = (idx: number, val: string) => {
    const next = [...priorities];
    next[idx] = val;
    setPriorities(next);
  };

  return (
    <LinearGradient colors={['#07090F', '#0A0614', '#07090F']} style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={styles.safe}>
        {/* Progress bar */}
        {step !== 'intro' && step !== 'launch' && (
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.content, contentStyle]}>
              {/* INTRO */}
              {step === 'intro' && (
                <View style={styles.stepWrap}>
                  <View style={styles.introGlow}>
                    <AscendIcon name="star" size={48} color={COLORS.gold} filled />
                  </View>
                  <Text style={styles.introGreeting}>{getGreeting()}</Text>
                  <Text style={styles.introName}>{character?.name ?? 'Warrior'}</Text>
                  <Text style={styles.introQuote}>"{getMorningQuote()}"</Text>
                  <Text style={styles.introSub}>
                    Take 60 seconds to set the tone for your day.
                  </Text>
                  <TouchableOpacity
                    onPress={advance}
                    style={styles.primaryBtn}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#5B6CF5', '#4550D4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.primaryBtnGrad}
                    >
                      <Text style={styles.primaryBtnText}>Begin Activation</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={finish} activeOpacity={0.6}>
                    <Text style={styles.skipText}>Skip for today</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* MOOD */}
              {step === 'mood' && (
                <View style={styles.stepWrap}>
                  <Text style={styles.stepNumber}>1 of 5</Text>
                  <Text style={styles.stepQuestion}>How are you feeling right now?</Text>
                  <Text style={styles.stepHint}>Be honest. Awareness is the first step.</Text>
                  <View style={styles.emojiRow}>
                    {MOOD_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setMood(opt.value)}
                        activeOpacity={0.8}
                        style={[
                          styles.emojiOption,
                          mood === opt.value && styles.emojiOptionSelected,
                        ]}
                      >
                        <Text style={styles.emojiLarge}>{opt.emoji}</Text>
                        <Text style={[
                          styles.emojiLabel,
                          mood === opt.value && { color: COLORS.text },
                        ]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* SLEEP */}
              {step === 'sleep' && (
                <View style={styles.stepWrap}>
                  <Text style={styles.stepNumber}>2 of 5</Text>
                  <Text style={styles.stepQuestion}>How did you sleep?</Text>
                  <Text style={styles.stepHint}>Sleep is the ultimate performance optimizer.</Text>
                  <View style={styles.emojiRow}>
                    {SLEEP_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setSleep(opt.value)}
                        activeOpacity={0.8}
                        style={[
                          styles.emojiOption,
                          sleep === opt.value && styles.emojiOptionSelected,
                        ]}
                      >
                        <Text style={styles.emojiLarge}>{opt.emoji}</Text>
                        <Text style={[
                          styles.emojiLabel,
                          sleep === opt.value && { color: COLORS.text },
                        ]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* INTENTION */}
              {step === 'intention' && (
                <View style={styles.stepWrap}>
                  <Text style={styles.stepNumber}>3 of 5</Text>
                  <Text style={styles.stepQuestion}>Set your focus intention</Text>
                  <Text style={styles.stepHint}>What is the ONE thing that matters most today?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Stay disciplined and finish the project..."
                    placeholderTextColor={COLORS.textMuted}
                    value={intention}
                    onChangeText={setIntention}
                    multiline
                    maxLength={120}
                    autoFocus
                  />
                  <Text style={styles.inputCount}>{intention.length}/120</Text>
                </View>
              )}

              {/* PRIORITIES */}
              {step === 'priorities' && (
                <View style={styles.stepWrap}>
                  <Text style={styles.stepNumber}>4 of 5</Text>
                  <Text style={styles.stepQuestion}>Top 3 priorities</Text>
                  <Text style={styles.stepHint}>The most important tasks to complete today.</Text>
                  {[0, 1, 2].map((idx) => (
                    <View key={idx} style={styles.priorityRow}>
                      <View style={[styles.priorityNum, { backgroundColor: idx === 0 ? COLORS.gold + '30' : 'rgba(255,255,255,0.06)' }]}>
                        <Text style={[styles.priorityNumText, { color: idx === 0 ? COLORS.gold : COLORS.textMuted }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      <TextInput
                        style={styles.priorityInput}
                        placeholder={idx === 0 ? 'Most critical task...' : idx === 1 ? 'Second priority...' : 'Third priority...'}
                        placeholderTextColor={COLORS.textMuted}
                        value={priorities[idx]}
                        onChangeText={(v) => updatePriority(idx, v)}
                        maxLength={80}
                        returnKeyType="next"
                      />
                    </View>
                  ))}
                </View>
              )}

              {/* ENERGY */}
              {step === 'energy' && (
                <View style={styles.stepWrap}>
                  <Text style={styles.stepNumber}>5 of 5</Text>
                  <Text style={styles.stepQuestion}>Energy level estimate</Text>
                  <Text style={styles.stepHint}>This adapts your goal difficulty for today.</Text>
                  <View style={styles.energyGrid}>
                    {ENERGY_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        onPress={() => setEnergy(opt.value)}
                        activeOpacity={0.8}
                        style={[
                          styles.energyOption,
                          energy === opt.value && {
                            borderColor: opt.color,
                            backgroundColor: opt.color + '20',
                          },
                        ]}
                      >
                        <View style={[styles.energyBar, { backgroundColor: opt.color }]}>
                          {Array.from({ length: opt.value }).map((_, i) => (
                            <View key={i} style={styles.energyBarFill} />
                          ))}
                        </View>
                        <Text style={[
                          styles.energyLabel,
                          energy === opt.value && { color: opt.color },
                        ]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* LAUNCH */}
              {step === 'launch' && (
                <View style={styles.stepWrap}>
                  <View style={[styles.introGlow, { backgroundColor: COLORS.success + '20' }]}>
                    <AscendIcon name="flash" size={48} color={COLORS.success} />
                  </View>
                  <Text style={styles.launchTitle}>You're activated.</Text>
                  <Text style={styles.launchSub}>
                    "{intention || 'Make today count.'}"
                  </Text>
                  {priorities.filter(Boolean).length > 0 && (
                    <View style={styles.launchPriorities}>
                      <Text style={styles.launchPrioritiesLabel}>TODAY'S TARGETS</Text>
                      {priorities.filter(Boolean).map((p, i) => (
                        <View key={i} style={styles.launchPriorityRow}>
                          <View style={[styles.launchPriorityDot, { backgroundColor: i === 0 ? COLORS.gold : COLORS.textMuted }]} />
                          <Text style={styles.launchPriorityText}>{p}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <Text style={styles.launchQuote}>
                    "Discipline is the bridge between goals and accomplishment."
                  </Text>
                  <Text style={styles.launchQuoteAttr}>— Jim Rohn</Text>
                  <TouchableOpacity
                    onPress={finish}
                    style={styles.primaryBtn}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#0EA875', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.primaryBtnGrad}
                    >
                      <Text style={styles.primaryBtnText}>Enter the Arena</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </ScrollView>

          {/* Nav buttons */}
          {step !== 'intro' && step !== 'launch' && (
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={() => setStep(STEPS[stepIndex - 1])}
                style={styles.backBtn}
                activeOpacity={0.7}
              >
                <AscendIcon name="chevron-left" size={18} color={COLORS.textSecondary} />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={stepIndex === totalSteps - 1 ? () => setStep('launch') : advance}
                disabled={!canAdvance()}
                activeOpacity={0.85}
                style={[styles.nextBtn, !canAdvance() && styles.nextBtnDisabled]}
              >
                <LinearGradient
                  colors={canAdvance() ? ['#5B6CF5', '#4550D4'] : ['#1a1c2e', '#1a1c2e']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextBtnGrad}
                >
                  <Text style={[styles.nextBtnText, !canAdvance() && { color: COLORS.textMuted }]}>
                    {stepIndex === totalSteps - 1 ? 'Complete' : 'Continue'}
                  </Text>
                  <AscendIcon
                    name="chevron-right"
                    size={16}
                    color={canAdvance() ? '#fff' : COLORS.textMuted}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  content: { gap: SPACING.lg },
  stepWrap: {
    gap: SPACING.lg,
    alignItems: 'center',
  },
  // Intro
  introGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: SPACING.sm,
  },
  introGreeting: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  introName: {
    fontSize: 36,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: -0.5,
    marginTop: -SPACING.sm,
  },
  introQuote: {
    fontSize: 15,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    paddingHorizontal: SPACING.md,
  },
  introSub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  // Step labels
  stepNumber: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stepQuestion: {
    fontSize: 26,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  stepHint: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Emoji grid
  emojiRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  emojiOption: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: COLORS.bgCard,
    minWidth: 60,
  },
  emojiOptionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentDim,
  },
  emojiLarge: { fontSize: 32 },
  emojiLabel: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  // Text inputs
  input: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputCount: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.displayLight,
    marginTop: -SPACING.sm,
  },
  // Priorities
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    width: '100%',
  },
  priorityNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  priorityNumText: {
    fontSize: 14,
    fontFamily: FONTS.families.displayBold,
  },
  priorityInput: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
  },
  // Energy
  energyGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  energyOption: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: COLORS.bgCard,
    minWidth: 60,
  },
  energyBar: {
    width: 8,
    height: 40,
    borderRadius: 4,
    opacity: 0.8,
  },
  energyBarFill: {},
  energyLabel: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  // Launch
  launchTitle: {
    fontSize: 36,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  launchSub: {
    fontSize: 16,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  launchPriorities: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  launchPrioritiesLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  launchPriorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  launchPriorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  launchPriorityText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    flex: 1,
  },
  launchQuote: {
    fontSize: 13,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  launchQuoteAttr: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  // Buttons
  primaryBtn: {
    width: '100%',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  primaryBtnGrad: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayBold,
    color: '#fff',
    letterSpacing: 0.8,
  },
  skipText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  // Nav
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  backBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textSecondary,
  },
  nextBtn: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  nextBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
  },
  nextBtnText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayBold,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
