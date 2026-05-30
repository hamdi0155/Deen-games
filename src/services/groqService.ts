import Groq from 'groq-sdk';
import { Character } from '../types';
import { CategoryId } from '../types';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (!apiKey) throw new Error('EXPO_PUBLIC_GROQ_API_KEY is not set');
    client = new Groq({ apiKey });
  }
  return client;
}

const CATEGORY_LABELS: Record<CategoryId, string> = {
  education: 'Education', career: 'Career', finance: 'Finance',
  physical: 'Physical Fitness', appearance: 'Appearance', mental: 'Mental Health',
  social: 'Social / Communication', relationships: 'Relationships',
  discipline: 'Discipline', spiritual: 'Spirituality',
  creativity: 'Creativity', leadership: 'Leadership',
};

/**
 * Get a quick, practical tip for a habit being created.
 * ~100ms faster than Claude — ideal for real-time UI hints.
 */
export async function getHabitTip(
  habitTitle: string,
  categoryId: CategoryId,
): Promise<string> {
  const category = CATEGORY_LABELS[categoryId] ?? categoryId;

  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 120,
    messages: [
      {
        role: 'system',
        content: `You are a concise life coach. Give one punchy, practical tip for building a specific habit.
1-2 sentences max. No filler, no preamble. Inspired by Jim Rohn's philosophy of discipline and compound growth.`,
      },
      {
        role: 'user',
        content: `Habit: "${habitTitle}" (${category} domain). Give one specific tip to make this stick.`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Get a fast motivational boost based on the character's current state.
 * Used in home screen pull-to-refresh or daily push notification.
 */
export async function getMotivationalBoost(character: Character): Promise<string> {
  const topCat = Object.values(character.categories)
    .sort((a, b) => b.xp - a.xp)[0];

  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 100,
    messages: [
      {
        role: 'system',
        content: `You are a Jim Rohn-inspired life coach. Give one punchy, direct motivational insight.
1-2 sentences. Reference the user's actual data. No generic fluff.`,
      },
      {
        role: 'user',
        content: `User: ${character.name}, Rank: ${character.lifeRank}, Level: ${character.overallLevel}, strongest in ${topCat?.label ?? 'life'} (Level ${topCat?.level ?? 0}). Give a short motivational boost for their day.`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Fast mentor chat reply via Groq.
 * Used for quick back-and-forth in the mentor chat screen.
 * For deeper, more philosophical responses use sendMentorMessage (Claude).
 */
export interface GroqMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendFastMentorMessage(
  messages: GroqMessage[],
  characterSummary: string,
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 300,
    messages: [
      {
        role: 'system',
        content: `You are the Ascend Life Mentor — direct, practical, and wise in the tradition of Jim Rohn.

${characterSummary}

Your style: short punchy insights, practical actions, powerful questions. 2-3 short paragraphs max.
End with a challenge, a question, or a one-line Rohn-style insight.`,
      },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}

/**
 * Generate a quick action plan for a user goal using Groq's speed.
 * Returns 3 bullet-point action steps.
 */
export async function getQuickActionPlan(
  goal: string,
  categoryId: CategoryId,
): Promise<string[]> {
  const category = CATEGORY_LABELS[categoryId] ?? categoryId;

  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: `You are a Jim Rohn-inspired life strategist. Return exactly 3 practical action steps as a JSON array of strings. No markdown, pure JSON array only.`,
      },
      {
        role: 'user',
        content: `Goal: "${goal}" (${category}). Give 3 immediate action steps.`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '[]';
  try {
    const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return raw.split('\n').filter((l) => l.trim()).slice(0, 3);
  }
}
