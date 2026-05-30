import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon, CATEGORY_ASCEND_ICONS } from '../src/components/icons/AscendIcon';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { useHabitStore } from '../src/store/habitStore';
import { COLORS, CATEGORY_COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';
import { CATEGORY_META } from '../src/constants/categories';
import { CategoryId } from '../src/types';
import { AvatarBuilder } from '../src/components/ui/AvatarBuilder';

const ROHN_SUGGESTIONS: Record<string, { title: string; description: string }[]> = {
  physical: [
    { title: 'Morning Walk', description: '30 minutes every morning to clear your mind and move your body.' },
    { title: 'No processed food today', description: 'Discipline in small choices builds champions.' },
    { title: 'Sleep before midnight', description: 'Your body is rebuilt in sleep. Guard it.' },
  ],
  mental: [
    { title: 'Read 10 pages daily', description: 'Leaders are readers. 10 pages a day = 12 books a year.' },
    { title: 'Morning journaling', description: '5 minutes writing your intentions sets the day.' },
    { title: 'No social media before noon', description: 'Protect your morning mind — it is your most powerful.' },
  ],
  education: [
    { title: 'Study for 1 hour', description: 'Formal education earns a living. Self-education earns a fortune.' },
    { title: 'Watch one educational video', description: 'Learn from those who have done it.' },
    { title: 'Take notes on what you learn', description: 'Writing crystallizes thought.' },
  ],
  finance: [
    { title: 'Track every expense', description: 'You cannot manage what you do not measure.' },
    { title: 'Save 10% today', description: 'Pay yourself first. Always.' },
    { title: 'Read one financial insight', description: 'Financial literacy is the foundation of wealth.' },
  ],
  relationships: [
    { title: 'Call someone you care about', description: 'Relationships are the currency of life.' },
    { title: 'Express gratitude to one person', description: 'Appreciation is the highest form of love.' },
    { title: 'Put the phone away at dinner', description: 'Presence is the greatest gift you can give.' },
  ],
  discipline: [
    { title: 'Wake up at the same time', description: 'Consistency is the hallmark of the unbeatable.' },
    { title: 'Make your bed every morning', description: 'Small disciplines lead to great disciplines.' },
    { title: 'No excuses for 24 hours', description: 'Discipline is the bridge between goals and accomplishment.' },
  ],
};

const POWER_CHECK_IDS: CategoryId[] = [
  'physical',
  'mental',
  'education',
  'finance',
  'relationships',
  'discipline',
];

const XP_FOR_RATING: Record<number, number> = {
  1: 0,
  2: 50,
  3: 200,
  4: 500,
  5: 1000,
};

export default function Onboarding() {
  const router = useRouter();
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('apex');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [inputFocused, setInputFocused] = useState(false);
  const [addedHabits, setAddedHabits] = useState<string[]>([]);

  const slideX = useSharedValue(0);
  const slideOpacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
    opacity: slideOpacity.value,
  }));

  function transitionForward(nextStep: number) {
    slideX.value = 40;
    slideOpacity.value = 0;
    slideX.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
    slideOpacity.value = withTiming(1, { duration: 350 });
    setStep(nextStep);
  }

  function transitionBack(prevStep: number) {
    slideX.value = -40;
    slideOpacity.value = 0;
    slideX.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
    slideOpacity.value = withTiming(1, { duration: 350 });
    setStep(prevStep);
  }

  const allRated = POWER_CHECK_IDS.every((id) => (ratings[id] ?? 0) > 0);

  function toggleHabit(title: string) {
    setAddedHabits((prev) =>
      prev.includes(title) ? prev.filter((h) => h !== title) : [...prev, title]
    );
  }

  const handleComplete = () => {
    if (!name.trim()) return;
    createCharacter(name.trim(), avatar);
    const { addXP } = useCharacterStore.getState();
    POWER_CHECK_IDS.forEach((id) => {
      const rating = ratings[id] ?? 0;
      const xp = XP_FOR_RATING[rating] ?? 0;
      if (xp > 0) {
        addXP(id, xp);
      }
    });

    // Add selected habits
    const { addHabit } = useHabitStore.getState();
    addedHabits.forEach((habitTitle) => {
      let catId: CategoryId = 'discipline';
      for (const [cid, suggestions] of Object.entries(ROHN_SUGGESTIONS)) {
        if (suggestions.some((s) => s.title === habitTitle)) {
          catId = cid as CategoryId;
          break;
        }
      }
      addHabit({
        title: habitTitle,
        categoryId: catId,
        frequency: 'daily',
        xpReward: 25,
      });
    });

    router.replace('/(tabs)');
  };

  const powerCheckCategories = POWER_CHECK_IDS.map((id) => {
    const meta = CATEGORY_META.find((m) => m.id === id);
    return { id, label: meta?.label ?? id };
  });

  // Suppress unused warning for transitionBack (kept for potential back navigation)
  void transitionBack;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Deep gradient background */}
      <LinearGradient
        colors={['#0A0520', '#07041A', COLORS.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Step dots — 4 steps */}
          <View style={styles.dots}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
            ))}
          </View>

          <Animated.View style={animStyle}>
            {/* ── STEP 0: THE INITIATION ── */}
            {step === 0 && (
              <View style={styles.step}>
                {/* Diamond symbol with radial glow */}
                <View style={styles.diamondWrap}>
                  <View style={styles.diamondGlow} />
                  <View style={styles.diamondIcon}>
                    <AscendIcon
                      name="diamond"
                      size={64}
                      color={COLORS.gold}
                    />
                  </View>
                </View>

                <View style={styles.headlineWrap}>
                  <Text style={styles.headline}>Begin Your Ascent</Text>
                  <Text style={styles.sub}>
                    Your transformation starts with a name.
                  </Text>
                </View>

                <TextInput
                  style={[styles.input, inputFocused && styles.inputFocused]}
                  placeholder="Your name…"
                  placeholderTextColor={COLORS.textDim}
                  value={name}
                  onChangeText={setName}
                  maxLength={24}
                  autoFocus
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />

                <TouchableOpacity
                  style={[styles.btn, !name.trim() && styles.btnDisabled]}
                  onPress={() => name.trim() && transitionForward(1)}
                  disabled={!name.trim()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#5B6CF5', '#4550D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>Continue  →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 1: CHOOSE YOUR VESSEL ── */}
            {step === 1 && (
              <View style={styles.step}>
                <View style={styles.headlineWrap}>
                  <Text style={styles.headline}>Choose Your Icon</Text>
                  <Text style={styles.sub}>
                    An icon that represents who you're becoming.
                  </Text>
                </View>

                <AvatarBuilder value={avatar} onChange={setAvatar} />

                <TouchableOpacity style={styles.btn} onPress={() => transitionForward(2)} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#5B6CF5', '#4550D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>Continue  →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP 2: FORGE YOUR FOUNDATION ── */}
            {step === 2 && (
              <View style={styles.step}>
                <View style={styles.headlineWrap}>
                  <Text style={styles.headline}>Shape Your Foundation</Text>
                  <Text style={styles.sub}>Rate yourself honestly — no filters, no ego.</Text>
                </View>

                <View style={styles.categoryGrid}>
                  {powerCheckCategories.map(({ id, label }) => {
                    const color = CATEGORY_COLORS[id] ?? COLORS.accent;
                    const currentRating = ratings[id] ?? 0;
                    return (
                      <View key={id} style={styles.categoryTile}>
                        <LinearGradient
                          colors={[`${color}18`, `${color}08`]}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.tileBorder} />
                        <AscendIcon name={CATEGORY_ASCEND_ICONS[id] ?? 'star'} size={26} color={color} />
                        <Text style={[styles.categoryLabel, { color }]}>
                          {label}
                        </Text>
                        <View style={styles.starRow}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                              key={star}
                              onPress={() => setRatings((prev) => ({ ...prev, [id]: star }))}
                              activeOpacity={0.7}
                              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                            >
                              <AscendIcon
                                name="star"
                                filled={star <= currentRating}
                                size={24}
                                color={star <= currentRating ? color : 'rgba(255,255,255,0.18)'}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {allRated && (
                  <TouchableOpacity style={styles.btn} onPress={() => transitionForward(3)} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#5B6CF5', '#4550D4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.btnText}>Continue  →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* ── STEP 3: JIM ROHN SUGGESTIONS ── */}
            {step === 3 && (
              <View style={styles.step}>
                <View style={styles.headlineWrap}>
                  <Text style={styles.headline}>Start With These</Text>
                  <Text style={styles.sub}>
                    Jim Rohn taught: success leaves clues. These are the first principles.
                  </Text>
                </View>

                <View style={styles.suggestionList}>
                  {POWER_CHECK_IDS.filter((id) => (ratings[id] ?? 0) > 0).map((id) => {
                    const suggestions = ROHN_SUGGESTIONS[id] ?? [];
                    const color = CATEGORY_COLORS[id] ?? COLORS.accent;
                    return suggestions.map((s) => (
                      <View key={s.title} style={styles.suggestionRow}>
                        <AscendIcon
                          name={CATEGORY_ASCEND_ICONS[id] ?? 'star'}
                          size={18}
                          color={color}
                        />
                        <View style={styles.suggestionText}>
                          <Text style={styles.suggestionTitle}>{s.title}</Text>
                          <Text style={styles.suggestionDesc}>{s.description}</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.addBtn, addedHabits.includes(s.title) && styles.addBtnAdded]}
                          onPress={() => toggleHabit(s.title)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.addBtnText}>
                            {addedHabits.includes(s.title) ? '✓' : '+'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ));
                  })}
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleComplete} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#5B6CF5', '#4550D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>Begin My Journey</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.skipText} onPress={handleComplete}>Skip for now</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, overflow: 'hidden' },
  orb1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(201,168,76,0.06)',
    top: -100,
    left: -100,
  },
  orb2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(91,108,245,0.08)',
    bottom: -80,
    right: -80,
  },
  orb3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(201,168,76,0.04)',
    top: '40%',
    right: -40,
  },
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.14)' },
  dotActive: { backgroundColor: COLORS.gold, width: 28, borderRadius: 4 },
  step: { gap: SPACING.xl },

  // Diamond icon (Step 0)
  diamondWrap: {
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  diamondGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  diamondIcon: {
    shadowColor: COLORS.gold,
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },

  headlineWrap: { gap: 10, alignItems: 'center' },
  headline: {
    fontSize: 28,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 5,
  },
  sub: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Input (Step 0)
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.displayLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputFocused: {
    borderColor: 'rgba(91,108,245,0.4)',
  },

  // Step 3: Jim Rohn Suggestions
  suggestionList: { gap: SPACING.sm },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  suggestionText: { flex: 1, gap: 3 },
  suggestionTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  suggestionDesc: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(91,108,245,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(91,108,245,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addBtnAdded: {
    backgroundColor: 'rgba(14,168,117,0.20)',
    borderColor: 'rgba(14,168,117,0.5)',
  },
  addBtnText: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.families.display,
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  // Button
  btn: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  btnDisabled: { opacity: 0.25 },
  btnGradient: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    letterSpacing: 2,
  },

  // Category power check styles (Step 2)
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  categoryTile: {
    width: '47%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
    position: 'relative',
  },
  tileBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
});
