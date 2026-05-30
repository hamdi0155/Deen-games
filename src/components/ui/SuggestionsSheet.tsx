import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon } from '../icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_COLORS } from '../../constants/theme';
import { getJimRohnSuggestions, RohnSuggestion } from '../../services/groqService';
import { Character, Habit, Quest } from '../../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  character: Character;
  habits: Habit[];
  quests: Quest[];
}

const CATEGORY_EMOJIS: Record<string, string> = {
  education: '📚', career: '💼', finance: '💰', physical: '🏋️',
  appearance: '✨', mental: '🧘', social: '🤝', relationships: '❤️',
  discipline: '⚔️', spiritual: '🕌', creativity: '🎨', leadership: '👑',
};

export function SuggestionsSheet({ visible, onClose, character, habits, quests }: Props) {
  const [suggestions, setSuggestions] = useState<RohnSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');

  const activeQuests = quests.filter((q) => q.status === 'active');

  const slideY = useSharedValue(300);
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const handleOpen = useCallback(() => {
    slideY.value = withSpring(0, { damping: 22, stiffness: 180 });
    if (!hasLoaded) generate();
  }, [hasLoaded]);

  const handleClose = () => {
    slideY.value = withTiming(300, { duration: 250 });
    setTimeout(onClose, 260);
  };

  React.useEffect(() => {
    if (visible) handleOpen();
  }, [visible]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getJimRohnSuggestions(
        character,
        habits.map((h) => ({ title: h.title, categoryId: h.categoryId, currentStreak: h.currentStreak })),
        activeQuests.length,
      );
      if (result.length === 0) throw new Error('No suggestions returned');
      setSuggestions(result);
      setHasLoaded(true);
    } catch (e) {
      const msg = (e as Error).message ?? '';
      setError(
        msg.includes('GROQ_API_KEY') || msg.includes('not set')
          ? 'Add EXPO_PUBLIC_GROQ_API_KEY to your .env to enable suggestions.'
          : 'Could not load suggestions. Check your Groq API key.',
      );
    } finally {
      setLoading(false);
    }
  }, [character, habits, activeQuests.length]);

  const handleRefresh = () => {
    setHasLoaded(false);
    setSuggestions([]);
    generate();
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={handleClose} statusBarTranslucent>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Jim Rohn Suggestions</Text>
            <View style={styles.groqBadge}>
              <Text style={styles.groqBadgeText}>⚡ Groq · Llama 3.3</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
            <AscendIcon name="close" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Personalised to your life profile · based on areas of neglect
        </Text>

        <View style={styles.divider} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Analysing your life domains...</Text>
              <Text style={styles.loadingSubtext}>Groq · llama-3.3-70b-versatile</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {!loading && suggestions.map((s, i) => {
            const catColor = CATEGORY_COLORS[s.categoryId] ?? COLORS.accent;
            const catEmoji = CATEGORY_EMOJIS[s.categoryId] ?? s.emoji ?? '✦';
            return (
              <View key={i} style={[styles.card, { borderLeftColor: catColor }]}>
                {/* Card gradient background */}
                <LinearGradient
                  colors={[catColor + '12', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* Category chip */}
                <View style={[styles.catChip, { backgroundColor: catColor + '20' }]}>
                  <Text style={styles.catChipEmoji}>{catEmoji}</Text>
                  <Text style={[styles.catChipText, { color: catColor }]}>
                    {s.categoryId.toUpperCase()}
                  </Text>
                </View>

                {/* Suggestion title */}
                <Text style={styles.cardTitle}>{s.title}</Text>

                {/* Action */}
                <View style={styles.actionRow}>
                  <View style={[styles.actionDot, { backgroundColor: catColor }]} />
                  <Text style={styles.actionText}>{s.action}</Text>
                </View>

                {/* Jim Rohn principle */}
                <View style={styles.quoteRow}>
                  <Text style={styles.quoteText}>"{s.principle}"</Text>
                  <Text style={styles.quoteSig}>— Jim Rohn</Text>
                </View>
              </View>
            );
          })}

          {!loading && suggestions.length > 0 && (
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.refreshBtn}
              activeOpacity={0.8}
            >
              <AscendIcon name="refresh" size={16} color={COLORS.accent} />
              <Text style={styles.refreshText}>Generate New Suggestions</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgModal,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -8 },
    elevation: 30,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  headerLeft: { gap: 6 },
  title: {
    fontSize: 20,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  groqBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(91,108,245,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(91,108,245,0.3)',
  },
  groqBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  closeBtn: { padding: SPACING.xs },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
  },
  loadingSubtext: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  errorCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  errorEmoji: { fontSize: 32 },
  errorText: {
    fontSize: 13,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    borderLeftWidth: 3,
    padding: SPACING.md,
    gap: SPACING.sm,
    overflow: 'hidden',
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  catChipEmoji: { fontSize: 12 },
  catChipText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  actionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  quoteRow: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 2,
    marginTop: 2,
  },
  quoteText: {
    fontSize: 12,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  quoteSig: {
    fontSize: 10,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
    backgroundColor: COLORS.accentDim,
    marginTop: SPACING.xs,
  },
  refreshText: {
    fontSize: 13,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
});
