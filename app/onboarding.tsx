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
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';

const AVATARS = ['⚔️', '🧙', '🏹', '🛡️', '🦁', '🐉', '🌟', '🔥', '💎', '🌙', '👑', '🦅'];

export default function Onboarding() {
  const router = useRouter();
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('⚔️');

  const handleComplete = () => {
    if (!name.trim()) return;
    createCharacter(name.trim(), avatar);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Ambient background orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Step dots */}
          <View style={styles.dots}>
            <View style={[styles.dot, step === 0 && styles.dotActive]} />
            <View style={[styles.dot, step === 1 && styles.dotActive]} />
          </View>

          {step === 0 && (
            <View style={styles.step}>
              <View style={styles.iconWrap}>
                <Text style={styles.bigIcon}>⚔️</Text>
              </View>
              <Text style={styles.headline}>Begin Your{'\n'}Ascent</Text>
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
                onPress={() => name.trim() && setStep(1)}
                disabled={!name.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Continue  →</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && (
            <View style={styles.step}>
              <Text style={styles.headline}>Choose Your{'\n'}Emblem</Text>
              <Text style={styles.sub}>Your avatar represents who you are becoming.</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={[styles.avatarCell, avatar === a && styles.avatarCellSelected]}
                    onPress={() => setAvatar(a)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.avatarEmoji}>{a}</Text>
                    {avatar === a && <View style={styles.avatarCheck}><Text style={styles.checkText}>✓</Text></View>}
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.btn} onPress={handleComplete} activeOpacity={0.8}>
                <Text style={styles.btnText}>Begin Your Journey  ⚔️</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, overflow: 'hidden' },
  orb1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(99,102,241,0.08)',
    top: -80,
    left: -80,
  },
  orb2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(124,58,237,0.06)',
    bottom: -60,
    right: -60,
  },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl, paddingTop: SPACING.xxl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xxl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotActive: { backgroundColor: COLORS.accent, width: 24 },
  step: { gap: SPACING.xl },
  iconWrap: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  bigIcon: { fontSize: 56 },
  headline: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: FONTS.sizes.xxxl * 1.2,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.sm },
  avatarCell: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCellSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(99,102,241,0.18)',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.6,
    shadowRadius: 12,
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
  checkText: { color: '#fff', fontSize: 9, fontWeight: FONTS.weights.bold },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  btnDisabled: { opacity: 0.25 },
  btnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, letterSpacing: 0.5 },
});
