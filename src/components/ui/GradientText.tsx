import React from 'react';
import { Text, TextStyle } from 'react-native';

interface Props {
  children: string;
  colors: string[];
  style?: TextStyle;
}

/**
 * GradientText renders text using the first color of the gradient palette
 * with a subtle glow shadow for a luminous look.
 *
 * A true per-pixel gradient requires platform-native masking (MaskedView or
 * canvas-based approaches) and adds a heavy dependency. This lightweight
 * cross-platform implementation achieves the visual intent — glowing
 * accent-colored text — without extra packages.
 */
export function GradientText({ children, colors, style }: Props) {
  const baseColor = colors[0] ?? '#FFFFFF';

  return (
    <Text
      style={[
        style,
        {
          color: baseColor,
          textShadowColor: baseColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        },
      ]}
    >
      {children}
    </Text>
  );
}
