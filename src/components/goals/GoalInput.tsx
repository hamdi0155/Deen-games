import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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

  const handleSubmit = () => {
    if (!goal.trim() || isLoading) return;
    onSubmit(goal.trim(), selected);
    setGoal('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forge a New Quest</Text>
      <Text style={styles.sub}>Describe your goal. The Quest Master will forge your path.</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. I want to study radiology and pass my board exams…"
        placeholderTextColor={COLORS.textDim}
        value={goal}
        onChangeText={setGoal}
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
              style={[styles.chip, isSel && { backgroundColor: color + '33', borderColor: color }]}
              onPress={() => setSelected(c.id)}
            >
              <Text style={styles.chipEmoji}>{c.emoji}</Text>
              <Text style={[styles.chipText, isSel && { color }]}>{c.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.btn, (!goal.trim() || isLoading) && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={!goal.trim() || isLoading}
      >
        <Text style={styles.btnText}>
          {isLoading ? 'Forging Quest…' : 'Generate Quest ⚔️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl, gap: SPACING.md },
  heading: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  sub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, lineHeight: 20 },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    borderColor: '#222',
    minHeight: 120,
  },
  label: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: FONTS.weights.medium, textTransform: 'uppercase', letterSpacing: 1 },
  scroll: { flexGrow: 0 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: SPACING.xs,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: FONTS.weights.medium },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
});
