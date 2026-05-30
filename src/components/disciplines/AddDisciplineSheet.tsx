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
import { DisciplineFrequency } from '../../types';
import { CATEGORY_META } from '../../constants/categories';
import { PressableScale } from '../ui/PressableScale';
import { useDisciplineStore } from '../../store/disciplineStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (discipline: {
    title: string;
    categoryId: string;
    frequency: DisciplineFrequency;
    xpReward: number;
  }) => void;
}

const FREQ_OPTIONS: { value: DisciplineFrequency; label: string; icon: AscendIconName }[] = [
  { value: 'daily',    label: 'Daily',    icon: 'sun' },
  { value: 'weekdays', label: 'Weekdays', icon: 'repeat' },
  { value: 'weekly',   label: 'Weekly',   icon: 'calendar' },
  { value: 'monthly',  label: 'Monthly',  icon: 'moon' },
];

const XP_PRESETS = [10, 25, 50, 100];

export function AddDisciplineSheet({ visible, onClose, onAdd }: Props) {
  const customCategories = useDisciplineStore((s) => s.customCategories);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('discipline');
  const [frequency, setFrequency] = useState<DisciplineFrequency>('daily');
  const [xpReward, setXpReward] = useState(25);
  const [focused, setFocused] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle('');
      setCategoryId('discipline');
      setFrequency('daily');
      setXpReward(25);
      setFocused(false);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), categoryId, frequency, xpReward });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheet}>
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Header with gradient */}
            <LinearGradient
              colors={['rgba(249,115,22,0.15)', 'transparent']}
              style={styles.headerGradient}
            >
              <Text style={styles.heading}>New Discipline</Text>
              <Text style={styles.subheading}>Forge your commitment</Text>
            </LinearGradient>

            {/* Title Input */}
            <TextInput
              style={[styles.input, focused && { borderColor: '#F97316' }]}
              placeholder="Discipline name…"
              placeholderTextColor={COLORS.textDim}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            {/* Category grid */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {[...CATEGORY_META, ...customCategories.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji }))].map((c) => {
                const selected = categoryId === c.id;
                const color = CATEGORY_COLORS[c.id] ?? (customCategories.find((cc) => cc.id === c.id)?.color ?? COLORS.warning);
                return (
                  <PressableScale
                    key={c.id}
                    onPress={() => setCategoryId(c.id)}
                    style={styles.catTileWrap}
                  >
                    <View style={[styles.catTile, selected && { borderColor: color }]}>
                      {selected && (
                        <LinearGradient
                          colors={[color + '40', color + '18']}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Text style={styles.catTileEmoji}>{c.emoji}</Text>
                      <Text
                        style={[styles.catTileLabel, selected && { color }]}
                        numberOfLines={1}
                      >
                        {c.label}
                      </Text>
                    </View>
                  </PressableScale>
                );
              })}
            </View>

            {/* Frequency chips */}
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.freqRow}>
              {FREQ_OPTIONS.map(({ value, label, icon }) => {
                const sel = frequency === value;
                return (
                  <PressableScale
                    key={value}
                    onPress={() => setFrequency(value)}
                    style={styles.freqChipWrap}
                  >
                    <View style={[styles.freqChip, sel && styles.freqChipActive]}>
                      {sel && (
                        <LinearGradient
                          colors={['#F97316', '#EA580C']}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <AscendIcon
                        name={icon}
                        size={14}
                        color={sel ? '#fff' : COLORS.textMuted}
                      />
                      <Text style={[styles.chipText, sel && styles.chipTextActive]}>
                        {label}
                      </Text>
                    </View>
                  </PressableScale>
                );
              })}
            </View>

            {/* XP Reward presets (2×2 grid) */}
            <Text style={styles.label}>XP Reward</Text>
            <View style={styles.xpGrid}>
              {XP_PRESETS.map((v) => {
                const sel = xpReward === v;
                return (
                  <PressableScale
                    key={v}
                    onPress={() => setXpReward(v)}
                    style={styles.xpCellWrap}
                  >
                    <View style={[styles.xpCell, sel && styles.xpCellActive]}>
                      {sel && (
                        <LinearGradient
                          colors={['#F97316', '#EA580C']}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Text style={[styles.xpCellText, sel && styles.xpCellTextActive]}>
                        ⚡ {v} XP
                      </Text>
                    </View>
                  </PressableScale>
                );
              })}
            </View>

            {/* Submit button */}
            <PressableScale onPress={handleSubmit} style={styles.addBtnWrap}>
              <LinearGradient
                colors={['#F97316', '#EA580C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addBtn}
              >
                <AscendIcon name="build" size={16} color="#fff" />
                <Text style={styles.addBtnText}>Forge Discipline</Text>
              </LinearGradient>
            </PressableScale>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scrollWrapper: { flexGrow: 0 },
  scrollContent: { justifyContent: 'flex-end' },
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
    gap: 2,
  },
  heading: {
    fontFamily: FONTS.families.display,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
  },
  subheading: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
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

  // Category grid — 3 columns
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  catTileWrap: { width: '30%' },
  catTile: {
    width: '100%',
    height: 60,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    overflow: 'hidden',
  },
  catTileEmoji: { fontSize: 20 },
  catTileLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 2,
  },

  // Frequency
  freqRow: { flexDirection: 'row', gap: SPACING.xs },
  freqChipWrap: { flex: 1 },
  freqChip: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    gap: 3,
  },
  freqChipActive: { borderColor: '#F97316' },
  chipText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipTextActive: { color: '#fff' },

  // XP 2x2 grid
  xpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  xpCellWrap: { width: '47%' },
  xpCell: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  xpCellActive: { borderColor: '#F97316' },
  xpCellText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
  },
  xpCellTextActive: { color: '#fff' },

  // Submit
  addBtnWrap: {},
  addBtn: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
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
    letterSpacing: 0.5,
  },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  cancelText: {
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
});
