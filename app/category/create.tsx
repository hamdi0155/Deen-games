import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDisciplineStore } from '../../src/store/disciplineStore';
import { generateDisciplines } from '../../src/services/categoryService';
import { QuestionnaireAnswers, AIDisciplinePayload, DisciplineFrequency } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import { GlowCard } from '../../src/components/ui/GlowCard';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6; // Steps 1-6 (7 = loading, 8 = results)

const CATEGORY_EMOJIS = [
  '🧠', '💪', '📚', '💼', '💰', '❤️', '🌱', '🎨', '🏆', '🌙',
  '🔥', '⚡', '🎯', '🛡️', '🌍', '✍️', '🎵', '🧘', '👑', '💎',
  '🌟', '🏔️', '🚀', '🦁', '🌊', '🌿', '🎭', '🔬', '🏛️', '🦅',
];

const ACCENT_COLORS = [
  '#6366F1', // indigo
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EC4899', // pink
  '#3B82F6', // blue
  '#8B5CF6', // violet
];

const MINUTE_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60+ min', value: 60 },
];

const FREQ_OPTIONS: Array<{
  label: string;
  value: 'daily' | 'weekdays' | 'weekly';
}> = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekly', value: 'weekly' },
];

const STEP_QUOTES = [
  '', // step 0 (unused)
  '"The secret of your future is hidden in your daily routine." — Jim Rohn',
  '"Reasons come first, answers come second." — Jim Rohn',
  '"For things to change, you must change." — Jim Rohn',
  '"The bigger the why, the easier the how." — Jim Rohn',
  '"Discipline is the bridge between goals and accomplishment." — Jim Rohn',
  '"Don\'t wish it were easier, wish you were better." — Jim Rohn',
];

const LOADING_MESSAGES = [
  'Consulting the Life Architect…',
  'Building your practices…',
  'Rooting habits in identity…',
  'Calibrating XP rewards…',
  'Your path is almost ready…',
];

