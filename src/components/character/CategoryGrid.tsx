import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { Category } from '../../types';
import { LevelBadge } from '../ui/LevelBadge';
import { XPBar } from '../ui/XPBar';
import { PressableScale } from '../ui/PressableScale';
import { Shimmer } from '../ui/Shimmer';
import { AscendIcon, CATEGORY_ASCEND_ICONS } from '../icons/AscendIcon';
import { xpProgress } from '../../services/xpService';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  categories: Category[];
  loading?: boolean;
}

const SKELETON_COUNT = 12;

function SkeletonCard() {
  return (
    <View style={styles.cell}>
      <View style={[styles.card, styles.skeletonCard]}>
        {/* top accent bar */}
        <Shimmer width="100%" height={3} borderRadius={0} />
        <View style={styles.cardInner}>
          <View style={styles.cardTop}>
            {/* emoji placeholder */}
            <Shimmer width={32} height={32} borderRadius={8} />
            {/* level badge placeholder */}
            <Shimmer width={28} height={28} borderRadius={14} />
          </View>
          {/* label placeholder */}
          <Shimmer width={80} height={12} borderRadius={4} />
          {/* XP bar placeholder */}
          <Shimmer width="100%" height={4} borderRadius={2} />
          {/* XP text placeholder */}
          <Shimmer width={60} height={10} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

export function CategoryGrid({ categories, loading = false }: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {categories.map((cat) => {
        const { level, progress } = xpProgress(cat.xp);
        return (
          <PressableScale
            key={cat.id}
            style={[
              styles.cell,
              {
                shadowColor: cat.color,
                shadowOpacity: 0.22,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 3 },
                elevation: 8,
              },
            ]}
            onPress={() => router.push(`/category/${cat.id}`)}
          >
            <View
              style={[
                styles.card,
                { borderColor: `${cat.color}25` },
              ]}
            >
              {/* Top accent — vertical gradient so full width is uniformly colored */}
              <LinearGradient
                colors={[cat.color + 'DD', cat.color + '55', cat.color + '00']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.accentBar}
              />

              <View style={styles.cardInner}>
                <View style={styles.cardTop}>
                  <AscendIcon name={CATEGORY_ASCEND_ICONS[cat.id] ?? 'star'} size={22} color={cat.color} />
                  <LevelBadge level={level} color={cat.color} size={28} />
                </View>
                <Text style={styles.label} numberOfLines={1}>{cat.label}</Text>
                <XPBar progress={progress} color={cat.color} height={4} glowing={cat.xp > 0} />
                <Text style={[styles.xp, { color: cat.color + 'AA' }]}>
                  {`Lv ${level}`}
                </Text>
              </View>
            </View>
          </PressableScale>
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
  cell: { width: '47%', borderRadius: RADIUS.lg },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: COLORS.bgCardBorder,
  },
  skeletonCard: {
    borderColor: 'rgba(255,255,255,0.06)',
  },
  accentBar: { height: 5, width: '100%' },
  cardInner: {
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 0.5,
  },
  xp: {
    fontSize: 10,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
