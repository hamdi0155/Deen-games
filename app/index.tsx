import { Redirect } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { useMorningStore } from '../src/store/morningStore';

export default function Index() {
  const isOnboarded = useCharacterStore((s) => s.isOnboarded);
  const hasCompletedToday = useMorningStore((s) => s.hasCompletedToday);
  const lastActivationDate = useMorningStore((s) => s.lastActivationDate);

  if (!isOnboarded) return <Redirect href="/onboarding" />;

  const today = new Date().toISOString().slice(0, 10);
  const showMorningActivation = lastActivationDate !== today && !hasCompletedToday;

  if (showMorningActivation) return <Redirect href={'/morning-activation' as any} />;

  return <Redirect href="/(tabs)" />;
}
