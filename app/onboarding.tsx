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
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { COLORS, CATEGORY_COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';
import { CATEGORY_META } from '../src/constants/categories';
import { CategoryId } from '../src/types';

const AVATARS = ['⚔️', '🧙', '🏹', '🛡️', '🦁', '🐉', '🌟', '🔥', '💎', '🌙', '👑', '🦅'];

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
  const [avatar, setAvatar] = useState('⚔️');
  const [ratings, setRatings] = useState<Record<string, number>>({});

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
    router.replace('/(tabs)');
  };

  const powerCheckCategories = POWER_CHECK_IDS.map((id) => {
    const meta = CATEGORY_META.find((m) => m.id === id);
    return { id, label: meta?.label ?? id, emoji: meta?.emoji ?? '⭐' };
  });

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
          {/* Step dots — 3 steps */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
            ))}
          </View>

          <Animated.View style={animStyle}>
            {step === 0 && (
              <View style={styles.step}>
                <View style={styles.iconWrap}>
                  <LinearGradient
                    colors={['rgba(99,102,241,0.25)', 'rgba(124,58,237,0.1)']}
                    style={styles.iconGradient}
                  >
                    <Text style={styles.bigIcon}>⚔️</Text>
                  </LinearGradient>
                  <View style={styles.iconGlow} />
                </View>

                <View style={styles.headlineWrap}>
                  <Text style={styles.headlineSub}>YOUR LEGEND BEGINS</Text>
                  <Text style={styles.headline}>Begin Your{'\n'}Ascent</Text>
                </View>

                <Text style={styles.sub}>
                  Every legend starts with a name.{'\n'}What will yours be?
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Your name…"
                  placeholderTextColor={COLORS.textDim}
                  value={name}
                  onChangeText={setName}
                  maxLength={24}
                  autoFocus
                />

                <TouchableOpacity
                  style={[styles.btn, !name.trim() && styles.btnDisabled]}
                  onPress={() => name.trim() && transitionForward(1)}
                  disabled={!name.trim()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.accent, '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>Continue  →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step === 1 && (
              <View style={styles.step}>
                <View style={styles.headlineWrap}>
                  <Text style={styles.headlineSub}>IDENTITY</Text>
                  <Text style={styles.headline}>Choose Your{'\n'}Emblem</Text>
                </View>
                <Text style={styles.sub}>Your avatar represents who you are becoming.</Text>

                <View style={styles.avatarGrid}>
                  {AVATARS.map((a) => (
                    <TouchableOpacity
                      key={a}
                      style={[styles.avatarCell, avatar === a && styles.avatarCellSelected]}
                      onPress={() => setAvatar(a)}
                      activeOpacity={0.7}
                    >
                      {avatar === a && (
                        <LinearGradient
                          colors={['rgba(99,102,241,0.25)', 'rgba(124,58,237,0.1)']}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Text style={styles.avatarEmoji}>{a}</Text>
                      {avatar === a && (
                        <View style={styles.avatarCheck}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.btn} onPress={() => transitionForward(2)} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[COLORS.accent, '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>Continue  →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View style={styles.step}>
                <View style={styles.headlineWrap}>
                  <Text style={styles.headlineSub}>POWER CHECK</Text>
                  <Text style={styles.headline}>Rate Your{'\n'}True Self</Text>
                </View>
                <Text style={styles.sub}>Rate yourself honestly in your top 3 areas</Text>

                <View style={styles.categoryGrid}>
                  {powerCheckCategories.map(({ id, label, emoji }) => {
                    const color = CATEGORY_COLORS[id] ?? COLORS.accent;
                    const currentRating = ratings[id] ?? 0;
                    return (
                      <View key={id} style={styles.categoryTile}>
                        <LinearGradient
                          colors={[`${color}18`, `${color}08`]}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.tileBorder} />
                        <Text style={styles.categoryEmoji}>{emoji}</Text>
                        <Text style={styles.categoryLabel}>{label}</Text>
                        <View style={styles.starRow}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                              key={star}
                              onPress={() => setRatings((prev) => ({ ...prev, [id]: star }))}
                              activeOpacity={0.7}
                              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                            >
                              <Text
                                style={[
                                  styles.star,
                                  { color: star <= currentRating ? color : 'rgba(255,255,255,0.18)' },
                                ]}
                              >
                                ★
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {allRated && (
                  <TouchableOpacity style={styles.btn} onPress={handleComplete} activeOpacity={0.8}>
                    <LinearGradient
                      colors={[COLORS.accent, '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.btnText}>Begin Your Legend  ⚔️</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
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
    backgroundColor: 'rgba(99,102,241,0.10)',
    top: -100,
    left: -100,
  },
  orb2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(124,58,237,0.08)',
    bottom: -80,
    right: -80,
  },
  orb3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(99,102,241,0.05)',
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
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.12)' },
  dotActive: { backgroundColor: COLORS.accent, width: 28, borderRadius: 4 },
  step: { gap: SPACING.xl },
  iconWrap: { alignSelf: 'center', position: 'relative' },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(99,102,241,0.08)',
    top: -10,
    left: -10,
  },
  bigIcon: { fontSize: 56 },
  headlineWrap: { gap: 6 },
  headlineSub: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
    textAlign: 'center',
    letterSpacing: 4,
  },
  headline: {
    fontSize: FONTS.sizes.xxxl,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: FONTS.sizes.xxxl * 1.25,
    letterSpacing: 0.5,
  },
  sub: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.families.displayLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    textAlign: 'center',
    letterSpacing: 1,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  avatarCell: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarCellSelected: {
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  avatarEmoji: { fontSize: 34 },
  avatarCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 9, fontFamily: FONTS.families.bodyBold },
  btn: {
    borderRadius: RADIUS.lg,
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
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    letterSpacing: 1,
  },
  // Category power check styles
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
  categoryEmoji: { fontSize: 28 },
  categoryLabel: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodySemibold,
    color: COLORS.text,
    textAlign: 'center',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  star: {
    fontSize: 20,
  },
});
