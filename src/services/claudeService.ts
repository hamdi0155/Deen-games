import Groq from 'groq-sdk';
import { QUEST_SYSTEM_PROMPT } from '../constants/prompts';
import { AIQuestPayload, CategoryId } from '../types';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

const CATEGORY_LABELS: Record<CategoryId, string> = {
  education: 'Education',
  career: 'Career',
  finance: 'Finance',
  physical: 'Physical Fitness',
  appearance: 'Appearance',
  mental: 'Mental Health',
  social: 'Social / Communication',
  relationships: 'Relationships',
  discipline: 'Discipline',
  spiritual: 'Spirituality',
  creativity: 'Creativity',
  leadership: 'Leadership',
};

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (!apiKey) throw new Error('EXPO_PUBLIC_GROQ_API_KEY is not set');
    client = new Groq({ apiKey });
  }
  return client;
}

export async function generateQuest(
  goal: string,
  categoryId: CategoryId,
): Promise<AIQuestPayload> {
  const label = CATEGORY_LABELS[categoryId];
  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 2000,
    messages: [
      { role: 'system', content: QUEST_SYSTEM_PROMPT },
      { role: 'user', content: `Category: ${label}\nGoal: ${goal}` },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '';
  const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
  return JSON.parse(cleaned) as AIQuestPayload;
}
