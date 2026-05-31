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

// ─── Category-specific suggestion types ──────────────────────────────────────

export type SuggestionType = 'book' | 'habit' | 'practice' | 'mindset' | 'challenge';

export interface CategorySuggestion {
  title: string;         // e.g. "Read Think and Grow Rich"
  rohnTeaching: string;  // The Jim Rohn principle behind it
  action: string;        // Concrete thing to do TODAY
  type: SuggestionType;
  emoji: string;
}

// Curated Jim Rohn teachings per category seeded into the prompt
// so Groq produces grounded, accurate suggestions rather than hallucinated ones.
const CATEGORY_ROHN_SEEDS: Record<string, string> = {
  education: `Jim Rohn's key teachings on education:
- "Formal education will make you a living; self-education will make you a fortune."
- He recommended reading 30 minutes a day minimum ("Leaders are readers").
- Books he explicitly recommended: Think and Grow Rich (Napoleon Hill), The Richest Man in Babylon (Clason), As a Man Thinketh (Allen), The Bible, The Art of Exceptional Living (his own), The Seasons of Life.
- He advised keeping a journal to capture ideas and track growth.
- "Miss a meal if you have to, but don't miss a book."`,

  finance: `Jim Rohn's key teachings on finance:
- "Part of your income must be set aside for investing in yourself."
- He taught the 70/10/10/10 rule: 70% living, 10% investing, 10% giving, 10% saving.
- "The philosophy of the rich and poor is: the rich invest their money and spend what's left; the poor spend their money and invest what's left."
- Start with $1,000 emergency fund before investing.
- Multiple streams of income — don't rely on one source.`,

  physical: `Jim Rohn's key teachings on physical health:
- "Take care of your body. It's the only place you have to live."
- He believed discipline in physical habits builds discipline everywhere.
- Start the day with movement — even a short walk.
- Discipline your diet: you don't have to eat everything you see.
- Energy is the foundation of productivity and success.`,

  discipline: `Jim Rohn's key teachings on discipline:
- "Discipline is the bridge between goals and accomplishment."
- "We must all suffer one of two things: the pain of discipline or the pain of regret."
- Start with one small discipline practiced perfectly every day.
- "Success is nothing more than a few simple disciplines, practiced every day."
- Track your daily progress — what gets measured gets managed.`,

  mental: `Jim Rohn's key teachings on mental health:
- "Stand guard at the door of your mind."
- Read philosophy, study how other great thinkers managed their inner world.
- Journal daily — clarity comes from writing.
- "Your life does not get better by chance, it gets better by change."
- Attitude is a choice — guard it like a treasure.`,

  career: `Jim Rohn's key teachings on career:
- "Work harder on yourself than you do on your job."
- Develop skills that make you indispensable — become more valuable.
- "Success is not to be pursued; it is to be attracted by the person you become."
- Study your industry relentlessly; become the expert.
- Find a mentor; shorten your learning curve by learning from others' mistakes.`,

  relationships: `Jim Rohn's key teachings on relationships:
- "You are the average of the five people you spend the most time with."
- Deliberately choose your associations — they will shape your future.
- "Don't join an easy crowd; you won't grow. Go where the expectations and the demands to perform are high."
- Invest time in relationships that challenge and elevate you.
- Be the kind of friend you want to attract.`,

  social: `Jim Rohn's key teachings on communication and social skills:
- "If you just communicate, you can get by. But if you communicate skillfully, you can work miracles."
- Study language, vocabulary, stories — communication is the vehicle for all influence.
- Practice speaking in public — it's a learnable skill that pays a lifetime dividend.
- Listen more than you speak.`,

  spiritual: `Jim Rohn's key teachings on spirituality:
- "Happiness is not something you postpone for the future; it is something you design for the present."
- Practice gratitude daily — write 3 things you are grateful for.
- Spend time in silence and reflection every morning.
- Read philosophy and timeless wisdom from the great thinkers.
- "The greatest gift you can give somebody is your own personal development."`,

  leadership: `Jim Rohn's key teachings on leadership:
- "The challenge of leadership is to be strong, but not rude; be kind, but not weak; be bold, but not bully; be thoughtful, but not lazy; be humble, but not timid; be proud, but not arrogant."
- Leaders are readers — invest in self-education relentlessly.
- Set the example before you set the expectation.
- "Don't follow the crowd; let the crowd follow you."`,

  creativity: `Jim Rohn's key teachings on creativity:
- "Imagination is the beginning of creation."
- Journal ideas every single day — capture the spark before it fades.
- Study the masters in your craft; imitation precedes innovation.
- "All good things are difficult to achieve; and bad things are very easy to get."
- Carve out protected creative time — guard it from interruption.`,

  appearance: `Jim Rohn's key teachings on personal presentation:
- "How you do anything is how you do everything."
- Dress and present yourself as the person you want to become.
- Personal presentation is a form of self-respect.
- "Take care of your body" extends to how you carry and present yourself.
- Excellence in appearance builds confidence and commands respect.`,
};

