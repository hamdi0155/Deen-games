import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomAvatar, AVATAR_CONFIGS } from './CustomAvatar';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function AvatarBuilder({ value, onChange }: Props) {
  return (
    <View style={styles.grid}>
      {AVATAR_CONFIGS.map((a) => {
        const isSelected = value === a.id;
        return (
          <TouchableOpacity
            key={a.id}
            style={[styles.cell, isSelected && styles.cellSelected]}
            onPress={() => onChange(a.id)}
            activeOpacity={0.7}
          >
            {isSelected && (
              <LinearGradient
                colors={['rgba(201,168,76,0.22)', 'rgba(201,168,76,0.07)']}
                style={StyleSheet.absoluteFill}
              />
            )}
            <CustomAvatar avatarId={a.id} size={48} selected={isSelected} />
            <Text style={styles.label}>{a.label}</Text>
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
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  cell: {
    width: '22%',
    aspectRatio: 0.85,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  cellSelected: {
    borderColor: COLORS.gold,
    borderWidth: 2,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.75,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
