import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MAX_LIVES = 3;

interface Props {
  lives: number;
}

export function LivesBar({ lives }: Props) {
  return (
    <View className="flex-row gap-1">
      {Array.from({ length: MAX_LIVES }).map((_, i) => (
        <Ionicons
          key={i}
          name="heart"
          size={20}
          color={i < lives ? '#e74c3c' : '#2d3148'}
        />
      ))}
    </View>
  );
}
