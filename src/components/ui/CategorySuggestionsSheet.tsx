import React, { useState, useCallback, useEffect } from 'react';
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
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { getCategorySuggestions, CategorySuggestion, SuggestionType } from '../../services/groqService';

interface Props {
  visible: boolean;
  onClose: () => void;
  categoryId: string;
  categoryLabel: string;
  categoryEmoji: string;
  categoryColor: string;
  currentLevel: number;
  currentXP: number;
}

const TYPE_CONFIG: Record<SuggestionType, { label: string; emoji: string }> = {
  book:      { label: 'READ',      emoji: '📚' },
  habit:     { label: 'HABIT',     emoji: '🔥' },
  practice:  { label: 'PRACTICE',  emoji: '⚔️' },
  mindset:   { label: 'MINDSET',   emoji: '🧠' },
  challenge: { label: 'CHALLENGE', emoji: '🏆' },
};

export function CategorySuggestionsSheet({
  visible,
  onClose,
  categoryId,
  categoryLabel,
  categoryEmoji,
  categoryColor,
  currentLevel,
  currentXP,
}: Props) {
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const slideY = useSharedValue(400);
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getCategorySuggestions(
        categoryId,
        categoryLabel,
        currentLevel,
        currentXP,
      );
      if (result.length === 0) throw new Error('empty');
      setSuggestions(result);
      setGenerated(true);
    } catch (e) {
      const msg = (e as Error).message ?? '';
      setError(
        msg.includes('GROQ') || msg.includes('not set')
          ? 'Add EXPO_PUBLIC_GROQ_API_KEY to your .env to unlock suggestions.'
          : 'Could not generate suggestions. Try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryLabel, currentLevel, currentXP]);

  useEffect(() => {
    if (visible) {
      slideY.value = withSpring(0, { damping: 22, stiffness: 180 });
      if (!generated) generate();
    } else {
      slideY.value = withTiming(400, { duration: 250 });
    }
  }, [visible]);

  const handleClose = () => {
    slideY.value = withTiming(400, { duration: 250 });
    setTimeout(onClose, 260);
  };

  const handleRefresh = () => {
    setGenerated(false);
    setSuggestions([]);
    generate();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      <Animated.View style={[styles.sheet, sheetStyle]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <LinearGradient
          colors={[categoryColor + '20', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGrad}
        >
          <View style={styles.header}>
            <View style={[styles.catIconWrap, { backgroundColor: categoryColor + '25' }]}>
              <Text style={styles.catIconEmoji}>{categoryEmoji}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{categoryLabel} Suggestions</Text>
              <View style={styles.headerBadgeRow}>
                <View style={[styles.badge, { borderColor: categoryColor + '50', backgroundColor: categoryColor + '15' }]}>
                  <Text style={[styles.badgeText, { color: categoryColor }]}>✦ Jim Rohn</Text>
                </View>
                <View style={styles.groqBadge}>
                  <Text style={styles.groqBadgeText}>⚡ Groq</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
              <AscendIcon name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.divider} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={categoryColor} />
              <Text style={[styles.loadingTitle, { color: categoryColor }]}>
                Consulting Jim Rohn's teachings...
              </Text>
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
            const typeConf = TYPE_CONFIG[s.type] ?? TYPE_CONFIG.practice;
            return (
              <View
                key={i}
                style={[
                  styles.card,
                  { borderLeftColor: categoryColor, borderColor: categoryColor + '25' },
                ]}
              >
                <LinearGradient
                  colors={[categoryColor + '0A', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* Type chip + emoji */}
                <View style={styles.cardTop}>
                  <View style={[styles.typeChip, { backgroundColor: categoryColor + '20' }]}>
                    <Text style={styles.typeChipEmoji}>{typeConf.emoji}</Text>
                    <Text style={[styles.typeChipText, { color: categoryColor }]}>
                      {typeConf.label}
                    </Text>
                  </View>
                  <Text style={styles.suggestionEmoji}>{s.emoji}</Text>
                </View>

                {/* Title */}
                <Text style={styles.cardTitle}>{s.title}</Text>

                {/* Action */}
                <View style={styles.actionBox}>
                  <View style={[styles.actionDot, { backgroundColor: categoryColor }]} />
                  <Text style={styles.actionText}>{s.action}</Text>
                </View>

                {/* Jim Rohn quote */}
                <View style={[styles.quoteBox, { borderLeftColor: categoryColor }]}>
                  <Text style={styles.quoteLabel}>JIM ROHN</Text>
                  <Text style={styles.quoteText}>"{s.rohnTeaching}"</Text>
                </View>
              </View>
            );
          })}

          {!loading && suggestions.length > 0 && (
            <TouchableOpacity
              onPress={handleRefresh}
              style={[styles.refreshBtn, { borderColor: categoryColor + '40', backgroundColor: categoryColor + '10' }]}
              activeOpacity={0.8}
            >
              <AscendIcon name="refresh" size={16} color={categoryColor} />
              <Text style={[styles.refreshText, { color: categoryColor }]}>New Suggestions</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgModal,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.7,
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
  headerGrad: {
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  catIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconEmoji: { fontSize: 24 },
  headerText: { flex: 1, gap: 5 },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.5,
  },
  groqBadge: {
    backgroundColor: 'rgba(91,108,245,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.bgCardBorder,
    marginHorizontal: SPACING.lg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 52,
    gap: SPACING.md,
  },
  loadingTitle: {
    fontSize: 15,
    fontFamily: FONTS.families.displayBold,
    textAlign: 'center',
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
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: SPACING.md,
    gap: SPACING.sm,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  typeChipEmoji: { fontSize: 11 },
  typeChipText: {
    fontSize: 9,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 1.5,
  },
  suggestionEmoji: { fontSize: 26 },
  cardTitle: {
    fontSize: 17,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    lineHeight: 22,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  actionDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 5,
    flexShrink: 0,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.families.body,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  quoteBox: {
    borderLeftWidth: 2,
    paddingLeft: SPACING.sm,
    gap: 3,
    marginTop: 2,
  },
  quoteLabel: {
    fontSize: 8,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  quoteText: {
    fontSize: 12,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 17,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  refreshText: {
    fontSize: 13,
    fontFamily: FONTS.families.displayBold,
    letterSpacing: 0.3,
  },
});
