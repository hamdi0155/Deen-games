// Daily wisdom rotation — Jim Rohn philosophy embedded into the experience.
// Quote index rotates by calendar date so everyone sees the same quote each day.

export interface WisdomQuote {
  text: string;
  category: 'discipline' | 'growth' | 'habits' | 'identity' | 'philosophy';
}

const QUOTES: WisdomQuote[] = [
  // Discipline
  { text: 'Discipline is the bridge between goals and accomplishment.', category: 'discipline' },
  { text: 'Motivation is what gets you started. Habit is what keeps you going.', category: 'discipline' },
  { text: 'Success is nothing more than a few simple disciplines, practiced every day.', category: 'discipline' },
  { text: 'The pain of discipline weighs ounces. The pain of regret weighs tons.', category: 'discipline' },
  { text: 'Don\'t wish it were easier. Wish you were better.', category: 'discipline' },
  { text: 'Either you run the day, or the day runs you.', category: 'discipline' },
  { text: 'We must all suffer one of two things: the pain of discipline or the pain of regret.', category: 'discipline' },
  { text: 'Take care of your body. It\'s the only place you have to live.', category: 'discipline' },

  // Growth
  { text: 'Work harder on yourself than you do on your job.', category: 'growth' },
  { text: 'Formal education will make you a living. Self-education will make you a fortune.', category: 'growth' },
  { text: 'Your life does not get better by chance. It gets better by change.', category: 'growth' },
  { text: 'The challenge of leadership is to be strong but not rude. Be kind but not weak.', category: 'growth' },
  { text: 'Become a millionaire not for the million dollars, but for what it will make of you to achieve it.', category: 'growth' },
  { text: 'Success is not to be pursued; it is to be attracted by the person you become.', category: 'growth' },
  { text: 'You are the average of the five people you spend the most time with.', category: 'growth' },
  { text: 'If you don\'t like how things are, change it. You\'re not a tree.', category: 'growth' },

  // Habits
  { text: 'You cannot change your destination overnight, but you can change your direction overnight.', category: 'habits' },
  { text: 'A good objective of leadership is to help those who are doing poorly to do well.', category: 'habits' },
  { text: 'Let others lead small lives, but not you. Let others argue over small things, but not you.', category: 'habits' },
  { text: 'Happiness is not something you postpone for the future; it is something you design for the present.', category: 'habits' },
  { text: 'The few who do are the envy of the many who only watch.', category: 'habits' },
  { text: 'If you don\'t design your own life plan, chances are you\'ll fall into someone else\'s plan.', category: 'habits' },
  { text: 'Things that are easy to do are also easy not to do.', category: 'habits' },
  { text: 'Time is our most valuable asset, yet we tend to waste it, kill it, and spend it rather than invest it.', category: 'habits' },

  // Identity
  { text: 'The biggest challenge you will ever face is the battle between becoming and staying the same.', category: 'identity' },
  { text: 'What you become is far more important than what you get.', category: 'identity' },
  { text: 'Your personal philosophy is the greatest determining factor in how your life works out.', category: 'identity' },
  { text: 'You must take personal responsibility. You cannot change the circumstances, but you can change yourself.', category: 'identity' },
  { text: 'The more you know, the less you need to say. The less you know, the more you need to say.', category: 'identity' },
  { text: 'We generally change ourselves for one of two reasons: inspiration or desperation.', category: 'identity' },
  { text: 'Integrity is the most valuable and respected quality of leadership.', category: 'identity' },
  { text: 'Your attitude determines your direction.', category: 'identity' },

  // Philosophy
  { text: 'One day your life will flash before your eyes. Make sure it\'s worth watching.', category: 'philosophy' },
  { text: 'The walls we build around us to keep sadness out also keep out the joy.', category: 'philosophy' },
  { text: 'Don\'t join an easy crowd; you won\'t grow. Go where the expectations and the demands to perform are high.', category: 'philosophy' },
  { text: 'Learn how to be happy with what you have while you pursue all that you want.', category: 'philosophy' },
  { text: 'Earn as much money as you possibly can and as quickly as you can. The sooner you get money out of the way, the sooner you will be able to get to the rest of your problems in style.', category: 'philosophy' },
  { text: 'The greatest gift you can give somebody is your own personal development.', category: 'philosophy' },
  { text: 'Life expects us to make something of ourselves, not just wait to be served.', category: 'philosophy' },
  { text: 'Give whatever you are doing and whoever you are with the gift of your attention.', category: 'philosophy' },
];

export function getDailyWisdom(): WisdomQuote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function getWisdomByCategory(category: WisdomQuote['category']): WisdomQuote {
  const filtered = QUOTES.filter((q) => q.category === category);
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return filtered[dayOfYear % filtered.length];
}
