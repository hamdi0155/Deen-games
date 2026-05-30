import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryMeta } from '@/constants/categories';

interface Props {
  category: CategoryMeta;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-card border border-border rounded-2xl p-4 flex-row items-center gap-4 active:opacity-80"
    >
      <View
        className="w-11 h-11 rounded-xl items-center justify-center"
        style={{ backgroundColor: category.color + '22' }}
      >
        <Ionicons name={category.icon as any} size={22} color={category.color} />
      </View>

      <View className="flex-1">
        <Text className="text-text font-semibold">{category.label}</Text>
        <Text className="text-muted text-xs">{category.totalQuestions} questions</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#6b7280" />
    </Pressable>
  );
}
