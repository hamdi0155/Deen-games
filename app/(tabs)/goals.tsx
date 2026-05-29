import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../src/store/questStore';
import { GoalInput } from '../../src/components/goals/GoalInput';
import { GeneratingAnimation } from '../../src/components/goals/GeneratingAnimation';
import { CategoryId } from '../../src/types';
import { COLORS } from '../../src/constants/theme';

export default function GoalsScreen() {
  const router = useRouter();
  const isGenerating = useQuestStore((s) => s.isGenerating);
  const generationError = useQuestStore((s) => s.generationError);
  const generateAndAddQuest = useQuestStore((s) => s.generateAndAddQuest);
  const clearError = useQuestStore((s) => s.clearError);

  const handleSubmit = async (goal: string, categoryId: CategoryId) => {
    clearError();
    await generateAndAddQuest(goal, categoryId);
    const error = useQuestStore.getState().generationError;
    if (!error) {
      router.push('/(tabs)/quests' as any);
    } else {
      Alert.alert('Quest Forging Failed', error ?? 'Unknown error. Please try again.');
    }
  };

  if (isGenerating) {
    return (
      <View style={styles.full}>
        <GeneratingAnimation />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <GoalInput onSubmit={handleSubmit} isLoading={isGenerating} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  full: { flex: 1, backgroundColor: COLORS.bg },
});
