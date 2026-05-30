import { View, Text, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={['#0f1117', '#1a1d27', '#0f1117']} className="flex-1">
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-1 items-center justify-center gap-8">
          <View className="items-center gap-3">
            <Text className="text-6xl">☪️</Text>
            <Text className="text-4xl font-bold text-gold text-center">Deen Games</Text>
            <Text className="text-base text-textSecondary text-center leading-relaxed px-4">
              Learn Islam through engaging games.{'\n'}Grow your knowledge, earn rewards.
            </Text>
          </View>

          <View className="w-full gap-3 mt-8">
            <Pressable
              onPress={() => router.push('/(auth)/signup')}
              className="bg-gold rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-background font-bold text-lg">Get Started</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/(auth)/login')}
              className="border border-border rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-text font-semibold text-lg">I have an account</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
