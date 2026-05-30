import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AvatarConfig,
  CustomAvatarFace,
  DEFAULT_AVATAR_CONFIG,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
} from './CustomAvatarFace';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  value: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
}

type Tab = 'skin' | 'hair' | 'eyes' | 'mouth' | 'extras';

const TABS: { key: Tab; label: string }[] = [
  { key: 'skin',   label: 'Skin'   },
  { key: 'hair',   label: 'Hair'   },
  { key: 'eyes',   label: 'Eyes'   },
  { key: 'mouth',  label: 'Mouth'  },
  { key: 'extras', label: 'Extras' },
];

const HAIR_STYLES: { key: AvatarConfig['hairStyle']; label: string }[] = [
  { key: 'short',  label: 'Short'  },
  { key: 'long',   label: 'Long'   },
  { key: 'curly',  label: 'Curly'  },
  { key: 'bun',    label: 'Bun'    },
  { key: 'fade',   label: 'Fade'   },
  { key: 'none',   label: 'Bald'   },
];

const EYE_STYLES: { key: AvatarConfig['eyeStyle']; label: string }[] = [
  { key: 'round',  label: 'Round'  },
  { key: 'almond', label: 'Almond' },
  { key: 'large',  label: 'Large'  },
];

const BROW_STYLES: { key: AvatarConfig['browStyle']; label: string }[] = [
  { key: 'arched',   label: 'Arched'   },
  { key: 'straight', label: 'Straight' },
];

const MOUTH_STYLES: { key: AvatarConfig['mouthStyle']; label: string }[] = [
  { key: 'smile',   label: 'Smile'   },
  { key: 'smirk',   label: 'Smirk'   },
  { key: 'neutral', label: 'Neutral' },
];

const ACCESSORY_OPTIONS: { key: AvatarConfig['accessory']; label: string }[] = [
  { key: 'none',    label: 'None'    },
  { key: 'glasses', label: 'Glasses' },
  { key: 'cap',     label: 'Cap'     },
];

const ACCENT_COLORS = [
  '#5B6CF5', '#C9A84C', '#0EA875', '#E84545',
  '#8B5CF6', '#EC4899', '#F97316', '#06B6D4',
];

function ColorSwatch({
  color,
  selected,
  onPress,
  size = 36,
}: {
  color: string;
  selected: boolean;
  onPress: () => void;
  size?: number;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.swatch,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        selected && styles.swatchSelected,
        selected && { borderColor: color, shadowColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    />
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {selected && (
        <LinearGradient
          colors={['rgba(91,108,245,0.25)', 'rgba(91,108,245,0.10)']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function AvatarCustomizer({ value, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('skin');

  function update(partial: Partial<AvatarConfig>) {
    onChange({ ...value, ...partial });
  }

  return (
    <View style={styles.container}>
      {/* Live preview */}
      <View style={styles.preview}>
        <View style={styles.previewRing}>
          <CustomAvatarFace config={value} size={110} />
        </View>
      </View>

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
            {activeTab === t.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Options panel */}
      <View style={styles.panel}>
        {/* ── SKIN ── */}
        {activeTab === 'skin' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SKIN TONE</Text>
            <View style={styles.swatchRow}>
              {SKIN_TONES.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={value.skinTone === c}
                  onPress={() => update({ skinTone: c })}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── HAIR ── */}
        {activeTab === 'hair' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>HAIR STYLE</Text>
            <View style={styles.chipRow}>
              {HAIR_STYLES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={value.hairStyle === s.key}
                  onPress={() => update({ hairStyle: s.key })}
                />
              ))}
            </View>
            <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>HAIR COLOR</Text>
            <View style={styles.swatchRow}>
              {HAIR_COLORS.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={value.hairColor === c}
                  onPress={() => update({ hairColor: c })}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── EYES ── */}
        {activeTab === 'eyes' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>EYE SHAPE</Text>
            <View style={styles.chipRow}>
              {EYE_STYLES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={value.eyeStyle === s.key}
                  onPress={() => update({ eyeStyle: s.key })}
                />
              ))}
            </View>
            <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>EYE COLOR</Text>
            <View style={styles.swatchRow}>
              {EYE_COLORS.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={value.eyeColor === c}
                  onPress={() => update({ eyeColor: c })}
                />
              ))}
            </View>
            <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>EYEBROWS</Text>
            <View style={styles.chipRow}>
              {BROW_STYLES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={value.browStyle === s.key}
                  onPress={() => update({ browStyle: s.key })}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── MOUTH ── */}
        {activeTab === 'mouth' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>EXPRESSION</Text>
            <View style={styles.chipRow}>
              {MOUTH_STYLES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={value.mouthStyle === s.key}
                  onPress={() => update({ mouthStyle: s.key })}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── EXTRAS ── */}
        {activeTab === 'extras' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ACCESSORY</Text>
            <View style={styles.chipRow}>
              {ACCESSORY_OPTIONS.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={value.accessory === s.key}
                  onPress={() => update({ accessory: s.key })}
                />
              ))}
            </View>
            <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>ACCENT COLOR</Text>
            <View style={styles.swatchRow}>
              {ACCENT_COLORS.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={value.accentColor === c}
                  onPress={() => update({ accentColor: c })}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export { DEFAULT_AVATAR_CONFIG };

const styles = StyleSheet.create({
  container: { gap: SPACING.md },

  // Preview
  preview: { alignItems: 'center', paddingVertical: SPACING.sm },
  previewRing: {
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(201,168,76,0.45)',
    shadowColor: '#C9A84C',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    overflow: 'hidden',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingBottom: 2,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: 'rgba(91,108,245,0.12)',
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: COLORS.accent,
    fontFamily: FONTS.families.display,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.accent,
  },

  // Options panel
  panel: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    minHeight: 140,
    padding: SPACING.md,
  },
  section: { gap: SPACING.sm },
  sectionLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textDim,
    letterSpacing: 2.5,
  },

  // Swatches
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  swatch: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderWidth: 2.5,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  chipSelected: {
    borderColor: 'rgba(91,108,245,0.55)',
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
  },
  chipTextSelected: {
    color: COLORS.accent,
    fontFamily: FONTS.families.displayBold,
  },
});
