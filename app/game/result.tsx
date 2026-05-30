import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '@/constants/categories';

export default function ResultScreen() {
  const { score, total, xp, category } = useLocalSearchParams<{
    score: string;
    total: string;
    xp: string;
    category: string;
  }>();

  const numScore = Number(score);
  const numTotal = Number(total);
  const numXp = Number(xp);
  const pct = Math.round((numScore / numTotal) * 100);

  const categoryMeta = CATEGORIES.find((c) => c.id === category);

  const emoji = pct === 100 ? '🌟' : pct >= 80 ? '✨' : pct >= 60 ? '👍' : '📚';
  const message =
    pct === 100
      ? 'Perfect score! Masha\'Allah!'
      : pct >= 80
      ? 'Excellent work!'
      : pct >= 60
      ? 'Good effort, keep practicing!'
      : 'Keep learning — you\'ll improve!';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 items-center justify-center gap-8">
        <Text className="text-7xl">{emoji}</Text>

        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-text">{message}</Text>
          <Text className="text-muted text-center">
            You answered {numScore} out of {numTotal} correctly
          </Text>
        </View>

        {/* Score circle */}
        <View
          className="w-32 h-32 rounded-full border-4 items-center justify-center"
          style={{ borderColor: categoryMeta?.color ?? '#d4a843' }}
        >
          <Text className="text-4xl font-bold text-text">{pct}%</Text>
          <Text className="text-muted text-xs">accuracy</Text>
        </View>

        {/* XP earned */}
        {numXp > 0 && (
          <View className="flex-row items-center gap-2 bg-gold/10 border border-gold/30 rounded-2xl px-6 py-3">
            <Ionicons name="star" size={20} color="#d4a843" />
            <Text className="text-gold font-bold text-lg">+{numXp} XP earned</Text>
          </View>
        )}

        {/* Actions */}
        <View className="w-full gap-3">
          <Pressable
            onPress={() => router.replace(`/game/${category}`)}
            className="rounded-2xl py-4 items-center active:opacity-80"
            style={{ backgroundColor: categoryMeta?.color ?? '#d4a843' }}
          >
            <Text className="text-white font-bold text-lg">Play Again</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="border border-border rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-text font-semibold">Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
