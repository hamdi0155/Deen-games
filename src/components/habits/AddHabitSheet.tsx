import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';
import { CategoryId, Habit } from '../../types';
import { CATEGORY_META } from '../../constants/categories';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completions' | 'createdAt' | 'isCompletedToday'>) => void;
}

export function AddHabitSheet({ visible, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('discipline');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const [xpReward, setXPReward] = useState(15);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), categoryId: category, frequency, xpReward, icon: undefined });
    setTitle('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>New Habit</Text>

          <TextInput
            style={styles.input}
            placeholder="Habit name…"
            placeholderTextColor={COLORS.textDim}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORY_META.map((c) => {
              const selected = category === c.id;
              const color = CATEGORY_COLORS[c.id];
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catChip, selected && { backgroundColor: color + '33', borderColor: color }]}
                  onPress={() => setCategory(c.id)}
                >
                  <Text>{c.emoji}</Text>
                  <Text style={[styles.chipText, selected && { color }]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.freqRow}>
            {(['daily', 'weekdays', 'weekends', 'weekly'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.freqChip, frequency === f && styles.freqChipActive]}
                onPress={() => setFrequency(f)}
              >
                <Text style={[styles.chipText, frequency === f && { color: COLORS.accent }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>XP per completion</Text>
          <View style={styles.xpRow}>
            {[10, 15, 25].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.xpChip, xpReward === v && styles.xpChipActive]}
                onPress={() => setXPReward(v)}
              >
                <Text style={[styles.chipText, xpReward === v && { color: COLORS.accent }]}>
                  {v} XP
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Forge Habit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: { backgroundColor: '#0D0D0D', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.xl, gap: SPACING.md },
  heading: { fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, color: COLORS.text },
  input: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.text, fontSize: FONTS.sizes.md, borderWidth: 1, borderColor: '#222' },
  label: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: FONTS.weights.medium, textTransform: 'uppercase', letterSpacing: 1 },
  catScroll: { flexGrow: 0 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#333', marginRight: SPACING.xs },
  freqRow: { flexDirection: 'row', gap: SPACING.xs },
  freqChip: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#333' },
  freqChipActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '22' },
  xpRow: { flexDirection: 'row', gap: SPACING.sm },
  xpChip: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#333' },
  xpChipActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '22' },
  chipText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: FONTS.weights.medium },
  addBtn: { backgroundColor: COLORS.accent, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  cancelText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md },
});
