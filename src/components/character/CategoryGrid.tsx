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
                shadowOpacity: cat.xp > 0 ? 0.25 : 0.08,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              },
            ]}
            onPress={() => router.push(`/category/${cat.id}`)}
          >
            <View
              style={[
                styles.card,
                { borderColor: `${cat.color}${cat.xp > 0 ? '30' : '12'}` },
              ]}
            >
              {/* Gradient top accent — vertical fade so full width is uniformly colored */}
              <LinearGradient
                colors={[cat.color + 'CC', cat.color + '40', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.accentBar, cat.xp > 0 && { height: 6 }]}
              />
              {cat.xp > 0 && (
                <LinearGradient
                  colors={[cat.color + '0C', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGlow}
                  pointerEvents="none"
                />
              )}

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
  accentBar: { height: 4, width: '100%' },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
