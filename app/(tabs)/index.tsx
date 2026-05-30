import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { CATEGORIES } from '@/constants/categories';
import { CategoryColors } from '@/constants/colors';
import { XpBar } from '@/components/ui/XpBar';
import { CategoryCard } from '@/components/ui/CategoryCard';

export default function HomeScreen() {
  const { profile } = useAuthStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
        {/* Header */}
        <LinearGradient
          colors={['#1a1d27', '#0f1117']}
          className="px-5 pt-4 pb-6 gap-4"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-muted text-sm">{greeting()},</Text>
              <Text className="text-text text-xl font-bold">
                {profile?.username ?? 'Learner'} 👋
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-card px-3 py-1.5 rounded-full border border-border">
              <Ionicons name="flame" size={16} color="#f39c12" />
              <Text className="text-text font-bold">{profile?.streak ?? 0}</Text>
              <Text className="text-muted text-xs"> day streak</Text>
            </View>
          </View>

          <XpBar xp={profile?.totalXp ?? 0} level={profile?.level ?? 1} />
        </LinearGradient>

        {/* Daily Challenge */}
        <View className="px-5 mt-5">
          <Pressable
            onPress={() => router.push('/game/quran')}
            className="active:opacity-80"
          >
            <LinearGradient
              colors={['#a8832f', '#d4a843', '#f0c85a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text className="text-background text-xs font-bold uppercase tracking-widest">
                    Daily Challenge
                  </Text>
                  <Text className="text-background text-xl font-bold">Quran Quiz</Text>
                  <Text className="text-background/80 text-sm">5 questions • up to 75 XP</Text>
                </View>
                <View className="bg-background/20 rounded-full p-3">
                  <Ionicons name="play" size={24} color="#0f1117" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Categories */}
        <View className="px-5 mt-6 gap-3">
          <Text className="text-text text-lg font-bold">Categories</Text>
          <View className="gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={() => router.push(`/game/${cat.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
