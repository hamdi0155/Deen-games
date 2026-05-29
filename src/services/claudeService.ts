import Anthropic from '@anthropic-ai/sdk';
import { QUEST_SYSTEM_PROMPT } from '../constants/prompts';
import { AIQuestPayload, CategoryId } from '../types';

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

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY is not set');
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function generateQuest(
  goal: string,
  categoryId: CategoryId,
): Promise<AIQuestPayload> {
  const label = CATEGORY_LABELS[categoryId];
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: [
      {
        type: 'text',
        text: QUEST_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      } as any,
    ],
    messages: [
      {
        role: 'user',
        content: `Category: ${label}\nGoal: ${goal}`,
      },
    ],
  });

  const raw =
    response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
  return JSON.parse(cleaned) as AIQuestPayload;
}
