import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCharacterStore } from '../src/store/characterStore';
import { useHabitStore } from '../src/store/habitStore';
import { useQuestStore } from '../src/store/questStore';
import { sendMentorMessage, getWelcomeMessage, MentorMessage } from '../src/services/mentorService';
import { AscendIcon } from '../src/components/icons/AscendIcon';
import { COLORS, FONTS, SPACING, RADIUS } from '../src/constants/theme';

interface ChatMessage extends MentorMessage {}

export default function MentorScreen() {
  const insets = useSafeAreaInsets();
  const character = useCharacterStore((s) => s.character);
  const habits = useHabitStore((s) => s.habits);
  const quests = useQuestStore((s) => s.quests);

  const activeQuests = quests.filter((q) => q.status === 'active');

  const initialMessage: ChatMessage = {
    role: 'assistant',
    content: character ? getWelcomeMessage(character) : 'Welcome. What brings you here today?',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !character) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const mentorMessages: MentorMessage[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMentorMessage(mentorMessages, character, habits, activeQuests);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const errMsg = (err as Error).message ?? '';
      const isApiKey = errMsg.includes('API key') || errMsg.includes('not set');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isApiKey
            ? 'Missing EXPO_PUBLIC_GROQ_API_KEY — add it to your .env file.'
            : 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, messages, character, habits, activeQuests]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAssistant]}>
        {!isUser && (
          <LinearGradient
            colors={['#5B6CF5', '#7C3AED']}
            style={styles.avatarBadge}
          >
            <Text style={styles.avatarText}>⚡</Text>
          </LinearGradient>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <AscendIcon name="chevron-left" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Life Mentor</Text>
          <Text style={styles.headerSub}>Jim Rohn · Inspired Wisdom</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderMessage}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={styles.typingRow}>
                <LinearGradient
                  colors={['#5B6CF5', '#7C3AED']}
                  style={styles.avatarBadge}
                >
                  <Text style={styles.avatarText}>⚡</Text>
                </LinearGradient>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={COLORS.accent} />
                  <Text style={styles.typingText}>Thinking fast...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Suggestion chips */}
        {messages.length === 1 && !loading && (
          <View style={styles.chips}>
            {STARTER_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                onPress={() => setInput(prompt)}
                style={styles.chip}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your mentor..."
            placeholderTextColor={COLORS.textDim}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
            style={styles.sendBtn}
          >
            <LinearGradient
              colors={
                input.trim() && !loading
                  ? ['#5B6CF5', '#7C3AED']
                  : ['#1e1e2e', '#1e1e2e']
              }
              style={styles.sendBtnGrad}
            >
              <AscendIcon
                name="send"
                size={18}
                color={input.trim() && !loading ? '#fff' : COLORS.textDim}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const STARTER_PROMPTS = [
  "How do I build better habits?",
  "Where should I focus first?",
  "I'm struggling with consistency",
  "What does my progress say about me?",
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgCardBorder,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontFamily: FONTS.families.displayBold,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 1,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAssistant: { justifyContent: 'flex-start' },
  avatarBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 13, fontFamily: FONTS.families.displayBold, color: '#fff' },
  bubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: 4,
  },
  bubbleUser: {
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: COLORS.bgCardElevated,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    lineHeight: 20,
  },
  bubbleTextUser: { color: '#fff' },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgCardElevated,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  typingText: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.accentDim,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
  },
  chipText: {
    fontSize: 12,
    fontFamily: FONTS.families.displayLight,
    color: COLORS.accent,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.bgCardBorder,
    backgroundColor: COLORS.bg,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    fontFamily: FONTS.families.body,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendBtn: { borderRadius: 20, overflow: 'hidden' },
  sendBtnGrad: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
