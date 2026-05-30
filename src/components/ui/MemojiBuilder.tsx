import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MemojiConfig,
  AvatarFace,
  SkinTone,
  HairStyle,
  HairColor,
  EyeColor,
  MouthStyle,
  Accessory,
  SKIN_COLORS,
  HAIR_COLORS,
  EYE_COLORS,
  BG_COLORS,
} from './CustomAvatar';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

// ─── Option definitions ───────────────────────────────────────────────────────

const HAIR_STYLE_OPTIONS: { id: HairStyle; label: string; emoji: string }[] = [
  { id: 'short',  label: 'Short',  emoji: '✂️' },
  { id: 'medium', label: 'Medium', emoji: '💈' },
  { id: 'long',   label: 'Long',   emoji: '💆' },
  { id: 'bald',   label: 'Bald',   emoji: '🧑‍🦲' },
  { id: 'afro',   label: 'Afro',   emoji: '🌟' },
  { id: 'hijab',  label: 'Hijab',  emoji: '🧕' },
];

const MOUTH_OPTIONS: { id: MouthStyle; label: string; emoji: string }[] = [
  { id: 'smile',   label: 'Smile',   emoji: '😊' },
  { id: 'grin',    label: 'Grin',    emoji: '😁' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
];

const ACCESSORY_OPTIONS: { id: Accessory; label: string; emoji: string }[] = [
  { id: 'none',         label: 'None',        emoji: '✦' },
  { id: 'glasses',      label: 'Glasses',     emoji: '🤓' },
  { id: 'beard',        label: 'Beard',       emoji: '🧔' },
  { id: 'beard_glasses', label: 'Both',       emoji: '🧔‍♂️' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function ColorDot({
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
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.colorDot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        selected && { borderWidth: 3, borderColor: '#fff' },
      ]}
    >
      {selected && (
        <View style={styles.colorDotCheck}>
          <Text style={styles.colorDotCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function OptionChip({
  label,
  emoji,
  selected,
  onPress,
}: {
  label: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.chipWrap}>
      {selected && (
        <LinearGradient
          colors={['rgba(91,108,245,0.30)', 'rgba(91,108,245,0.12)']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[styles.chip, selected && styles.chipSelected]}>
        <Text style={styles.chipEmoji}>{emoji}</Text>
        <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── MemojiBuilder ────────────────────────────────────────────────────────────

interface Props {
  config: MemojiConfig;
  onChange: (config: MemojiConfig) => void;
  previewSize?: number;
}

export function MemojiBuilder({ config, onChange, previewSize = 150 }: Props) {
  const set = <K extends keyof MemojiConfig>(key: K, value: MemojiConfig[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <View style={styles.root}>
      {/* ── Live preview ── */}
      <View style={styles.previewWrap}>
        <View style={[styles.previewRing, { width: previewSize + 8, height: previewSize + 8, borderRadius: (previewSize + 8) / 2 }]}>
          <View style={{ width: previewSize, height: previewSize, borderRadius: previewSize / 2, overflow: 'hidden' }}>
            <AvatarFace config={config} size={previewSize} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Background ── */}
        <SectionLabel>Background</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {BG_COLORS.map((c) => (
            <ColorDot
              key={c}
              color={c}
              selected={config.bgColor === c}
              onPress={() => set('bgColor', c)}
            />
          ))}
        </ScrollView>

        {/* ── Skin Tone ── */}
        <SectionLabel>Skin Tone</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {(Object.keys(SKIN_COLORS) as SkinTone[]).map((tone) => (
            <ColorDot
              key={tone}
              color={SKIN_COLORS[tone].base}
              selected={config.skinTone === tone}
              onPress={() => set('skinTone', tone)}
              size={38}
            />
          ))}
        </ScrollView>

        {/* ── Hair Style ── */}
        <SectionLabel>Hair Style</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {HAIR_STYLE_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              emoji={opt.emoji}
              selected={config.hairStyle === opt.id}
              onPress={() => set('hairStyle', opt.id)}
            />
          ))}
        </ScrollView>

        {/* ── Hair Color (hidden when bald/hijab) ── */}
        {config.hairStyle !== 'bald' && (
          <>
            <SectionLabel>Hair Color</SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
              {(Object.entries(HAIR_COLORS) as [HairColor, string][]).map(([key, color]) => (
                <View key={key} style={styles.colorLabelWrap}>
                  <ColorDot
                    color={color === '#1A1008' ? '#2A2018' : color}
                    selected={config.hairColor === key}
                    onPress={() => set('hairColor', key)}
                  />
                  <Text style={styles.colorLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Eye Color ── */}
        <SectionLabel>Eye Color</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {(Object.entries(EYE_COLORS) as [EyeColor, string][]).map(([key, color]) => (
            <View key={key} style={styles.colorLabelWrap}>
              <ColorDot
                color={color}
                selected={config.eyeColor === key}
                onPress={() => set('eyeColor', key)}
              />
              <Text style={styles.colorLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Mouth ── */}
        <SectionLabel>Expression</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {MOUTH_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              emoji={opt.emoji}
              selected={config.mouth === opt.id}
              onPress={() => set('mouth', opt.id)}
            />
          ))}
        </ScrollView>

        {/* ── Accessories (hidden for hijab) ── */}
        {config.hairStyle !== 'hijab' && (
          <>
            <SectionLabel>Accessories</SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
              {ACCESSORY_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.id}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={config.accessory === opt.id}
                  onPress={() => set('accessory', opt.id)}
                />
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  previewWrap: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  previewRing: {
    borderWidth: 2.5,
    borderColor: 'rgba(201,168,76,0.60)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9A84C',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginTop: SPACING.md,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 4,
    paddingRight: SPACING.lg,
  },
  colorDot: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  colorDotCheck: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotCheckText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FONTS.families.displayBold,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorLabelWrap: {
    alignItems: 'center',
    gap: 4,
  },
  colorLabel: {
    fontSize: 9,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  chipWrap: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    backgroundColor: COLORS.bgCard,
  },
  chipSelected: {
    borderColor: COLORS.accent + '60',
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 12,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },
  chipLabelSelected: {
    color: COLORS.accent,
  },
});
