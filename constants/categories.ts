import { Category } from '@/types';

export interface CategoryMeta {
  id: Category;
  label: string;
  arabicLabel: string;
  description: string;
  icon: string;
  color: string;
  totalQuestions: number;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'quran',
    label: 'Quran',
    arabicLabel: 'القرآن الكريم',
    description: 'Test your knowledge of Quranic verses and meanings',
    icon: 'book',
    color: '#2ecc71',
    totalQuestions: 50,
  },
  {
    id: 'hadith',
    label: 'Hadith',
    arabicLabel: 'الحديث الشريف',
    description: 'Sayings and practices of the Prophet ﷺ',
    icon: 'star',
    color: '#d4a843',
    totalQuestions: 40,
  },
  {
    id: 'fiqh',
    label: 'Fiqh',
    arabicLabel: 'الفقه الإسلامي',
    description: 'Islamic jurisprudence and rules of worship',
    icon: 'shield',
    color: '#3b82f6',
    totalQuestions: 35,
  },
  {
    id: 'seerah',
    label: 'Seerah',
    arabicLabel: 'السيرة النبوية',
    description: "Life of the Prophet ﷺ and Islamic history",
    icon: 'time',
    color: '#8b5cf6',
    totalQuestions: 45,
  },
];

export const XP_PER_LEVEL = 500;

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
