import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';
import { CategoryId, Habit } from '../../types';
import { CATEGORY_META } from '../../constants/categories';
import { PressableScale } from '../ui/PressableScale';
import { useDisciplineStore } from '../../store/disciplineStore';

type HabitUpdates = Partial<Pick<Habit, 'title' | 'categoryId' | 'frequency' | 'xpReward' | 'icon'>>;

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'completions' | 'createdAt' | 'isCompletedToday'>) => void;
  editHabit?: Habit;
  onUpdate?: (habitId: string, updates: HabitUpdates) => void;
}

export function AddHabitSheet({ visible, onClose, onAdd, editHabit, onUpdate }: Props) {
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('discipline');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const [xpReward, setXPReward] = useState(15);
  const [focused, setFocused] = useState(false);

  // Populate fields when editHabit changes
  useEffect(() => {
    if (editHabit) {
      setTitle(editHabit.title);
      setCategory(editHabit.categoryId);
      setFrequency(editHabit.frequency);
      setXPReward(editHabit.xpReward);
    } else {
      setTitle('');
      setCategory('discipline');
      setFrequency('daily');
      setXPReward(15);
    }
  }, [editHabit]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle('');
      setCategory('discipline');
      setFrequency('daily');
      setXPReward(15);
      setFocused(false);
    }
  }, [visible]);

  const isEditMode = !!editHabit;

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (isEditMode && editHabit && onUpdate) {
      onUpdate(editHabit.id, {
        title: title.trim(),
        categoryId: category as CategoryId,
        frequency,
        xpReward,
      });
    } else {
      onAdd({ title: title.trim(), categoryId: category as CategoryId, frequency, xpReward, icon: undefined });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header with gradient */}
          <LinearGradient
            colors={['rgba(249,115,22,0.15)', 'transparent']}
            style={styles.headerGradient}
          >
            <Text style={styles.heading}>{isEditMode ? 'Edit Habit' : 'New Habit'}</Text>
          </LinearGradient>

          <TextInput
            style={[
              styles.input,
              focused && { borderColor: '#F97316' },
            ]}
            placeholder="Habit name…"
            placeholderTextColor={COLORS.textDim}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORY_META.map((c) => {
              const selected = category === c.id;
              const color = CATEGORY_COLORS[c.id];
              return (
                <PressableScale
                  key={c.id}
                  onPress={() => setCategory(c.id)}
                  style={styles.catChipWrap}
                >
                  <View
                    style={[
                      styles.catChip,
                      selected && { borderColor: color },
                    ]}
                  >
                    {selected && (
                      <LinearGradient
                        colors={[color + '33', color + '11']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text>{c.emoji}</Text>
                    <Text style={[styles.catChipText, selected && { color }]}>{c.label}</Text>
                  </View>
                </PressableScale>
              );
            })}
            {customCategories.map((cat) => {
              const selected = category === cat.id;
              const color = cat.color;
              return (
                <PressableScale
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={styles.catChipWrap}
                >
                  <View
                    style={[
                      styles.catChip,
                      selected && { borderColor: color },
                    ]}
                  >
                    {selected && (
                      <LinearGradient
                        colors={[color + '33', color + '11']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text>{cat.emoji}</Text>
                    <Text style={[styles.catChipText, selected && { color }]}>{cat.label}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.freqRow}>
            {(['daily', 'weekdays', 'weekends', 'weekly'] as const).map((f) => {
              const sel = frequency === f;
              return (
                <PressableScale
                  key={f}
                  onPress={() => setFrequency(f)}
                  style={styles.freqChipWrap}
                >
                  <View style={[styles.freqChip, sel && styles.freqChipActive]}>
                    {sel && (
                      <LinearGradient
                        colors={['#F97316', '#EA580C']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text style={[styles.chipText, sel && styles.chipTextActive]}>{f}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>

          <Text style={styles.label}>XP per completion</Text>
          <View style={styles.xpRow}>
            {[10, 15, 25].map((v) => {
              const sel = xpReward === v;
              return (
                <PressableScale
                  key={v}
                  onPress={() => setXPReward(v)}
                  style={styles.xpChipWrap}
                >
                  <View style={[styles.xpChip, sel && styles.xpChipActive]}>
                    {sel && (
                      <LinearGradient
                        colors={['#F97316', '#EA580C']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text style={[styles.xpChipText, sel && styles.xpChipTextActive]}>
                      ⚡ {v} XP
                    </Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>

          <PressableScale onPress={handleSubmit} style={styles.addBtnWrap}>
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>{isEditMode ? 'Update Habit' : 'Forge Habit'}</Text>
            </LinearGradient>
          </PressableScale>

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
  sheet: {
    backgroundColor: 'rgba(8,8,14,0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginTop: SPACING.md,
  },
  headerGradient: {
    marginHorizontal: -SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  heading: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  catScroll: { flexGrow: 0 },
  catChipWrap: { marginRight: SPACING.xs },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  catChipText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  freqRow: { flexDirection: 'row', gap: SPACING.xs },
  freqChipWrap: { flex: 1 },
  freqChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  freqChipActive: { borderColor: '#F97316' },
  chipText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'lowercase',
  },
  chipTextActive: { color: '#fff' },
  xpRow: { flexDirection: 'row', gap: SPACING.sm },
  xpChipWrap: { flex: 1 },
  xpChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  xpChipActive: { borderColor: '#F97316' },
  xpChipText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
  },
  xpChipTextActive: { color: '#fff' },
  addBtnWrap: {},
  addBtn: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  addBtnText: {
    fontFamily: FONTS.families.display,
    color: '#fff',
    fontSize: FONTS.sizes.md,
    letterSpacing: 0.5,
  },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  cancelText: {
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
});
