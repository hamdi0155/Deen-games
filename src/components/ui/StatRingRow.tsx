// ============================================================
// StatRingRow — horizontal 4-up row of StatRings
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatRing } from './StatRing';
import { AscendIconName, CATEGORY_ASCEND_ICONS } from '../icons/AscendIcon';
import { CATEGORY_COLORS, COLORS, RADIUS, SPACING } from '../../constants/theme';
import { xpProgress } from '../../services/xpService';

// Priority order for display
const PRIORITY_IDS = ['discipline', 'physical', 'mental', 'education'] as const;

// Human-readable labels per category id
const CATEGORY_LABELS: Record<string, string> = {
  discipline: 'Discipline',
  physical:   'Health',
  mental:     'Focus',
  education:  'Growth',
};

// ── Props ─────────────────────────────────────────────────────
export interface StatRingRowProps {
  categories: Array<{
    id: string;
    label: string;
    level: number;
    xp: number;
  }>;
}

export function StatRingRow({ categories }: StatRingRowProps) {
  // Build a lookup map for quick access
  const byId = Object.fromEntries(categories.map((c) => [c.id, c]));

  // Pick the 4 priority categories, falling back to first 4 in array
  const selected: typeof categories = [];
  for (const id of PRIORITY_IDS) {
    if (byId[id]) selected.push(byId[id]);
    if (selected.length === 4) break;
  }
  // Pad with remaining categories if we don't have 4 yet
  if (selected.length < 4) {
    const selectedIds = new Set(selected.map((c) => c.id));
    for (const c of categories) {
      if (!selectedIds.has(c.id)) {
        selected.push(c);
        if (selected.length === 4) break;
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {selected.map((cat) => {
          const { level, progress } = xpProgress(cat.xp);
          const iconName: AscendIconName =
            (CATEGORY_ASCEND_ICONS[cat.id] as AscendIconName | undefined) ?? 'star';
          const color = CATEGORY_COLORS[cat.id] ?? COLORS.accent;
          const label = CATEGORY_LABELS[cat.id] ?? cat.label;

          return (
            <StatRing
              key={cat.id}
              label={label}
              level={level}
              progress={progress}
              color={color}
              iconName={iconName}
              size={72}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
