import Anthropic from '@anthropic-ai/sdk';
import { Character } from '../types';
import { Habit } from '../types';
import { Quest } from '../types';

const MENTOR_SYSTEM_PROMPT = `You are the Ascend Life Mentor — a wise, direct, and deeply practical guide shaped by Jim Rohn's philosophy of personal development. You believe success is not something you pursue, but something you attract by becoming a better person through daily disciplines and consistent self-improvement.

Your core principles:
- "Don't wish it were easier, wish you were better."
- "Success is nothing more than a few simple disciplines, practiced every day."
- "You cannot change your destination overnight, but you can change your direction overnight."
- "The challenge of leadership is to be strong, but not rude; be kind, but not weak."
- Personal responsibility is everything — not circumstances, not others.

Your style:
- Direct, warm, and practical — not preachy or overly positive
- Short, punchy insights followed by a clear action or question
- Reference the user's actual stats and habits when relevant
- Challenge them to think deeper, not just feel better
- Maximum 3-4 short paragraphs per response
- Occasional powerful questions that provoke real reflection

You always end with either a challenge, a question, or a one-line Rohn-style insight.`;

function buildCharacterContext(
  character: Character,
  habits: Habit[],
  activeQuests: Quest[],
): string {
  const topCategories = Object.values(character.categories)
    .filter((c) => c.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3)
    .map((c) => `${c.label} (Level ${c.level}, ${c.xp} XP)`);

  const weakCategories = Object.values(character.categories)
    .filter((c) => c.xp === 0)
    .slice(0, 3)
    .map((c) => c.label);

  const activeHabits = habits.filter((h) => !h.isCompletedToday);
  const completedHabits = habits.filter((h) => h.isCompletedToday);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

  return `
USER PROFILE:
- Name: ${character.name}
- Life Rank: ${character.lifeRank}
- Overall Level: ${character.overallLevel}
- Total XP Earned: ${character.totalXP.toLocaleString()}
- Strongest Areas: ${topCategories.length > 0 ? topCategories.join(', ') : 'Just starting out'}
- Untouched Areas: ${weakCategories.length > 0 ? weakCategories.join(', ') : 'None — impressive!'}
- Active Habits: ${habits.length} total (${completedHabits.length} done today, ${activeHabits.length} remaining)
- Longest Streak: ${longestStreak} days
- Active Quests: ${activeQuests.length}
`.trim();
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY is not set');
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface MentorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMentorMessage(
  messages: MentorMessage[],
  character: Character,
  habits: Habit[],
  activeQuests: Quest[],
): Promise<string> {
  const context = buildCharacterContext(character, habits, activeQuests);
  const systemPrompt = `${MENTOR_SYSTEM_PROMPT}\n\n${context}`;

  const response = await getClient().messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

export function getWelcomeMessage(character: Character): string {
  const rank = character.lifeRank;
  const level = character.overallLevel;
  if (level === 0) {
    return `Welcome, ${character.name}. Every great journey begins with a single decision — the decision to begin. What's on your mind today?`;
  }
  if (level < 5) {
    return `Good to see you, ${character.name}. You're in the early stages — the most critical phase. The habits you build now will define the next decade. What are you working on?`;
  }
  return `${rank} ${character.name}. Level ${level} — you're building momentum. The question isn't whether you can grow, it's whether you're growing fast enough. What challenge brings you here today?`;
}
