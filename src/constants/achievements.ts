import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Habit achievements
  { id: 'first_habit',      title: 'Creature of Habit',   description: 'Complete your first habit.',          iconName: 'habits',      category: 'habits' },
  { id: 'habit_streak_7',   title: 'Seven Days Strong',   description: 'Maintain a 7-day habit streak.',      iconName: 'flame',       category: 'habits' },
  { id: 'habit_streak_30',  title: 'Iron Discipline',     description: 'Maintain a 30-day habit streak.',     iconName: 'shield',      category: 'habits' },
  { id: 'habit_streak_100', title: 'Century Warrior',     description: '100-day habit streak.',               iconName: 'trophy',      category: 'habits' },
  { id: 'habits_10',        title: 'Habit Arsenal',       description: 'Create 10 different habits.',         iconName: 'list',        category: 'habits' },
  { id: 'habits_total_50',  title: 'Half Century',        description: '50 total habit completions.',         iconName: 'check-circle', category: 'habits' },
  { id: 'habits_total_200', title: 'The Long Game',       description: '200 total habit completions.',        iconName: 'diamond',     category: 'habits' },

  // Goal achievements
  { id: 'first_quest',       title: 'Goal Started',        description: 'Set your first goal.',               iconName: 'flash',       category: 'quests' },
  { id: 'quest_complete_1',  title: 'Goal Achieved',       description: 'Complete your first goal.',          iconName: 'check',       category: 'quests' },
  { id: 'quest_complete_5',  title: 'Five Goals Reached',  description: 'Complete 5 goals.',                  iconName: 'goals',       category: 'quests' },
  { id: 'quest_complete_10', title: 'Goal Legend',         description: 'Complete 10 goals.',                 iconName: 'star',        category: 'quests' },
  { id: 'first_task',        title: 'First Step',          description: 'Complete your first action step.',   iconName: 'check',       category: 'quests' },
  { id: 'tasks_50',          title: 'Relentless Executor', description: 'Complete 50 action steps.',          iconName: 'discipline',  category: 'quests' },

  // Progress achievements
  { id: 'xp_100',   title: 'Spark Ignited',   description: 'Earn 100 progress points.',    iconName: 'sparkle',  category: 'xp' },
  { id: 'xp_1000',  title: 'Rising Force',    description: 'Earn 1,000 progress points.',  iconName: 'arrow-up', category: 'xp' },
  { id: 'xp_5000',  title: 'Power Ascending', description: 'Earn 5,000 progress points.',  iconName: 'flash',    category: 'xp' },
  { id: 'xp_10000', title: 'Unstoppable',     description: 'Earn 10,000 progress points.', iconName: 'diamond',  category: 'xp' },
  { id: 'xp_50000', title: 'Life Legend',     description: 'Earn 50,000 progress points.', iconName: 'trophy',   category: 'xp' },

  // Level achievements
  { id: 'level_5',  title: 'Awakening',    description: 'Reach Overall Level 5.',  iconName: 'sun',         category: 'level' },
  { id: 'level_10', title: 'Adept',        description: 'Reach Overall Level 10.', iconName: 'moon',        category: 'level' },
  { id: 'level_20', title: 'Champion',     description: 'Reach Overall Level 20.', iconName: 'achievement', category: 'level' },
  { id: 'level_50', title: 'Transcendent', description: 'Reach Overall Level 50.', iconName: 'star',        category: 'level' },

  // Category mastery
  { id: 'cat_level_5',    title: 'Domain Expert',  description: 'Reach Level 5 in any category.',  iconName: 'education',  category: 'disciplines' },
  { id: 'cat_level_10',   title: 'Domain Master',  description: 'Reach Level 10 in any category.', iconName: 'goals',      category: 'disciplines' },
  { id: 'all_cats_active',title: 'Life Architect', description: 'Gain XP in all 12 life domains.',  iconName: 'leadership', category: 'disciplines' },

  // Special
  { id: 'first_wisdom', title: 'Student of Life', description: 'Read your first daily wisdom.',                        iconName: 'education', category: 'social' },
  { id: 'focus_mode',   title: 'Laser Focus',     description: 'Complete Focus Mode for the first time.',              iconName: 'focus',     category: 'habits' },
  { id: 'perfect_day',  title: 'Perfect Day',     description: 'Complete all habits AND disciplines in a single day.', iconName: 'star',      category: 'habits' },
];
