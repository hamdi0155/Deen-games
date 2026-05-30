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
import { AscendIcon, AscendIconName } from '../icons/AscendIcon';
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

  const activeCategoryColor = CATEGORY_COLORS[category] ?? COLORS.accent;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.heading}>{isEditMode ? 'Edit Habit' : 'New Habit'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <AscendIcon name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Habit Name label */}
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={[
              styles.input,
              focused && { borderColor: COLORS.accent },
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
                      selected
                        ? { borderColor: color }
                        : { backgroundColor: COLORS.bgCard, borderColor: COLORS.bgCardBorder },
                    ]}
                  >
                    {selected && (
                      <LinearGradient
                        colors={[color + '33', color + '11']}
                        style={[
                          StyleSheet.absoluteFill,
                          {
                            shadowColor: color,
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 0 },
                          },
                        ]}
                      />
                    )}
                    <Text style={styles.catEmoji}>{c.emoji}</Text>
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
                      selected
                        ? { borderColor: color }
                        : { backgroundColor: COLORS.bgCard, borderColor: COLORS.bgCardBorder },
                    ]}
                  >
                    {selected && (
                      <LinearGradient
                        colors={[color + '33', color + '11']}
                        style={[
                          StyleSheet.absoluteFill,
                          {
                            shadowColor: color,
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 0 },
                          },
                        ]}
                      />
                    )}
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
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
              const freqIcon: Record<typeof f, AscendIconName> = {
                daily: 'flash',
                weekdays: 'build',
                weekends: 'star',
                weekly: 'list',
              };
              return (
                <PressableScale
                  key={f}
                  onPress={() => setFrequency(f)}
                  style={styles.freqChipWrap}
                >
                  <View style={[styles.freqChip, sel && { borderColor: activeCategoryColor }]}>
                    {sel && (
                      <LinearGradient
                        colors={[activeCategoryColor, activeCategoryColor + 'CC']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <AscendIcon
                      name={freqIcon[f]}
                      size={14}
                      color={sel ? '#fff' : COLORS.textMuted}
                    />
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
                  <View style={[styles.xpChip, sel && { borderColor: activeCategoryColor }]}>
                    {sel && (
                      <LinearGradient
                        colors={[activeCategoryColor, activeCategoryColor + 'CC']}
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
              colors={[COLORS.accent, '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtn}
            >
              <AscendIcon name="check" size={16} color="#fff" />
              <Text style={styles.addBtnText}>{isEditMode ? 'Save Changes' : 'Add Habit'}</Text>
            </LinearGradient>
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: COLORS.bgModal,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: -8 },
    elevation: 30,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xl,
    letterSpacing: 1,
    color: COLORS.text,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
    marginHorizontal: -SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.text,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.md,
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  catScroll: { flexGrow: 0 },
  catChipWrap: { marginRight: SPACING.xs },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
  },
  catEmoji: {
    fontSize: 20,
  },
  catChipText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  freqRow: { flexDirection: 'row', gap: SPACING.xs },
  freqChipWrap: { flex: 1 },
  freqChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
    gap: 3,
  },
  chipText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  chipTextActive: { color: '#fff' },
  xpRow: { flexDirection: 'row', gap: SPACING.sm },
  xpChipWrap: { flex: 1 },
  xpChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
  },
  xpChipText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
  },
  xpChipTextActive: { color: '#fff' },
  addBtnWrap: {},
  addBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    overflow: 'hidden',
  },
  addBtnText: {
    fontFamily: FONTS.families.display,
    color: '#fff',
    fontSize: FONTS.sizes.md,
    letterSpacing: 1,
  },
});