/**
 * Get 3-4 Jim Rohn-inspired suggestions for a specific life category.
 * The prompt is seeded with real Rohn teachings for that domain to prevent hallucination.
 */
export async function getCategorySuggestions(
  categoryId: string,
  categoryLabel: string,
  currentLevel: number,
  currentXP: number,
): Promise<CategorySuggestion[]> {
  const seed = CATEGORY_ROHN_SEEDS[categoryId] ?? `Jim Rohn's teachings on ${categoryLabel}: focus on daily disciplines, consistent growth, and self-education.`;
  const levelContext = currentLevel === 0
    ? 'They are just starting in this area — give foundational suggestions.'
    : currentLevel < 5
    ? `They are at Level ${currentLevel} with ${currentXP} points — give intermediate growth suggestions.`
    : `They are at Level ${currentLevel} with ${currentXP} points — they have momentum; give advanced mastery suggestions.`;

  const prompt = `${seed}

User context: ${levelContext}

Based ONLY on the Jim Rohn teachings above, generate exactly 3 highly specific, actionable suggestions for someone improving their ${categoryLabel}.

Return a JSON array of exactly 3 objects with these exact keys:
- "title": concise suggestion name (max 6 words, specific — e.g. "Read Think and Grow Rich" not "Read a book")
- "rohnTeaching": the specific Jim Rohn quote or principle this is based on (use real quotes from above)
- "action": what they should do TODAY, specific and measurable (e.g. "Read 10 pages of Think and Grow Rich before bed tonight")
- "type": one of: book|habit|practice|mindset|challenge
- "emoji": single relevant emoji

Return ONLY the JSON array. No markdown. No explanation.`;

  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 700,
    temperature: 0.6,
    messages: [
      {
        role: 'system',
        content: 'You are a Jim Rohn philosophy expert. Output only valid JSON arrays. Use real Jim Rohn quotes. Be specific — avoid vague advice.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '[]';
  try {
    const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
  } catch {
    return [];
  }
}

// ─── General suggestion types ─────────────────────────────────────────────────

export interface RohnSuggestion {
  title: string;
  principle: string;   // Jim Rohn quote or principle driving this
  action: string;      // Specific, concrete next step
  categoryId: CategoryId;
  emoji: string;
}

/**
 * Generate 3 personalised Jim Rohn-inspired suggestions.
 * Looks at weak areas, habit gaps, and untouched categories.
 */
export async function getJimRohnSuggestions(
  character: Character,
  habits: { title: string; categoryId: string; currentStreak: number }[],
  activeQuestCount: number,
): Promise<RohnSuggestion[]> {
  const cats = Object.values(character.categories);
  const weakAreas = cats
    .filter((c) => c.xp === 0)
    .map((c) => c.label)
    .slice(0, 4);
  const strongArea = cats.sort((a, b) => b.xp - a.xp)[0]?.label ?? 'discipline';
  const habitNames = habits.slice(0, 5).map((h) => h.title).join(', ') || 'none yet';
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak), 0);

  const prompt = `User profile:
- Name: ${character.name}, Rank: ${character.lifeRank}, Level: ${character.overallLevel}
- Strongest area: ${strongArea}
- Neglected areas (no progress): ${weakAreas.join(', ') || 'none'}
- Current habits: ${habitNames}
- Best streak: ${bestStreak} days
- Active goals: ${activeQuestCount}

Generate exactly 3 highly personalised, Jim Rohn-inspired suggestions to help this person grow.
Each must reference a real neglected area or gap in their profile.

Return a JSON array of exactly 3 objects with these exact keys:
- "title": short, punchy suggestion name (5 words max)
- "principle": one Jim Rohn quote or principle (real quote preferred)
- "action": one concrete action to take TODAY (specific, measurable)
- "categoryId": one of: education|career|finance|physical|appearance|mental|social|relationships|discipline|spiritual|creativity|leadership
- "emoji": one relevant emoji

Return ONLY the JSON array, no markdown, no explanation.`;

  const response = await getClient().chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 600,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: 'You are a Jim Rohn life philosophy expert. Output only valid JSON. No markdown code blocks.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '[]';
  try {
    const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
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
