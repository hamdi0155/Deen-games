import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AscendIcon, AscendIconName } from '../icons/AscendIcon';
import { COLORS, FONTS } from '../../constants/theme';

interface StatIconCardProps {
  icon: AscendIconName; // AscendIcon name
  iconColor: string; // e.g. "#F97316"
  label: string; // e.g. "Streak"
  value: string | number; // e.g. "7d" or 42
  style?: ViewStyle;
}

export function StatIconCard({ icon, iconColor, label, value, style }: StatIconCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View
        style={[
          styles.iconBoxShadow,
          {
            shadowColor: iconColor,
          },
        ]}
      >
        <LinearGradient
          colors={[iconColor + '33', iconColor + '11']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.iconBox,
            {
              borderColor: iconColor + '44',
            },
          ]}
        >
          <AscendIcon name={icon} size={22} color={iconColor} />
        </LinearGradient>
      </View>

      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconBoxShadow: {
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 9,
    fontFamily: FONTS.families.body,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  value: {
    fontSize: 24,
    fontFamily: FONTS.families.display,
    color: COLORS.text,
  },
});
