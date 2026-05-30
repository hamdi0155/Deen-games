import { Redirect } from 'expo-router';
import { useAuthStore } from '@/lib/store';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { profile, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#d4a843" size="large" />
      </View>
    );
  }

  return <Redirect href={profile ? '/(tabs)' : '/(auth)/welcome'} />;
}