const FREQ_DISPLAY: Record<DisciplineFrequency, { label: string; color: string; bg: string }> = {
  daily:    { label: 'Daily',    color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  weekdays: { label: 'Weekdays', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  weekly:   { label: 'Weekly',   color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  monthly:  { label: 'Monthly',  color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateCategoryScreen() {
  const router = useRouter();
  const { builtinId, builtinLabel, builtinEmoji, builtinColor } =
    useLocalSearchParams<{
      builtinId?: string;
      builtinLabel?: string;
      builtinEmoji?: string;
      builtinColor?: string;
    }>();

  const isBuiltinMode = Boolean(builtinId);

  // ─── Initial answers ──────────────────────────────────────────────────────
  const initialAnswers: QuestionnaireAnswers = {
    categoryName: builtinLabel ?? '',
    categoryEmoji: builtinEmoji ?? '🧠',
    categoryColor: builtinColor ?? '#6366F1',
    vision3Years: '',
    whoBecoming: '',
    currentScore: 5,
    alreadyDoingWell: '',
    whyMatters: '',
    whoElseBenefits: '',
    dailyMinutes: 30,
    preferredFrequency: 'daily',
    mainObstacle: '',
  };

  const addCustomCategory = useDisciplineStore((s) => s.addCustomCategory);
  const saveGeneratedPayload = useDisciplineStore((s) => s.saveGeneratedPayload);

  // When in builtin mode start at step 2 (skip naming/emoji/color)
  const initialStep = isBuiltinMode ? 2 : 1;
  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [generatedCategoryId, setGeneratedCategoryId] = useState<string | null>(null);
  const [generatedPayload, setGeneratedPayload] = useState<AIDisciplinePayload | null>(null);
  const [editableDisciplines, setEditableDisciplines] = useState<
    AIDisciplinePayload['disciplines']
  >([]);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  // Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step === 7) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      loadingInterval.current = setInterval(() => {
        setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
      }, 2000);

      return () => {
        if (loadingInterval.current) clearInterval(loadingInterval.current);
      };
    }
  }, [step]);

  const update = <K extends keyof QuestionnaireAnswers>(
    key: K,
    value: QuestionnaireAnswers[K]
  ) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const canAdvanceStep = (): boolean => {
    switch (step) {
      case 1:
        return answers.categoryName.trim().length > 0;
      case 2:
        return (
          answers.vision3Years.trim().length > 0 &&
          answers.whoBecoming.trim().length > 0
        );
      case 3:
        return answers.alreadyDoingWell.trim().length > 0;
      case 4:
        return (
          answers.whyMatters.trim().length > 0 &&
          answers.whoElseBenefits.trim().length > 0
        );
      case 5:
        return true; // chips always have a value
      case 6:
        return answers.mainObstacle.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (step < 6) {
      setStep((s) => s + 1);
    } else if (step === 6) {
      setLocalError(null);

      let catId: string;
      if (isBuiltinMode && builtinId) {
        // Builtin category — no need to create a custom category entry
        catId = builtinId;
      } else {
        // Custom category — create the entry first
        catId = addCustomCategory({
          label: answers.categoryName.trim(),
          emoji: answers.categoryEmoji,
          color: answers.categoryColor,
        });
      }
      setGeneratedCategoryId(catId);
      setStep(7); // loading

      try {
        // Call service, then save via store
        const payload = await generateDisciplines(answers);
        setGeneratedPayload(payload);
        setEditableDisciplines([...payload.disciplines]);
        saveGeneratedPayload(payload, answers, catId);
        setStep(8); // results
      } catch (err) {
        setLocalError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.'
        );
        setStep(6); // go back so user can retry
      }
    }
  };

  const handleConfirm = () => {
    if (isBuiltinMode && builtinId) {
      router.replace(`/category/${builtinId}` as any);
    } else if (generatedCategoryId) {
      router.replace(`/category/${generatedCategoryId}` as any);
    } else {
      router.replace('/(tabs)');
    }
  };

  const accent = answers.categoryColor;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Ambient orbs */}
      <View style={[styles.orb1, { backgroundColor: `${accent}10` }]} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* Header */}
        {step <= 6 && (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => (step > initialStep ? setStep((s) => s - 1) : router.back())}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.accent} />
            </TouchableOpacity>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: isBuiltinMode
                      ? `${((step - 1) / 5) * 100}%`
                      : `${(step / TOTAL_STEPS) * 100}%`,
                    backgroundColor: accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.stepLabel}>
              {isBuiltinMode ? `${step - 1}/5` : `${step}/${TOTAL_STEPS}`}
            </Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── STEP 1: Category Identity ── */}
          {step === 1 && (
            <StepWrapper
              quote={STEP_QUOTES[1]}
              title="Name Your Domain"
              subtitle="Give this area of your life a name. This becomes your identity anchor."
            >
              {/* Name input */}
              <Text style={styles.fieldLabel}>Category Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Deep Work, Spanish, Fitness…"
                placeholderTextColor={COLORS.textDim}
                value={answers.categoryName}
                onChangeText={(v) => update('categoryName', v)}
                maxLength={32}
                autoFocus
              />

              {/* Emoji grid */}
              <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>
                Choose an Emblem
              </Text>
              <View style={styles.emojiGrid}>
                {CATEGORY_EMOJIS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[
                      styles.emojiCell,
                      answers.categoryEmoji === e && {
                        borderColor: accent,
                        backgroundColor: `${accent}20`,
                      },
                    ]}
                    onPress={() => update('categoryEmoji', e)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Color swatches */}
              <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>
                Accent Color
              </Text>
              <View style={styles.swatches}>
                {ACCENT_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.swatch,
                      { backgroundColor: c },
                      answers.categoryColor === c && styles.swatchSelected,
                    ]}
                    onPress={() => update('categoryColor', c)}
                    activeOpacity={0.8}
                  >
                    {answers.categoryColor === c && (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preview pill */}
              {answers.categoryName.trim().length > 0 && (
                <View
                  style={[
                    styles.previewPill,
                    { borderColor: `${accent}40`, backgroundColor: `${accent}10` },
                  ]}
                >
                  <Text style={styles.previewEmoji}>{answers.categoryEmoji}</Text>
                  <Text style={[styles.previewName, { color: accent }]}>
                    {answers.categoryName.trim()}
                  </Text>
                </View>
              )}
            </StepWrapper>
          )}

          {/* ── STEP 2: Vision ── */}
          {step === 2 && (
            <StepWrapper
              quote={STEP_QUOTES[2]}
              title="Cast Your Vision"
              subtitle="Reasons come first. Without a compelling future, discipline has no fuel."
            >
              <Text style={styles.fieldLabel}>
                What does mastery in{' '}
                <Text style={{ color: accent }}>
                  {answers.categoryName}
                </Text>{' '}
                look like in 3 years?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Paint the picture in detail — where do you live, how do you feel, what have you built…"
                placeholderTextColor={COLORS.textDim}
                value={answers.vision3Years}
                onChangeText={(v) => update('vision3Years', v)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>
                Who are you becoming as you grow in this area?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="I am becoming the person who… the type of individual who…"
                placeholderTextColor={COLORS.textDim}
                value={answers.whoBecoming}
                onChangeText={(v) => update('whoBecoming', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </StepWrapper>
          )}

          {/* ── STEP 3: Current Reality ── */}
          {step === 3 && (
            <StepWrapper
              quote={STEP_QUOTES[3]}
              title="Know Where You Stand"
              subtitle="Honest assessment is the beginning of all real progress."
            >
              <Text style={styles.fieldLabel}>
                Rate yourself in{' '}
                <Text style={{ color: accent }}>{answers.categoryName}</Text>{' '}
                today (1–10)
              </Text>
              <View style={styles.scoreRow}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.scoreCell,
                      answers.currentScore === n && {
                        backgroundColor: accent,
                        borderColor: accent,
                        shadowColor: accent,
                        shadowOpacity: 0.6,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 0 },
                      },
                    ]}
                    onPress={() => update('currentScore', n)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.scoreText,
                        answers.currentScore === n && styles.scoreTextSelected,
                      ]}
                    >
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { marginTop: SPACING.xl }]}>
                What's one thing you're already doing right in this area?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Even a small win counts — what's working?"
                placeholderTextColor={COLORS.textDim}
                value={answers.alreadyDoingWell}
                onChangeText={(v) => update('alreadyDoingWell', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </StepWrapper>
          )}

          {/* ── STEP 4: The Why ── */}
          {step === 4 && (
            <StepWrapper
              quote={STEP_QUOTES[4]}
              title="Your Deep Why"
              subtitle="Surface reasons run out. Find the reason that survives your hardest days."
            >
              <Text style={styles.fieldLabel}>
                Why does improving{' '}
                <Text style={{ color: accent }}>{answers.categoryName}</Text>{' '}
                matter deeply to you?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Go beyond the surface. Why does this truly matter at your core?"
                placeholderTextColor={COLORS.textDim}
                value={answers.whyMatters}
                onChangeText={(v) => update('whyMatters', v)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={[styles.fieldLabel, { marginTop: SPACING.lg }]}>
                Who else benefits when you master this?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Your family, your team, your community… who wins when you win?"
                placeholderTextColor={COLORS.textDim}
                value={answers.whoElseBenefits}
                onChangeText={(v) => update('whoElseBenefits', v)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </StepWrapper>
          )}

          {/* ── STEP 5: Commitment ── */}
          {step === 5 && (
            <StepWrapper
              quote={STEP_QUOTES[5]}
              title="Make the Commitment"
              subtitle="Realistic commitments kept outperform ambitious commitments broken."
            >
              <Text style={styles.fieldLabel}>
                How many minutes per day can you realistically commit?
              </Text>
              <View style={styles.chipRow}>
                {MINUTE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.chip,
                      answers.dailyMinutes === opt.value && {
                        backgroundColor: accent,
                        borderColor: accent,
                      },
                    ]}
                    onPress={() => update('dailyMinutes', opt.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        answers.dailyMinutes === opt.value && styles.chipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { marginTop: SPACING.xl }]}>
                Which frequency works for deeper practice?
              </Text>
              <View style={styles.chipRow}>
                {FREQ_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.chip,
                      answers.preferredFrequency === opt.value && {
                        backgroundColor: accent,
                        borderColor: accent,
                      },
                    ]}
                    onPress={() => update('preferredFrequency', opt.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        answers.preferredFrequency === opt.value &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GlowCard glowColor={accent} style={styles.commitCard}>
                <Text style={styles.commitEmoji}>{answers.categoryEmoji}</Text>
                <Text style={styles.commitText}>
                  I commit to{' '}
                  <Text style={{ color: accent, fontFamily: FONTS.families.bodySemibold }}>
                    {answers.dailyMinutes} minutes
                  </Text>{' '}
                  of{' '}
                  <Text style={{ color: accent, fontFamily: FONTS.families.bodySemibold }}>
                    {answers.preferredFrequency}
                  </Text>{' '}
                  practice in{' '}
                  <Text style={{ color: accent, fontFamily: FONTS.families.bodySemibold }}>
                    {answers.categoryName}
                  </Text>
                  .
                </Text>
              </GlowCard>
            </StepWrapper>
          )}

          {/* ── STEP 6: Obstacles ── */}
          {step === 6 && (
            <StepWrapper
              quote={STEP_QUOTES[6]}
              title="Face the Obstacle"
              subtitle="Name your enemy. What you resist, you empower. What you acknowledge, you can overcome."
            >
              <Text style={styles.fieldLabel}>
                What has held you back from improving{' '}
                <Text style={{ color: accent }}>{answers.categoryName}</Text>{' '}
                before?
              </Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="Be honest — time, fear, distraction, lack of knowledge, past failures…"
                placeholderTextColor={COLORS.textDim}
                value={answers.mainObstacle}
                onChangeText={(v) => update('mainObstacle', v)}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                autoFocus
              />

              {localError && (
                <GlowCard glowColor={COLORS.danger} style={styles.errorCard}>
                  <Text style={styles.errorText}>{localError}</Text>
                  <Text style={styles.errorHint}>Tap "Generate My Path" to try again.</Text>
                </GlowCard>
              )}
            </StepWrapper>
          )}

          {/* ── STEP 7: Loading / Generating ── */}
          {step === 7 && (
            <View style={styles.loadingContainer}>
              <Animated.Text style={[styles.loadingEmoji, { opacity: pulseAnim }]}>
                {answers.categoryEmoji}
              </Animated.Text>
              <Text style={styles.loadingTitle}>The Life Architect is working…</Text>
              <Text style={styles.loadingMsg}>
                {LOADING_MESSAGES[loadingMsgIndex]}
              </Text>
              <View style={styles.loadingDots}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={[styles.dot, { backgroundColor: accent }]}
                  />
                ))}
              </View>
              <Text style={styles.loadingQuote}>
                "Small disciplines repeated consistently over time lead to great
                achievement." — Jim Rohn
              </Text>
            </View>
          )}

          {/* ── STEP 8: Review & Confirm ── */}
          {step === 8 && generatedPayload && (
            <View style={styles.resultsContainer}>
              {/* Header */}
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsEmoji}>{answers.categoryEmoji}</Text>
                <Text style={[styles.resultsTitle, { color: accent }]}>
                  {answers.categoryName}
                </Text>
                <Text style={styles.resultsSub}>Your Path is Ready</Text>
              </View>

              {/* Philosophy Statement */}
              <GlowCard glowColor={accent} style={styles.philosophyCard}>
                <Text style={styles.philosophyLabel}>Your Philosophy</Text>
                <Text style={styles.philosophyText}>
                  {generatedPayload.philosophyStatement}
                </Text>
                <View style={styles.quoteRow}>
                  <Text style={styles.quoteBar}>|</Text>
                  <Text style={styles.quoteText}>{generatedPayload.jimRohnQuote}</Text>
                </View>
              </GlowCard>

              {/* Disciplines grouped by frequency */}
              {(['daily', 'weekdays', 'weekly', 'monthly'] as DisciplineFrequency[]).map(
                (freq) => {
                  const group = editableDisciplines.filter((d) => d.frequency === freq);
                  if (group.length === 0) return null;
                  const freqConfig = FREQ_DISPLAY[freq];
                  return (
                    <View key={freq} style={styles.freqGroup}>
                      <View style={styles.freqGroupLabelRow}>
                        <Ionicons
                          name={
                            freq === 'daily'
                              ? 'sunny-outline'
                              : freq === 'weekdays'
                              ? 'calendar-outline'
                              : freq === 'weekly'
                              ? 'calendar-number-outline'
                              : 'moon-outline'
                          }
                          size={13}
                          color={freqConfig.color}
                        />
                        <Text
                          style={[styles.freqGroupLabel, { color: freqConfig.color }]}
                        >
                          {freq === 'daily'
                            ? 'Daily Practices'
                            : freq === 'weekdays'
                            ? 'Weekday Practices'
                            : freq === 'weekly'
                            ? 'Weekly Practices'
                            : 'Monthly Rituals'}
                        </Text>
                      </View>
                      {group.map((disc, idx) => {
                        const globalIdx = editableDisciplines.indexOf(disc);
                        return (
                          <GlowCard key={idx} style={styles.disciplinePreviewCard}>
                            <View style={styles.disciplinePreviewHeader}>
                              <View
                                style={[
                                  styles.freqChip,
                                  { backgroundColor: freqConfig.bg },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.freqChipText,
                                    { color: freqConfig.color },
                                  ]}
                                >
                                  {freqConfig.label}
                                </Text>
                              </View>
                              <Text style={styles.discMinutes}>
                                {disc.estimatedMinutes} min
                              </Text>
                              <View
                                style={[
                                  styles.xpChip,
                                  { borderColor: `${accent}40` },
                                ]}
                              >
                                <Text style={[styles.xpChipText, { color: accent }]}>
                                  +{disc.xpReward} XP
                                </Text>
                              </View>
                            </View>
                            <TextInput
                              style={styles.discTitleInput}
                              value={disc.title}
                              onChangeText={(v) => {
                                setEditableDisciplines((prev) =>
                                  prev.map((d, i) =>
                                    i === globalIdx ? { ...d, title: v } : d
                                  )
                                );
                              }}
                              placeholderTextColor={COLORS.textDim}
                            />
                            <Text style={styles.discDesc}>{disc.description}</Text>
                          </GlowCard>
                        );
                      })}
                    </View>
                  );
                }
              )}

              {/* Confirm button */}
              <TouchableOpacity
                style={[styles.forgeBtn, { backgroundColor: accent, shadowColor: accent }]}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <View style={styles.forgeBtnInner}>
                  <Text style={styles.forgeBtnText}>Build My Path</Text>
                  <Ionicons name="shield-checkmark" size={20} color="#fff" />
                </View>
              </TouchableOpacity>

              <View style={{ height: SPACING.xxl }} />
            </View>
          )}
        </ScrollView>

        {/* Next button (steps 1-6) */}
        {step <= 6 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.nextBtn,
                { backgroundColor: accent, shadowColor: accent },
                !canAdvanceStep() && styles.nextBtnDisabled,
              ]}
              onPress={handleNext}
              disabled={!canAdvanceStep()}
              activeOpacity={0.8}
            >
              <View style={styles.nextBtnInner}>
                <Text style={styles.nextBtnText}>
                  {step === 6 ? 'Generate My Path' : 'Continue'}
                </Text>
                <Ionicons
                  name={step === 6 ? 'flash' : 'arrow-forward'}
                  size={18}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── StepWrapper ──────────────────────────────────────────────────────────────

