import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Habit achievements
  { id: 'first_habit',      title: 'Creature of Habit',   description: 'Complete your first habit.',          emoji: '\u{1F331}', category: 'habits' },
  { id: 'habit_streak_7',   title: 'Seven Days Strong',   description: 'Maintain a 7-day habit streak.',      emoji: '\u{1F525}', category: 'habits' },
  { id: 'habit_streak_30',  title: 'Iron Discipline',     description: 'Maintain a 30-day habit streak.',     emoji: '⚔️', category: 'habits' },
  { id: 'habit_streak_100', title: 'Century Warrior',     description: '100-day habit streak.',               emoji: '\u{1F451}', category: 'habits' },
  { id: 'habits_10',        title: 'Habit Arsenal',       description: 'Create 10 different habits.',         emoji: '\u{1F6E1}️', category: 'habits' },
  { id: 'habits_total_50',  title: 'Half Century',        description: '50 total habit completions.',         emoji: '\u{1F4AA}', category: 'habits' },
  { id: 'habits_total_200', title: 'The Long Game',       description: '200 total habit completions.',        emoji: '\u{1F3C6}', category: 'habits' },

  // Quest achievements
  { id: 'first_quest',       title: 'Quest Accepted',      description: 'Start your first quest.',            emoji: '⚡', category: 'quests' },
  { id: 'quest_complete_1',  title: 'Quest Master I',      description: 'Complete your first quest.',         emoji: '✅', category: 'quests' },
  { id: 'quest_complete_5',  title: 'Quest Master V',      description: 'Complete 5 quests.',                 emoji: '\u{1F3AF}', category: 'quests' },
  { id: 'quest_complete_10', title: 'Legendary Quester',   description: 'Complete 10 quests.',                emoji: '\u{1F31F}', category: 'quests' },
  { id: 'first_task',        title: 'First Step',          description: 'Complete your first task.',          emoji: '\u{1F463}', category: 'quests' },
  { id: 'tasks_50',          title: 'Relentless Executor', description: 'Complete 50 quest tasks.',           emoji: '⚔️', category: 'quests' },

  // XP achievements
  { id: 'xp_100',   title: 'Spark Ignited',   description: 'Earn 100 XP.',    emoji: '✨', category: 'xp' },
  { id: 'xp_1000',  title: 'Rising Force',    description: 'Earn 1,000 XP.',  emoji: '⬆️', category: 'xp' },
  { id: 'xp_5000',  title: 'Power Ascending', description: 'Earn 5,000 XP.',  emoji: '\u{1F680}', category: 'xp' },
  { id: 'xp_10000', title: 'Unstoppable',     description: 'Earn 10,000 XP.', emoji: '\u{1F4A5}', category: 'xp' },
  { id: 'xp_50000', title: 'Life Legend',     description: 'Earn 50,000 XP.', emoji: '\u{1F451}', category: 'xp' },

  // Level achievements
  { id: 'level_5',  title: 'Awakening',    description: 'Reach Overall Level 5.',  emoji: '\u{1F305}', category: 'level' },
  { id: 'level_10', title: 'Adept',        description: 'Reach Overall Level 10.', emoji: '\u{1F52E}', category: 'level' },
  { id: 'level_20', title: 'Champion',     description: 'Reach Overall Level 20.', emoji: '\u{1F3C5}', category: 'level' },
  { id: 'level_50', title: 'Transcendent', description: 'Reach Overall Level 50.', emoji: '⭐', category: 'level' },

  // Category mastery
  { id: 'cat_level_5',    title: 'Domain Expert',  description: 'Reach Level 5 in any category.',  emoji: '\u{1F393}', category: 'disciplines' },
  { id: 'cat_level_10',   title: 'Domain Master',  description: 'Reach Level 10 in any category.', emoji: '\u{1F3AF}', category: 'disciplines' },
  { id: 'all_cats_active',title: 'Life Architect', description: 'Gain XP in all 12 life domains.',  emoji: '\u{1F3DB}️', category: 'disciplines' },

  // Special
  { id: 'first_wisdom', title: 'Student of Life', description: 'Read your first daily wisdom.',                        emoji: '\u{1F4D6}', category: 'social' },
  { id: 'focus_mode',   title: 'Laser Focus',     description: 'Complete Focus Mode for the first time.',              emoji: '\u{1F3AF}', category: 'habits' },
  { id: 'perfect_day',  title: 'Perfect Day',     description: 'Complete all habits AND disciplines in a single day.', emoji: '\u{1F31F}', category: 'habits' },
];
