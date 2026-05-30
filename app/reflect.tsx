// ============================================================
// Daily Reflection Screen — Stoic philosophy inspired
// Premium dark luxury journaling experience
// ============================================================
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
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AuroraBackground } from '../src/components/ui/AuroraBackground';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS, SPRING, DURATION } from '../src/constants/theme';

// ---------------------------------------------------------------------------
// Prompts — 7 Stoic reflection questions, one per day of the week
// ---------------------------------------------------------------------------
const PROMPTS = [
  { question: 'How will you be better than yesterday?', category: 'growth' },
  { question: 'What one action today moves you forward?', category: 'discipline' },
  { question: 'What are you committed to becoming?', category: 'identity' },
  { question: 'Who must you be to achieve your goals?', category: 'identity' },
  { question: 'What would your best self do right now?', category: 'discipline' },
  { question: 'What did you learn today that changes how you act tomorrow?', category: 'growth' },
  { question: 'What fear are you choosing to face this week?', category: 'courage' },
];

const CATEGORY_LABELS: Record<string, string> = {
  growth:     'GROWTH',
  discipline: 'DISCIPLINE',
  identity:   'IDENTITY',
  courage:    'COURAGE',
};

const CATEGORY_COLORS: Record<string, string> = {
  growth:     '#0EA875',
  discipline: '#5B6CF5',
  identity:   '#C9A84C',
  courage:    '#E84545',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Entrance animation hook — mirrors the pattern from index.tsx
// ---------------------------------------------------------------------------
function useEntranceAnimation(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: DURATION.standard }));
    translateY.value = withDelay(delay, withSpring(0, SPRING.gentle));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function ReflectScreen() {
  const router = useRouter();

  // Today's prompt index (day-of-week cycles through 7 prompts)
  const todayIndex = new Date().getDay(); // 0 = Sunday
  const [promptIndex, setPromptIndex] = useState(todayIndex);
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  const currentPrompt = PROMPTS[promptIndex % PROMPTS.length];
  const prevIndex = (promptIndex - 1 + PROMPTS.length) % PROMPTS.length;
  const prevPrompt = PROMPTS[prevIndex];
  const categoryColor = CATEGORY_COLORS[currentPrompt.category] ?? COLORS.accent;
  const categoryLabel = CATEGORY_LABELS[currentPrompt.category] ?? currentPrompt.category.toUpperCase();

  // Staggered entrance animations
  const headerAnim  = useEntranceAnimation(0);
  const promptAnim  = useEntranceAnimation(120);
  const inputAnim   = useEntranceAnimation(240);
  const footerAnim  = useEntranceAnimation(320);

  const handleSave = () => {
    if (saved) return;
    setSaved(true);
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  const handlePrevPrompt = () => {
    setPromptIndex(prevIndex);
    setAnswer('');
    setSaved(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AuroraBackground />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ─────────────────────────────────────── */}
          <Animated.View style={[styles.header, headerAnim]}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <AscendIcon name="chevron-left" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Daily Reflection</Text>
              <Text style={styles.headerDate}>{formatDate(new Date())}</Text>
            </View>

            {/* Spacer to balance the back button */}
            <View style={styles.backBtn} />
          </Animated.View>

          {/* ── PROMPT CARD ────────────────────────────────── */}
          <Animated.View style={[styles.promptWrapper, promptAnim]}>
            <LinearGradient
              colors={['rgba(91,108,245,0.12)', 'rgba(91,108,245,0.04)', 'transparent']}
              style={styles.promptCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              {/* Card border overlay */}
              <View style={styles.promptBorder} pointerEvents="none" />

              {/* Category label */}
              <View style={[styles.categoryPill, { borderColor: categoryColor + '40' }]}>
                <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                <Text style={[styles.categoryLabel, { color: categoryColor }]}>
                  {categoryLabel}
                </Text>
              </View>

              {/* The question */}
              <Text style={styles.questionText}>{currentPrompt.question}</Text>

              {/* Decorative quotation mark */}
              <Text style={styles.quoteMark}>"</Text>
            </LinearGradient>
          </Animated.View>

          {/* ── INPUT AREA ─────────────────────────────────── */}
          <Animated.View style={[styles.inputWrapper, inputAnim]}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Write your thoughts..."
              placeholderTextColor={COLORS.textDim}
              value={answer}
              onChangeText={setAnswer}
              textAlignVertical="top"
              autoCorrect
              spellCheck
            />
          </Animated.View>

          {/* ── PREV PROMPT + SAVE BUTTON ──────────────────── */}
          <Animated.View style={[styles.footer, footerAnim]}>
            {/* Yesterday's prompt */}
            <TouchableOpacity
              onPress={handlePrevPrompt}
              activeOpacity={0.7}
              style={styles.prevPromptBtn}
            >
              <AscendIcon name="chevron-left" size={14} color={COLORS.textMuted} />
              <Text style={styles.prevPromptText} numberOfLines={1}>
                Yesterday: {prevPrompt.question}
              </Text>
            </TouchableOpacity>

            {/* Save button */}
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              style={styles.saveButtonWrapper}
              disabled={saved}
            >
              <LinearGradient
                colors={[COLORS.accent, '#7C8FF7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>
                  {saved ? 'Saved ✓' : 'Save Reflection'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerDate: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },

  // Prompt card
  promptWrapper: {
    marginBottom: SPACING.lg,
  },
  promptCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    paddingBottom: SPACING.lg,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'space-between',
  },
  promptBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(91,108,245,0.2)',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: 6,
    marginBottom: SPACING.lg,
  },
  categoryDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  categoryLabel: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 1.5,
  },
  questionText: {
    fontFamily: FONTS.families.display,
    fontSize: 22,
    color: COLORS.text,
    lineHeight: 30,
    letterSpacing: -0.5,
    flex: 1,
  },
  quoteMark: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 80,
    color: 'rgba(91,108,245,0.08)',
    position: 'absolute',
    right: SPACING.lg,
    bottom: -20,
    lineHeight: 80,
  },

  // Text input
  inputWrapper: {
    marginBottom: SPACING.lg,
  },
  textInput: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    minHeight: 160,
    padding: SPACING.lg,
    color: COLORS.text,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
  },

  // Footer
  footer: {
    gap: SPACING.lg,
  },
  prevPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    alignSelf: 'flex-start',
  },
  prevPromptText: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    maxWidth: 260,
  },
  saveButtonWrapper: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  saveButton: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
  },
  saveButtonText: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.md,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
