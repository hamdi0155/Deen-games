import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Question } from '@/types';

interface Props {
  question: Question;
  selected: number | null;
  showResult: boolean;
  onSelect: (index: number) => void;
}

export function QuestionCard({ question, selected, showResult, onSelect }: Props) {
  function optionStyle(index: number) {
    if (!showResult) return 'bg-card border-border';
    if (index === question.correctIndex) return 'bg-emerald/10 border-emerald';
    if (index === selected) return 'bg-danger/10 border-danger';
    return 'bg-card border-border opacity-50';
  }

  function optionTextStyle(index: number) {
    if (!showResult) return 'text-text';
    if (index === question.correctIndex) return 'text-emerald font-semibold';
    if (index === selected) return 'text-danger font-semibold';
    return 'text-muted';
  }

  return (
    <ScrollView
      contentContainerClassName="px-5 pb-4"
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      {/* Arabic display */}
      {question.arabic && (
        <View className="bg-card border border-border rounded-2xl p-5 mb-5 items-center">
          <Text className="text-2xl text-gold text-center font-arabic leading-10" style={{ fontFamily: 'Amiri-Regular' }}>
            {question.arabic}
          </Text>
        </View>
      )}

      {/* Question */}
      <Text className="text-text text-lg font-semibold mb-5 leading-7">
        {question.question}
      </Text>

      {/* Options */}
      <View className="gap-3">
        {question.options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => onSelect(index)}
            disabled={showResult}
            className={`border rounded-2xl p-4 flex-row items-center gap-3 ${optionStyle(index)}`}
          >
            <View
              className={`w-7 h-7 rounded-full border-2 items-center justify-center shrink-0 ${
                showResult && index === question.correctIndex
                  ? 'border-emerald bg-emerald/20'
                  : showResult && index === selected
                  ? 'border-danger bg-danger/20'
                  : 'border-border'
              }`}
            >
              {showResult && index === question.correctIndex && (
                <Ionicons name="checkmark" size={14} color="#2ecc71" />
              )}
              {showResult && index === selected && index !== question.correctIndex && (
                <Ionicons name="close" size={14} color="#e74c3c" />
              )}
            </View>
            <Text className={`flex-1 text-base ${optionTextStyle(index)}`}>{option}</Text>
          </Pressable>
        ))}
      </View>

      {/* Explanation */}
      {showResult && question.explanation && (
        <View className="mt-5 bg-surface border border-border rounded-2xl p-4">
          <Text className="text-muted text-xs font-bold uppercase tracking-widest mb-1">
            Did you know?
          </Text>
          <Text className="text-textSecondary text-sm leading-6">{question.explanation}</Text>
        </View>
      )}
    </ScrollView>
  );
}