function StepWrapper({
  quote,
  title,
  subtitle,
  children,
}: {
  quote: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.stepContainer}>
      {quote ? <Text style={styles.stepQuote}>{quote}</Text> : null}
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSubtitle}>{subtitle}</Text>
      <View style={styles.stepFields}>{children}</View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, overflow: 'hidden' },
  flex: { flex: 1 },
  orb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -80,
  },
  orb2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(124,58,237,0.05)',
    bottom: -80,
    left: -80,
  },

  // Header / progress
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: { padding: SPACING.xs },
  backText: { color: COLORS.accent, fontSize: FONTS.sizes.xl },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, borderRadius: 2 },
  stepLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.displayLight,
    minWidth: 28,
    textAlign: 'right',
    letterSpacing: 1,
  },

  scroll: { flexGrow: 1, paddingBottom: SPACING.xxl },

  // Step wrapper
  stepContainer: { padding: SPACING.lg, paddingTop: SPACING.xl, gap: SPACING.md },
  stepQuote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textDim,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 16,
  },
  stepTitle: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  stepSubtitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  stepFields: { marginTop: SPACING.sm, gap: SPACING.sm },

  // Field label
  fieldLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.displayLight,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },

  // Text inputs
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  inputMulti: { minHeight: 100, textAlignVertical: 'top' },

  // Emoji grid
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  emojiCell: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 26 },

  // Color swatches
  swatches: { flexDirection: 'row', gap: SPACING.md },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  swatchCheck: { color: '#fff', fontSize: 16, fontFamily: FONTS.families.bodyBold },

  // Preview pill
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.md,
  },
  previewEmoji: { fontSize: 20 },
  previewName: { fontSize: FONTS.sizes.md, fontFamily: FONTS.families.bodySemibold },

  // Score row (Step 3)
  scoreRow: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  scoreCell: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    fontFamily: FONTS.families.bodySemibold,
  },
  scoreTextSelected: { color: '#000', fontFamily: FONTS.families.bodyBold },

  // Chips (Step 5)
  chipRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontFamily: FONTS.families.bodySemibold },
  chipTextSelected: { color: '#fff', fontFamily: FONTS.families.bodyBold },

  // Commitment card (Step 5)
  commitCard: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xl,
  },
  commitEmoji: { fontSize: 40 },
  commitText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Error card
  errorCard: {
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  errorText: { fontSize: FONTS.sizes.sm, color: COLORS.danger, fontFamily: FONTS.families.bodySemibold },
  errorHint: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontFamily: FONTS.families.body },

  // Footer next button
  footer: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  nextBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  nextBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  nextBtnDisabled: { opacity: 0.3 },
  nextBtnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontFamily: FONTS.families.displayMedium, letterSpacing: 1 },

  // Loading (Step 7)
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    padding: SPACING.xl,
    minHeight: 500,
  },
  loadingEmoji: { fontSize: 72 },
  loadingTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingMsg: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  loadingDots: { flexDirection: 'row', gap: SPACING.sm },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.6 },
  loadingQuote: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textDim,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 18,
    marginTop: SPACING.xl,
  },

  // Results (Step 8)
  resultsContainer: { padding: SPACING.lg, gap: SPACING.xl },
  resultsHeader: { alignItems: 'center', gap: SPACING.sm },
  resultsEmoji: { fontSize: 64 },
  resultsTitle: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.5,
  },
  resultsSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: FONTS.families.displayLight,
  },

  philosophyCard: { gap: SPACING.md },
  philosophyLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: FONTS.families.displayLight,
  },
  philosophyText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.bodyMedium,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  quoteBar: { color: COLORS.textDim, fontSize: FONTS.sizes.xl },
  quoteText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textDim,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  freqGroup: { gap: SPACING.sm },
  freqGroupLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  freqGroupLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },

  disciplinePreviewCard: { gap: SPACING.sm },
  disciplinePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  freqChip: {
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  freqChipText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  discMinutes: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, flex: 1, fontFamily: FONTS.families.body },
  xpChip: {
    borderWidth: 1,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  xpChipText: { fontSize: FONTS.sizes.xs, fontFamily: FONTS.families.display },
  discTitleInput: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontFamily: FONTS.families.bodySemibold,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  discDesc: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  forgeBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  forgeBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  forgeBtnText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.displayMedium,
    letterSpacing: 1,
  },
});
