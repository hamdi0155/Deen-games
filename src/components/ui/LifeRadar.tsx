import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface RadarCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  level: number;
}

interface Props {
  categories: RadarCategory[];
  size?: number;
}

export function LifeRadar({ categories, size = 280 }: Props) {
  const maxRadius = size / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // 5 rings at 20%, 40%, 60%, 80%, 100%
  const ringRatios = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <View
      style={[
        styles.wrapper,
        {
          shadowColor: COLORS.accent,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
          },
        ]}
      >
        {/* Concentric rings */}
        {ringRatios.map((ratio, i) => {
          const ringSize = size * ratio;
          return (
            <View
              key={`ring-${i}`}
              style={{
                position: 'absolute',
                width: ringSize,
                height: ringSize,
                borderRadius: ringSize / 2,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.07)',
                left: centerX - ringSize / 2,
                top: centerY - ringSize / 2,
              }}
            />
          );
        })}

        {/* Axis lines from center to edge, and category dots + emoji labels */}
        {categories.map((cat, index) => {
          const angle =
            (index / categories.length) * 2 * Math.PI - Math.PI / 2;

          const normalizedValue = Math.min(Math.max(cat.level, 0) / 10, 1);

          // Dot position at the category's level
          const dotX = centerX + maxRadius * normalizedValue * Math.cos(angle);
          const dotY = centerY + maxRadius * normalizedValue * Math.sin(angle);

          // Label position — slightly beyond full radius
          const labelOffset = 18;
          const labelX =
            centerX + (maxRadius + labelOffset) * Math.cos(angle);
          const labelY =
            centerY + (maxRadius + labelOffset) * Math.sin(angle);

          // Axis line: a thin View starting at center going outward.
          // React Native rotates around the element's center.
          // The line is maxRadius tall. We center it at (centerX, centerY + maxRadius/2)
          // so its top edge starts at centerY. Then rotate.
          // angle already starts from -π/2 (top), so axisDeg converts to degrees.
          const axisDeg = (angle * 180) / Math.PI + 90;

          const dotSize = 8;

          return (
            <React.Fragment key={cat.id}>
              {/* Axis line — positioned so its top starts at center, rotates outward */}
              <View
                style={{
                  position: 'absolute',
                  width: 1,
                  height: maxRadius,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  left: centerX - 0.5,
                  top: centerY,
                  transform: [
                    { translateY: -maxRadius / 2 },
                    { rotate: `${axisDeg - 90}deg` },
                    { translateY: maxRadius / 2 },
                  ],
                }}
              />

              {/* Dot at category level */}
              <View
                style={{
                  position: 'absolute',
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: cat.color,
                  left: dotX - dotSize / 2,
                  top: dotY - dotSize / 2,
                  shadowColor: cat.color,
                  shadowOpacity: normalizedValue > 0 ? 0.8 : 0,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: normalizedValue > 0 ? 6 : 0,
                }}
              />

              {/* Emoji label at max radius */}
              <Text
                style={{
                  position: 'absolute',
                  fontSize: 13,
                  left: labelX - 10,
                  top: labelY - 10,
                  textAlign: 'center',
                }}
              >
                {cat.emoji}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Center dot */}
        <View
          style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            left: centerX - 3,
            top: centerY - 3,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    overflow: 'visible',
  },
});
