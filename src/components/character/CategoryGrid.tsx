import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Category } from '../../types';
import { GlowCard } from '../ui/GlowCard';
import { LevelBadge } from '../ui/LevelBadge';
import { XPBar } from '../ui/XPBar';
import { xpProgress } from '../../services/xpService';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

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
            activeOpacity={0.7}
          >
            <GlowCard style={styles.card} glowColor={cat.color} padding={SPACING.sm}>
              <View style={styles.cardTop}>
                <Text style={styles.emoji}>{cat.emoji}</Text>
                <LevelBadge level={cat.level} color={cat.color} size={28} />
              </View>
              <Text style={styles.label} numberOfLines={1}>{cat.label}</Text>
              <XPBar progress={progress} color={cat.color} height={4} />
            </GlowCard>
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
    gap: SPACING.xs,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },
});
