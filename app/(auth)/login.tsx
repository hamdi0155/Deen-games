import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn } from '@/lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center gap-6">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-text">Welcome back</Text>
            <Text className="text-muted">Sign in to continue your journey</Text>
          </View>

          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-textSecondary text-sm font-medium">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#6b7280"
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-card border border-border rounded-xl px-4 py-3.5 text-text"
              />
            </View>

            <View className="gap-2">
              <Text className="text-textSecondary text-sm font-medium">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                secureTextEntry
                className="bg-card border border-border rounded-xl px-4 py-3.5 text-text"
              />
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-gold rounded-2xl py-4 items-center active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-background font-bold text-lg">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="items-center">
            <Text className="text-muted">
              Don't have an account?{' '}
              <Text className="text-gold font-semibold">Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
