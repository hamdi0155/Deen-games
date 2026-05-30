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

const CATEGORY_PLACEHOLDERS: Partial<Record<CategoryId, string>> = {
  education: 'e.g. I want to master Python programming',
  career: 'e.g. I want to land a senior engineer role in 6 months',
  finance: 'e.g. I want to save $10,000 for an emergency fund',
  physical: 'e.g. I want to run a 5K in under 30 minutes',
  appearance: 'e.g. I want to build a consistent skincare routine',
  mental: 'e.g. I want to reduce anxiety through daily mindfulness',
  social: 'e.g. I want to expand my professional network',
  relationships: 'e.g. I want to strengthen my bond with family',
  discipline: 'e.g. I want to wake up at 5 AM every day for 30 days',
  spiritual: 'e.g. I want to build a consistent prayer and reflection habit',
  creativity: 'e.g. I want to write and publish my first short story',
  leadership: 'e.g. I want to lead my team to deliver a successful project',
};

const MAX_LENGTH = 200;

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
  const placeholder = CATEGORY_PLACEHOLDERS[selected] ?? 'e.g. I want to achieve something meaningful…';

  // Build rows of 3 for the grid
  const rows: Array<Array<typeof CATEGORY_META[number]>> = [];
  for (let i = 0; i < CATEGORY_META.length; i += 3) {
    rows.push(CATEGORY_META.slice(i, i + 3));
  }

  return (
    <ScrollView
      style={styles.scrollRoot}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textDim}
          value={goal}
          onChangeText={(t) => setGoal(t.slice(0, MAX_LENGTH))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={MAX_LENGTH}
        />
        <Text style={[styles.charCounter, goal.length >= MAX_LENGTH && styles.charCounterMax]}>
          {goal.length}/{MAX_LENGTH}
        </Text>
      </View>

      <Text style={styles.label}>Select Category</Text>

      <View style={styles.categoryGrid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.categoryRow}>
            {row.map((c) => {
              const isSel = selected === c.id;
              const color = CATEGORY_COLORS[c.id];
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelected(c.id)}
                  activeOpacity={0.75}
                  style={[
                    styles.tile,
                    isSel
                      ? {
                          borderColor: color,
                          shadowColor: color,
                          shadowOpacity: 0.6,
                          shadowRadius: 10,
                          shadowOffset: { width: 0, height: 0 },
                          elevation: 8,
                        }
                      : styles.tileInactive,
                  ]}
                >
                  {isSel ? (
                    <LinearGradient
                      colors={[color + '33', color + '11']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.tileGradient}
                    >
                      <Text style={styles.tileEmoji}>{c.emoji}</Text>
                      <Text style={[styles.tileLabel, { color }]} numberOfLines={1}>
                        {c.label}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.tileInner}>
                      <Text style={styles.tileEmoji}>{c.emoji}</Text>
                      <Text style={styles.tileLabelDim} numberOfLines={1}>
                        {c.label}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

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
    </ScrollView>
  );
}

const TILE_SIZE = 80;

const styles = StyleSheet.create({
  scrollRoot: { flex: 1 },
  container: { padding: SPACING.xl, gap: SPACING.md, paddingBottom: SPACING.xxl },
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
    letterSpacing: 0.8,
    zIndex: 1,
  },
  sub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    lineHeight: 20,
    zIndex: 1,
  },
  inputWrapper: {
    gap: SPACING.xs,
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
    minHeight: 100,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  charCounter: {
    alignSelf: 'flex-end',
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textDim,
  },
  charCounterMax: {
    color: COLORS.danger,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  categoryGrid: {
    gap: SPACING.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  tileInactive: {
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tileGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
  },
  tileInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
  },
  tileEmoji: {
    fontSize: 26,
  },
  tileLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.bodyBold,
    textAlign: 'center',
  },
  tileLabelDim: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textDim,
    textAlign: 'center',
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
