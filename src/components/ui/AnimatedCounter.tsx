import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface Props {
  value: number;
  style?: TextStyle;
  duration?: number;
  formatter?: (n: number) => string;
}

export function AnimatedCounter({ value, style, duration = 900, formatter }: Props) {
  const [displayed, setDisplayed] = useState(value);
  const anim = useSharedValue(value);

  useAnimatedReaction(
    () => Math.round(anim.value),
    (cur, prev) => {
      if (cur !== prev) runOnJS(setDisplayed)(cur);
    },
  );

  useEffect(() => {
    anim.value = withTiming(value, { duration, easing: Easing.out(Easing.cubic) });
  }, [value]);

  const text = formatter ? formatter(displayed) : displayed.toLocaleString();

  return <Text style={style}>{text}</Text>;
}
