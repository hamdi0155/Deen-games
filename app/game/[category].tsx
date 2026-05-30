import { useEffect, useState } from 'react';
import { View, Text, Pressable, BackHandler } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore, useAuthStore } from '@/lib/store';
import { updateXp } from '@/lib/auth';
import { getRandomQuestions } from '@/constants/questions';
import { CATEGORIES } from '@/constants/categories';
import { QuestionCard } from '@/components/game/QuestionCard';
import { LivesBar } from '@/components/game/LivesBar';
import { ProgressBar } from '@/components/game/ProgressBar';

const QUESTIONS_PER_GAME = 5;

export default function GameScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { session, startSession, answerQuestion, nextQuestion, endSession } = useGameStore();
  const { profile, addXp } = useAuthStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  const categoryMeta = CATEGORIES.find((c) => c.id === category);

  useEffect(() => {
    const questions = getRandomQuestions(category, QUESTIONS_PER_GAME);
    startSession(questions);
    return () => endSession();
  }, [category]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleQuit();
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!session || !categoryMeta) return null;

  const question = session.questions[session.currentIndex];
  const isFinished = session.currentIndex >= session.questions.length || session.lives === 0;

  function handleAnswer(index: number) {
    if (selected !== null || !question) return;
    setSelected(index);
    setShowResult(true);

    const { correct, xpEarned } = answerQuestion(index);
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTotalXpEarned((prev) => prev + xpEarned);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  async function handleNext() {
    if (session!.currentIndex + 1 >= session!.questions.length || session!.lives === 0) {
      // Game over — save XP
      if (profile && totalXpEarned > 0) {
        addXp(totalXpEarned);
        await updateXp(profile.id, totalXpEarned);
      }
      router.replace({
        pathname: '/game/result',
        params: {
          score: String(session!.score),
          total: String(session!.questions.length),
          xp: String(totalXpEarned),
          category,
        },
      });
      return;
    }
    setSelected(null);
    setShowResult(false);
    nextQuestion();
  }

  function handleQuit() {
    endSession();
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Pressable onPress={handleQuit} className="p-1">
          <Ionicons name="close" size={26} color="#6b7280" />
        </Pressable>
        <ProgressBar
          current={session.currentIndex}
          total={session.questions.length}
          color={categoryMeta.color}
        />
        <LivesBar lives={session.lives} />
      </View>

      {/* XP earned this session */}
      {totalXpEarned > 0 && (
        <View className="mx-5 mb-2 flex-row items-center gap-1 justify-center">
          <Ionicons name="star" size={14} color="#d4a843" />
          <Text className="text-gold text-sm font-bold">+{totalXpEarned} XP</Text>
          {session.streak >= 3 && (
            <Text className="text-warning text-sm ml-1">🔥 {session.streak} streak!</Text>
          )}
        </View>
      )}

      <QuestionCard
        question={question}
        selected={selected}
        showResult={showResult}
        onSelect={handleAnswer}
      />

      {/* Continue button */}
      {showResult && (
        <View className="px-5 pb-6">
          <Pressable
            onPress={handleNext}
            className="rounded-2xl py-4 items-center active:opacity-80"
            style={{ backgroundColor: categoryMeta.color }}
          >
            <Text className="text-white font-bold text-lg">
              {session.currentIndex + 1 >= session.questions.length || session.lives === 0
                ? 'See Results'
                : 'Continue'}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
