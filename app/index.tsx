import { Redirect } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';

export default function Index() {
  const isOnboarded = useCharacterStore((s) => s.isOnboarded);
  return <Redirect href={isOnboarded ? '/(tabs)' : '/onboarding'} />;
}
