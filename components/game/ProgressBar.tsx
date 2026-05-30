import { View } from 'react-native';

interface Props {
  current: number;
  total: number;
  color: string;
}

export function ProgressBar({ current, total, color }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <View className="flex-1 mx-4 h-2.5 bg-surface rounded-full overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </View>
  );
}
