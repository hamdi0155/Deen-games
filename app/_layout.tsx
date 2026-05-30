import { useEffect } from 'react';
import { AppState, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useHabitStore } from '../src/store/habitStore';
import { useDisciplineStore } from '../src/store/disciplineStore';
import { useNotificationStore } from '../src/store/notificationStore';
import { NotificationBanner } from '../src/components/ui/NotificationBanner';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const runDailyReset = useHabitStore((s) => s.runDailyReset);
  const runDisciplineReset = useDisciplineStore((s) => s.runDailyReset);
  const notification = useNotificationStore((s) => s.current);
  const dismissNotification = useNotificationStore((s) => s.dismiss);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    runDailyReset();
    runDisciplineReset();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        runDailyReset();
        runDisciplineReset();
      }
    });
    return () => sub.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quest/[id]" options={{ presentation: 'card', animation: 'fade' }} />
        <Stack.Screen name="category/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="category/create" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="disciplines" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="focus" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="morning-activation" options={{ presentation: 'modal', animation: 'fade' }} />
        <Stack.Screen name="future-self" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="mentor" options={{ presentation: 'card', animation: 'slide_from_right' }} />
      </Stack>
      <NotificationBanner
        visible={!!notification}
        message={notification?.message ?? ''}
        subtext={notification?.subtext}
        color={notification?.color ?? '#5B6CF5'}
        icon={notification?.icon}
        onDismiss={dismissNotification}
      />
    </GestureHandlerRootView>
  );
}
