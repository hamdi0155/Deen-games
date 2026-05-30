import { View, Text } from 'react-native';
import { XP_PER_LEVEL, xpInCurrentLevel } from '@/constants/categories';

interface Props {
  xp: number;
  level: number;
}

export function XpBar({ xp, level }: Props) {
  const currentLevelXp = xpInCurrentLevel(xp);
  const pct = (currentLevelXp / XP_PER_LEVEL) * 100;

  return (
    <View className="gap-1.5">
      <View className="flex-row justify-between">
        <Text className="text-gold font-bold text-sm">Level {level}</Text>
        <Text className="text-muted text-xs">
          {currentLevelXp} / {XP_PER_LEVEL} XP
        </Text>
      </View>
      <View className="h-2 bg-surface rounded-full overflow-hidden">
        <View
          className="h-full bg-gold rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
