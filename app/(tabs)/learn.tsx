import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '@/constants/categories';
import { getQuestionsByCategory } from '@/constants/questions';

export default function LearnScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8">
        <Text className="text-2xl font-bold text-text mt-4 mb-1">Learn</Text>
        <Text className="text-muted mb-6">Choose a topic to practice</Text>

        {CATEGORIES.map((cat) => {
          const questions = getQuestionsByCategory(cat.id);
          return (
            <Pressable
              key={cat.id}
              onPress={() => router.push(`/game/${cat.id}`)}
              className="bg-card border border-border rounded-2xl p-5 mb-4 active:opacity-80"
            >
              <View className="flex-row items-center gap-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: cat.color + '22' }}
                >
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                </View>

                <View className="flex-1 gap-0.5">
                  <Text className="text-text font-bold text-base">{cat.label}</Text>
                  <Text className="text-muted text-xs font-arabic">{cat.arabicLabel}</Text>
                  <Text className="text-textSecondary text-sm mt-1">{cat.description}</Text>
                </View>

                <View className="items-end gap-1">
                  <Text className="text-xs text-muted">{questions.length} Q</Text>
                  <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                </View>
              </View>

              {/* Progress bar placeholder */}
              <View className="mt-4 h-1.5 bg-surface rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: '0%', backgroundColor: cat.color }}
                />
              </View>
              <Text className="text-muted text-xs mt-1">0 / {questions.length} completed</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
