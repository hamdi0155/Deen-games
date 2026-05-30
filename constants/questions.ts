import { Question } from '@/types';

export const QUESTIONS: Question[] = [
  // Quran
  {
    id: 'q1',
    category: 'quran',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    question: 'What is the meaning of "Bismillah ir-Rahman ir-Raheem"?',
    options: [
      'In the name of Allah, the Most Gracious, the Most Merciful',
      'Praise be to Allah, Lord of the worlds',
      'There is no god but Allah',
      'Allah is the Greatest',
    ],
    correctIndex: 0,
    explanation: 'This is the opening phrase of the Quran and most surahs, known as the Basmala.',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'q2',
    category: 'quran',
    question: 'How many surahs (chapters) are in the Quran?',
    options: ['99', '112', '114', '120'],
    correctIndex: 2,
    explanation: 'The Quran consists of 114 surahs, beginning with Al-Fatihah and ending with An-Nas.',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'q3',
    category: 'quran',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    question: 'This verse is from which surah?',
    options: ['Al-Baqarah', 'Al-Ikhlas', 'Al-Fatihah', 'Al-Kahf'],
    correctIndex: 2,
    explanation: 'Al-Fatihah (The Opening) is the first surah of the Quran, recited in every rakat of prayer.',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'q4',
    category: 'quran',
    question: 'What is the longest surah in the Quran?',
    options: ['Al-Imran', 'Al-Baqarah', 'An-Nisa', 'Al-Maidah'],
    correctIndex: 1,
    explanation: 'Al-Baqarah has 286 verses, making it the longest surah in the Quran.',
    difficulty: 'medium',
    xpReward: 15,
  },
  {
    id: 'q5',
    category: 'quran',
    question: 'Ayat al-Kursi is found in which surah?',
    options: ['Al-Fatihah', 'Al-Ikhlas', 'Al-Baqarah', 'Al-Nas'],
    correctIndex: 2,
    difficulty: 'medium',
    xpReward: 15,
    explanation: 'Ayat al-Kursi is verse 255 of Surah Al-Baqarah, considered the greatest verse in the Quran.',
  },

  // Hadith
  {
    id: 'h1',
    category: 'hadith',
    question: 'According to a famous hadith, which action is considered the best form of jihad?',
    options: [
      'Fasting in Ramadan',
      'Speaking a word of truth to an unjust ruler',
      'Praying tahajjud every night',
      'Performing Hajj',
    ],
    correctIndex: 1,
    explanation: 'The Prophet ﷺ said: "The best jihad is a word of truth spoken to an unjust ruler." (Abu Dawud)',
    difficulty: 'medium',
    xpReward: 15,
  },
  {
    id: 'h2',
    category: 'hadith',
    question: 'Complete the hadith: "Actions are judged by..."',
    options: [
      '...their outcomes',
      '...their intentions',
      '...the words spoken',
      '...the effort made',
    ],
    correctIndex: 1,
    explanation: '"Actions are judged by intentions, and everyone will be rewarded according to their intention." (Bukhari & Muslim)',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'h3',
    category: 'hadith',
    question: 'How many pillars of Islam are there?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'The Five Pillars are: Shahada, Salah, Zakat, Sawm (fasting), and Hajj.',
    difficulty: 'easy',
    xpReward: 10,
  },

  // Fiqh
  {
    id: 'f1',
    category: 'fiqh',
    question: 'How many times a day are Muslims required to pray (Salah)?',
    options: ['3', '4', '5', '7'],
    correctIndex: 2,
    explanation: 'Muslims pray five times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'f2',
    category: 'fiqh',
    question: 'What is the minimum amount of wealth (Nisab) that makes Zakat obligatory?',
    options: [
      'Equivalent to 85g of gold',
      'Equivalent to 50g of gold',
      'Equivalent to 100g of gold',
      'Equivalent to 40g of gold',
    ],
    correctIndex: 0,
    explanation: 'Nisab is equivalent to 85 grams of gold or 595 grams of silver, held for one lunar year.',
    difficulty: 'hard',
    xpReward: 20,
  },
  {
    id: 'f3',
    category: 'fiqh',
    question: 'In which month do Muslims fast?',
    options: ['Rajab', 'Sha\'ban', 'Ramadan', 'Muharram'],
    correctIndex: 2,
    explanation: 'Fasting in Ramadan, the 9th month of the Islamic calendar, is one of the Five Pillars of Islam.',
    difficulty: 'easy',
    xpReward: 10,
  },

  // Seerah
  {
    id: 's1',
    category: 'seerah',
    question: 'In which city was Prophet Muhammad ﷺ born?',
    options: ['Madinah', 'Makkah', 'Ta\'if', 'Jerusalem'],
    correctIndex: 1,
    explanation: 'Prophet Muhammad ﷺ was born in Makkah in approximately 570 CE, known as the Year of the Elephant.',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 's2',
    category: 'seerah',
    question: 'What was the name of the Prophet\'s ﷺ first wife?',
    options: ['Aisha', 'Hafsa', 'Khadijah', 'Zainab'],
    correctIndex: 2,
    explanation: 'Khadijah bint Khuwaylid (RA) was the first wife of the Prophet ﷺ and the first person to embrace Islam.',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 's3',
    category: 'seerah',
    question: 'At what age did the Prophet ﷺ receive the first revelation?',
    options: ['35', '37', '40', '45'],
    correctIndex: 2,
    explanation: 'The Prophet ﷺ received the first revelation in the Cave of Hira at the age of 40.',
    difficulty: 'easy',
    xpReward: 10,
  },
];

export function getQuestionsByCategory(category: string): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}

export function getRandomQuestions(category: string, count: number): Question[] {
  const pool = getQuestionsByCategory(category);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
