import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUp } from '@/lib/auth';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!username || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, username.trim());
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Sign up failed', err.message);
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
        <ScrollView contentContainerClassName="flex-grow px-6 justify-center gap-6 py-8">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-text">Create account</Text>
            <Text className="text-muted">Start your Deen learning journey</Text>
          </View>

          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-textSecondary text-sm font-medium">Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="muslimlearner123"
                placeholderTextColor="#6b7280"
                autoCapitalize="none"
                className="bg-card border border-border rounded-xl px-4 py-3.5 text-text"
              />
            </View>

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
                placeholder="Min. 8 characters"
                placeholderTextColor="#6b7280"
                secureTextEntry
                className="bg-card border border-border rounded-xl px-4 py-3.5 text-text"
              />
            </View>
          </View>

          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className="bg-gold rounded-2xl py-4 items-center active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-background font-bold text-lg">
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/login')} className="items-center">
            <Text className="text-muted">
              Already have an account?{' '}
              <Text className="text-gold font-semibold">Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
