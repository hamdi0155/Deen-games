import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '../../types';
import { LevelBadge } from '../ui/LevelBadge';
import { XPBar } from '../ui/XPBar';
import { xpProgress } from '../../services/xpService';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  categories: Category[];
}

export function CategoryGrid({ categories }: Props) {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {categories.map((cat) => {
        const { progress } = xpProgress(cat.xp);
        return (
          <TouchableOpacity
            key={cat.id}
            style={styles.cell}
            onPress={() => router.push(`/category/${cat.id}`)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.card,
                {
                  shadowColor: cat.color,
                  shadowOpacity: 0.35,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 10,
                },
              ]}
            >
              {/* Colored top accent bar */}
              <View style={[styles.accentBar, { backgroundColor: cat.color }]} />

              <View style={styles.cardInner}>
                <View style={styles.cardTop}>
                  <Text style={styles.emoji}>{cat.emoji}</Text>
                  <LevelBadge level={cat.level} color={cat.color} size={30} />
                </View>
                <Text style={styles.label} numberOfLines={1}>{cat.label}</Text>
                <XPBar progress={progress} color={cat.color} height={3} />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  cell: {
    width: '47%',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    overflow: 'hidden',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  cardInner: {
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: { fontSize: 26 },
  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.semibold,
    letterSpacing: 0.2,
  },
});
