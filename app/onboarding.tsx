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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <View style={styles.step}>
              <Text style={styles.bigIcon}>⚔️</Text>
              <Text style={styles.heading}>Begin Your Ascent</Text>
              <Text style={styles.sub}>
                Every legend starts with a name. What will yours be?
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name…"
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
              >
                <Text style={styles.btnText}>Next →</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && (
            <View style={styles.step}>
              <Text style={styles.heading}>Choose Your Emblem</Text>
              <Text style={styles.sub}>Your avatar represents who you are becoming.</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={[styles.avatarCell, avatar === a && styles.avatarCellSelected]}
                    onPress={() => setAvatar(a)}
                  >
                    <Text style={styles.avatarEmoji}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.btn} onPress={handleComplete}>
                <Text style={styles.btnText}>Begin Your Journey ⚔️</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl },
  step: { gap: SPACING.lg },
  bigIcon: { fontSize: 72, textAlign: 'center' },
  heading: { fontSize: FONTS.sizes.xxxl, fontWeight: FONTS.weights.bold, color: COLORS.text, textAlign: 'center' },
  sub: { fontSize: FONTS.sizes.md, color: COLORS.textMuted, textAlign: 'center', lineHeight: 24 },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    borderWidth: 1,
    borderColor: '#222',
    textAlign: 'center',
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.sm },
  avatarCell: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCellSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '22' },
  avatarEmoji: { fontSize: 32 },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.3 },
  btnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
});
