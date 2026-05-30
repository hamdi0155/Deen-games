import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/store';
import { signOut } from '@/lib/auth';
import { router } from 'expo-router';
import { XpBar } from '@/components/ui/XpBar';
import { CATEGORIES } from '@/constants/categories';
import { CategoryColors } from '@/constants/colors';

export default function ProfileScreen() {
  const { profile, setProfile } = useAuthStore();

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          setProfile(null);
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  }

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8">
        {/* Avatar + name */}
        <View className="items-center mt-6 gap-3">
          <View className="w-20 h-20 rounded-full bg-card border-2 border-gold items-center justify-center">
            <Text className="text-4xl">{profile.username.charAt(0).toUpperCase()}</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-text">{profile.username}</Text>
            <Text className="text-muted text-sm">{profile.email}</Text>
          </View>
        </View>

        {/* XP / Level */}
        <View className="mt-6 bg-card border border-border rounded-2xl p-4">
          <XpBar xp={profile.totalXp} level={profile.level} />
        </View>

        {/* Stats row */}
        <View className="flex-row gap-3 mt-4">
          {[
            { label: 'Total XP', value: profile.totalXp.toLocaleString(), icon: 'star' },
            { label: 'Level', value: String(profile.level), icon: 'shield' },
            { label: 'Streak', value: `${profile.streak}d`, icon: 'flame' },
          ].map((stat) => (
            <View key={stat.label} className="flex-1 bg-card border border-border rounded-2xl p-4 items-center gap-1">
              <Ionicons name={stat.icon as any} size={20} color="#d4a843" />
              <Text className="text-text font-bold text-lg">{stat.value}</Text>
              <Text className="text-muted text-xs">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Category progress */}
        <Text className="text-text font-bold text-lg mt-6 mb-3">Progress by Category</Text>
        <View className="gap-3">
          {CATEGORIES.map((cat) => (
            <View key={cat.id} className="bg-card border border-border rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-text font-semibold">{cat.label}</Text>
                <Text className="text-muted text-xs">0 / {cat.totalQuestions}</Text>
              </View>
              <View className="h-2 bg-surface rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: '0%', backgroundColor: cat.color }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Sign out */}
        <Pressable
          onPress={handleSignOut}
          className="mt-8 border border-danger rounded-2xl py-4 items-center active:opacity-80"
        >
          <Text className="text-danger font-semibold">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
