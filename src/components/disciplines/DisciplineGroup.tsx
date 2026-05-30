import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AscendIcon, AscendIconName } from '../icons/AscendIcon';
import { Discipline, DisciplineFrequency } from '../../types';
import { DisciplineCard } from './DisciplineCard';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface Props {
  frequency: DisciplineFrequency;
  disciplines: Discipline[];
  categoryColor?: string;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SECTION_CONFIG: Record<
  DisciplineFrequency,
  { icon: AscendIconName; label: string; color: string }
> = {
  daily: { icon: 'flash', label: 'Daily Disciplines', color: '#10B981' },
  weekdays: { icon: 'build', label: 'Weekday Disciplines', color: '#10B981' },
  weekly: { icon: 'list', label: 'Weekly Practices', color: '#3B82F6' },
  monthly: { icon: 'moon', label: 'Monthly Rituals', color: '#8B5CF6' },
};

export function DisciplineGroup({
  frequency,
  disciplines,
  categoryColor,
  onComplete,
  onDelete,
}: Props) {
  if (disciplines.length === 0) return null;

  const config = SECTION_CONFIG[frequency];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AscendIcon name={config.icon} size={16} color={config.color} />
        <Text style={[styles.label, { color: config.color }]}>
          {config.label}
        </Text>
        <View style={[styles.count, { backgroundColor: `${config.color}20` }]}>
          <Text style={[styles.countText, { color: config.color }]}>
            {disciplines.length}
          </Text>
        </View>
      </View>
      {disciplines.map((disc) => (
        <DisciplineCard
          key={disc.id}
          discipline={disc}
          categoryColor={categoryColor}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
    letterSpacing: 1,
    flex: 1,
  },
  count: {
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  countText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.displayLight,
  },
});
