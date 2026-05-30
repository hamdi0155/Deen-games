import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { GlowCard } from '../src/components/ui/GlowCard';
import { PressableScale } from '../src/components/ui/PressableScale';
import { CustomAvatar } from '../src/components/ui/CustomAvatar';
import { AvatarBuilder } from '../src/components/ui/AvatarBuilder';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character);
  const updateName = useCharacterStore((s) => s.updateName);
  const updateAvatar = useCharacterStore((s) => s.updateAvatar);
  const reset = useCharacterStore((s) => s.reset);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character?.name ?? '');
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);

  if (!character) return null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      updateName(trimmed);
    } else {
      setNameInput(character.name);
    }
    setEditingName(false);
  };

  const handleSelectAvatar = (avatarId: string) => {
    updateAvatar(avatarId);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your progress, quests, habits, and disciplines. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: () => {
            reset();
            router.replace('/onboarding' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <LinearGradient
          colors={['rgba(99,102,241,0.15)', 'transparent']}
          style={styles.header}
        >
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <AscendIcon name="chevron-left" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Settings</Text>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>

        {/* ── Character summary (read-only) ── */}
        <Text style={styles.sectionLabel}>Character</Text>
        <GlowCard glowColor={COLORS.accent} style={styles.card}>
          <SettingRow icon={<View style={[styles.iconBox, { backgroundColor: 'rgba(99,102,241,0.18)' }]}><AscendIcon name="profile" size={16} color={COLORS.accent} /></View>} label="Name" right={<Text style={styles.valueText}>{character.name}</Text>} />
          <Divider />
          <SettingRow icon={<View style={[styles.iconBox, { backgroundColor: 'rgba(124,58,237,0.18)' }]}><AscendIcon name="profile" size={16} color="#7C3AED" /></View>} label="Avatar" right={<CustomAvatar avatarId={character.avatarEmoji} size={28} />} />
          <Divider />
          <SettingRow icon={<View style={[styles.iconBox, { backgroundColor: 'rgba(16,185,129,0.18)' }]}><AscendIcon name="stats" size={16} color={COLORS.success} /></View>} label="Level" right={<Text style={styles.valueText}>{character.overallLevel}</Text>} />
          <Divider />
          <SettingRow icon={<View style={[styles.iconBox, { backgroundColor: 'rgba(245,158,11,0.18)' }]}><AscendIcon name="achievement" size={16} color={COLORS.warning} /></View>} label="Life Rank" right={<Text style={[styles.valueText, { color: COLORS.accent }]}>{character.lifeRank}</Text>} />
        </GlowCard>

        {/* ── Your Legend stats mini card ── */}
        <GlowCard glowColor={COLORS.accent} style={styles.legendCard}>
          <Text style={styles.legendTitle}>Your Story</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <Text style={styles.legendValue}>{character.overallLevel}</Text>
              <Text style={styles.legendLabel}>Level</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendValue}>{character.totalXP.toLocaleString()}</Text>
              <Text style={styles.legendLabel}>XP</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={[styles.legendValue, { color: COLORS.accent, fontSize: FONTS.sizes.xs }]}>{character.lifeRank}</Text>
              <Text style={styles.legendLabel}>Life Rank</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendValue}>
                {Math.floor((Date.now() - new Date(character.createdAt).getTime()) / 86400000)}
              </Text>
              <Text style={styles.legendLabel}>Days Active</Text>
            </View>
          </View>
        </GlowCard>

        {/* ── Profile edit ── */}
        <Text style={styles.sectionLabel}>Profile</Text>
        <GlowCard style={styles.card}>
          {/* Edit Name */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(99,102,241,0.18)' }]}><AscendIcon name="profile" size={16} color={COLORS.accent} /></View>
            <Text style={styles.rowLabel}>Name</Text>
            {editingName ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  maxLength={30}
                  placeholderTextColor={COLORS.textMuted}
                  onSubmitEditing={handleSaveName}
                  returnKeyType="done"
                  selectionColor={COLORS.accent}
                />
                <TouchableOpacity onPress={handleSaveName} style={styles.saveBtn} activeOpacity={0.8}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setNameInput(character.name); setEditingName(true); }} activeOpacity={0.7} style={styles.rowRight}>
                <Text style={styles.valueText}>{character.name}</Text>
                <AscendIcon name="chevron-right" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <Divider />

          {/* Change Avatar */}
          <PressableScale onPress={() => setShowAvatarBuilder((prev) => !prev)} style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(124,58,237,0.18)' }]}><AscendIcon name="profile" size={16} color="#7C3AED" /></View>
            <Text style={styles.rowLabel}>Avatar</Text>
            <View style={styles.rowRight}>
              <CustomAvatar avatarId={character.avatarEmoji} size={56} />
              <AscendIcon name={showAvatarBuilder ? 'chevron-left' : 'chevron-right'} size={16} color={COLORS.textMuted} />
            </View>
          </PressableScale>

          {showAvatarBuilder && (
            <View style={styles.avatarBuilderWrap}>
              <AvatarBuilder
                value={character.avatarEmoji}
                onChange={(id) => {
                  handleSelectAvatar(id);
                }}
              />
            </View>
          )}
        </GlowCard>

        {/* ── Preferences ── */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <GlowCard style={styles.card}>
          {/* Dark Mode */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(99,102,241,0.18)' }]}>
              <AscendIcon name="moon" size={16} color={COLORS.accent} />
            </View>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <View style={styles.rowRight}>
              <Text style={styles.prefMuted}>Always On</Text>
              <View style={styles.switchTrackOn}>
                <View style={styles.switchThumbRight} />
              </View>
            </View>
          </View>

          <Divider />

          {/* Daily Reminder */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(245,158,11,0.18)' }]}>
              <AscendIcon name="bell" size={16} color={COLORS.warning} />
            </View>
            <Text style={styles.rowLabel}>Daily Reminder</Text>
            <View style={styles.rowRight}>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            </View>
          </View>
        </GlowCard>

        {/* ── App ── */}
        <Text style={styles.sectionLabel}>App</Text>
        <GlowCard style={styles.card}>
          {/* Clear All Data */}
          <PressableScale onPress={handleClearAllData} style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.18)' }]}>
              <AscendIcon name="trash" size={16} color={COLORS.danger} />
            </View>
            <Text style={[styles.rowLabel, { color: COLORS.danger }]}>Clear All Data</Text>
            <AscendIcon name="chevron-right" size={16} color={COLORS.textMuted} />
          </PressableScale>

          <Divider />

          {/* About */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(99,102,241,0.18)' }]}>
              <AscendIcon name="info" size={16} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>About</Text>
              <Text style={styles.aboutDesc}>
                Ascend · v1.0.0{'\n'}Level up your life, one discipline at a time.
              </Text>
            </View>
          </View>
        </GlowCard>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Small helpers ── */

function Divider() {
  return <View style={styles.divider} />;
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
}

function SettingRow({ icon, label, right }: SettingRowProps) {
  return (
    <View style={styles.row}>
      {icon}
      <Text style={styles.rowLabel}>{label}</Text>
      {right && <View style={styles.rowRight}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 60 },

  header: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  screenTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.families.displayMedium,
    color: COLORS.text,
    letterSpacing: 0.5,
  },

  sectionLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },

  card: {
    marginHorizontal: SPACING.lg,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    gap: SPACING.md,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
    fontFamily: FONTS.families.bodyMedium,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  valueText: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  nameInput: {
    flex: 1,
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  saveBtnText: {
    fontFamily: FONTS.families.bodySemibold,
    fontSize: FONTS.sizes.sm,
    color: '#fff',
  },

  aboutDesc: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
    marginVertical: 2,
  },

  // Legend stats card
  legendCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  legendTitle: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  legendItem: {
    width: '47%',
    gap: 2,
  },
  legendValue: {
    fontFamily: FONTS.families.displayBold,
    fontSize: 22,
    color: COLORS.text,
  },
  legendLabel: {
    fontFamily: FONTS.families.displayLight,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Preferences section
  prefMuted: {
    fontFamily: FONTS.families.body,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginRight: SPACING.sm,
  },
  switchTrackOn: {
    width: 44,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-end',
  },
  switchThumbRight: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
  },
  comingSoonText: {
    fontFamily: FONTS.families.displayLight,
    fontSize: FONTS.sizes.xs,
    color: COLORS.accent,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0E0E18',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderColor: COLORS.bgCardBorder,
  },
  modalTitle: {
    fontFamily: FONTS.families.displayBold,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    letterSpacing: 1,
  },
  avatarBuilderWrap: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
  },
  avatarOptionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
});
