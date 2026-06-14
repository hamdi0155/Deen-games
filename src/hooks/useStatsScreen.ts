import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../store/characterStore';
import { useDisciplineStore } from '../store/disciplineStore';
import { Character, CustomCategory } from '../types';

export interface StatsScreenData {
  // Store data
  character: Character;
  customCategoryXP: Record<string, { xp: number; level: number }>;
  customCategories: CustomCategory[];

  // Derived values
  totalXP: number;
  lifeRank: string;

  // Navigation handlers
  navigateToAddDomain: () => void;
  navigateToCategory: (categoryId: string) => void;

  // Action handlers
  handleDeleteCustomCategory: (cat: CustomCategory) => void;
}

export function useStatsScreen(): StatsScreenData {
  const router = useRouter();
  const character = useCharacterStore((s) => s.character)!;
  const customCategoryXP = useCharacterStore((s) => s.customCategoryXP);
  const customCategories = useDisciplineStore((s) => s.customCategories);
  const deleteCustomCategory = useDisciplineStore((s) => s.deleteCustomCategory);

  const totalXP = character.totalXP;
  const lifeRank = character.lifeRank;

  const navigateToAddDomain = () => {
    router.push('/category/create' as any);
  };

  const navigateToCategory = (categoryId: string) => {
    router.push(`/category/${categoryId}` as any);
  };

  const handleDeleteCustomCategory = (cat: CustomCategory) => {
    Alert.alert(
      'Delete Custom Domain',
      `Remove "${cat.label}"? All its disciplines and progress will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCustomCategory(cat.id) },
      ]
    );
  };

  return {
    character,
    customCategoryXP,
    customCategories,
    totalXP,
    lifeRank,
    navigateToAddDomain,
    navigateToCategory,
    handleDeleteCustomCategory,
  };
}
