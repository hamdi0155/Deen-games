import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
                  shadowOpacity: 0.3,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 10,
                  borderColor: `${cat.color}22`,
                },
              ]}
            >
              {/* Gradient top accent */}
              <LinearGradient
                colors={[cat.color, cat.color + '00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accentBar}
              />

              <View style={styles.cardInner}>
                <View style={styles.cardTop}>
                  <Text style={styles.emoji}>{cat.emoji}</Text>
                  <LevelBadge level={cat.level} color={cat.color} size={30} />
                </View>
                <Text style={styles.label} numberOfLines={1}>{cat.label}</Text>
                <XPBar progress={progress} color={cat.color} height={3} />
                <Text style={[styles.xp, { color: cat.color + 'AA' }]}>{cat.xp} XP</Text>
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
  cell: { width: '47%' },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: { height: 3, width: '100%' },
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
    color: COLORS.text,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 0.3,
  },
  xp: {
    fontSize: 10,
    fontFamily: FONTS.families.body,
    letterSpacing: 0.2,
  },
});
