import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CategoryId } from '../../types';
import { CATEGORY_META } from '../../constants/categories';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';

interface Props {
  onSubmit: (goal: string, categoryId: CategoryId) => void;
  isLoading: boolean;
}

export function GoalInput({ onSubmit, isLoading }: Props) {
  const [goal, setGoal] = useState('');
  const [selected, setSelected] = useState<CategoryId>('education');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!goal.trim() || isLoading) return;
    onSubmit(goal.trim(), selected);
    setGoal('');
  };

  const canSubmit = !!goal.trim() && !isLoading;

  return (
    <View style={styles.container}>
      {/* Subtle ambient gradient top section */}
      <LinearGradient
        colors={['rgba(99,102,241,0.12)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambientTop}
        pointerEvents="none"
      />

      <Text style={styles.heading}>Forge a New Quest</Text>
      <Text style={styles.sub}>Describe your goal. The Quest Master will forge your path.</Text>

      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        placeholder="e.g. I want to study radiology and pass my board exams…"
        placeholderTextColor={COLORS.textDim}
        value={goal}
        onChangeText={setGoal}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Select Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {CATEGORY_META.map((c) => {
          const isSel = selected === c.id;
          const color = CATEGORY_COLORS[c.id];
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => setSelected(c.id)}
              activeOpacity={0.75}
              style={styles.chipWrapper}
            >
              {isSel ? (
                <LinearGradient
                  colors={[color + '55', color + '22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.chip, { borderColor: color }]}
                >
                  <Text style={styles.chipEmoji}>{c.emoji}</Text>
                  <Text style={[styles.chipText, { color }]}>{c.label}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.chip, styles.chipInactive]}>
                  <Text style={styles.chipEmoji}>{c.emoji}</Text>
                  <Text style={styles.chipText}>{c.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.8}
        style={[styles.btnWrapper, !canSubmit && styles.btnDisabled]}
      >
        <LinearGradient
          colors={canSubmit ? [COLORS.accent, '#7C3AED'] : ['#333', '#222']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>
            {isLoading ? 'Forging Quest…' : '✦  Generate Quest ⚔️'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl, gap: SPACING.md },
  ambientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 0,
  },
  heading: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
    zIndex: 1,
  },
  sub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 20,
    zIndex: 1,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.body,
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
    minHeight: 120,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  scroll: { flexGrow: 0 },
  chipWrapper: {
    marginRight: SPACING.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipInactive: {
    borderColor: '#333',
  },
  chipEmoji: { fontSize: 16 },
  chipText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.bodyBold,
    color: COLORS.textMuted,
  },
  btnWrapper: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.md,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  btnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
  },
  btn: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.display,
    letterSpacing: 0.5,
  },
});
